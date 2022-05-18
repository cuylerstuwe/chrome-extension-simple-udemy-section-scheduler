export async function waitForPageToSettle(requiredSettleDurationMs = 50) {

    return new Promise(resolve => {

        let mutationObserver;
        let timeoutHandle;

        const resetTimeout = () => {
            if (timeoutHandle) {
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

        mutationObserver.observe(document.body, {subtree: true, attributes: true, childList: true});

    });
}