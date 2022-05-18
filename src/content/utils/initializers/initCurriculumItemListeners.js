export function initCurriculumItemListeners(globalDataCache) {
    window.addEventListener("message", e => {
        if (e.data.type === "provideCurriculumItems") {
            globalDataCache.curriculumItems = e.data.curriculumItems;
            window.postMessage({
                type: "curriculumItemsReceived",
                curriculumItems: e.data.curriculumItems
            }, "*");
        }
    });

    window.addEventListener("message", e => {
        if (e?.data?.type === "readyToProvideCurriculumItems") {
            window.postMessage({type: "requestCurriculumItems"}, "*");
        }
    });
}