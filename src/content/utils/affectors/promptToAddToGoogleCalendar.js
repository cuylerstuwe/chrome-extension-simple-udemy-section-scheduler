import {toGoogleEventEditUrlWithParams} from "../transformers/toGoogleEventEditUrlWithParams";

export function promptToAddToGoogleCalendar(calendarEmailAddress, eventTitle, startTimestamp, endTimestamp, description) {
    const maybeCalendarEmailAddressParam = calendarEmailAddress ? `&src=${calendarEmailAddress}` : "";
    const encodedEventTitle = encodeURIComponent(eventTitle);

    const toGoogleIso = timestamp => new Date(timestamp).toISOString().replace(/[-:.]/g, "");

    const startTimeGoogleIso = toGoogleIso(startTimestamp);
    const endTimeGoogleIso = toGoogleIso(endTimestamp);
    const urlEncodedDescription = encodeURIComponent(description);

    // https://dylanbeattie.net/2021/01/12/adding-events-to-google-calendar-via-a-link.html
    const googleCalendarComposedEventAddLink = toGoogleEventEditUrlWithParams(encodedEventTitle, startTimeGoogleIso, endTimeGoogleIso, urlEncodedDescription, maybeCalendarEmailAddressParam);
    window.open(googleCalendarComposedEventAddLink, "_blank");
}