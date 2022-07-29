import React, { useState } from "react";
import "../../styles/MovieComponent.css";

/**
 * This component represents rating form.
 */
function Message(props) {

    return (
        <div>

            <div className="overlay-shade" onClick={() => props.showForm(false)}></div>
            <div id="pop-container" className="message-window" >

                <div id="pop-form">
                    {/* close button */}
                    <div className="close-window" onClick={() => props.showForm(false)}>close (x)</div>
                    <form id="message-form">
                        <div id="rate-title">
                            <h2>{props.showMessage.title}</h2>
                        </div>
                        <div>
                            {props.showMessage.message}
                        </div>
                    </form>


                </div>
            </div>
        </div>
    );
}


export default Message;
