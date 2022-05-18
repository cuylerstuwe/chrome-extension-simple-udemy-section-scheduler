export function findStandaloneNumberInTitle(title) {
    return title.match(/\b\d+\b/)?.[0];
}