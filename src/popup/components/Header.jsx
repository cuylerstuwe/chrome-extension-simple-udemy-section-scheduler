import React from "react";

export default function Header({children}) {
    return (
        <div style={{marginBottom: "10px", fontSize: "28px"}}>
            {children}
        </div>
    );
}