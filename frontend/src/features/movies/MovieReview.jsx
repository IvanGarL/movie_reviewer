import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { moviesActions } from "features";
import { history } from 'helpers';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

function MovieReview() {
    const dispatch = useDispatch();
    const { user: authUser } = useSelector((store) => store.auth);
    const { selectedMovie } = useSelector(store => store.movies);

    const [comment, setComment] = useState('');

    // form validation rules 
    const validationSchema = Yup.object().shape({
        rating: Yup.number().required('rating is required'),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    function onSubmit({ rating }) {
        const { tmdbId } = selectedMovie;
        const userName = authUser.username;
        alert(`You rated ${selectedMovie.title} ${rating} stars!`)
        return dispatch(moviesActions.reviewMovie({ tmdbId, userName, rating, comment }));
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
                    <div className="movie-release-date">Release date: {selectedMovie.releaseDate ? new Date(selectedMovie.releaseDate).toLocaleDateString('en-US') : 'NA'}</div>
                    <div className="movie-overview">
                        {selectedMovie.overview}
                    </div>
                    <div className="rating-form">
                        <br></br>
                        <h5>Rate the Movie</h5>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <label>Rating (1-10):</label>
                            <input type="number" {...register('rating')} id="rating" name="rating" className="rating-input" min="1.0" max="10.0" required></input>
                            <div className="invalid-feedback">{errors.rating?.message}</div>
                            <br></br>
                            <div className="rating-form">
                                <p>Add Your Comment:</p>
                                <textarea
                                    id="commentInput"
                                    rows="4"
                                    cols="50"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>
                            <button disabled={isSubmitting} className="submit-button" type="submit">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Rate
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    ) : history.navigate('/');
}

export { MovieReview };