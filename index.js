const FETCH_ERROR = "error during the request"
const API_ENDPOINT = "http://localhost:8000/api/v1/titles"
const IMDB_SCORE_MAX = "9.6"
const IMDB_SCORE_MAX_SECOND = "9.3"
const BEST_MOVIE_URL = API_ENDPOINT + "?imdb_score_min=" + IMDB_SCORE_MAX
const SECOND_BEST_MOVIE_URL = API_ENDPOINT + "?imdb_score_min=" + IMDB_SCORE_MAX_SECOND
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
async function buildBestMovie(data) {
    const bestMovie = data.results[3]
    const singleMovieData = await get(API_ENDPOINT + "/" + bestMovie.id)

    BEST_MOVIE_TITLE.innerHTML = singleMovieData.title
    BEST_MOVIE_IMG.setAttribute("src", singleMovieData.image_url)
    BEST_MOVIE_DESC.innerHTML = singleMovieData.description
}

async function buildMovie() {
    let data = await get(BEST_MOVIE_URL)
    buildBestMovie(data)

    data = await get(SECOND_BEST_MOVIE_URL)
    let otherBestMovies = []
    for (let i = 0; i < data.results.length; i++) {
        if (data.results[i].title != BEST_MOVIE_TITLE.textContent) {
            otherBestMovies.push(data.results[i])
        } 
    }
    if (data.next != "") {
        data = await get(data.next)
        for (let i = 0; i < data.results.length; i++) {
            if (data.results[i].title != BEST_MOVIE_TITLE.textContent) {
                otherBestMovies.push(data.results[i])
                if (otherBestMovies.length == 7) {
                    i = data.results.length
                }
            } 
        }
    }

    for (let i=0; i < otherBestMovies.length; i++) {
        let movieTitle = document.getElementById("second__movie-title-" + i)
        let movieImg = document.getElementById("second__movie-img-" + i)
        movieTitle.innerHTML = otherBestMovies[i].title
        movieImg.setAttribute("src", otherBestMovies[i].image_url)
    }

}

// get and display information about the best movie of the api and the seven others
buildMovie()
