import "../utils/startedLog";
import {waitForCurriculumItemsToHaveBeenReceived} from "./utils/receivers/waitForCurriculumItemsToHaveBeenReceived";
import {waitForPageToSettle} from "./utils/delayers/waitForPageToSettle";
import {waitForCurriculumItemsRequest} from "./utils/receivers/waitForCurriculumItemsRequest";
import {waitForSectionsToExist} from "./utils/delayers/waitForSectionsToExist";
import {mapCurriculumItemsToChapterTitleFirstLectureTuples} from "./utils/transformers/mapCurriculumItemsToChapterTitleFirstLectureTuples";
import {injectButtonsIntoSectionsIfNotInjectedAlready} from "./utils/affectors/injectButtonsIntoSectionsIfNotInjectedAlready";

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