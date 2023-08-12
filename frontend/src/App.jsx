import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { history } from 'helpers';
import { Nav } from './components/Nav';
import { PrivateRoute } from './components/PrivateRoute';
import { Register } from './features/auth/Register';
import { Login } from './features/auth/Login';
import React from 'react';
import { MovieHome } from './features/movies/MovieHome';
import { MovieReview } from './features/movies/MovieReview';

function App() {
    // init custom history object to allow navigation from 
    // anywhere in the react app (inside or outside components)
    history.navigate = useNavigate();
    history.location = useLocation();

    return (
        <div className="app-container bg-light">
            <Nav />
            <div className="container pt-4 pb-4">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <MovieHome />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/review"
                        element={
                            <PrivateRoute>
                                <MovieReview />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </div>
    );
}

export { App };
