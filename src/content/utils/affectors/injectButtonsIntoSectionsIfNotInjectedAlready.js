import {toIcsText} from "../transformers/toIcsText";
import {writeIcsFile} from "./writeIcsFile";
import {moduleTitleToPrettyFilename} from "../transformers/moduleTitleToPrettyFilename";

const isLowercaseWordInconsequential = (() => {
    const inconsequentialWordsLowercaseLookup = {
        "the": true,
        "section": true,
        "udemy": true,
        "complete": true,
        "guide": true,
        "to": true,
        "from": true,
        "and": true,
        "&": true,
        "bootcamp": true,
        "become": true,
        "a": true,
        "developer": true,
        "masterclass": true,
        "build": true,
        "including": true,
        "front": true,
        "back": true,
        "working": true,
        "being": true,
        "be": true,
        "in": true
    };
    return (word) => inconsequentialWordsLowercaseLookup[word];
})();

function stripPunctuationAndNumbersFrom(str) {
    return str.replace(/[\d\[\]()<>"':]/g, "");
}

function firstConsequentialWordInTitle(title) {
    const wordsInTitle = stripPunctuationAndNumbersFrom(title)?.split(/\W/).filter(word => !!word?.trim());
    return wordsInTitle.find(wordInTitle => !isLowercaseWordInconsequential(wordInTitle?.toLowerCase()));
}

function allConsequentialWordsInTitleWithoutPunctuation(title) {
    const wordsInTitle = stripPunctuationAndNumbersFrom(title)?.split(/\W/).filter(word => !!word?.trim());
    return wordsInTitle.filter(wordInTitle => !isLowercaseWordInconsequential(wordInTitle?.toLowerCase()))?.join(" ");
}

function findStandaloneNumberInTitle(title) {
    return title.match(/\b\d+\b/)?.[0];
}

export async function injectButtonsIntoSectionsIfNotInjectedAlready({chapterTitleToFirstLectureTuples}) {

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
            if (doesButtonAlreadyExist) {
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
                if (e.target?.nodeName === "BUTTON" && ["calendar", "ics"].includes(e.target?.dataset?.purpose ?? "")) {
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

                    const { calendarId: calendarEmailAddress, shouldUseVerboseNames } = await new Promise(resolve => {
                        chrome.storage.local.get(null, ({calendarId, shouldUseVerboseNames}) => {
                            return resolve({calendarId, shouldUseVerboseNames});
                        });
                    });

                    const eventTitle = (
                        shouldUseVerboseNames
                            ? `Udemy: ${courseTitle} (${sectionTitleText})`
                            : `${allConsequentialWordsInTitleWithoutPunctuation(courseTitle)} (${findStandaloneNumberInTitle(sectionTitleText)}: ${allConsequentialWordsInTitleWithoutPunctuation(sectionTitleText)})`
                    );
                    const description = `Start Section:\n${firstLectureInSectionLink}\n\nContinue Course:\n${courseContinueLink}`;

                    if (e.target?.dataset?.purpose === "calendar") {

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
                    } else if (e.target?.dataset?.purpose === "ics") {
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