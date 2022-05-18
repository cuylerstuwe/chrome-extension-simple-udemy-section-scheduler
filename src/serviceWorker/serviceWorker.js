import startedLog from "../utils/startedLog";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message?.type === "monkeyPatchMyXhr") {
        chrome.scripting.executeScript({
            world: "MAIN",
            target: {tabId: sender.tab.id},
            func: () => {
                let oldXHROpen = window.XMLHttpRequest.prototype.open;
                let oldXHRSend = window.XMLHttpRequest.prototype.send;
                window.XMLHttpRequest.prototype.send = function() {
                    if(this.shouldBeForciblyUncached) {
                        this.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate");
                    }
                    oldXHRSend.apply(this, arguments);
                };
                window.XMLHttpRequest.prototype.open = function(method, url) {
                    this.storedOpenArgs = [...arguments];
                    const isSubscriberCurriculumItemsRequest = url?.match(/https:\/\/www.udemy.com\/api-2.0\/courses\/\d+\/subscriber-curriculum-items/);
                    if(isSubscriberCurriculumItemsRequest) {
                        this.shouldBeForciblyUncached = true;
                    }
                    this.addEventListener("load", function() {
                        if(isSubscriberCurriculumItemsRequest) {
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
                    if(isSubscriberCurriculumItemsRequest) {
                        return oldXHROpen.apply(this, ["GET", url + "&cachebust=" + (Math.random()*1000)]);
                    }
                    else {
                        return oldXHROpen.apply(this, arguments);
                    }
                };
            }
        }, () => {
            sendResponse(true);
        })
        return true;
    }
});