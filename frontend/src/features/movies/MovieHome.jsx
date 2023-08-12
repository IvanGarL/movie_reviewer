import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { moviesActions, userActions } from "features";
import React from "react";
import { Link } from "react-router-dom";

function MovieHome() {
    const dispatch = useDispatch();

    // Gets current state for the 'user' object
    // from the store from the 'auth' reducer
    const { user: authUser } = useSelector((store) => store.auth);
    const { movies } = useSelector((store) => store.movies);

    useEffect(() => {
        dispatch(userActions.getUserInfo(authUser.username));
        dispatch(moviesActions.getAll());
    }, []);

    const handleReview = (movie) => {
        return dispatch(moviesActions.selectMovie(movie));
    };

    return (
        <div>
            <h1>Hi {authUser?.username}!</h1>
            <div className="image-container">
                {movies.movies?.length &&
                    movies.movies.map((movie) => {
                        return (
                            <ul key={movie.tmbdId}>
                                <p>{movie.title}</p>
                                <div className="image-wrapper">
                                    <img className="image" src={movie.posterPath} alt="asd"></img>
                                    <div className="tooltip">
                                        <Link
                                            onClick={() => {
                                                handleReview(movie);
                                            }}
                                            to="/review"
                                            className="btn btn-link"
                                        >
                                            Rate Movie
                                        </Link>
                                    </div>
                                </div>
                            </ul>
                        );
                    })}
                {movies.loading && (
                    <div className="spinner-border spinner-border-sm"></div>
                )}
                {movies.error && (
                    <div className="text-danger">
                        Error loading movies: {movies.error.message}
                    </div>
                )}
            </div>
        </div>
    );
}

export { MovieHome };
