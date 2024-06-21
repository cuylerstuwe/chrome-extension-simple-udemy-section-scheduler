import {allConsequentialWordsInTitleWithoutPunctuation} from "./toConsequential";
import {findStandaloneNumberInTitle} from "./findStandaloneNumberInTitle";

export function generateEventTitle(shouldUseVerboseNames, courseTitle, sectionTitleText) {
    const standaloneNumberInTitle = findStandaloneNumberInTitle(sectionTitleText);

    return shouldUseVerboseNames
        ? `Udemy: ${courseTitle} (${sectionTitleText})`
        : `${allConsequentialWordsInTitleWithoutPunctuation(courseTitle)} (${standaloneNumberInTitle ? `${standaloneNumberInTitle}: ` : ""}${allConsequentialWordsInTitleWithoutPunctuation(sectionTitleText)})`;
}