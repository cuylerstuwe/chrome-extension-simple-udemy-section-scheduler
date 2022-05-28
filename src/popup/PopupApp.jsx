import React, {useState} from "react";
import TodoList from "./components/TodoList.jsx";
import TaskEntry from "./components/TaskEntry.jsx";
import Header from "./components/Header.jsx";
import {KEY_FOR_MOST_RECENTLY_SERIALIZED_TODO_LIST} from "./constants/KEY_FOR_MOST_RECENTLY_SERIALIZED_TODO_LIST";

export default function PopupApp(props) {

    const [todoListItems, setTodoListItems] = useState(props.initialTodoListItems);

    const reserializeTodoListItems = itemsToSerialize => {
        localStorage.setItem(KEY_FOR_MOST_RECENTLY_SERIALIZED_TODO_LIST, JSON.stringify(itemsToSerialize ?? []));
    };

    const createAndAppendNewTaskWithDefaultSettings = labelOfNewTaskToCreate => {
        const newTask = ({
            label: labelOfNewTaskToCreate,
            id: Math.random(), // Good enough for the purpose of this interview demo, otherwise would usually use UUIDv4.
            isComplete: false
        });

        const todoListItemsWithNewTaskAppended = [...todoListItems, newTask];
        setTodoListItems(todoListItemsWithNewTaskAppended);
        reserializeTodoListItems(todoListItemsWithNewTaskAppended);
    };

    const toggleTodoListItemCompletionStatus = idOfItemToToggle => {

        const todoListItemsWithMatchingItemMarkedAsComplete = todoListItems.map(todoListItem =>
            todoListItem.id === idOfItemToToggle
                ? {...todoListItem, isComplete: !todoListItem.isComplete}
                : {...todoListItem}
        );

        setTodoListItems(todoListItemsWithMatchingItemMarkedAsComplete);
        reserializeTodoListItems(todoListItemsWithMatchingItemMarkedAsComplete);
    };

    return (
        <>
            <Header>Udemy Tasks</Header>
            <TaskEntry createAndAppendNewTaskWithDefaultSettings={createAndAppendNewTaskWithDefaultSettings} />
            <TodoList
                todoListItems={todoListItems}
                toggleTodoListItemCompletionStatus={toggleTodoListItemCompletionStatus}
            />
        </>
    );
}