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
                    " data-purpose="calendar"
                    >
                        Google Calendar
                    </button>
                    <button style="
                            border: 1px solid black;
                            background: none;
                            padding: 8px;
                            border-radius: 5px;
                            margin: 8px 0px;
                    " data-purpose="ics"
                    >
                        ICS Download
                    </button>
                </div>
            `);
}