const FETCH_ERROR = "error during the request"
const API_ENDPOINT = "http://localhost:8000/api/v1/titles"
const BEST_MOVIE_URL = API_ENDPOINT + "?sort_by=-imdb_score"
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
    // FETCH FULL INFO OF BEST MOVIE
    const singleMovieData = await get(API_ENDPOINT + "/" + data.id)

    // INSERT IN THE HTML
    BEST_MOVIE_TITLE.innerHTML = singleMovieData.title
    BEST_MOVIE_IMG.setAttribute("src", singleMovieData.image_url)
    BEST_MOVIE_DESC.innerHTML = singleMovieData.description
}

async function buildSecondBestMovies(movies) {
    for (let i=0; i < movies.length; i++) {
        let movieTitle = document.getElementById("second__movie-title-" + i)
        let movieImg = document.getElementById("second__movie-img-" + i)
        movieTitle.innerHTML = movies[i].title
        movieImg.setAttribute("src", movies[i].image_url)
    }
}

async function buildMovie() {
    // FETCH FIRST PART OF BEST MOVIES  
    let data = await get(BEST_MOVIE_URL)
    let movies = []

    for (i=0; i < data.results.length; i++) {
        movies.push(data.results[i])
    }

    // FETCH SECOND PART OF BEST MOVIES 
    const SECOND_URL = data.next
    data = await get(SECOND_URL)

    for (i=0; i < 3; i++) {
        movies.push(data.results[i])
    }

    buildBestMovie(movies[0])
    movies.shift()
    buildSecondBestMovies(movies)
}

// get and display information about the best movie of the api and the seven others
buildMovie()

// genres = await get("")