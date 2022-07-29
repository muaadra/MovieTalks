/**
 * This script is the controller for the router featuredMovies.js found in routes/featuredMovies.js
 * Here are functions that handle the getFeaturedMovies request
 * 
 * @author Matt Whitehead, B00783328
 */
import moviesCollection from '../models/movie.js';

const defaultFeaturedMovieIds = [
    'tt9419884', 'tt11291274',
    'tt11252248', 'tt8041270',
    'tt11827628', 'tt8009428',
    'tt4123432', 'tt13320622',
    'tt1464335', 'tt5108870',
]

/**
 * Handles searching for and retrieving movies from our database that
 * match the defaultFeaturedMovieIds shown above
 */
export const getFeaturedMovies_get = async (req, res) => {
    let movies = await moviesCollection.find({
        _id: {
            $in: defaultFeaturedMovieIds
        }
    });

    movies.sort(function (a, b) {
        return defaultFeaturedMovieIds.indexOf(a._id) - defaultFeaturedMovieIds.indexOf(b._id);
    });

    res.json(movies)
}