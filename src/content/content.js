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

const globalDataCache = {
    curriculumItems: undefined
};

initCurriculumItemListeners(globalDataCache);
blockSynchronouslyForMonkeyPatchingXHR();

async function main() {
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
    main();
})