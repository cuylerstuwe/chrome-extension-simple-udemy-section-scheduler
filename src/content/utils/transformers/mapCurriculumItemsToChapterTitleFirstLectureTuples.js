export function mapCurriculumItemsToChapterTitleFirstLectureTuples(curriculumItems) {
    return curriculumItems?.reduce((acc, val, idx) => {
        if (val?._class === "chapter") {
            return ([
                ...acc,
                [val?.title, curriculumItems[idx + 1]]
            ]);
        } else {
            return [...acc];
        }
    }, []);
}