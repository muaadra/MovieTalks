import React, { useState } from "react";
import "../../styles/MovieComponent.css";

/**
 * This component represents the setting window on the profile page.
 * The windows pops up when the user clicks on the "settings" button on the profile page
 * 
 * The component allows the user to:
 * Sign out, and Delete an account
 * 
 * @author Muaad Alrawhani, B00538563
 */

function SettingsWindow(props) {
    const [deleteAccount, showDeleteAccount] = useState(false);
    const [error, setError] = useState(null);

    /**
     * this function handles deleteing the account of the user
     * if "delete account" button is clicked, an input text shows asking the user 
     * to fill in the phrase "Delete Account" and click the button again
     */
    function handleDeleteAccountRequest() {
        if (deleteAccount) { //if "delete account" button is clicked
            //get the input value of the input field
            let inputVal = document.getElementById("delete-account-input").value


            //check if the user input the correct phrase
            if (inputVal == "Delete Account") {

                //send API request to delete account
                fetch("/Auth/deleteAccount/", { method: "DELETE" })
                    .then(response => response.json())
                    .then(data => {
                        if (!alert(data.message)) {
                            window.location.href = "/"
                        }
                    });
                setError(null)
            } else {
                //alert user if the provided phrase was incorrect
                setError("Phrase does not match.\nPlease type in exactly 'Delete Account' including capitalizations")
            }
        } else {
            //the user clicked on "delete account", so on the second click check for input
            showDeleteAccount(true)
        }
    }


    return (
        <div>
            {/* the background shade of the form */}
            <div className="overlay-shade" onClick={() => props.showForm(false)}></div>

            {/* the form container */}
            <div id="pop-container" >
                <div id="pop-form" >
                    {/* close button */}
                    <div className="close-window" onClick={() => props.showForm(false)}>close (x)</div>

                    <div id="thread-reply-text-form">
                        <div className="title">
                            <h2>Settings</h2>
                        </div>

                        <div className="pop-window-container">
                            <div id="delete-account">

                                {/* the "delete account" input field  */}
                                {deleteAccount ?
                                    <div id="delete-account-input-cont">
                                        <div>
                                            Type in "Delete Account" and click again
                                        </div>
                                        <input id="delete-account-input" ></input>
                                    </div>
                                    : null
                                }

                                {/* the "delete account" button */}
                                <div className="button warning" onClick={() => handleDeleteAccountRequest()}>Delete Account</div>
                            </div>
                            {/* error messages/feedback */}
                            {error ?
                                <div className="alert">{error}</div>
                                : null
                            }
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}


export default SettingsWindow;
