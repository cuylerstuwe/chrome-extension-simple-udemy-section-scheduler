import React, {useState} from "react";

const DEFAULT_TASK_ENTRY_TEXT = "";

export default function TaskEntry({createAndAppendNewTaskWithDefaultSettings}) {
    const [taskEntryText, setTaskEntryText] = useState(DEFAULT_TASK_ENTRY_TEXT);
    const didUserActuallyEnterSomethingYet = !!(taskEntryText);

    const triggerSubmitIntent = () => {
        if(!didUserActuallyEnterSomethingYet) { return; }
        createAndAppendNewTaskWithDefaultSettings(taskEntryText);
        setTaskEntryText(DEFAULT_TASK_ENTRY_TEXT);
    };

    return (
        <div style={{marginBottom: "10px"}}>
            <input
                placeholder="New task title"
                value={taskEntryText}
                onChange={e => setTaskEntryText(e.target.value)}
                onKeyDown={e => {
                    if(e.key === "Enter") {
                        e.preventDefault();
                        e.stopPropagation();
                        triggerSubmitIntent();
                    }
                }}
            />
            <button
                disabled={!didUserActuallyEnterSomethingYet}
                style={{marginLeft: "5px"}}
                onClick={triggerSubmitIntent}>Add</button>
        </div>
    );
}