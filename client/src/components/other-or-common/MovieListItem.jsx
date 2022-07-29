import "../../styles/MovieComponent.css";
import "../../styles/lists.css";
import starFilled from "../../images/star-fill.svg"
import React, { useState, useEffect } from 'react';

import { useNavigate } from "react-router-dom";


/**
 * This component for movie item in a list
 * pass movie id as a prop
 */
function MovieListItem(props) {
    const navigate = useNavigate();
    const [item, setMovieItem] = useState(props.item)

    useEffect(() => {
        if (!item) {
            fetchMovieData()
        }
    }, []);

    useEffect(() => {
        if (props.movieId) {
            fetchMovieData() //if movie id is passed, then fech data from db
        } else {
            setMovieItem(props.item)
        }
    }, [props.item, props.movieId]);

    function fetchMovieData() {
        fetch("/getMovie/" + props.movieId)
            .then(response => response.json())
            .then(data => {
                setMovieItem(data)
            });
    }

    function handleItemClick() {
        if (props.adminAprrovalView) {
            //if this list item is from admin page, for movies a waiting approvals
            navigate('/adminMoviePage/?id=' + item._id, { state: { item } })
        } else if (props.movieSubmission) {
            navigate("/submitMovie", { state: { item } })
        } else {
            navigate('/moviePage/?id=' + item._id, { state: { item } })
        }
    }

    function showEmailWindow(e, approved) {
        e.stopPropagation();
        props.showEmailWindow({ approved, movieItem: item })
    }

    return (
        !item ? null :
            < div className={"thread-movie-list-item"}>
                <div className="movie-listing-container pointer"
                    onClick={() => handleItemClick()}>
                    <img className="movie-thumbnail" src={item.posterURL && item.posterURL.split("@.")[0] + "@._V1_UX128_AL_.jpg"} alt="" />

                    <div className="movie-listing-preview" >
                        <div id="top-section-watchlist">
                            <div className="movie-listing-title">
                                {item.title}
                            </div>
                            <div className="movie-listing-details">
                                <div className="movie-listing-rating">
                                    <img id="star-img" src={starFilled} alt="rating" />
                                    <div id="userrating-value">{(!item.rating ? "- " : (Math.round(item.rating * 10) / 10))}/10 </div>
                                </div>

                                <div className="movie-listing-extra-info">
                                    {item.ratingType} • {(new Date(item.releaseDate)).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })} • {item.genere}</div>
                            </div>

                        </div>

                        <div className="movie-listing-text" >
                            {item.description.length > 350 ? item.description.substring(0, 350) + "... read more >>" : item.description}
                        </div>
                    </div>


                </div>
                {props.adminAprrovalView ?
                    <div className="admin-movie-submissions-list-item">
                        <div className="button warning no-margin" onClick={(e) => showEmailWindow(e, false)}>
                            Deny
                        </div>
                        <div className="button yellow no-margin" onClick={(e) => showEmailWindow(e, true)}>
                            Approve
                        </div>
                    </div> : null
                }
            </div>

    );
}

export default MovieListItem;
