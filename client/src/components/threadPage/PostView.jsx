import { useState, useEffect } from "react"
import person from "../../images/person-circle.svg"
import { useNavigate } from "react-router-dom";

/**
 * Will display an individual (1 single view like a list item) of a thread, component, or a reply
 * just pass it props "item" containing: movieId threadId commentId replyId
 * 
 * Example: to view a comment, you MUST pass item object as a prop, and it contains
 * movieId, threadId, and commentId
 * movieId and threadId are min requirment
 */


function PostView(props) {
    const [postData, setPostData] = useState(null)
    const navigate = useNavigate();
    let item = postData
    let user = props.user
    const [userImage, setUserImage] = useState(null);


    function getFormattedDate(dateVal) {
        const date = new Date(dateVal);
        const dateFormatted = date.getDate() + " " + date.toLocaleString('default', { month: 'long' }) + " " + date.getFullYear()
        return dateFormatted
    }

    useEffect(() => {
        if (item)
            getProfileImage()
    }, [postData])

    useEffect(() => {
        window.scrollTo(0, 0)
        getPost()
    }, [props.item])

    function getPost() {
        if (!props.item.movieId) return;

        let url = `/postView/${props.item.movieId}/${props.item.threadId}/`

        if (props.item.replyId) {
            url = `/postView/${props.item.movieId}/${props.item.threadId}/${props.item.commentId}/${props.item.replyId}/`
        } else if (props.item.commentId) {
            url = `/postView/${props.item.movieId}/${props.item.threadId}/${props.item.commentId}/`
        }
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setPostData(data.body)
                } else {
                    setPostData(null)
                }
            });
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
            fetch("/getUserImageForThreads/" + item.userId)
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

    function goToPost() {
        let url = `/thread/?movieId=${props.item.movieId}&threadId=${props.item.threadId}`
        navigate(url)
    }

    return (
        postData ? <div className="list-item-thread-main">
            < div id="bottom-section" >
                <div className="user-profile-img-reply">
                    <img className="user-profile-img" src={userImage}></img>
                </div>

                <div className="review-preview pointer"
                    onClick={() => goToPost()}>
                    <div>
                        <div className="title thread-title">
                            <h2>{(postData.postTitle ? "Thread: " + postData.postTitle :
                                (postData.postType == "comment" ? "comment" : "Reply to a comment"))}
                            </h2>
                        </div>

                        <div id="top-section">
                            <div id="usrname-postdate">
                                <div className="username">{postData.userName}</div>
                                <div id="postdate">{getFormattedDate(postData.postDate)}</div>
                            </div>

                        </div></div>

                    <div className="post-text">
                        {postData.postText}
                    </div>
                    {
                        props.flaggedId ?
                            <div className="admin-delete-post">
                                <div className="button warning no-margin" onClick={(e) => props.dismissOrDeletePost(e, props.item, postData.userId, props.flaggedId, true)}>
                                    Delete Post
                                </div>
                                <div className="button yellow no-margin" onClick={(e) => props.dismissOrDeletePost(e, props.item, postData.userId, props.flaggedId, false)}>
                                    Dismiss Flag Request
                                </div>
                            </div> : null
                    }

                </div>
            </div >
        </div > : null


    )
}

export default PostView;