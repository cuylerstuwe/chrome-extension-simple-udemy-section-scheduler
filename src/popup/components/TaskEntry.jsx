import React, {useState} from "react";

const DEFAULT_TASK_ENTRY_TEXT = "";

export default function TaskEntry({createAndAppendNewTaskWithDefaultSettings}) {

    const [taskEntryText, setTaskEntryText] = useState(DEFAULT_TASK_ENTRY_TEXT);
    const didUserActuallyEnterSomethingYet = !!(taskEntryText);

    return (
        <div style={{marginBottom: "10px"}}>
            <input
                placeholder="New task title"
                value={taskEntryText}
                onChange={e => setTaskEntryText(e.target.value)}
            />
            <button
                disabled={!didUserActuallyEnterSomethingYet}
                style={{marginLeft: "5px"}}
                onClick={() => {
                    if(!didUserActuallyEnterSomethingYet) { return; }
                    createAndAppendNewTaskWithDefaultSettings(taskEntryText);
                    setTaskEntryText(DEFAULT_TASK_ENTRY_TEXT);
                }
            }>Add</button>
        </div>
    );
}