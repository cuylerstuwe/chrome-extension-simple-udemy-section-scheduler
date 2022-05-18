export async function waitForCurriculumItemsRequest() {
    const courseId = JSON.parse(document.querySelector("[data-module-id='course-taking']")?.dataset?.moduleArgs || "{}")?.courseId;
    let curriculumItemResponse;
    try {
        curriculumItemResponse = await fetch(`https://www.udemy.com/api-2.0/courses/${courseId}/subscriber-curriculum-items/?page_size=1400&fields[lecture]=title,object_index,is_published,sort_order,created,asset,supplementary_assets,is_free&fields[quiz]=title,object_index,is_published,sort_order,type&fields[practice]=title,object_index,is_published,sort_order&fields[chapter]=title,object_index,is_published,sort_order&fields[asset]=title,filename,asset_type,status,time_estimation,is_external&caching_intent=True&cachebust=${Math.random() * 10000}`);
    } catch (err) {
    }

    let curriculumItemJson;
    try {
        curriculumItemJson = await curriculumItemResponse?.json();
    } catch (err) {
    }

    return curriculumItemJson?.results;
}