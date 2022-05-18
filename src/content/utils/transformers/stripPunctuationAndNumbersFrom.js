export function stripPunctuationAndNumbersFrom(str) {
    return str.replace(/[\d\[\]()<>"':]/g, "");
}