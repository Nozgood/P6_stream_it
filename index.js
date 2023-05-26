const FETCH_ERROR = "error during the request"
const API_ENDPOINT = "http://localhost:8000/api/v1/titles"
const IMDB_SCORE_MAX = "9.6"
const BEST_MOVIE_DIV = document.getElementsByClassName("best__movie")
const BEST_MOVIE_TITLE = document.getElementById("best__movie-title")
const BEST_MOVIE_IMG = document.getElementById("best__movie-img")
const BEST_MOVIE_DESC = document.getElementById("best__movie-description")

// get function will fetch the given url and returns raw datas 
async function get(URL) {
    const res = await fetch(URL)
    if (!res.ok) {
        console.log(FETCH_ERROR)
        return 
    }

    const data = await res.json()
    return data
}

async function fetchMovieID(URL) {
    data = await get(URL)
    let bestMovie = data.results[3]

    return bestMovie.id
}

async function buildMovie(URL, method) {
    id = await fetchMovieID(URL)
    console.log(id)
    const movieData = await get(API_ENDPOINT + "/" + id)
    console.log(movieData)

    if(method == "bestMovie"){
        BEST_MOVIE_TITLE.innerHTML = movieData.title
        BEST_MOVIE_IMG.setAttribute("src", movieData.image_url)
        BEST_MOVIE_DESC.innerHTML = movieData.description
    }
}

buildMovie(API_ENDPOINT + "?imdb_score_min=" + IMDB_SCORE_MAX, "bestMovie")