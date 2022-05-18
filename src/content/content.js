import "../utils/startedLog";
import { saveAs } from "file-saver";
import { createEvent } from "ics";
import sanitizeFilename from "sanitize-filename";

let curriculumItemsCache;

window.addEventListener("message", e => {
    if(e.data.type === "provideCurriculumItems") {
        curriculumItemsCache = e.data.curriculumItems;
        window.postMessage({
            type: "curriculumItemsReceived",
            curriculumItems: e.data.curriculumItems
        }, "*");
    }
});

window.addEventListener("message", e => {
    if(e?.data?.type === "readyToProvideCurriculumItems") {
        window.postMessage({type: "requestCurriculumItems"}, "*");
    }
});

let didEnoughTimePassToMonkeyPatchXHR = false;

let startTimestamp = Date.now();
chrome.runtime.sendMessage({type: "monkeyPatchMyXhr"}, () => { });
while(!didEnoughTimePassToMonkeyPatchXHR) {
    didEnoughTimePassToMonkeyPatchXHR = Date.now() - startTimestamp > 500;
}

function toIcsText({title, description, startTimestamp, totalMin, url}) {

    const dateFromGivenTimestamp = new Date(startTimestamp);

    const event = {
        start: [
            dateFromGivenTimestamp.getFullYear(),
            dateFromGivenTimestamp.getMonth() + 1,
            dateFromGivenTimestamp.getDate(),
            dateFromGivenTimestamp.getHours(),
            dateFromGivenTimestamp.getMinutes()
        ],
        duration: { minutes: totalMin },
        title,
        description,
        url: url ?? undefined,
        status: 'CONFIRMED',
        busyStatus: 'BUSY',
        attendees: []
    }

    const { value } = createEvent(event);

    return value;
}

function writeIcsFile(icsFileData, filename = "event.ics") {
    const file = new File([icsFileData], filename, {type: "text/calendar;charset=utf-8"});
    saveAs(file);
}

function moduleTitleToPrettyFilename(courseTitle) {
    return sanitizeFilename(
        courseTitle
            .replace(/ /g, "-")
            .toLowerCase()
    );
}

async function injectButtonsIntoSectionsIfNotInjectedAlready({chapterTitleToFirstLectureTuples}) {

    const courseLinkEl = document.querySelector("a[href^='/course']");
    const courseLink = window.location.origin + courseLinkEl.getAttribute("href")?.trim()?.replace(/\/$/, "");
    const courseTitle = courseLinkEl?.innerText?.trim();
    [...document.querySelectorAll(`[data-purpose^="section-panel-"]`)].map(sectionEl => {
        const titleSpanEl = sectionEl.querySelector(`.udlite-accordion-panel-heading .udlite-accordion-panel-title span`);
        titleSpanEl.setAttribute("class", "")
        const sectionProgressDurationEl = sectionEl.querySelector(`[data-purpose="section-duration"]`);
        const rawSectionProgressDurationText = sectionProgressDurationEl?.innerText?.trim() ?? "";
        const rawDurationText = rawSectionProgressDurationText.split("|")?.[1]?.trim();
        return ({
            sectionEl,
            titleText: titleSpanEl?.innerText?.trim(),
            rawDurationText,
            titleSpanEl,
            courseLink
        });
    })
        .forEach(({sectionEl, titleText: sectionTitleText, rawDurationText, titleSpanEl}, idx) => {

            const doesButtonAlreadyExist = !!(sectionEl?.querySelector("button[data-purpose='calendar']"));
            if(doesButtonAlreadyExist) {
                return;
            }

            const existingButtonEl = sectionEl.querySelector("button:not([data-purpose='calendar'])");

            existingButtonEl.insertAdjacentHTML("afterend", `
                <div>
                    <span>
                        Schedule: 
                    </span>
                    <button style="
                            border: 1px solid black;
                            background: none;
                            padding: 8px;
                            border-radius: 5px;
                            margin: 8px 0px;
                    " data-purpose="calendar"
                    >
                        Google Calendar
                    </button>
                    <button style="
                            border: 1px solid black;
                            background: none;
                            padding: 8px;
                            border-radius: 5px;
                            margin: 8px 0px;
                    " data-purpose="ics"
                    >
                        ICS Download
                    </button>
                </div>
            `);
            sectionEl.addEventListener("click", async e => {
                if(e.target?.nodeName === "BUTTON" && ["calendar", "ics"].includes(e.target?.dataset?.purpose ?? "")) {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    e.preventDefault();

                    const rawHrText = rawDurationText?.match(/(\d+)hr/)?.[1] ?? "0";
                    const rawMinText = rawDurationText?.match(/(\d+)min/)?.[1] ?? "0";

                    const hrsAsMinNum = Math.floor((+rawHrText) * 60);
                    const minAsNum = +rawMinText;

                    const totalMin = hrsAsMinNum + minAsNum;
                    const totalMs = Math.floor(totalMin * 60 * 1000);

                    const startTimestamp = Date.now();
                    const endTimestamp = startTimestamp + totalMs;

                    const courseContinueLink = `${courseLink}/learn`;
                    const lectureIdOfFirstLectureInSection = chapterTitleToFirstLectureTuples[idx][1].id;
                    const firstLectureInSectionLink = `${courseLink}/learn/lecture/${lectureIdOfFirstLectureInSection}`

                    const eventTitle = `Udemy: ${courseTitle} (${sectionTitleText})`;
                    const description = `Start Section:\n${firstLectureInSectionLink}\n\nContinue Course:\n${courseContinueLink}`;

                    if(e.target?.dataset?.purpose === "calendar") {

                        const calendarEmailAddress = await new Promise(resolve => {
                            chrome.storage.local.get( "calendarId", ({ calendarId }) => {
                                return resolve(calendarId);
                            });
                        });

                        const maybeCalendarEmailAddressParam = calendarEmailAddress ? `&src=${calendarEmailAddress}` : "";

                        const eventAddBase = "https://calendar.google.com/calendar/u/0/r/eventedit";
                        const encodedEventTitle = encodeURIComponent(eventTitle);

                        const toGoogleIso = timestamp => new Date(timestamp).toISOString().replace(/[-:.]/g, "");

                        const startTimeGoogleIso = toGoogleIso(startTimestamp);
                        const endTimeGoogleIso = toGoogleIso(endTimestamp);

                        const urlEncodedDescription = encodeURIComponent(description);

                        // https://dylanbeattie.net/2021/01/12/adding-events-to-google-calendar-via-a-link.html
                        const googleCalendarComposedEventAddLink = `${eventAddBase}?text=${encodedEventTitle}&dates=${startTimeGoogleIso}/${endTimeGoogleIso}&details=${urlEncodedDescription}${maybeCalendarEmailAddressParam}`;

                        window.open(googleCalendarComposedEventAddLink, "_blank");
                    }
                    else if(e.target?.dataset?.purpose === "ics") {
                        const icsText = toIcsText({
                            title: eventTitle,
                            description,
                            startTimestamp,
                            totalMin
                        });
                        writeIcsFile(icsText, moduleTitleToPrettyFilename(sectionTitleText));
                    }

                }
            }, true);

        });

}

async function waitForSectionsToExist(refreshRateMs = 200) {
    return new Promise(resolve => {
        let sectionPanelEls = document.querySelectorAll(`[data-purpose^="section-panel-"]`);
        if(sectionPanelEls.length > 0) { return resolve(); }
        else {
            const intervalHandle = setInterval(() => {
                sectionPanelEls = document.querySelectorAll(`[data-purpose^="section-panel-"]`);
                if(sectionPanelEls.length > 0) {
                    clearInterval(intervalHandle);
                    return resolve();
                }
            }, refreshRateMs);
        }
    });
}

async function waitForPageToSettle(requiredSettleDurationMs = 50) {

    return new Promise(resolve => {

        let mutationObserver;
        let timeoutHandle;

        const resetTimeout = () => {
            if(timeoutHandle) {
                clearTimeout(timeoutHandle);
            }
            timeoutHandle = setTimeout(() => {
                mutationObserver?.disconnect();
                return resolve();
            }, requiredSettleDurationMs);
        };

        resetTimeout();

        mutationObserver = new MutationObserver(() => {
            resetTimeout();
        });

        mutationObserver.observe(document.body, { subtree: true, attributes: true, childList: true });

    });
}

async function waitForCurriculumItemsRequest() {
    const courseId = JSON.parse(document.querySelector("[data-module-id='course-taking']")?.dataset?.moduleArgs || "{}")?.courseId;
    let curriculumItemResponse;
    try {
        curriculumItemResponse = await fetch(`https://www.udemy.com/api-2.0/courses/${courseId}/subscriber-curriculum-items/?page_size=1400&fields[lecture]=title,object_index,is_published,sort_order,created,asset,supplementary_assets,is_free&fields[quiz]=title,object_index,is_published,sort_order,type&fields[practice]=title,object_index,is_published,sort_order&fields[chapter]=title,object_index,is_published,sort_order&fields[asset]=title,filename,asset_type,status,time_estimation,is_external&caching_intent=True&cachebust=${Math.random() * 10000}`);
    } catch(err) {}

    let curriculumItemJson;
    try {
        curriculumItemJson = await curriculumItemResponse?.json();
    } catch (err) {}

    return curriculumItemJson?.results;
}

async function waitForCurriculumItemsToHaveBeenReceived() {
    if(!!curriculumItemsCache) { return Promise.resolve(curriculumItemsCache); }
    else {
        return new Promise(resolve => {
            window.addEventListener("message", e => {
                if(e?.data?.type === "curriculumItemsReceived") {
                    return resolve(e?.data?.curriculumItems);
                }
            });
        });
    }
}

function mapCurriculumItemsToChapterTitleFirstLectureTuples(curriculumItems) {
    return curriculumItems?.reduce((acc, val, idx) => {
        if(val?._class === "chapter") {
            return ([
                ...acc,
                [val?.title, curriculumItems[idx + 1]]
            ]);
        }
        else {
            return [...acc];
        }
    }, []);
}

async function main() {
    await waitForSectionsToExist();
    await waitForPageToSettle();
    let curriculumItems = await waitForCurriculumItemsRequest();
    if(!curriculumItems) {
        curriculumItems = await waitForCurriculumItemsToHaveBeenReceived();
    }

    const chapterTitleToFirstLectureTuples = mapCurriculumItemsToChapterTitleFirstLectureTuples(curriculumItems);

    await injectButtonsIntoSectionsIfNotInjectedAlready({chapterTitleToFirstLectureTuples});

    setInterval(() => {
        injectButtonsIntoSectionsIfNotInjectedAlready({chapterTitleToFirstLectureTuples});
    }, 1000);
}

window.addEventListener("DOMContentLoaded", () => {
    main();
})