import {stripPunctuationAndNumbersFrom} from "./stripPunctuationAndNumbersFrom";

const isLowercaseWordInconsequential = (() => {
    const inconsequentialWordsLowercaseLookup = {
        "the": true,
        "section": true,
        "udemy": true,
        "complete": true,
        "guide": true,
        "to": true,
        "from": true,
        "and": true,
        "&": true,
        "bootcamp": true,
        "become": true,
        "a": true,
        "developer": true,
        "masterclass": true,
        "build": true,
        "including": true,
        "front": true,
        "back": true,
        "working": true,
        "being": true,
        "be": true,
        "in": true
    };
    return (word) => inconsequentialWordsLowercaseLookup[word];
})();

export function firstConsequentialWordInTitle(title) {
    const wordsInTitle = stripPunctuationAndNumbersFrom(title)?.split(/\W/).filter(word => !!word?.trim());
    return wordsInTitle.find(wordInTitle => !isLowercaseWordInconsequential(wordInTitle?.toLowerCase()));
}

export function allConsequentialWordsInTitleWithoutPunctuation(title) {
    const wordsInTitle = stripPunctuationAndNumbersFrom(title)?.split(/\W/).filter(word => !!word?.trim());
    return wordsInTitle.filter(wordInTitle => !isLowercaseWordInconsequential(wordInTitle?.toLowerCase()))?.join(" ");
}
