import {buttonPurpose} from "../enums/buttonPurpose";

export function isElementAnExtensionAddedButton(element) {
    return (
        [buttonPurpose.ADD_TO_GOOGLE_CALENDAR, buttonPurpose.DOWNLOAD_ICS]
            .includes(element.dataset?.purpose ?? "")
    );
}