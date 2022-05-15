import "../utils/startedLog";

let isInjecting = false;

async function injectButtonsIntoSectionsIfNotInjectedAlready() {

    isInjecting = true;

    const courseLinkEl = document.querySelector("a[href^='/course']");
    const courseTitle = courseLinkEl?.innerText?.trim();
    [...document.querySelectorAll(`[data-purpose^="section-panel-"]`)].map(sectionEl => {
        const titleSpanEl = sectionEl.querySelector(`.udlite-accordion-panel-heading .udlite-accordion-panel-title span`);
        titleSpanEl.setAttribute("class", "")
        const sectionProgressDurationEl = sectionEl.querySelector(`[data-purpose="section-duration"]`);
        const rawSectionProgressDurationText = sectionProgressDurationEl?.innerText?.trim() ?? "";
        const rawDurationText = rawSectionProgressDurationText.split("|")?.[1]?.trim();
        return ({
            sectionEl,
            titleText: titleSpanEl?.innerText?.trim(),
            rawDurationText,
            titleSpanEl
        });
    })
        .forEach(({sectionEl, titleText: sectionTitleText, rawDurationText, titleSpanEl}, idx) => {

            const doesButtonAlreadyExist = !!(sectionEl?.querySelector("button[data-purpose='calendar']"));
            if(doesButtonAlreadyExist) {
                return;
            }

            const existingButtonEl = sectionEl.querySelector("button:not([data-purpose='calendar'])");

            existingButtonEl.insertAdjacentHTML("afterend", `
                <div>
                    <button style="
                            border: 1px solid black;
                            background: none;
                            padding: 8px;
                            border-radius: 5px;
                            margin: 8px 0px;
                    " data-purpose="calendar"
                    >
                        Schedule on Google Calendar
                    </button>
                </div>
            `);
            sectionEl.addEventListener("click", e => {
                if(e.target?.nodeName === "BUTTON" && e.target?.dataset?.purpose === "calendar") {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    e.preventDefault();

                    const eventAddBase = "https://calendar.google.com/calendar/u/0/r/eventedit";
                    const encodedEventTitle = encodeURIComponent(`Udemy: ${courseTitle} (${sectionTitleText})`);


                    const rawHrText = rawDurationText?.match(/(\d+)hr/)?.[1] ?? "0";
                    const rawMinText = rawDurationText?.match(/(\d+)min/)?.[1] ?? "0";

                    const hrsAsMinNum = Math.floor((+rawHrText) * 60);
                    const minAsNum = +rawMinText;

                    const totalMin = hrsAsMinNum + minAsNum;
                    const totalMs = Math.floor(totalMin * 60 * 1000);

                    const startTimestamp = Date.now();
                    const endTimestamp = startTimestamp + totalMs;

                    const toGoogleIso = timestamp => new Date(timestamp).toISOString().replace(/[-:.]/g, "");

                    const startTimeGoogleIso = toGoogleIso(startTimestamp);
                    const endTimeGoogleIso = toGoogleIso(endTimestamp);

                    console.log({ hrsAsMinNum, minAsNum, totalMin });

                    const googleCalendarComposedEventAddLink = `${eventAddBase}?text=${encodedEventTitle}&dates=${startTimeGoogleIso}/${endTimeGoogleIso}`;

                    window.open(googleCalendarComposedEventAddLink, "_blank");
                }
            }, true);

        });

    isInjecting = false;
}

async function waitForSectionsToExist(refreshRateMs = 200) {
    return new Promise(resolve => {
        let sectionPanelEls = document.querySelectorAll(`[data-purpose^="section-panel-"]`);
        if(sectionPanelEls.length > 0) { return resolve(); }
        else {
            const intervalHandle = setInterval(() => {
                sectionPanelEls = document.querySelectorAll(`[data-purpose^="section-panel-"]`);
                if(sectionPanelEls.length > 0) {
                    clearInterval(intervalHandle);
                    return resolve();
                }
            }, refreshRateMs);
        }
    });
}

async function waitForPageToSettle(requiredSettleDurationMs = 50) {

    return new Promise(resolve => {

        let mutationObserver;
        let timeoutHandle;

        const resetTimeout = () => {
            if(timeoutHandle) {
                clearTimeout(timeoutHandle);
            }
            timeoutHandle = setTimeout(() => {
                mutationObserver?.disconnect();
                return resolve();
            }, requiredSettleDurationMs);
        };

        resetTimeout();

        mutationObserver = new MutationObserver(() => {
            resetTimeout();
        });

        mutationObserver.observe(document.body, { subtree: true, attributes: true, childList: true });

    });
}

async function main() {
    await waitForSectionsToExist();
    await waitForPageToSettle();
    await injectButtonsIntoSectionsIfNotInjectedAlready();

    setInterval(() => {
        injectButtonsIntoSectionsIfNotInjectedAlready();
    }, 1000);
}

main();