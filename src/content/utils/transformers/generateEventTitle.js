import {allConsequentialWordsInTitleWithoutPunctuation} from "./toConsequential";
import {findStandaloneNumberInTitle} from "./findStandaloneNumberInTitle";

export function generateEventTitle(shouldUseVerboseNames, courseTitle, sectionTitleText) {
    return shouldUseVerboseNames
        ? `Udemy: ${courseTitle} (${sectionTitleText})`
        : `${allConsequentialWordsInTitleWithoutPunctuation(courseTitle)} (${findStandaloneNumberInTitle(sectionTitleText)}: ${allConsequentialWordsInTitleWithoutPunctuation(sectionTitleText)})`;
}