import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';

import { history } from 'helpers';
import { authActions } from 'features';
import { Link } from 'react-router-dom';

function Register() {
    const dispatch = useDispatch();
    const authUser = useSelector(x => x.auth.user);
    const authError = useSelector(x => x.auth.error);

    useEffect(() => {
        // redirect to home if already logged in
        if (authUser) history.navigate('/');

    }, []);

    // form validation rules 
    const validationSchema = Yup.object().shape({
        username: Yup.string().max(50).required('Username is required'),
        email: Yup.string().email().required('email is required'),
        password: Yup.string().required('Password is required'),
        passwordConfirmation: Yup.string().required('Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    function onSubmit({ username, email, password, passwordConfirmation }) {
        return dispatch(authActions.register({ username, email, password, passwordConfirmation }));
    }

    return (
        <div className="col-md-6 offset-md-3 mt-5">
            <div className="card">
                <h4 className="card-header">Register</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>Username</label>
                            <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input name="email" type="text" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.email?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Password confirmation</label>
                            <input name="passwordConfirmation" type="password" {...register('passwordConfirmation')} className={`form-control ${errors.passwordConfirmation ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.passwordConfirmation?.message}</div>
                        </div>
                        <button disabled={isSubmitting} className="btn btn-primary">
                            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Register
                        </button>
                        {authError &&
                            <div className="alert alert-danger mt-3 mb-0">{authError.message}</div>
                        }
                    </form>
                </div>
                <div>
                    <Link to="/login" className="btn btn-link">Already have an account ? Log in</Link>
                </div>
            </div>
        </div>
    )
}

export { Register };
