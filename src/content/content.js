import "../utils/startedLog";
import {waitForCurriculumItemsToHaveBeenReceived} from "./waitForCurriculumItemsToHaveBeenReceived";
import {waitForPageToSettle} from "./waitForPageToSettle";
import {waitForCurriculumItemsRequest} from "./waitForCurriculumItemsRequest";
import {waitForSectionsToExist} from "./waitForSectionsToExist";
import {mapCurriculumItemsToChapterTitleFirstLectureTuples} from "./mapCurriculumItemsToChapterTitleFirstLectureTuples";
import {injectButtonsIntoSectionsIfNotInjectedAlready} from "./injectButtonsIntoSectionsIfNotInjectedAlready";

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

async function main() {
    await waitForSectionsToExist();
    await waitForPageToSettle();
    let curriculumItems = await waitForCurriculumItemsRequest();
    if(!curriculumItems) {
        curriculumItems = await waitForCurriculumItemsToHaveBeenReceived(curriculumItemsCache);
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