document.body.insertAdjacentHTML("beforeend", `
    <img src="${chrome.runtime.getURL("icons/example.png")}" width="350" />
`);

chrome.storage.local.get( "calendarId", ({ calendarId }) => {
    document.querySelector("#calendarId").value = calendarId || "";
});

document.querySelector("#save").addEventListener("click", e => {
    chrome.storage.local.set(({ calendarId: document.querySelector("#calendarId").value }), () => {});
    window.close();
});