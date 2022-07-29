import React, { useState, useEffect } from "react";
import "../../styles/featuredMovies.css";
import Movies from "../moviepage/Movie";
import { featuredMovies, setFeaturedMovies } from "../../App";
import Loading from "../other-or-common/Loading";


/**
 * The featured movie component on the main page
 * 
 * @author Muaad Alrawhani and modified by Matt Whitehead, B00783328
 */
function FeaturedMovies(props) {
    const [slide, changeSlide] = useState(0)
    const [featured, setFeatured] = useState(featuredMovies)
    const [numberOfSlides, setNumberOfSlides] = useState(0)

    // Function to change to next slide (will go back to start if on last slide)
    const nextSlide = () => {
        if (slide !== numberOfSlides - 1) {
            changeSlide(slide + 1);
        } else {
            changeSlide(0);
        }
    }

    // Function to change to previous slide (will go back to last slide if at start)
    const prevSlide = () => {
        if (slide !== 0) {
            changeSlide(slide - 1);
        } else {
            changeSlide(numberOfSlides - 1);
        }
    }


    useEffect(() => {
        fetchFeaturedMovies()
    }, []);

    // Backend function call to retrieve featured movies from database
    function fetchFeaturedMovies() {
        if (featured.length > 0) {
            setNumberOfSlides(5)
            return
        }

        fetch("/getFeaturedMovies/")
            .then(response => response.json())
            .then(data => {
                setFeatured(data)
                setNumberOfSlides(5)
                setFeaturedMovies(data)
            });
    }


    return (
        <div id="main-component-container-featured-movies" >
            <div className="title featured-movie-title">
                Featured Movies
            </div>


            <div id="slides-cont">
                <div className="button button-slide" onClick={prevSlide} >
                    &#8249;
                </div>

                {numberOfSlides > 0 ? <div className='slidshow-cont'>
                    {Array(numberOfSlides).fill().map((item, idx) => {
                        return (

                            <div key={idx} className={idx == slide ? "animi-slide-show" : "setup-animi"} >
                                <Movies compact={true} movieId={featured[idx]._id} movieDetails={featured[idx]} />
                            </div>
                        );
                    })}
                </div> : <Loading number={3} />}
                <div className="button button-slide" onClick={nextSlide} >
                    &#8250;
                </div>
            </div>



        </div>
    );
}


export default FeaturedMovies;
