import starFilled from "../../images/star-fill.svg"
import person from "../../images/person-circle.svg"
import upVote from "../../images/chevron-up.svg"
import downVote from "../../images/chevron-down.svg"
import { useState, useEffect } from "react"
import { setVote } from "./MoviePageThreadItem"

function ThreadPostItem(props) {
    let item = props.item
    let idx = props.idx
    let reply = props.reply
    let level2Reply = props.level2Reply
    let parentReplytId = props.parentReplytId
    let user = props.user
    let movieThread = props.movieThread
    let flagPost = props.flagPost
    let setMovieThread = props.setMovieThread
    let showReplyWindow = props.showReplyWindow
    let setViewReplies = props.setViewReplies
    let viewReplies = props.viewReplies
    let movieId = props.movieId
    let threadId = props.threadId

    const [voteCount, setVoteCount] = useState(item.voteCount);
    const [myVoteCount, setMyVoteCount] = useState(0);
    const [userImage, setUserImage] = useState(null);
    useEffect(() => {
        if (item)
            getProfileImage()
    }, [])

    useEffect(() => {
        setUpMyVoteCount()
    }, []);


    function setUpMyVoteCount() {
        if (user && item.voters && item.voters[user._id]) {
            setMyVoteCount(item.voters[user._id])
        } else {
            return setMyVoteCount(0)
        }
    }

    if (!item) return null;
    if (parentReplytId) {
        item.parentId = parentReplytId
    }



    function getFormattedDate(dateVal) {
        const date = new Date(dateVal);
        const dateFormatted = date.getDate() + " " + date.toLocaleString('default', { month: 'long' }) + " " + date.getFullYear()
        return dateFormatted
    }

    function deleteReply(commentId, replyId) {
        if (window.confirm("Are you sure you want to delete your comment?")) {
            let url = `/deleteAReply/${movieId}/${threadId}/${commentId}/`
            if (replyId) {
                url += `${replyId}/`
            }

            fetch(url, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setMovieThread(data.body)
                    } else {
                        console.log(data)
                    }
                });
        }
    }

    function sortReplies(rep) {
        rep.sort((a, b) => a.postDate > b.postDate ? -1 : 1)
        return rep
    }

    function getProfileImage() {
        if (user && item.userId == user._id && user.profileImage) {
            setUserImage(user.profileImage)
        } else {
            fetchProfileImage()
        }
    }

    function fetchProfileImage() {

        if (item.userId) {
            //send API request
            fetch("/getUserImageForThreads/" + (item._id ? item.userId : movieThread.userId))
                .then(response => response.blob())
                .then(image => {

                    if (image.size > 0) {
                        let imgUrl = window.URL.createObjectURL(image)
                        setUserImage(imgUrl)
                    } else {
                        setUserImage(person)
                    }
                });
        }

    }


    return (
        < div key={idx} id={item._id} className={reply ? "list-item" : "list-item-thread-main"}>
            <div id="bottom-section">
                {
                    reply ?
                        <div className="user-profile-img-reply">
                            <img className="user-profile-img" src={userImage}></img>
                        </div> :
                        <div className="votes">
                            <img src={upVote} alt="" id="up-vote" className={myVoteCount == 1 ? "vote yellow" : "vote"}
                                onClick={() => (user ? setVote((myVoteCount == 1 ? 0 : 1), item, props.movieId, setMyVoteCount, setVoteCount) : alert("You must sign in to vote"))} />
                            {voteCount >= 1000 ? (((voteCount / 1000)) + "k") : voteCount}
                            <img src={downVote} alt="" id="down-vote" className={myVoteCount == -1 ? "vote yellow" : "vote"}
                                onClick={() => (user ? setVote((myVoteCount == -1 ? 0 : -1), item, props.movieId, setMyVoteCount, setVoteCount) : alert("You must sign in to vote"))} />
                        </div>
                }

                <div className="review-preview no-pointer">
                    {
                        reply ?
                            <div id="usrname-postdate-reply">
                                <div className="username">{item.userName}</div>
                                <div id="postdate">{getFormattedDate(item.postDate)}</div>
                            </div>

                            :
                            <div>
                                <div className="title thread-title">{movieThread.postTitle}</div>

                                <div id="top-section">
                                    <img className="user-profile-img"
                                        src={userImage}></img>
                                    <div id="usrname-postdate">
                                        <div className="username">{item.userName}</div>
                                        <div id="postdate">{getFormattedDate(item.postDate)}</div>
                                    </div>
                                    <div id="userrating">
                                        <img id="star-img" src={starFilled} alt="rating" />
                                        <div id="userrating-value">{item.userRating}/10</div>
                                    </div>
                                    {movieThread.spoilers ?
                                        <div className="spoiler-tag">
                                            <div >
                                                Spoilers
                                            </div>
                                        </div>
                                        : null
                                    }
                                </div></div>

                    }

                    <div className="post-text">
                        {item.postText}
                    </div>
                    {
                        !reply ? null :

                            <div className="thread-tools-bottom-bar">

                                {user ? <div className="link-style" onClick={() => flagPost((level2Reply ? parentReplytId : item._id), (!level2Reply ? null : item._id))}>Flag</div> : null}
                                {user && user._id == item.userId ? <div className="link-style" onClick={() => deleteReply((level2Reply ? parentReplytId : item._id), (!level2Reply ? null : item._id))}> Delete</div> : null}
                                {user && user._id == item.userId ? <div className="link-style" onClick={() => showReplyWindow(item, (level2Reply ? false : true), movieThread, true)}> Edit</div> : null}
                                {level2Reply ? null : <div className="link-style" onClick={() => showReplyWindow(item, false, movieThread, false)}> Reply</div>}
                                {item.replies && item.replies.length > 0 ? <div className="pointer" onClick={() => setViewReplies(viewReplies != item._id ? item._id : -1)}> View Replies {viewReplies != item._id ? "►" : "▼"}</div> : null}
                            </div>
                    }

                </div>
            </div>
            {item.replies && item.replies.length > 0 && reply && viewReplies == item._id ?
                <div className="replies-container">
                    <strong>Replies:</strong>
                    <div className="replies-to-comments">
                        {sortReplies(item.replies).map((repItem, idx) => props.getListItem(repItem, idx, true, true, item._id))}
                    </div>
                </div> : null}
        </div >)
}

export default ThreadPostItem;