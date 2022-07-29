
import "../../styles/MovieComponent.css";
import { useLocation } from 'react-router-dom';

import "../../styles/MovieComponent.css";
import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom";
import { UserContext } from "../authentication/UserContext";
import demoPoster from "../../images/poster-demo.png"
import React from 'react';


/**
 * This component represents the movie component
 */
function MoviePage_AdminApprovalView(props) {
    const location = useLocation();

    const [movie, setMovie] = useState((location.state ? location.state.item : {}))

    const query = window.location.search
    const params = new URLSearchParams(query);
    let movieId = params.get('id')

    const movieDetails = movie
    const navigate = useNavigate();



    return (
        // comapct view hides evrything but the top section" poster, trailer, and ratings. like in featured movies
        <div >

            {/* page container */}
            <div id="main-movie-container" className={!props.compact ? "main-component-container dark-blue white-font" : "main-component-container-compact dark-blue white-font"}>
                {/* poster, trailer, and ratings */}
                <div id="top-bar">
                    <div className="title pointer" onClick={() => navigate('/moviePage/?id=' + movieId)}>
                        {movieDetails.title}
                    </div>
                </div>

                <div id="movie-item">
                    {/* poster */}
                    <div id="left-side">
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

                </div>
            </div>

            {/* this section is hiddien if not "compact" mode */}

            <div id="movie-info" className="main-component-container">
                <div id="genre">
                    {movieDetails.genere ? movieDetails.genere.replace(",", " • ") : null}
                </div>
                <div id="details">
                    {movieDetails.releaseDate} • {movieDetails.ratingType}
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

        </div>

    );

}

export default MoviePage_AdminApprovalView;
