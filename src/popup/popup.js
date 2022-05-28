import React from "react";
import ReactDOM from "react-dom";
import PopupApp from "./PopupApp.jsx";
import {KEY_FOR_MOST_RECENTLY_SERIALIZED_TODO_LIST} from "./constants/KEY_FOR_MOST_RECENTLY_SERIALIZED_TODO_LIST";
import {initTodoListWithMockDataIfEmpty} from "./utils/initTodoListWithMockDataIfEmpty";

initTodoListWithMockDataIfEmpty();

const rawMostRecentlySerializedTodoListFromStorage = localStorage.getItem(KEY_FOR_MOST_RECENTLY_SERIALIZED_TODO_LIST);
const deserializedTodoListFromStorage = JSON.parse(rawMostRecentlySerializedTodoListFromStorage || "[]");

ReactDOM.render(
    <PopupApp initialTodoListItems={deserializedTodoListFromStorage}/>,
    document.getElementById("popupApp")
);