import React from "react";

export default function TodoListItem({id, isComplete, label, toggleCompletionStatus}) {
    return (
        <div style={{display: "flex", borderTop: "1px solid black", alignItems: "center"}} data-task-id={id}>
            <input type="checkbox" checked={isComplete} onClick={e => {toggleCompletionStatus();}}></input>
            <span style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                ...(
                    isComplete
                        ? {textDecoration: "line-through"}
                        : {}
                )
            }}>
                {label}
            </span>
        </div>
    );
}
