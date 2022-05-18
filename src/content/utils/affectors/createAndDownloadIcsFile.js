import { saveAs } from "file-saver";

export function createAndDownloadIcsFile(icsFileData, filename = "event.ics") {
    const file = new File([icsFileData], filename, {type: "text/calendar;charset=utf-8"});
    saveAs(file);
}