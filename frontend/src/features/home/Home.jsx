import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { userActions } from 'features';

export { Home };

function Home() {
    const dispatch = useDispatch();
    // Gets current state for the 'user' object 
    // from the store from the 'auth' reducer
    const { user: authUser } = useSelector(x => x.auth);

    useEffect(() => {
        dispatch(userActions.getAll());

    }, []);

    return (
        <div>
            <h1>Hi {authUser?.username}!</h1>
        </div>
    );
}
