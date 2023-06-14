const FETCH_ERROR = "error during the request"
const API_ENDPOINT = "http://localhost:8000/api/v1/titles"
const BEST_MOVIE_URL = API_ENDPOINT + "?sort_by=-imdb_score"
const BEST_MOVIE_TITLE = document.getElementById("best__movie-title")
const BEST_MOVIE_IMG = document.getElementById("best__movie-img")
const BEST_MOVIE_DESC = document.getElementById("best__movie-description")
const FIRST_GENDER = "Adventure"
const SECOND_GENDER = "Animation"
const THIRD_GENDER = "Fantasy"
const SLIDER_NEXT = document.querySelectorAll(".slider__next")
const SLIDER_PREVIOUS = document.querySelectorAll(".slider__previous")

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

async function buildMoviesData(data, max_length) {
    moviesData = []

    for (i=0; i < data.results.length; i++) {
        moviesData.push(data.results[i])
    }

    const SECOND_URL = data.next
    data = await get(SECOND_URL)

    if (max_length == 8) {
        for (i=0; i < 3; i++) {
            moviesData.push(data.results[i])
        }
    } else if (max_length == 7) {
        for (i=0; i < 2; i++) {
            moviesData.push(data.results[i])
        }
    }

    return moviesData
}

async function buildBestMovie(data) {
    // FETCH FULL INFO OF BEST MOVIE
    const singleMovieData = await get(API_ENDPOINT + "/" + data.id)
    console.log(singleMovieData)

    // INSERT IN THE HTML
    BEST_MOVIE_TITLE.innerHTML = singleMovieData.title
    BEST_MOVIE_IMG.setAttribute("src", singleMovieData.image_url)
    BEST_MOVIE_DESC.innerHTML = singleMovieData.description
    let bestMovieButton = document.getElementById("best__movie-modal")
    bestMovieButton.addEventListener("click", function () {
        fillModalWindow(singleMovieData)
    })
}

async function buildMovies(movies, idName) {
    for (let i=0; i < movies.length; i++) {
        let movieImg = document.getElementById(idName + i)
        movieImg.setAttribute("src", movies[i].image_url)
        movieImg.setAttribute("data-id", movies[i].id)
        movieImg.addEventListener("click", async function() {
            let movieData = await get(API_ENDPOINT + "/" + movieImg.dataset.id)
            fillModalWindow(movieData)
        })
    }
}

async function buildMovie() {
    // FETCH BEST RATED MOVIES 
    let data = await get(BEST_MOVIE_URL)
    moviesData = await buildMoviesData(data, max_length=8)

    // BUILD BEST MOVIE AND 7 OTHER BEST MOVIES
    buildBestMovie(moviesData[0])
    moviesData.shift()
    buildMovies(moviesData, "second__movie-img-")

    // FETCH AND BUILD MOVIES FOR FIRST CATEGORY    
    firstGenderData = await get(API_ENDPOINT + "?genre=" + FIRST_GENDER + "&sort_by=-year")
    firstGenderMovies = await buildMoviesData(firstGenderData, max_length=7)
    buildMovies(firstGenderMovies, "movie__first-category-image-")

    // FETCH AND BUILD MOVIES FOR SECOND CATEGORY  
    secondGenderData = await get(API_ENDPOINT + "?genre=" + SECOND_GENDER + "&sort_by=-year")
    secondGenderMovies = await buildMoviesData(secondGenderData, max_length=7)
    buildMovies(secondGenderMovies, "movie__second-category-image-")

    // FETCH AND BUILD MOVIES FOR THIRD CATEGORY  
    thirdGenderData = await get(API_ENDPOINT + "?genre=" + THIRD_GENDER + "&sort_by=-year")
    thirdGenderMovies = await buildMoviesData(thirdGenderData, max_length=7)
    buildMovies(thirdGenderMovies, "movie__third-category-image-")
}

async function fillModalWindow(data) {
    let modalWindow = document.getElementById("modal")
    let modalImg = document.getElementById("modal__img")
    let modalTitle = document.getElementById("modal__title")
    let modalGender = document.getElementById("modal__gender")
    let modalDate = document.getElementById("modal__date")
    let modalRated = document.getElementById("modal__rated")
    let modalImdbScore = document.getElementById("modal__imdb-score")
    let modalRealisator = document.getElementById("modal__realisator")
    let modalActorList = document.getElementById("modal__actor-list")
    let modalDuration = document.getElementById("modal__duration")
    let modalCountry = document.getElementById("modal__country")
    let modalBoxOffice = document.getElementById("modal__box-office")
    let modalSummary = document.getElementById("modal__summary")
    let modalButton = document.getElementById("modal__button")
    modalDate.innerHTML = "Date de sortie: " + data.date_published
    modalRated.innerHTML = "Note: " + data.rated
    modalImdbScore.innerHTML = "Score Imdb: "  + data.imdb_score
    modalRealisator.innerHTML = "Réalisateur: " + data.directors[0]
    let allActors = ""
    for (let i=0; i < data.actors.length; i++) {
        if (i == data.actors.length -1) {
            allActors += data.actors[i] 
        } else {
            allActors += data.actors[i] + ", "
        }
    }

    modalActorList.innerHTML = "Acteurs: " + allActors
    modalDuration.innerHTML = "Durée: " + data.duration + " minutes"
    modalCountry.innerHTML = "Pays de sortie:" + data.countries
    let allGenres = ""
    for (let i=0; i < data.genres.length; i++) {
        if (i == data.genres.length -1) {
            allGenres += data.genres[i]
        } else {
            allGenres += data.genres[i] + ", "
        }
    }

    modalGender.innerHTML = "Genre(s): " + allGenres
    modalTitle.innerHTML = "Titre: " + data.title
    if (data.worldwide_gross_income != null) {
        modalBoxOffice.innerHTML = "Box Office: " + data.worldwide_gross_income + " $"
    } else {
        modalBoxOffice.innerHTML = "Box Office: inconnu" 
    }
    
    modalSummary.innerHTML = "Résumé: " + data.long_description


    modalButton.addEventListener("click", function() {
        modalWindow.setAttribute("class", "modal inactive")
    })

    modalImg.setAttribute("src", data.image_url)
    modalWindow.setAttribute("class", "modal active")
}

buildMovie()

for (let i=0; i < SLIDER_NEXT.length; i ++) {
    SLIDER_NEXT[i].addEventListener("click", () => {
        let container = SLIDER_NEXT[i].parentNode
        let cardsContainer = container.getElementsByClassName("movie__cards")[0]
        const widthToScroll = cardsContainer.children[0].offsetWidth
        cardsContainer.scrollLeft += widthToScroll + 32
    })
}

for (let i=0; i < SLIDER_PREVIOUS.length; i ++) {
    SLIDER_PREVIOUS[i].addEventListener("click", () => {
        let container = SLIDER_PREVIOUS[i].parentNode
        let cardsContainer = container.getElementsByClassName("movie__cards")[0]
        const widthToScroll = cardsContainer.children[0].offsetWidth
        cardsContainer.scrollLeft -= widthToScroll + 32
    })
}
