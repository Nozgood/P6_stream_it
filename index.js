const API_ENDPOINT = "http://localhost:8000/api/v1/titles"
const IMDB_SCORE_MAX = "9.6"
const BEST_MOVIE_DIV = document.getElementsByClassName("best_movie")
const BEST_MOVIE_TITLE = document.getElementById("test")
function fetchBestMovies(URL) {
    fetch(URL)
        .then(res => {
            if (!res.ok) {
                console.log("error during the request")
            }
            return res.json()
        })
        .then(data => {
            let bestMovie = data.results[3]
            console.log(bestMovie.title)
            BEST_MOVIE_TITLE.innerHTML = bestMovie.title
        })  
}

console.log()
fetchBestMovies(API_ENDPOINT + "?imdb_score_min=" + IMDB_SCORE_MAX)