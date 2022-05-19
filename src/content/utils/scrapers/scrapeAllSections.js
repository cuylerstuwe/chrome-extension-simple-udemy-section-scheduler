import {getTitleSpanFromSectionEl} from "./getTitleSpanFromSectionEl";

export function scrapeAllSections() {
    return [...document.querySelectorAll(`[data-purpose^="section-panel-"]`)].map(sectionEl => {
        const titleSpanEl = getTitleSpanFromSectionEl(sectionEl);
        titleSpanEl.setAttribute("class", "");
        const sectionProgressDurationEl = sectionEl.querySelector(`[data-purpose="section-duration"]`);
        const rawSectionProgressDurationText = sectionProgressDurationEl?.innerText?.trim() ?? "";
        const rawDurationText = rawSectionProgressDurationText.split("|")?.[1]?.trim();
        return ({
            sectionEl,
            titleText: titleSpanEl?.innerText?.trim(),
            rawDurationText,
            titleSpanEl,
        });
    });
}