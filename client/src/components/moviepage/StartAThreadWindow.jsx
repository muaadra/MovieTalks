import React, { useContext, useState, useEffect } from "react";
import "../../styles/MovieComponent.css";
import RateButton from "./RateButton";
import Rate from "./RateWindow";

/**
 * This component represents rating form.
 */
function StartAThreadWindow(props) {
    const threadTBEdited = props.threadDetails.movieThread
    const [showRate, setShowRate] = useState(null);
    const [userRating, setUserRating] = useState(threadTBEdited ? threadTBEdited.userRating : -1);


    useEffect(() => {
        if (props.threadDetails.edit) {
            document.getElementById("thread-input-body").value = threadTBEdited.postText
            document.getElementById("thread-input-title").value = threadTBEdited.postTitle
            document.getElementById("thread-type").value = threadTBEdited.threadType
            document.getElementById("contains-spoiler-check").checked = threadTBEdited.spoilers
        }
    }, []);


    function submitThread() {
        const threadTitle = document.getElementById("thread-input-title").value
        const threadText = document.getElementById("thread-input-body").value
        const threadType = document.getElementById("thread-type").value
        const containsSpoilers = document.getElementById("contains-spoiler-check").checked

        if (props.userRating < 0) {
            alert("Please provide a rating for this movie")
            return
        }

        if (!threadTitle || !threadText) {
            alert("All fields are required")
            return
        }

        const threadBody = {
            _id: (props.threadDetails.edit ? props.threadDetails.movieThread._id : null),
            threadType: threadType,
            voteCount: 0,
            voters: {},
            postDate: 0,
            postTitle: threadTitle,
            postText: threadText,
            spoilers: containsSpoilers,
            userRating: (!props.fromThreadPage ? props.userRating : userRating),
        }

        if (threadBody._id) {
            updateAThread(threadBody)
        } else {
            postThread(threadBody)
        }


        if (!props.fromThreadPage) {
            props.setThreadType(threadType)
        }

        props.showForm(false)
    }


    function postThread(threadData) {
        const requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(threadData)
        };

        fetch("/postAThread/" + props.movieId, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    props.setThreads(data.body.threads)
                    // updateThreadSection(prev => prev + 1)
                } else {
                    console.log(data)
                }
            });
    }

    function updateAThread(threadData) {
        const requestOptions = {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(threadData)
        };

        fetch("/updateAThread/" + props.movieId, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(data.body)
                    props.setMovieThread(data.body)
                    // updateThreadSection(prev => prev + 1)
                } else {
                    console.log(data)
                }
            });
    }

    return (
        <div>
            {/* ratings window */}
            {showRate ? <Rate movieDetails={{ _id: props.movieId }} showForm={setShowRate}
                setUserRating={setUserRating} userRating={userRating} onThreadForm={true} /> : null}

            <div className="overlay-shade" onClick={() => props.showForm(false)}></div>
            <div id="pop-container" >

                <div id="pop-form" >
                    {/* close button */}
                    <div className="close-window" onClick={() => props.showForm(false)}>close (x)</div>

                    <div id="thread-reply-text-form">
                        <div className="title">
                            <h2>{props.threadDetails.edit ? "Update thread" : "Start New Thread"}</h2>
                        </div>
                        <RateButton setUserRating={props.setUserRating} userRating={props.fromThreadPage ? userRating : props.userRating} user={props.user}
                            movieDetails={props.movieDetails} setShowRate={props.fromThreadPage ? setShowRate : props.setShowRate} fromThreadPage={props.fromThreadPage} />

                        <div>
                            <label htmlFor="thread-type">Type of Thread</label>
                            <select id="thread-type">
                                <option value="Review">Review</option>
                                <option value="Discussion">Discussion</option>
                            </select>
                        </div>

                        <div id="contains-spoiler-cont">
                            <input type="checkbox" id="contains-spoiler-check" value="Spoiler" defaultChecked />
                            <label htmlFor="contains-spoiler-check">Contains Spoilers</label>
                        </div>

                        <div>
                            <label htmlFor="thread-input-title" className="form-label">
                                Thread Title
                            </label>
                            <input id="thread-input-title" type="text"></input>
                        </div>

                        <div>
                            <label htmlFor="thread-input-body"> Thread body                         </label>
                            <textarea id="thread-input-body" name="comment-input" ></textarea>
                        </div>


                        <button type="submit" className="button blue" onClick={() => submitThread()}>
                            {props.threadDetails.edit ? "Update" : "Submit Thread"}
                        </button>
                    </div>


                </div>
            </div>
        </div>
    );
}


export default StartAThreadWindow;
