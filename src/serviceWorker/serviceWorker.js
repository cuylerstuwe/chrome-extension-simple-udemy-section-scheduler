import startedLog from "../utils/startedLog";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message?.type === "monkeyPatchMyXhr") {
        chrome.scripting.executeScript({
            world: "MAIN",
            target: {tabId: sender.tab.id},
            func: () => {
                let oldXHROpen = window.XMLHttpRequest.prototype.open;
                window.XMLHttpRequest.prototype.open = function(method, url) {
                    this.addEventListener("load", function() {
                        if(url?.match(/https:\/\/www.udemy.com\/api-2.0\/courses\/\d+\/subscriber-curriculum-items/)) {
                            const responseBody = this.responseText;
                            const responseJson = JSON.parse(responseBody);
                            const curriculumItems = responseJson?.results;
                            window.addEventListener("message", e => {
                                if(e?.data?.type === "requestCurriculumItems") {
                                    window.postMessage({
                                        type: "provideCurriculumItems",
                                        curriculumItems
                                    }, "*");
                                }
                            });
                            window.postMessage({
                                type: "readyToProvideCurriculumItems"
                            }, "*");
                        }
                    });
                    return oldXHROpen.apply(this, arguments);
                };
            }
        }, () => {
            sendResponse(true);
        })
        return true;
    }
});