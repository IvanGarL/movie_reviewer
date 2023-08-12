import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { moviesActions } from "features";
import { history } from 'helpers';

function MovieReview() {
    const dispatch = useDispatch();
    const { user: authUser } = useSelector((store) => store.auth);
    const { selectedMovie } = useSelector(store => store.movies) || { selectedMovie: null};

    useEffect(() => {
        if (!selectedMovie) {
            history.navigate('/');
        }
    }, []);

    const handleOnSubmit = ({ tmdbId, username, rating, comment }) => {
        return dispatch(moviesActions.reviewMovie({ tmdbId, username, rating, comment }));
    };

    return selectedMovie ? (
        <div>
            <h1>Let's rate this movie!</h1>
            <div className="movie-container">
                <div className="movie-image">
                    <img src={selectedMovie.posterPath} alt="Movie Poster"></img>
                </div>
                <div className="movie-details">
                    <div className="movie-title">{selectedMovie.title}</div>
                    <div className="movie-release-date">Release date: { new Date(selectedMovie.releaseDate).toLocaleDateString('en-US')}</div>
                    <div className="movie-overview">
                        {selectedMovie.overview}
                    </div>
                    <div className="rating-form">
                    <h2>Rate the Movie</h2>
                    <form onSubmit={() => { handleOnSubmit({ tmdbId: selectedMovie.tmdbId, username: authUser.username })}}>
                        <label>Rating (1-10):</label>
                        <input type="number" id="rating" name="rating" className="rating-input" min="1.0" max="10.0" required></input>
                        <br></br>
                        <button className="submit-button" type="submit">Submit Rating</button>
                    </form>
                </div>
                </div>
            </div>
        </div>
    ): (
    <div>
        <h1>Please select a movie!</h1>
    </div>
    );
}

export { MovieReview };