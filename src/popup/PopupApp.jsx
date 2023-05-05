import React, {useState} from "react";
import TodoList from "./components/TodoList.jsx";
import TaskEntry from "./components/TaskEntry.jsx";
import Header from "./components/Header.jsx";
import {KEY_FOR_MOST_RECENTLY_SERIALIZED_TODO_LIST} from "./constants/KEY_FOR_MOST_RECENTLY_SERIALIZED_TODO_LIST";
import { v4 as uuidv4 } from 'uuid';

export default function PopupApp(props) {

    const [todoListItems, setTodoListItems] = useState(props.initialTodoListItems);

    const reserializeTodoListItems = itemsToSerialize => {
        localStorage.setItem(KEY_FOR_MOST_RECENTLY_SERIALIZED_TODO_LIST, JSON.stringify(itemsToSerialize ?? []));
    };

    const createAndAppendNewTaskWithDefaultSettings = labelOfNewTaskToCreate => {
        const newTask = ({
            label: labelOfNewTaskToCreate,
            id: uuidv4(),
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

    const clearAllFinishedTodoListItems = () => {
        const todoListItemsWithAllFinishedTodoListItemsCleared = todoListItems.flatMap(todoListItem =>
            todoListItem.isComplete
                ? []
                : [todoListItem]
        );

        setTodoListItems(todoListItemsWithAllFinishedTodoListItemsCleared);
        reserializeTodoListItems(todoListItemsWithAllFinishedTodoListItemsCleared);
    }

    const markAllItemsAsCompleted = () => {
        const todoListItemsWithAllMarkedAsFinished = todoListItems.map(todoListItem => ({...todoListItem, isComplete: true}));
        setTodoListItems(todoListItemsWithAllMarkedAsFinished);
        reserializeTodoListItems(todoListItemsWithAllMarkedAsFinished);
    };

    return (
        <>
            <Header>Learning Tasks</Header>
            <div style={{fontSize: '12px', marginBottom: '10px'}}>Keep track of things you still need to try out on your learning journey.</div>
            <div style={{marginBottom: '10px', display: 'flex', alignItems: 'center'}}>
                <div style={{marginRight: '5px'}}>Actions: </div>
                <button style={{marginRight: '5px'}} onClick={markAllItemsAsCompleted}>Mark all as completed</button>
                <button onClick={clearAllFinishedTodoListItems}>Clear all completed tasks</button>
            </div>
            <TaskEntry createAndAppendNewTaskWithDefaultSettings={createAndAppendNewTaskWithDefaultSettings} />
            <TodoList
                todoListItems={todoListItems}
                toggleTodoListItemCompletionStatus={toggleTodoListItemCompletionStatus}
            />
        </>
    );
}