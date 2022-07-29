
import "../../styles/main.css";
import FeaturedMovies from "../featuredMovies/FeaturedMovies";
import SearchBar from "../search/SearchBar";
import React, { useEffect, useState } from 'react';
import MovieListItem from "../other-or-common/MovieListItem";
import info from "../../images/info-circle-fill.svg"
import Message from "../other-or-common/Message";
import topRated from "./TopRatedMovies";
import movieLists from "../other-or-common/MovieLists.js"

/**
 * This component represents main content of the website (the middle section between the header
 *  and the footer)
 */
function TopRated(props) {
    const [movieList, setMovieList] = useState([])
    useEffect(() => {
        fetchTopRated()
    }, []);

    function fetchTopRated() {
        fetch("/topRated/")
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setMovieList(data.body)
                } else {
                    console.log(data)
                }
            });
    }


    return (
        <div>
            {movieList.map((item, idx) =>
                <MovieListItem item={item} key={idx} idx={idx} />
            )}
        </div>
    );
}

export default TopRated;
