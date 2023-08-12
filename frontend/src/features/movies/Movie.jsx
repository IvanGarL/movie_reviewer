import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from 'features';
import React from 'react';

function Movie() {
    
    return (
        <div class="image-wrapper">
            <img class="image" src="image1.jpg" alt="asd"></img>
            <div class="tooltip">Rate Movie</div>
        </div>
    );
}

export { Movie };