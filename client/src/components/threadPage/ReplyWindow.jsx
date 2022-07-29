import React, { useContext, useState, useEffect } from "react";
import "../../styles/MovieComponent.css";
import { UserContext } from "../authentication/UserContext";

/**
 * This component represents reply form.
 */
function ReplyWindow(props) {
    const { user, setUser } = useContext(UserContext)
    const replyDetails = props.replyDetails
    let postComments = props.replyDetails.movieThread.replies
    let item = props.replyDetails.item
    useEffect(() => {
        if (props.replyDetails.edit) {
            document.getElementById("comment-input").value = item.postText
        }
    }, []);

    function submitReply() {
        let replyText = document.getElementById("comment-input").value

        if (!replyText) {
            alert("All fields are required")
            return
        }

        let reply = {
            _id: (props.replyDetails.edit ? item._id : null),
            repliedTo: props.replyDetails.movieThread._id, //id of the reply or thread 
            userId: user._id,
            userName: user.username,
            postType: (replyDetails.isComment ? "comment" : "reply"),
            postText: replyText,
        }

        if (reply._id) {
            updateReply(reply)
        } else {
            postReply(reply)
        }


        // props.updateCommentSection(prev => prev + 1)
        props.showForm(false)
    }

    function updateReply(reply) {
        const parentId = props.replyDetails.item.parentId
        const childId = props.replyDetails.item._id

        const requestOptions = {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reply)
        };

        let url = `/updateAReply/${replyDetails.movieId}/${replyDetails.movieThread._id}/`
        if (!parentId) { //it is a comment
            url += `${childId}/`
        } else { // a reply
            url += `${parentId}/${childId}/`
        }

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    props.setMovieThread(data.body)

                    //if a new reply is added to a comment, expand replies
                    if (reply._id == null && !props.replyDetails.isComment) {//new reply
                        props.setViewReplies(replyDetails.replyTo)
                    }

                } else {
                    console.log(data)
                }
            });
    }
    function postReply(reply) {
        const requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reply)
        };

        let url = `/postAReply/${replyDetails.movieId}/${replyDetails.movieThread._id}`
        //build reply chain of ids as a url query
        if (!replyDetails.isComment) {//a reply to a comment
            url = `/postAReply/${replyDetails.movieId}/${replyDetails.movieThread._id}/${replyDetails.replyTo}`
        }

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    props.setMovieThread(data.body)

                    //if a new reply is added to a comment, expand replies
                    if (reply._id == null && !props.replyDetails.isComment) {//new reply
                        props.setViewReplies(replyDetails.replyTo)
                    }

                } else {
                    console.log(data)
                }
            });
    }

    return (
        <div>
            <div className="overlay-shade" onClick={() => props.showForm(false)}></div>
            <div id="pop-container" >

                <div id="pop-form" >
                    {/* close button */}
                    <div className="close-window" onClick={() => props.showForm(false)}>close (x)</div>


                    <div id="thread-reply-text-form">
                        <div className="title">
                            <h2>Comment</h2>
                        </div>

                        <label id="comment-input-label" htmlFor="comment-input"> Add your {props.replyDetails.comment ? "comment" : "reply"} below:
                        </label>
                        <textarea id="comment-input" name="comment-input" ></textarea>
                        <button type="submit" className="button blue" onClick={() => submitReply()}>
                            Submit  {props.replyDetails.comment ? "Comment" : "Reply"}
                        </button>
                    </div>


                </div>
            </div>
        </div>
    );
}


export default ReplyWindow;
