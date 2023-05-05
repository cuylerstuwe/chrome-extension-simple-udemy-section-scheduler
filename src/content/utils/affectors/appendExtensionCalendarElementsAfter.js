import {buttonPurpose} from "../enums/buttonPurpose";

// TODO: Make this configurable.
const SHOULD_INSERT_ICS_DOWNLOAD_LINK = false;

export function appendExtensionCalendarElementsAfter(existingButtonEl) {
    existingButtonEl.insertAdjacentHTML("afterend", `
                <div>
                    <span>
                        Schedule: 
                    </span>
                    <button class="__udemy-scheduler__add_to_google_calendar" style="
                            border: 1px solid black;
                            background: none;
                            padding: 8px;
                            border-radius: 5px;
                            margin: 8px 0px;
                            cursor: pointer !important;
                    " data-purpose="${buttonPurpose.ADD_TO_GOOGLE_CALENDAR}"
                    >
                        Google Calendar
                    </button>
                    ${SHOULD_INSERT_ICS_DOWNLOAD_LINK ? (`
                        <button class="__udemy-scheduler__download_ics" style="
                                border: 1px solid black;
                                background: none;
                                padding: 8px;
                                border-radius: 5px;
                                margin: 8px 0px;
                                cursor: pointer !important;
                        " data-purpose="${buttonPurpose.DOWNLOAD_ICS}"
                    >
                        ICS Download
                    </button>
                    `) : ''}
                </div>
            `);
}