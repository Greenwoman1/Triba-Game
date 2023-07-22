import React, { useState } from 'react';
import './AlertModal.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import {updateProfileRating} from "../../api";

library.add(faStar, faStarHalfAlt, faStarRegular);

const AlertModal = ({ playerToBeRated, onClose}) => {
    const [selectedRating, setSelectedRating] = useState(0);

    const showStar = (rating) => {
        setSelectedRating(rating);
    };

    const resetStars = () => {
        setSelectedRating(0);
    };

    const rateAndClose = () =>{
        updateProfileRating(playerToBeRated, selectedRating);
        onClose();
    }

    return (
        <div className="alert-modal">
            <div className="modal-body">
                <p>{`You need to rate ${playerToBeRated}`}</p>
            </div>
            <div className="rating-stars-container">
                {[1, 2, 3, 4, 5].map((rating) => (
                    <FontAwesomeIcon
                        key={rating}
                        icon={['fas', rating <= selectedRating ? 'star' : 'star-half-alt']}
                        className={`rating-star${rating <= selectedRating ? ' selected' : ''}`}
                        onMouseEnter={() => showStar(rating)}
                        onMouseLeave={resetStars}
                        onClick={rateAndClose}
                    />
                ))}
            </div>
            <div className="modal-footer">
                <button className="btn btn-primary" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default AlertModal;
