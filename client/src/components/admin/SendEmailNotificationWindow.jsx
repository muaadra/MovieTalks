import React, { useContext, useState, useEffect } from "react";
import "../../styles/MovieComponent.css";
import { UserContext } from "../authentication/UserContext";

/**
 * This component is a pop up window to allow admins to send emails
 * the window shows when admin clicks on "approve" or "deny" buttons on movie
 * submissions
 */
function SendEmailNotificationWindow(props) {

    /**
     * send request to email the user of the approval decision
     */
    function sendApprovalData(reqData) {
        const requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reqData)
        };

        fetch("/approval/", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message)
                } else {
                    console.log(data)
                }
            });
    }

    /**
     * validats data on the email window befor send a request to email
     */
    function sendEmail(e) {
        e.preventDefault()
        const formData = new FormData(e.target);
        const reqData = {}
        for (const entry of formData) {
            if (entry[1] == "") {
                alert(`All fields are required: missing '${entry[0]}'`)
                return
            }
            reqData[entry[0]] = entry[1]
        }

        //add approval data
        reqData.approved = props.emailWindow.approved
        reqData.adminMovieId = props.emailWindow.movieItem._id

        props.showForm(false)

        //includes email data
        sendApprovalData(reqData)
    }


    return (
        <div>
            <div className="overlay-shade" onClick={() => props.showForm(false)}></div>
            <div id="pop-container" >

                <div id="pop-form" >
                    {/* close button */}
                    <div className="close-window" onClick={() => props.showForm(false)}>close (x)</div>

                    <form id="thread-reply-text-form" onSubmit={(e) => sendEmail(e)}>
                        <div className="title">
                            <h2>Send Email Notification</h2>
                        </div>
                        {/* to field */}
                        <div>
                            <label htmlFor="movie-submitter-email" className="form-label">
                                To
                            </label>
                            <input id="movie-submitter-email" name="email" type="email" defaultValue={props.emailWindow.movieItem.userEmail} ></input>
                        </div>

                        {/* subject field */}
                        <div>
                            <label htmlFor="movie-submitter-subject" className="form-label">
                                Subject
                            </label>
                            <input id="movie-submitter-subject" name="subject" defaultValue={props.emailWindow.approved ? "Approved!" : "Sorry"}></input>
                        </div>

                        {/* body text input */}
                        <div>
                            <label htmlFor="email-input-body"> Email body                         </label>
                            <textarea id="email-input-body" name="emailBody" ></textarea>
                        </div>

                        {/* email button */}
                        <button type="submit" className="button blue" >
                            Send Email
                        </button>
                    </form>


                </div>
            </div>
        </div>
    );
}


export default SendEmailNotificationWindow;
