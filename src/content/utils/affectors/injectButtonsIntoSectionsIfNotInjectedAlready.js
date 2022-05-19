import {
    getParsedDurationAndEndTimestampFromRawUdemyTextAndStartTimestamp
} from "../transformers/getParsedDurationAndEndTimestampFromRawUdemyTextAndStartTimestamp";
import {fullyConsumeEvent} from "./fullyConsumeEvent";
import {appendExtensionCalendarElementsAfter} from "./appendExtensionCalendarElementsAfter";
import {getCourseLinkEl} from "../scrapers/getCourseLinkEl";
import {getCompleteBaseLinkToCurrentCourse} from "../transformers/getCompleteBaseLinkToCurrentCourse";
import {buildAndDownloadIcsFile} from "./buildAndDownloadIcsFile";
import {generateEventTitle} from "../transformers/generateEventTitle";
import {promptToAddToGoogleCalendar} from "./promptToAddToGoogleCalendar";
import {getTitleOfCurrentCourse} from "../transformers/getTitleOfCurrentCourse";
import {scrapeAllSections} from "../scrapers/scrapeAllSections";
import {generateEventDescription} from "../transformers/generateEventDescription";
import {buttonPurpose} from "../enums/buttonPurpose";
import {isElementAnExtensionAddedButton} from "./isElementAnExtensionAddedButton";

export async function injectButtonsIntoSectionsIfNotInjectedAlready({chapterTitleToFirstLectureTuples}) {

    const courseLinkEl = getCourseLinkEl();
    const courseLink = getCompleteBaseLinkToCurrentCourse(courseLinkEl);
    const courseTitle = getTitleOfCurrentCourse(courseLinkEl);
    scrapeAllSections(courseLink)
        .forEach(({sectionEl, titleText: sectionTitleText, rawDurationText, titleSpanEl}, idx) => {

            const doesAnAddToGoogleCalendarButtonAlreadyExist = !!(sectionEl?.querySelector(`button[data-purpose='${buttonPurpose.ADD_TO_GOOGLE_CALENDAR}']`));
            if (doesAnAddToGoogleCalendarButtonAlreadyExist) {
                return;
            }

            const existingUdemySectionToggleButtonEl = sectionEl.querySelector(
                `button:not([data-purpose='${buttonPurpose.ADD_TO_GOOGLE_CALENDAR}']):not([data-purpose='${buttonPurpose.DOWNLOAD_ICS}'])`
            );

            appendExtensionCalendarElementsAfter(existingUdemySectionToggleButtonEl);

            sectionEl.addEventListener("click", async e => {
                if (isElementAnExtensionAddedButton(e.target)) {
                    fullyConsumeEvent(e);

                    const startTimestamp = Date.now();

                    const {totalMin, endTimestamp} = getParsedDurationAndEndTimestampFromRawUdemyTextAndStartTimestamp(rawDurationText, startTimestamp);

                    const courseContinueLink = `${courseLink}/learn`;
                    const lectureIdOfFirstLectureInSection = chapterTitleToFirstLectureTuples[idx][1].id;
                    const firstLectureInSectionLink = `${courseLink}/learn/lecture/${lectureIdOfFirstLectureInSection}`

                    const { calendarId: calendarEmailAddress, shouldUseVerboseNames } = await new Promise(resolve => {
                        chrome.storage.local.get(null, ({calendarId, shouldUseVerboseNames}) => {
                            return resolve({calendarId, shouldUseVerboseNames});
                        });
                    });

                    const eventTitle = generateEventTitle(shouldUseVerboseNames, courseTitle, sectionTitleText);
                    const description = generateEventDescription(firstLectureInSectionLink, courseContinueLink);

                    if (e.target?.dataset?.purpose === buttonPurpose.ADD_TO_GOOGLE_CALENDAR) {
                        promptToAddToGoogleCalendar(calendarEmailAddress, eventTitle, startTimestamp, endTimestamp, description);
                    } else if (e.target?.dataset?.purpose === buttonPurpose.DOWNLOAD_ICS) {
                        buildAndDownloadIcsFile(eventTitle, description, startTimestamp, totalMin, sectionTitleText);
                    }

                }
            }, true);

        });

}