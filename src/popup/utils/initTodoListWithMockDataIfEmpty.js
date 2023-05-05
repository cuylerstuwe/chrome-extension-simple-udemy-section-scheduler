import {KEY_FOR_MOST_RECENTLY_SERIALIZED_TODO_LIST} from "../constants/KEY_FOR_MOST_RECENTLY_SERIALIZED_TODO_LIST";
import { v4 as uuidv4 } from 'uuid';

export function initTodoListWithMockDataIfEmpty() {
    if (!localStorage.getItem(KEY_FOR_MOST_RECENTLY_SERIALIZED_TODO_LIST)) {
        localStorage.setItem(
            KEY_FOR_MOST_RECENTLY_SERIALIZED_TODO_LIST,
            JSON.stringify([
                {
                    id: uuidv4(),
                    isComplete: true,
                    label: "Download the Schedule Udemy Course Sections extension"
                },
                {
                    id: uuidv4(),
                    isComplete: true,
                    label: "Open Learning Tasks for the first time"
                },
                {
                    id: uuidv4(),
                    isComplete: false,
                    label: "Add your own task to this list"
                }
            ])
        );
    }
}