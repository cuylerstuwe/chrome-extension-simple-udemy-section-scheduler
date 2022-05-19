import {buttonPurpose} from "../enums/buttonPurpose";

export function appendExtensionCalendarElementsAfter(existingButtonEl) {
    existingButtonEl.insertAdjacentHTML("afterend", `
                <div>
                    <span>
                        Schedule: 
                    </span>
                    <button style="
                            border: 1px solid black;
                            background: none;
                            padding: 8px;
                            border-radius: 5px;
                            margin: 8px 0px;
                    " data-purpose="${buttonPurpose.ADD_TO_GOOGLE_CALENDAR}"
                    >
                        Google Calendar
                    </button>
                    <button style="
                            border: 1px solid black;
                            background: none;
                            padding: 8px;
                            border-radius: 5px;
                            margin: 8px 0px;
                    " data-purpose="${buttonPurpose.DOWNLOAD_ICS}"
                    >
                        ICS Download
                    </button>
                </div>
            `);
}