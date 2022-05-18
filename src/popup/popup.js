document.body.insertAdjacentHTML("beforeend", `
    <img src="${chrome.runtime.getURL("icons/example.png")}" width="350" />
`);

chrome.storage.local.get( null, ({ calendarId, shouldUseVerboseNames }) => {
    document.querySelector("#calendarId").value = calendarId || "";
    document.querySelector("#shouldUseVerboseNames").checked = shouldUseVerboseNames;
});

document.querySelector("#save").addEventListener("click", e => {
    chrome.storage.local.set(({ calendarId: document.querySelector("#calendarId").value }), () => {});
    chrome.storage.local.set(({ shouldUseVerboseNames: !!(document.querySelector("#shouldUseVerboseNames").checked) }), () => {});
    window.close();
});