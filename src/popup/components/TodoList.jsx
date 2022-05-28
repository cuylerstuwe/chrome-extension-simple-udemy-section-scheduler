import React from "react";
import TodoListItem from "./TodoListItem.jsx";

export default function TodoList({todoListItems, toggleTodoListItemCompletionStatus}) {
    return (
        <div style={{borderBottom: "1px solid black", height: "300px", overflow: "scroll"}}>
            {
                todoListItems.map(({id, label, isComplete}) => (
                    <TodoListItem
                        key={`todoListItem-${id}`}
                        id={id}
                        label={label}
                        isComplete={isComplete}
                        toggleCompletionStatus={() => toggleTodoListItemCompletionStatus(id)}
                    />
                ))
            }
        </div>
);
}