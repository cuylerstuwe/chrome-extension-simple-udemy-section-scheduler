export async function waitForSectionsToExist(refreshRateMs = 200) {
    return new Promise(resolve => {
        let sectionPanelEls = document.querySelectorAll(`[data-purpose^="section-panel-"]`);
        if (sectionPanelEls.length > 0) {
            return resolve();
        } else {
            const intervalHandle = setInterval(() => {
                sectionPanelEls = document.querySelectorAll(`[data-purpose^="section-panel-"]`);
                if (sectionPanelEls.length > 0) {
                    clearInterval(intervalHandle);
                    return resolve();
                }
            }, refreshRateMs);
        }
    });
}