export function toGoogleEventEditUrlWithParams(encodedEventTitle, startTimeGoogleIso, endTimeGoogleIso, urlEncodedDescription, maybeCalendarEmailAddressParam) {
    const eventAddBase = "https://calendar.google.com/calendar/u/0/r/eventedit";
    const googleCalendarComposedEventAddLink = `${eventAddBase}?text=${encodedEventTitle}&dates=${startTimeGoogleIso}/${endTimeGoogleIso}&details=${urlEncodedDescription}${maybeCalendarEmailAddressParam}`;
    return googleCalendarComposedEventAddLink;
}