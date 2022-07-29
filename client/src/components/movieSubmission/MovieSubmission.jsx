// Created by Muaad Alrawhani and edited by Jack Hipson for Assignment 3

import React, { useState, useEffect } from "react";
import "../../styles/MovieComponent.css";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import moment from 'moment';


function MovieSubmission() {
    const location = useLocation();
    const [updateData, setUpdateData] = useState({}) //used for edits, if user is updating data
    const [errorMessage, setErrorMessage] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        //if user is updating/editing existing submittion then populate the
        // data to the submission form 
        //data is recieved when the user navigates to the subsiion page from profile
        if (location.state && location.state.item) {
            setUpdateData(location.state.item)
        }
    }, []);

    function submit(e) {
        e.preventDefault();

        const title = e.target[0].value;
        const actors = e.target[1].value;
        const genre = e.target[2].value;
        const directors = e.target[3].value;
        const writers = e.target[4].value;
        const rating = e.target[5].value;
        const releaseDate = e.target[6].value;
        const trailerURL = e.target[7].value;
        const posterURL = e.target[8].value;
        const description = e.target[9].value;

        const validate = () => {
            if(title.length < 1) {
                return "Title must contain one or more characters";
            } else if(actors.length < 1) {
                return "Actors field must contain one or more names";
            } else if(genre.length < 1) {
                return "Genre must contain one or more characters";
            } else if(directors.length < 1) {
                return "Directors field must contain one or more names";
            } else if(writers.length < 1) {
                return "Writers field must contain one or more names";
            } else if(rating.length < 1) {
                return "Rating field must contain one or more characters";
            } else if(!moment(releaseDate).isValid()) {
                return "Please enter a valid release date";
            } else if(trailerURL.length < 1) {
                return "Please enter a valid trailer URL";
            } else if(posterURL.length < 1) {
                return "Please enter a valid poster URL";
            } else if(description.length < 1) {
                return "Description must contain one or more characters";
            } else {
                return undefined;
            }
        }

        const error = validate();
        setErrorMessage(error);
        if(error) {
            return;
        }

        const submission = {
            title,
            actors,
            genere: genre,
            directors,
            writers,
            ratingType: rating,
            releaseDate: moment(releaseDate).toDate(),
            trailerURL,
            posterURL,
            description,
        }

        const isExistingSubmission = updateData._id !== undefined;
        if(isExistingSubmission) {
            submission._id = updateData._id;
        }

        const movieOptions = {
            method: isExistingSubmission ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(submission),
        }

        if(isExistingSubmission) {
            fetch("/updateMovieSubmissions/", movieOptions)
                .then((response) => response.json())
                .then((data) => {
                    if(data.success) {
                        window.alert("Your submission has been updated");
                        navigate("/profile");
                    } else {
                        window.alert("Submission update failed. Please try again");
                    }
                })
        } else {
            fetch("/movieSubmissions/", movieOptions)
                .then((response) => response.json())
                .then((data) => {
                    if(data.success) {
                        window.alert("Your movie has been submitted");
                        navigate("/profile");
                    } else {
                        window.alert("Submission failed. Please try again");
                    }
                }) 
        }
    }

    function deleteSubmission() {
        if (window.confirm("are you sure you want to delete?")) {
            const options = {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            }
            fetch(`/deleteMovieSubmissions/${updateData._id}`, options)
                .then((response) => response.json())
                .then((data) => {
                    if(data.success) {
                        window.alert("Your submission has been deleted");
                        navigate("/profile");
                    } else {
                        window.alert("Deletion failed. Please try again");
                    }
                })
        }
    }

    function showImageOnView(e) {
        document.getElementById("userprofile-img").src =
            window.URL.createObjectURL(e.target.files[0])
    }


    return (
        <div>
            <div className="userprofile-container">

                <div className="title"><h2>Submit a New Movie or TV show</h2></div>
                <form onSubmit={(e) => submit(e)} name="movie-submission-form">
                    <div className="movie-submission-cont">
                        <label htmlFor="movie-submit-title" className="form-label">
                            Title
                        </label>
                        <input id="movie-submit-title" name="title"
                            placeholder="e.g., The Shining" defaultValue={updateData.title} >
                        </input>
                    </div>

                    <div className="movie-submission-cont">
                        <label htmlFor="movie-submit-Actors" className="form-label">
                            Actors (separate by comma)
                        </label>
                        <input id="movie-submit-Actors" name="actors"
                            placeholder="e.g., Jack Nicholson, Shelley Duvall, ..."
                            defaultValue={updateData.actors} >
                        </input>
                    </div>

                    <div className="movie-submission-cont">
                        <label htmlFor="movie-submit-genre" className="form-label">
                            Genre (separate by comma)
                        </label>
                        <input id="movie-submit-genre" name="genere"
                            placeholder="e.g., Drama, Horror, ..."
                            defaultValue={updateData.genere} >
                        </input>
                    </div>
                    <div className="movie-submission-cont">
                        <label htmlFor="movie-submit-directors" className="form-label">
                            Director(s) (separate by comma)
                        </label>
                        <input id="movie-submit-directors" name="directors"
                            placeholder="e.g., Stanley Kubrick, ..."
                            defaultValue={updateData.directors}>
                        </input>
                    </div>
                    <div className="movie-submission-cont">
                        <label htmlFor="movie-submit-Writers" className="form-label">
                            Writer(s) (separate by comma)
                        </label>
                        <input id="movie-submit-Writers" name="writers"
                            placeholder="e.g., Stephen King, Stanley Kubrick, ..."
                            defaultValue={updateData.writers} >
                        </input>
                    </div>

                    <div className="movie-submission-cont">
                        <label htmlFor="movie-submit-rating" className="form-label">
                            Rating
                        </label>
                        <input id="movie-submit-rating" name="ratingType"
                            placeholder="e.g., R or PG-13"
                            defaultValue={updateData.ratingType} >
                        </input>
                    </div>

                    <div className="movie-submission-cont">
                        <label htmlFor="movie-submit-releaseDate" className="form-label">
                            Release Date
                        </label>
                        <input id="movie-submit-releaseDate" name="releaseDate"
                            placeholder="e.g., March 25 1980"
                            defaultValue={updateData.releaseDate} >
                        </input>
                    </div>
                    <div className="movie-submission-cont">
                        <label htmlFor="movie-submit-trailerURL" className="form-label">
                            Trailer URL
                        </label>
                        <input id="movie-submit-trailerURL" name="trailerURL"
                            placeholder="e.g., https://www.youtube.com/ ..."
                            defaultValue={updateData.trailerURL}>
                        </input>
                    </div>

                    <div className="movie-submission-cont">
                        <label htmlFor="upload-poster-file" className="form-label">
                            Poster URL
                        </label>
                        <input id="upload-poster-file" name="posterURL"
                            placeholder="e.g., https://www.imgur.com/ ..."
                            defaultValue={updateData.posterURL}>
                        </input>
                    </div>
                    <div id="userprogile-aboutme-cont">
                        <label htmlFor="userprogile-aboutm" className="form-label">
                            Movie Description
                        </label>
                        <textarea id="userprogile-aboutme" name="description"
                            defaultValue={updateData.description} >
                        </textarea>
                    </div>
                    {errorMessage ? (
                        <div>
                            <p id="movie-submission-error-text">{errorMessage}</p>
                        </div>
                    ) : null}
                    <div id="userprogile-aboutme-cont">
                        <button type="submit"
                            className="button blue submit-movie-button"> {!updateData.title ? "Submit Movie for Approval" : "Update Movie Submission"}</button>

                    </div>
                </form>
                {
                    location.state && location.state.item ?
                        <div className="button warning submit-movie-button"
                            onClick={() => deleteSubmission()}>Delete submission</div>
                        :
                        null
                }


            </div >

        </div >

    )
}

export default MovieSubmission