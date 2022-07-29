
import "../../styles/MovieComponent.css";
import starFilled from "../../images/star-fill.svg"
import collaps from "../../images/caret-down-square-fill.svg"
import ThreadLists from "../threadPage/ThreadLists";
import { useState, useEffect, useContext } from "react"
import Rate from "./RateWindow";
import { useNavigate } from "react-router-dom";
import StartAThreadWindow from "./StartAThreadWindow";
import { UserContext } from "../authentication/UserContext";
import demoPoster from "../../images/poster-demo.png"
import React from 'react';
import RateButton from "./RateButton";
import { addToWatchList } from "../watchlist/WatchList";

/**
 * This component represents the movie component
 */
function Movies(props) {
    const { user, setUser } = useContext(UserContext)
    const movieId = (props.movieId ? props.movieId : 1)
    const movieDetails = props.movieDetails
    const [showThreadWindow, setShowStartAThread] = useState(null);
    const [showRate, setShowRate] = useState(null);
    const [threadType, setThreadType] = useState("Review");
    const [userRating, setUserRating] = useState(-1);
    const [ratingStats, setRatingStats] = useState(movieDetails);
    const [threadSection, updateThreadSection] = useState(0);
    const navigate = useNavigate();
    const [threads, setThreads] = useState([]);

    useEffect(() => {
        fetchThreads()
    }, []);



    function fetchThreads() {
        if (props.compact) return;

        fetch("/getThreads/" + movieId)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setThreads(data.body)
                    updateThreadSection(prev => prev + 1)
                } else {
                    console.log(data)
                }
            });
    }

    function goToMoviePage() {
        if (props.compact)
            navigate('/moviePage/?id=' + movieId, { state: { item: movieDetails } })
    }

    return (
        // comapct view hides evrything but the top section" poster, trailer, and ratings. like in featured movies
        <div className={props.compact ? "compact" : null} >
            {/* "start a thread" window */}
            {showThreadWindow ? <StartAThreadWindow movieId={movieId} threadDetails={showThreadWindow}
                showForm={setShowStartAThread} setUserRating={setUserRating} userRating={userRating} setThreads={setThreads} user={user}
                updateThreadSection={updateThreadSection} setThreadType={setThreadType} showRate={showRate} movieDetails={movieDetails} setShowRate={setShowRate} /> : null}

            {/* ratings window */}
            {showRate ? <Rate movieDetails={movieDetails} setRatingStats={setRatingStats} showForm={setShowRate} setUserRating={setUserRating} userRating={userRating} /> : null}

            {/* page container */}
            <div id="main-movie-container" className={!props.compact ? "main-component-container dark-blue white-font" : "main-component-container-compact dark-blue white-font"}>
                {/* poster, trailer, and ratings */}
                <div id="top-bar">
                    <div className="title pointer" onClick={() => navigate('/moviePage/?id=' + movieId, { state: { item: movieDetails } })}>
                        {movieDetails.title}
                    </div>
                    <button className="button yellow" onClick={() => addToWatchList(movieId, user)}>+ Add to Watchlist</button>
                </div>

                <div id="movie-item">
                    {/* poster */}
                    <div id="left-side" className={props.compact ? "pointer" : null}
                        onClick={() => goToMoviePage()}>
                        <img src={movieDetails.demo ? demoPoster : movieDetails.posterURL} className={props.compact ? "compact-poster" : "poster"} ></img>
                    </div>

                    {/* trailer container */}
                    <div id="mid">
                        <iframe id="trailer"
                            src={movieDetails.trailerURL}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; 
                             clipboard-write; encrypted-media;
                            gyroscope; picture-in-picture" allowFullScreen>
                        </iframe>

                    </div>

                    {/* rating stats */}
                    <div id="movie-stats">
                        <div id="movie-stat-top">
                            <div className="movie-rating">
                                <img className="start-img" src={starFilled}></img>
                                <div id="rating">{(Math.round(ratingStats.rating * 10) / 10)}/10</div>
                            </div>
                            <div id="number-of-votes">({ratingStats.ratingCount} votes)</div>
                        </div>
                        <RateButton userRating={userRating} setUserRating={setUserRating} user={user} movieDetails={movieDetails} setShowRate={setShowRate} />
                    </div>
                </div>
            </div>

            {/* this section is hiddien if not "compact" mode */}
            {!props.compact ?
                <div>
                    <div id="movie-info" className="main-component-container">
                        <div id="genre">
                            {movieDetails.genere.replace(",", " • ")}
                            <img src={collaps}></img>
                        </div>
                        <div id="details">
                            {(new Date(movieDetails.releaseDate)).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })} • {movieDetails.ratingType}
                        </div>
                        <div id="description">
                            {movieDetails.description}
                        </div>
                        <div id="staff">
                            <div id="directors">
                                <strong>Director(s):</strong> {movieDetails.directors}
                            </div>
                            <div id="directors">
                                <strong>Writer(s):</strong> {movieDetails.writers}
                            </div>
                            <div id="directors">
                                <strong>Actor(s):</strong> {movieDetails.actors}
                            </div>
                        </div>

                    </div>
                    <div id="disscussions">
                        <div id="discussion-nav-container">
                            {
                                threadType == "Review" ?
                                    <div id="discussion-nav" >
                                        <div id="discussion-nav-left"></div>
                                        <div className="tab yellow" onClick={() => setThreadType("Review")}>
                                            Reviews
                                        </div>
                                        <div className="tab light-grey" onClick={() => setThreadType("Discussion")}>
                                            Discussions
                                        </div>
                                    </div> :
                                    <div id="discussion-nav" >
                                        <div className="tab light-grey" onClick={() => setThreadType("Review")}>
                                            Reviews
                                        </div>
                                        <div className="tab yellow" onClick={() => setThreadType("Discussion")}>
                                            Discussions
                                        </div>
                                    </div>

                            }
                            <button id="start-a-thread" className="button yellow" onClick={() => (user ? setShowStartAThread(true) : alert("You must sign in to start a thread"))}>Start A Thread</button>
                        </div>

                        {/* list of threads for this movie */}
                        <ThreadLists movieId={movieId} threadType={threadType} threads={threads} threadSection={threadSection} />
                    </div></div>
                : null}

        </div>

    );
}

export default Movies;
