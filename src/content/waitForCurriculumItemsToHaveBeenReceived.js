export async function waitForCurriculumItemsToHaveBeenReceived(curriculumItemsCache) {
    if (!!curriculumItemsCache) {
        return Promise.resolve(curriculumItemsCache);
    } else {
        return new Promise(resolve => {
            window.addEventListener("message", e => {
                if (e?.data?.type === "curriculumItemsReceived") {
                    return resolve(e?.data?.curriculumItems);
                }
            });
        });
    }
}