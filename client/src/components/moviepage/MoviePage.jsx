
import "../../styles/MovieComponent.css";
import Movie from "./Movie";
import { useEffect, useState } from "react";
import Loading from "../other-or-common/Loading";
import { useLocation } from 'react-router-dom';

/**
 * This component represents the movie component
 */
function MoviePage(props) {
    const [movie, setMovie] = useState(null)

    const query = window.location.search
    const params = new URLSearchParams(query);
    let movieId = params.get('id')
    const location = useLocation();

    useEffect(() => {
        fetchMovieData()
        // if (location.state && location.state.item) {
        //     //if the movie data is passed from prev pass, then just use that
        //     //no need to make another
        //     setMovie(location.state.item)
        // } else {

        // }
    }, []);

    function fetchMovieData() {
        fetch("/getMovie/" + movieId)
            .then(response => response.json())
            .then(data => {
                setMovie(data)
            });
    }

    return (
        movie ? < Movie showForm={props.showForm} movieId={movie._id} movieDetails={movie} /> :
            <div className="main-component-container dark-blue white-font">
                <Loading h={10} />
                <Loading h={2} number={2} />
            </div>

    );
}

export default MoviePage;
