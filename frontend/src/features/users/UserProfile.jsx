import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "features";
import { history } from 'helpers';

const UserProfile = () => {
    const dispatch = useDispatch();

    const { user: authUser } = useSelector((store) => store.auth);
    const { userInfo } = useSelector((store) => store.users);
    const [userState, setUser] = useState(userInfo);

    useEffect(() => {
        dispatch(userActions.getUserInfo(authUser.username));
        setUser(userInfo);
        history.navigate('/profile');
    }, [userInfo]);

    const user = {
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy_JmafxKbli9Es5QUvL6d-qIdOd5RmExsvA&usqp=CAU',
        username: userState.username,
        email: userState.email,
        memberSince: userState.createdAt,
        reviews: userState.reviews
    };

    return user.username ? (
        <div className="user-profile">
            <div className="user-info">
                <div className="user-image">
                    <img src={user.image} alt="User" />
                </div>
                <div className="user-details">
                    <h2>{user.username}</h2>
                    <p>Email: {user.email}</p>
                    <p>Member Since: {user.memberSince}</p>
                </div>
            </div>
            <div className="reviews">
                <h3>User Reviews</h3>
                <ul>
                    {user.reviews.map((review, index) => (
                        <li key={index}>
                            <h4>{review.title}</h4>
                            <p>Movie overview: {review.overview}</p>
                            <p>Date: {review.createdAt}</p>
                            <p>Rating: {review.rating}</p>
                            <p>Comment: {review.comment}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>): <div>{setUser(userInfo)}</div>;
};

export { UserProfile };





