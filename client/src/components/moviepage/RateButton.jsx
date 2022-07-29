import React, { useEffect } from "react";
import "../../styles/MovieComponent.css";
import starFilled from "../../images/star-fill.svg"
/**
 * This component represents rating form.
 */
function RateButton(props) {
    const user = props.user
    const movieDetails = props.movieDetails

    useEffect(() => {
        getUserRating()
    }, []);

    function getUserRating() {
        fetch("/userRating/" + (movieDetails ? movieDetails._id : props.movieId))
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (!props.fromThreadPage) props.setUserRating(data.body.rating);
                } else {
                    console.log(data)
                }
            });
    }

    return (
        <div id="your-rating" className="your-rating" onClick={() =>
        (user ? props.setShowRate(props.fromThreadPage ? {} : { title: movieDetails.title, id: movieDetails.movieId }) :
            alert("You must be signed in to rate a movie"))}>
            <div>Your Rating</div>
            <div className="movie-rating">
                <img className="start-img" src={starFilled}></img>
                <div id="rating"> {props.userRating < 0 ? "-" : props.userRating} /10</div>
            </div >
        </div>
    );
}


export default RateButton;
