import {createEvent} from "ics";

export function toIcsText({title, description, startTimestamp, totalMin, url}) {

    const dateFromGivenTimestamp = new Date(startTimestamp);

    const event = {
        start: [
            dateFromGivenTimestamp.getFullYear(),
            dateFromGivenTimestamp.getMonth() + 1,
            dateFromGivenTimestamp.getDate(),
            dateFromGivenTimestamp.getHours(),
            dateFromGivenTimestamp.getMinutes()
        ],
        duration: {minutes: totalMin},
        title,
        description,
        url: url ?? undefined,
        status: 'CONFIRMED',
        busyStatus: 'BUSY',
        attendees: []
    }

    const {value} = createEvent(event);

    return value;
}