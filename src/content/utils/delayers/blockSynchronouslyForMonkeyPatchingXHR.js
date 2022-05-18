export function blockSynchronouslyForMonkeyPatchingXHR(amountOfMsToWaitToMonkeyPatchXHR = 500) {
    let didEnoughTimePassToMonkeyPatchXHR = false;
    let startTimestamp = Date.now();
    chrome.runtime.sendMessage({type: "monkeyPatchMyXhr"}, () => {
    });
    while (!didEnoughTimePassToMonkeyPatchXHR) {
        didEnoughTimePassToMonkeyPatchXHR = Date.now() - startTimestamp > amountOfMsToWaitToMonkeyPatchXHR;
    }
}