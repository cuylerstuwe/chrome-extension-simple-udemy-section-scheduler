import {KEY_FOR_MOST_RECENTLY_SERIALIZED_TODO_LIST} from "../constants/KEY_FOR_MOST_RECENTLY_SERIALIZED_TODO_LIST";

export function initTodoListWithMockDataIfEmpty() {
    if (!localStorage.getItem(KEY_FOR_MOST_RECENTLY_SERIALIZED_TODO_LIST)) {
        localStorage.setItem(
            KEY_FOR_MOST_RECENTLY_SERIALIZED_TODO_LIST,
            JSON.stringify([
                {
                    id: 0,
                    isComplete: false,
                    label: "Do things"
                },
                {
                    id: 1,
                    isComplete: true,
                    label: "Something I already did"
                }
            ])
        );
    }
}