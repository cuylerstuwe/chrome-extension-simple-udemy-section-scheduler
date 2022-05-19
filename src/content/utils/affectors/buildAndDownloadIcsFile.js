import {generateIcsText} from "../transformers/generateIcsText";
import {generateInMemoryIcsBlobFileFromIcsText} from "../transformers/generateInMemoryIcsBlobFileFromIcsText";
import {moduleTitleToPrettyFilename} from "../transformers/moduleTitleToPrettyFilename";
import { saveAs } from "file-saver";

export function buildAndDownloadIcsFile(eventTitle, description, startTimestamp, totalMin, sectionTitleText) {
    const icsText = generateIcsText({
        title: eventTitle,
        description,
        startTimestamp,
        totalMin
    });
    const icsBlobFile = generateInMemoryIcsBlobFileFromIcsText(icsText, moduleTitleToPrettyFilename(sectionTitleText));
    saveAs(icsBlobFile);
}