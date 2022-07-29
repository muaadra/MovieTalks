/**
 * this component represents an item on thread list on the movie page
 */

import "../../styles/MovieComponent.css";
import "../../styles/colors.css";
import "../../styles/lists.css";
import starFilled from "../../images/star-fill.svg"
import person from "../../images/person-circle.svg"
import upVote from "../../images/chevron-up.svg"
import downVote from "../../images/chevron-down.svg"
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react"
import { UserContext } from "../authentication/UserContext";


function MoviePageThreadItem(props) {
    const { user, setUser } = useContext(UserContext)
    let item = props.item
    let idx = props.idx
    const [voteCount, setVoteCount] = useState(item.voteCount);
    const [myVoteCount, setMyVoteCount] = useState(0);
    const [userImage, setUserImage] = useState(null);
    const navigate = useNavigate();

    const date = new Date(item.postDate);
    let dateFormatted = date.getDate() + " " + date.toLocaleString('default', { month: 'long' }) + " " + date.getFullYear()


    useEffect(() => {
        setUpMyVoteCount()
        if (item)
            getProfileImage()
    }, []);


    function setUpMyVoteCount() {
        if (user && item.voters && item.voters[user._id]) {
            setMyVoteCount(item.voters[user._id])
        } else {
            return setMyVoteCount(0)
        }
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
            fetch("/getUserImageForThreads/" + (item._id ? item.userId : item.userId))
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
        < div key={idx} className="list-item">
            <div id="top-section" className="pointer"
                onClick={() => navigate(`/thread/?movieId=${props.movieId}&threadId=${item._id}`)}>
                <img className="user-profile-img" src={userImage}></img>
                <div id="usrname-postdate">
                    <div id="username">{item.userName}</div>
                    <div id="postdate">{dateFormatted}</div>
                </div>
                <div id="userrating">
                    <img id="star-img" src={starFilled} alt="rating" />
                    <div id="userrating-value">{item.userRating}/10</div>
                </div>

                {item.spoilers ?
                    <div className="spoiler-tag">
                        <div >
                            Spoilers
                        </div>
                    </div>
                    : null
                }

            </div>
            <div id="bottom-section">
                {
                    !props.admin ?
                        <div className="votes">
                            <img src={upVote} alt="" id="up-vote" className={myVoteCount == 1 ? "vote yellow" : "vote"}
                                onClick={() => (user ? setVote((myVoteCount == 1 ? 0 : 1), item, props.movieId, setMyVoteCount, setVoteCount) : alert("You must sign in to vote"))} />
                            {voteCount >= 1000 ? (((voteCount / 1000)) + "k") : voteCount}
                            <img src={downVote} alt="" id="down-vote" className={myVoteCount == -1 ? "vote yellow" : "vote"}
                                onClick={() => (user ? setVote((myVoteCount == -1 ? 0 : -1), item, props.movieId, setMyVoteCount, setVoteCount) : alert("You must sign in to vote"))} />
                        </div>
                        : null
                }

                <div className="review-preview pointer"
                    onClick={() => navigate(`/thread/?movieId=${props.movieId}&threadId=${item._id}`)}>
                    <div className="post-title">
                        {item.postTitle}
                    </div>
                    <div className="post-text" >
                        {item.postText}
                    </div>
                </div>
            </div>


        </div >

    )


}

export function setVote(vote, item, movieId, setMyVoteCount, setVoteCount) {
    setMyVoteCount(item.voteCount + vote)

    const requestOptions = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote, threadId: item._id, movieId })
    };

    fetch("/setVote/", requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setVoteCount(data.body.voteCount)
            } else {
                console.log(data)
            }
        });
}


export default MoviePageThreadItem;
