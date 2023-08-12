import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { moviesActions } from "features";
import { history } from 'helpers';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

function MovieReview() {
    const dispatch = useDispatch();
    const { user: authUser } = useSelector((store) => store.auth);
    const { selectedMovie } = useSelector(store => store.movies);

    useEffect(() => {
    }, []);

    // form validation rules 
    const validationSchema = Yup.object().shape({
        rating: Yup.number().required('rating is required'), 
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    function onSubmit ({ rating }) {
        const { tmdbId } = selectedMovie;
        const userName = authUser.username;
        alert(`You rated ${selectedMovie.title} ${rating} stars!`)
        return dispatch(moviesActions.reviewMovie({ tmdbId, userName, rating }));
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
                    <div className="movie-release-date">Release date: {new Date(selectedMovie.releaseDate).toLocaleDateString('en-US')}</div>
                    <div className="movie-overview">
                        {selectedMovie.overview}
                    </div>
                    <div className="rating-form">
                        <h2>Rate the Movie</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <label>Rating (1-10):</label>
                            <input type="number" {...register('rating')} id="rating" name="rating" className="rating-input" min="1.0" max="10.0" required></input>
                            <div className="invalid-feedback">{errors.rating?.message}</div>
                            <br></br>
                            <button disabled={isSubmitting} className="submit-button" type="submit">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Rate
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div>
            <h1>Hi {authUser?.username}!</h1>
        </div>
    );
}

export { MovieReview };