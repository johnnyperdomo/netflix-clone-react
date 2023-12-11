import { useEffect, useState } from "react";
import "./App.css";
import netflix_logo from "./assets/netflix-logo.png";

const base_image_path = "https://image.tmdb.org/t/p/w500";

const movie_discovery_path =
    "https://api.themoviedb.org/3/discover/movie?api_key=7053d2afad4e42651641ff9e144dab67&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate";

const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
];

//get the genre name of the movie
const getMovieGenreName = (movie) => {
    let genre = genres.find((i) => i.id === movie.genre_ids[0]);
    console.log(genre.name);
    return genre.name;
};

//to have them organized and placed into their appropriate genres
const getAllGenresInSetThenOrganize = (movies) => {
    const uniqueGenres = [...new Set(movies.map((item) => item.genre))]; // [ 'A', 'B']

    var newMovieSet = [];

    uniqueGenres.map((genre) => {
        let filter = movies.filter((movie) => movie.genre === genre);

        newMovieSet.push({ genre: genre, movies: filter });
    });

    return newMovieSet;
};

const fetchMovies = () => {
    return fetch(movie_discovery_path)
        .then((res) => {
            let json = res.json();
            return json;
        })
        .then((movies) => {
            console.log(movies);

            var movieBuilder = movies.results.map((movie) => {
                let genreName = getMovieGenreName(movie);

                return {
                    title: movie.title,
                    release_date: movie.release_date,
                    image: `${base_image_path}${movie.poster_path}`,
                    overview: movie.overview,
                    genre: genreName,
                };
            });

            let newMovies = getAllGenresInSetThenOrganize(movieBuilder);

            console.log(newMovies);
            return newMovies;
        })
        .catch((err) => {
            console.log(err);
            alert(err);
        });
};

function App() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetchMovies().then((fetched) => {
            setMovies(fetched);
            console.log(movies);
        });
    }, []);

    return (
        <div id="app" class="main-content vh-100">
            <nav className="navbar navbar-light border-bottom border-4 border-danger">
                <div className="container">
                    <a className="navbar-brand" href="#">
                        <img src={netflix_logo} alt="" height="24" />
                    </a>
                </div>
            </nav>

            {/* check if movies are empty */}
            {movies.length !== 0 && (
                <div id="dynamic-data" className="container mt-8 vh-100">
                    {/* hero */}

                    <div id="hero" className="row mt-5">
                        {/* left */}

                        <div className="col-12 col-sm-6">
                            <h4 className="text-muted">New Releases</h4>

                            {/* title */}
                            <h1 className="text-white">{movies[0].movies[0].title}</h1>

                            {/* <!-- overview --> */}
                            <p class="col-10 text-white mt-4">{movies[0].movies[0].overview}</p>

                            {/* action buttons */}
                            <div className="btn-toolbar mt-4">
                                <div className="btn btn-light">Play Movie</div>
                            </div>
                        </div>

                        {/* right */}

                        <div className="col-12 col-sm-6">
                            <div className="col-2 mx-auto">
                                <img
                                    src={movies[0].movies[0].image}
                                    alt="movie-banner"
                                    className="rounded shadow"
                                    height={300}
                                />
                            </div>
                        </div>
                    </div>

                    {/* movie slider components */}

                    <div className="mt-5">
                        {/* loop */}

                        {movies.map((movie, indx) => (
                            <div id="movie-rows" className="bg-black" key={indx}>
                                <div>
                                    <h3 className="text-white">{movie.genre}</h3>

                                    {/* horizontal slider */}

                                    <div className="row mt-3 flex-row flex-nowrap scrollable-wrapper">
                                        {/* card */}

                                        {movie.movies.map((nestedMovie, nestedIndx) => (
                                            <div
                                                className="card col-6 col-sm-5 col-md-4 col-lg-3 col-xl-2 mx-2 h-25"
                                                style={{
                                                    padding: "0px",
                                                    border: "0",
                                                    "background-color": "black",
                                                }}
                                                key={(nestedMovie, nestedIndx)}>
                                                <img
                                                    src={nestedMovie.image}
                                                    alt="movie-banner"
                                                    className="card-img-top rounded shadow h-100"
                                                />

                                                <div className="card-body">
                                                    <h6 className="text-white small">
                                                        {nestedMovie.title}
                                                    </h6>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
