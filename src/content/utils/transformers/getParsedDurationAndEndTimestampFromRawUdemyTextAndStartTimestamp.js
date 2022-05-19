export function getParsedDurationAndEndTimestampFromRawUdemyTextAndStartTimestamp(rawDurationText, startTimestamp) {
    const rawHrText = rawDurationText?.match(/(\d+)hr/)?.[1] ?? "0";
    const rawMinText = rawDurationText?.match(/(\d+)min/)?.[1] ?? "0";

    const hrsAsMinNum = Math.floor((+rawHrText) * 60);
    const minAsNum = +rawMinText;

    const totalMin = hrsAsMinNum + minAsNum;
    const totalMs = Math.floor(totalMin * 60 * 1000);

    const endTimestamp = startTimestamp + totalMs;

    return {totalMin, totalMs, endTimestamp};
}