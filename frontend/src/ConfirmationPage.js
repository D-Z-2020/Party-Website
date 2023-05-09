import React from 'react';

function ConfirmationPage({ handleConfirm, handleCancel }) {
    return (
        <div className="container d-flex flex-column justify-content-center align-items-center text-center" style={{height:'60vh'}}>
            <h3>Are you sure?</h3>
            <div className="row w-50 justify-content-around mt-3">
                <button className="btn btn-primary col-4 my-3" onClick={handleConfirm}>Yes</button>
                <button className="btn btn-secondary col-4 my-3" onClick={handleCancel}>No</button>
            </div>
        </div>
    );
}

export default ConfirmationPage;
