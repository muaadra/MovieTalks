
let trailerListLength = 0

let topRated = []
function getMovies() {
    let movies = {}
    fetch("https://imdb-api.com/en/API/Top250Movies/k_922csv7b")
        .then(response => response.json())
        .then(data => {
            trailerListLength = 250
            data.items.forEach(element => {
                topRated.push(element.id)//sorted ids
                getTrailersById(element.id, movies)
            });

        });

}

export function getMoviesFromListOfIds(idsList) {
    trailerListLength = idsList.length
    const movieItems = {}
    for (const id of idsList) {
        getTrailersById(id, movieItems)
    }
}

function getMovieInfoById(id, trailerURL, TMDBmovieId, movieSet) {



    fetch("https://imdb-api.com/en/API/Title/k_922csv7b/" + id + "/FullActor,Posters,Trailer")
        .then(response => response.json())
        .then(data => {
            let movieItem = {
                id: data.id,
                title: data.title,
                TMDBmovieId,
                rating: data.imDbRating,
                releaseDate: data.releaseDate,
                ratingCount: data.imDbRatingVotes,
                genere: data.genres,
                description: data.plot,
                ratingType: data.contentRating,
                directors: data.directors,
                writers: data.writers,
                actors: data.stars,
                trailerURL: trailerURL,
                posterURL: data.image,
                discussions: []
            }
            count++

            movieSet[data.id] = movieItem
            console.log(count, data.id)
            if (count == trailerListLength) console.log(movieSet)

        });
}

let count = 0
async function getTrailersById(id, movieSet) {
    fetch(`https://api.themoviedb.org/3/find/${id}?api_key=72b9bcf18cd9dc3266097b5cef3d2253&external_source=imdb_id`)
        .then(response => response.json())
        .then(data => {
            let TMDBmovieId = data.movie_results[0].id
            let url = `https://api.themoviedb.org/3/movie/${TMDBmovieId}/videos?api_key=72b9bcf18cd9dc3266097b5cef3d2253&language=en-US`
            fetch(url)
                .then(response => response.json())
                .then(data => {

                    let trailerURL = null
                    for (const element of data.results) {
                        if (element.type == "Trailer") {
                            trailerURL = `https://www.youtube.com/embed/${element.key}`
                        }
                    }


                    if (trailerURL == null && data.results.length > 0) {
                        trailerURL = `https://www.youtube.com/embed/${data.results[0].key}`
                    }

                    // prepare movie object 
                    getMovieInfoById(id, trailerURL, TMDBmovieId, movieSet)

                });
        });
}

export default getMovies;