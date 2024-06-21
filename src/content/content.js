import "../utils/startedLog";
import {waitForCurriculumItemsToHaveBeenReceived} from "./utils/receivers/waitForCurriculumItemsToHaveBeenReceived";
import {waitForPageToSettle} from "./utils/delayers/waitForPageToSettle";
import {waitForCurriculumItemsRequest} from "./utils/receivers/waitForCurriculumItemsRequest";
import {waitForSectionsToExist} from "./utils/delayers/waitForSectionsToExist";
import {
    mapCurriculumItemsToChapterTitleFirstLectureTuples
} from "./utils/transformers/mapCurriculumItemsToChapterTitleFirstLectureTuples";
import {
    injectButtonsIntoSectionsIfNotInjectedAlready
} from "./utils/affectors/injectButtonsIntoSectionsIfNotInjectedAlready";
import {initCurriculumItemListeners} from "./utils/initializers/initCurriculumItemListeners";
import {blockSynchronouslyForMonkeyPatchingXHR} from "./utils/delayers/blockSynchronouslyForMonkeyPatchingXHR";
import injectExtensionStylesheetsIfNotInjectedAlready
    from "./utils/affectors/injectExtensionStylesheetsIfNotInjectedAlready";
import {isElementAnExtensionAddedButton} from "./utils/affectors/isElementAnExtensionAddedButton";
import {fullyConsumeEvent} from "./utils/affectors/fullyConsumeEvent";
import {
    getParsedDurationAndEndTimestampFromRawUdemyTextAndStartTimestamp
} from "./utils/transformers/getParsedDurationAndEndTimestampFromRawUdemyTextAndStartTimestamp";
import {generateEventTitle} from "./utils/transformers/generateEventTitle";
import {generateEventDescription} from "./utils/transformers/generateEventDescription";
import {buttonPurpose} from "./utils/enums/buttonPurpose";
import {promptToAddToGoogleCalendar} from "./utils/affectors/promptToAddToGoogleCalendar";
import {buildAndDownloadIcsFile} from "./utils/affectors/buildAndDownloadIcsFile";

const globalDataCache = {
    curriculumItems: undefined
};

function isOnUdemy() {
    let currentUrl;
    try {
        currentUrl = new URL(window.location);
    } catch(err) {
    }
    return currentUrl?.hostname.includes("udemy.com");
}

function isOnFrontendMasters() {
    let currentUrl;
    try {
        currentUrl = new URL(window.location);
    } catch(err) {
    }
    return currentUrl?.hostname.includes("frontendmasters.com");
}

function isOnTeachable() {
    const teachableCdnLinkEl = document.querySelector("link[href*='teachablecdn.com']");
    const doesHaveTeachableCdnLink = !!teachableCdnLinkEl;
    return doesHaveTeachableCdnLink;
}

if(isOnUdemy()) {
    udemyInit();
}

function udemyInit() {
    initCurriculumItemListeners(globalDataCache);
    blockSynchronouslyForMonkeyPatchingXHR();
}

async function teachableMain() {
    const courseName = document.querySelector('.course-sidebar h2')?.innerText || "";

    // Find all the sections
    const sectionsEls = document.querySelectorAll('.course-section');

    const sections = [...(sectionsEls || [])].map(sectionEl => ({
        el: sectionEl,
        sectionNameEl: sectionEl.querySelector('.section-title'),
    }));

    // Get the title of each section
    sections.forEach(section => section.title = section.el.querySelector('.section-title')?.innerText?.trim() || "");

    // Find all the lectures in each section
    sections.forEach(section => {
        section.lectures = [...(section.el.querySelectorAll('.item') || [])].map(lectureEl => ({
            name: lectureEl.querySelector(".lecture-name")?.innerText?.trim() || "",
            durationStr: lectureEl.querySelector(".lecture-name")?.innerText?.match(/\((\d+:\d+)\)/)?.[1] || "",
        }));
    });

    // Get the combined duration of all the lectures in each section
    sections.forEach(section => {
        section.totalDurationMs = section.lectures.reduce((acc, lecture) => {
            const durationStr = lecture.durationStr;
            if(!durationStr) return acc;
            const durationParts = durationStr?.split(":");
            const minutes = parseInt(durationParts[0]);
            const seconds = parseInt(durationParts[1]);
            return acc + (((minutes * 60) + seconds) * 1000);
        }, 0);
    });

    sections.forEach(section => {
        section.sectionNameEl.insertAdjacentHTML('beforeend', `
            <button class="__udemy-scheduler__add_to_google_calendar" style="
                    border: 1px solid black;
                    background: none;
                    padding: 8px;
                    border-radius: 5px;
                    margin: 8px 0px;
                    cursor: pointer !important;
            " data-purpose="${buttonPurpose.ADD_TO_GOOGLE_CALENDAR}"
            >
                Google Calendar
            </button>
        `);

        section.sectionNameEl.addEventListener("click", async e => {
            if (isElementAnExtensionAddedButton(e.target)) {
                fullyConsumeEvent(e);

                const startTimestamp = Date.now();

                const { calendarId: calendarEmailAddress, shouldUseVerboseNames } = await new Promise(resolve => {
                    chrome.storage.local.get(null, ({calendarId, shouldUseVerboseNames}) => {
                        return resolve({calendarId, shouldUseVerboseNames});
                    });
                });

                const eventTitle = generateEventTitle(shouldUseVerboseNames, courseName, section.title || "");
                const description = generateEventDescription(window.location.href, window.location.href);

                if (e.target?.dataset?.purpose === buttonPurpose.ADD_TO_GOOGLE_CALENDAR) {
                    const endTimestamp = Date.now() + section.totalDurationMs;
                    promptToAddToGoogleCalendar(calendarEmailAddress, eventTitle, startTimestamp, endTimestamp, description);
                }
            }
        }, true);
    });


    console.log({sections});

}

async function frontendMastersMain() {
    const courseName = document.querySelector('h1')?.innerText || "";

    const courseLessonGroups = [...document.querySelectorAll('.Course-Lesson-Group')];
    const courseLessonLists = [...document.querySelectorAll('.Course-Lesson-List')];

    // Find all the sections
    const zippedSectionEls = courseLessonGroups.map((groupEl, index) => {
        return [].concat(groupEl, courseLessonLists[index]);
    });

    const sections = zippedSectionEls.map(zippedSectionEl => ({
        el: zippedSectionEl[1],
        sectionNameGroup: zippedSectionEl[0],
        sectionNameEl: zippedSectionEl[0]?.querySelector('[class*="Heading"]'),
    }));

    // Get the title of each section
    sections.forEach(section => section.title = section.sectionNameEl?.innerText?.trim() || "");

    // Get the combined duration of all the lectures in each section
    sections.forEach(section => {
        section.totalDurationMs = +(section.sectionNameGroup?.querySelector("[data-group-duration]")?.dataset.groupDuration || "0");
    });

    sections.forEach(section => {
        section.sectionNameEl.insertAdjacentHTML('beforeend', `
            <button class="__udemy-scheduler__add_to_google_calendar" style="
                    border: 1px solid black;
                    background: none;
                    padding: 8px;
                    border-radius: 5px;
                    margin: 8px 0px;
                    cursor: pointer !important;
            " data-purpose="${buttonPurpose.ADD_TO_GOOGLE_CALENDAR}"
            >
                Google Calendar
            </button>
        `);

        section.sectionNameEl.addEventListener("click", async e => {
            if (isElementAnExtensionAddedButton(e.target)) {
                fullyConsumeEvent(e);

                const startTimestamp = Date.now();

                const { calendarId: calendarEmailAddress, shouldUseVerboseNames } = await new Promise(resolve => {
                    chrome.storage.local.get(null, ({calendarId, shouldUseVerboseNames}) => {
                        return resolve({calendarId, shouldUseVerboseNames});
                    });
                });

                const eventTitle = generateEventTitle(shouldUseVerboseNames, courseName, section.title || "");
                const description = generateEventDescription(window.location.href, window.location.href);

                if (e.target?.dataset?.purpose === buttonPurpose.ADD_TO_GOOGLE_CALENDAR) {
                    const endTimestamp = Date.now() + section.totalDurationMs;
                    promptToAddToGoogleCalendar(calendarEmailAddress, eventTitle, startTimestamp, endTimestamp, description);
                }
            }
        }, true);
    });
}

async function udemyMain() {
    await waitForSectionsToExist();
    await waitForPageToSettle();
    let curriculumItems = await waitForCurriculumItemsRequest();
    if(!curriculumItems) {
        curriculumItems = await waitForCurriculumItemsToHaveBeenReceived(globalDataCache.curriculumItems);
    }

    const chapterTitleToFirstLectureTuples = mapCurriculumItemsToChapterTitleFirstLectureTuples(curriculumItems);

    await injectExtensionStylesheetsIfNotInjectedAlready();

    await injectButtonsIntoSectionsIfNotInjectedAlready({chapterTitleToFirstLectureTuples});

    // When the Udemy course-taking app is in a narrow window, it changes to a "responsive" mode which will remove
    // all sections from the DOM (similarly, when it starts out in a narrow window, these sections aren't
    // added to the DOM in the first place).

    // When it's scaled back up, sections are added to the DOM.

    // Checking every second to see whether we should inject buttons is a good tradeoff between CPU usage and response rate.
    // The page has a LOT of mutations, so Mutation Observers probably wouldn't be much different from a much-faster
    // interval in this case.
    //
    setInterval(() => {
        injectButtonsIntoSectionsIfNotInjectedAlready({chapterTitleToFirstLectureTuples});
    }, 1000);
}

window.addEventListener("DOMContentLoaded", () => {
    if(isOnUdemy()) {
        udemyMain().then(() => {});
    }

    if(isOnTeachable()) {
        teachableMain().then(() => {});
    }

    if(isOnFrontendMasters()) {
        frontendMastersMain().then(() => {});
    }
})