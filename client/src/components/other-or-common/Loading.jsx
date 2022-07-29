import React, { useContext, useState, useEffect } from "react";
import "../../styles/index.css";


function Loading(props) {

    return (
        <div >
            {Array(props.number || 1).fill().map((i, idx) =>
                <div key={idx} className="loading" style={{ minHeight: `${props.h || 5}rem` }}>loading...</div>
            )}

        </div>

    )
}

export default Loading