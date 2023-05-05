export default function injectExtensionStylesheetsIfNotInjectedAlready() {
    const existingExtensionStylesheets = [...document.querySelectorAll('.__udemy_scheduler__stylesheet')];
    const hasExistingExtensionStylesheets = existingExtensionStylesheets.length > 0;
    if(hasExistingExtensionStylesheets) return;
    document.head.insertAdjacentHTML('beforeend', `
        <style class="__udemy_scheduler__stylesheet">
            .__udemy-scheduler__add_to_google_calendar:hover {
                opacity: 0.8;
            }
            /* Hide Udemy tooltips; They're not generally helpful, and they're confusing in context of the new buttons added. */
            [id^='popper-content--']:has([class*="tooltip-module--tooltip"]) {
                visibility: hidden;
                user-select: none;
                pointer-events: none;
            }
        </style>
    `);
}