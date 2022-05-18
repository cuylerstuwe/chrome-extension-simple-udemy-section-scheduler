import sanitizeFilename from "sanitize-filename";

export function moduleTitleToPrettyFilename(courseTitle) {
    return sanitizeFilename(
        courseTitle
            .replace(/ /g, "-")
            .toLowerCase()
    );
}