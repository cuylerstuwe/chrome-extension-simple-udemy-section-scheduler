export function getCompleteBaseLinkToCurrentCourse(courseLinkEl) {
    return window.location.origin + courseLinkEl.getAttribute("href")?.trim()?.replace(/\/$/, "");
}