export function generateInMemoryIcsBlobFileFromIcsText(icsFileData, filename = "event.ics") {
    return new File([icsFileData], filename, {type: "text/calendar;charset=utf-8"});
}