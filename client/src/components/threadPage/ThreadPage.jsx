
import "../../styles/MovieComponent.css";
import "../../styles/colors.css";
import "../../styles/lists.css";

import flag from "../../images/flag-fill.svg"
import { useNavigate } from "react-router-dom";
import MovieListItem from "../other-or-common/MovieListItem";
import ReplyWindow from "./ReplyWindow";
import { useState, useEffect, useContext } from "react"
import { UserContext } from "../authentication/UserContext";
import StartAThreadWindow from "../moviepage/StartAThreadWindow";
import ThreadPostItem from "./ThreadPostItem";
import NoListItemsMessage from "../other-or-common/NoListItemsMessage";

/**
 * This component for listing threads in a movie
 */
function ThreadPage(props) {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext)

    //get thread params
    const query = window.location.search
    const params = new URLSearchParams(query);
    const movieId = params.get('movieId')
    const threadId = params.get('threadId')

    const [showReply, setShowReply] = useState(null);
    const [mainThread, updateMainThread] = useState(0);
    const [showThreadWindow, setShowStartAThread] = useState(null);
    const [movieThread, setMovieThread] = useState(true);
    const [viewReplies, setViewReplies] = useState(-1);


    useEffect(() => {
        window.scrollTo(0, 0)
        fetchThread()
    }, [])

    function fetchThread() {
        fetch(`/getAThread/${movieId}/${threadId}`)
            .then(async response => response.json())
            .then(data => {
                if (data.success) {
                    setMovieThread(data.body)
                } else {
                    setMovieThread(false)
                }
            });
    }

    /**
     * creates a comment or reply component
     */
    function getListItem(item, idx, reply, level2Reply, parentReplytId) {
        if (!item._id || !movieThread) return null;

        if (parentReplytId) item.parentId = parentReplytId;

        return <ThreadPostItem key={idx} item={item} idx={idx} level2Reply={level2Reply}
            parentReplytId={parentReplytId} user={user} movieThread={movieThread}
            flagPost={flagPost} movieId={movieId} threadId={threadId} setMovieThread={setMovieThread}
            showReplyWindow={showReplyWindow} setViewReplies={setViewReplies} viewReplies={viewReplies} reply={reply}
            getListItem={getListItem} />

    }

    /**
     * show reply/commenting window
     * @param {Boolean} isComment if not a comment then it is a reply to a comment
     * @param {Object} movieThread 
     * @param {Boolean} isEdit is it to edit an existing comment/reply
     */
    function showReplyWindow(item, isComment, movieThread, isEdit) {
        if (!user) {
            alert("You must sign in to " + (isComment ? "comment" : "reply"))
            return
        }
        setShowReply({
            isComment,
            replyTo: item._id,
            movieThread,
            movieId,
            edit: isEdit,
            item,
        })
    }



    function flagPost(commentId, replyId) {
        // console.log(`/flagAPost/${movieId}/${threadId}/${commentId}/${replyId}/`)
        const reqData = {
            movieId,
            threadId,
            commentId,
            replyId
        }

        // console.log(reqData)
        // return
        const requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reqData)
        };

        fetch(`/flagAPost/`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(data.body)
                    alert("Post was flagged successfully")
                    // updateThreadSection(prev => prev + 1)
                } else {
                    console.log(data)
                }
            });
    }

    function deleteThread() {
        if (movieThread.replies && movieThread.replies.length > 0) {
            if (window.confirm("Thread cannot be deleted because there are comments on this thread." +
                " Would you like to delete your profile info from the thread instead?" +
                " You will not be able to edit your post after removing you info.")) {
                movieThread.userName = "Deleted User"
                sendDeleteAthreadRequest(true)
                return
            }
        } else if (window.confirm("Are you sure you want to delete this thread?")) {
            sendDeleteAthreadRequest(false)
        }
    }

    function sendDeleteAthreadRequest(deleteInfoOnly) {
        let url = `/deleteAThread/${movieId}/${threadId}/`
        fetch(url, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (deleteInfoOnly) {
                        setMovieThread(data.body)

                        alert("Your info has been deleted from the thread")
                    } else {
                        alert("Thread has been deleted")
                        navigate("/moviePage/?id=" + movieId)
                    }
                } else {
                    console.log(data)
                }
            });
    }

    return (

        <div>
            {showReply ? <ReplyWindow replyDetails={showReply} showForm={setShowReply} setMovieThread={setMovieThread} setViewReplies={setViewReplies} /> : null}

            {showThreadWindow ? <StartAThreadWindow movieId={movieId} threadDetails={showThreadWindow}
                showForm={setShowStartAThread} userRating={movieThread.userRating} setMovieThread={setMovieThread}
                updateMainThread={updateMainThread} fromThreadPage={true} user={user} /> : null}

            {movieThread ? <div id="thread-component" className="main-component-container light-blue elevated">

                <div className="thread-movie-list-item-parenxt">
                    <MovieListItem movieId={movieId} />
                </div>
                {getListItem(movieThread, 0)}
                <div className="thread-tools-bottom-bar">
                    <div className="button no-margin shade" onClick={() => flagPost()}>
                        Flag
                        <img src={flag} alt="flag a post" className="flag-post" /></div>

                    <div className="button no-margin shade" onClick={() => showReplyWindow(movieThread, true, movieThread, false)}> Add a Comment</div>

                    {user && movieThread && user._id == movieThread.userId ? <div className="button no-margin shade" onClick={() => deleteThread()}> Delete</div> : null}
                    {user && movieThread && user._id == movieThread.userId ? <div className="button no-margin shade" onClick={() => setShowStartAThread({ movieId, movieThread, edit: true })}> Edit</div> : null}
                </div>

            </div> :
                <div id="thread-component" className="main-component-container light-blue elevated">
                    <h2>Thread cannot be found. Possible reasons: The thread was either deleted or wrong link (url ) was provided</h2>
                </div>}

            {/* comment section */}
            {movieThread ? <div id="threads-component" className="main-component-container">
                <div className="title">Comments</div>
                {movieThread && movieThread.replies && movieThread.replies.length > 0 ?
                    movieThread.replies.map((item, idx) => getListItem(item, idx, true, false, null)) :

                    <NoListItemsMessage header={"There are no comments on this thread"}
                        message={`You can add a new comment by clicking on the "Add a Comment" button, above.`} />
                }

            </div> : null}

        </div >

    );
}

export default ThreadPage;
