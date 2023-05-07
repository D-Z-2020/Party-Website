import React from 'react';

function ConfirmationPage({ handleConfirm, handleCancel }) {
    return (
        <div>
            <h3>Are you sure?</h3>
            <button onClick={handleConfirm}>Yes</button>
            <button onClick={handleCancel}>No</button>
        </div>
    );
}

export default ConfirmationPage;
