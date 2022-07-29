import React, { useState } from "react";
import "../../styles/MovieComponent.css";
import starFilled from "../../images/star-fill.svg"
import starEmpty from "../../images/star.svg"
/**
 * This component represents rating form.
 */
function Rate(props) {
    const [rateValue, setRateValue] = useState((props.userRating < 0 ? 9 : props.userRating))

    function submitRating(e) {
        e.preventDefault()

        const body = { movieId: props.movieDetails._id, rateValue }
        const requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        };

        fetch("/userRating/", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success && props.setRatingStats) {
                    console.log(data)
                    props.setRatingStats(data.body)
                }
            });

        props.setUserRating(rateValue)
        props.showForm(false)
    }


    return (
        <div>
            <div className="overlay-shade-rate" onClick={() => props.showForm(false)}></div>
            <div id="pop-container-rate" >

                <div id="pop-form" onSubmit={(e) => submitRating(e)}>
                    {/* close button */}
                    <div className="close-window" onClick={() => props.showForm(false)}>close (x)</div>
                    <form>

                        <div id="rate-title">
                            <h2>Rate: {props.movieDetails ? props.movieDetails.title : null}</h2>
                        </div>
                        <div id="user-star-rating" value={1}>
                            {Array(10).fill().map((i, idx) =>
                                <img src={rateValue <= idx ? starEmpty : starFilled} alt="empty star" className="star-rating-input"
                                    onClick={(e) => setRateValue(idx + 1)} key={idx} />
                            )}
                        </div>
                        <div id="rating-value">
                            {rateValue}/10
                        </div>


                        <button type="submit" className="button blue">
                            Submit Rating
                        </button>
                    </form>


                </div>
            </div>
        </div>
    );
}


export default Rate;
