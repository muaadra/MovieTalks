import "../../styles/profile.css"
import "../../styles/admin.css"
import "../../styles/index.css"
import MovieListItem from "../other-or-common/MovieListItem";
import { useState, useEffect, useContext } from "react"
import SendEmailNotificationWindow from "./SendEmailNotificationWindow";
import PostView from "../threadPage/PostView";
import { UserContext } from "../authentication/UserContext";

/**
 * This component is for the admin page, it displayes flagged posts and movie submissions
 */

function Admin(props) {
    const [emailWindow, showEmailWindow] = useState(false); //show email window
    const [movieSubmissions, setMovieSubmissions] = useState([]);//list of movie submissions
    const [flaggedPosts, setFlaggedPosts] = useState([]);//list of flagged posts
    const { user, setUser } = useContext(UserContext) //the signed in user


    //fet movie submissions after closing the email window
    useEffect(() => {
        if (!emailWindow) {
            fetchMovieSubmissions()
        }
    }, [emailWindow]);

    //fetch flagged posts
    useEffect(() => {
        fetchMovieFlaggedPosts()
    }, []);

    /**
     * handles fetching the list of movie submissions
     */
    function fetchMovieSubmissions() {
        fetch(`/movieSubmissions/`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setMovieSubmissions(data.body)
                }
            });
    }

    /**
     * handles fetching the list of flagged posts
     */
    function fetchMovieFlaggedPosts() {
        fetch(`/flaggedPosts/`)
            .then(response => response.json())
            .then(data => {
                setFlaggedPosts(data.body)
            });
    }

    /**
     * sends requests to delete a post (thread, comment, or a reply)
     */
    function dismissOrDeletePost(e, reqData, authorId, flaggedId, deletePost) {
        e.stopPropagation()
        reqData.flaggedId = flaggedId //id of flagged item

        if (deletePost) { //if the admin selected on delete button
            if (window.confirm("Are you sure you want to delete?")) {
                // console.log(reqData)
                dismissFlaggedReq(reqData)
                deleteAPost(authorId, reqData.movieId, reqData.threadId,
                    reqData.commentId, reqData.replyId)
            }
        } else if (window.confirm("Dismiss?")) {
            //if admin selected on "dismiss" button
            dismissFlaggedReq(reqData)
        }
    }

    /**
     * sends request to dismiss a flagged post
     */
    function dismissFlaggedReq(reqData) {
        const requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reqData)
        };

        fetch("/dismissFlaggedPost/", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchMovieFlaggedPosts()
                } else {
                    console.log(data)
                }
            });
    }


    /**
     * sends request to delete a post
     */
    function deleteAPost(authorId, movieId, threadId, commentId, replyId) {

        let url = `/adminDeleteAPost/${authorId}/${movieId}/${threadId}/`

        if (replyId) {
            url += `${commentId}/${replyId}/`
        } else if (commentId) {
            url += `${commentId}/`
        }

        fetch(url, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchMovieFlaggedPosts()
                } else {
                    console.log(data)
                }
            });
    }

    return (
        <div id="profile-content-parent">
            {emailWindow ? <SendEmailNotificationWindow emailWindow={emailWindow} showForm={showEmailWindow} /> : null}

            {/* the right side of the profile page */}
            <div id="profile-content" >
                <div id="profile-nav">
                    <h1 className="userprofile-title">Admin Page</h1>
                </div>

                <div>
                    {/* Flagged Posts */}
                    <div className="userprofile-container">
                        <div className="title"><h2>Flagged Posts</h2></div>
                        <div className="scrollabl">
                            {/* {console.log(userProfileData.posts)} */}
                            {flaggedPosts.map((item, idx) =>
                                <PostView flaggedId={item._id} dismissOrDeletePost={dismissOrDeletePost} key={idx} item={item} user={user ? user : {}} />
                            )}
                            {(flaggedPosts.length == 0 ?
                                <div>No flagged posts</div> : null)}
                        </div>
                    </div>

                    {/* Submitted Movies */}
                    <div className="userprofile-container">
                        <div id="Submitted-Movies-Admin" className="title"><h2>Submitted Movies For Approval</h2></div>

                        <div className="scrollabl">
                            {movieSubmissions.map((item, idx) =>
                                <MovieListItem showEmailWindow={showEmailWindow} adminAprrovalView={true} index={idx} key={idx} item={item} />
                            )}
                            {(flaggedPosts.length == 0 ?
                                <div>No Submitted Movies For Approval</div> : null)}
                        </div>


                    </div>
                </div>

            </div>

        </div>

    )
}

export default Admin