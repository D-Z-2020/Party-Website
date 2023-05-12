import React, { useState } from 'react';
import p1 from './assets/image/host.png';
import p1_enable from './assets/image/hostActive.png';
import p2 from './assets/image/guest.png';
import p2_enable from './assets/image/guestActive.png';
import "./styles/Login.css";

function RoleSelection({ globalIsPremium, restorePrevRoom, AUTH_URL, AUTH_URL_SHOW_DIALOG, setShowJoinRoomForm }) {
    const [selectedOption, setSelectedOption] = useState('Host');
    const [p1Src, setP1Src] = useState(p1_enable);
    const [p2Src, setP2Src] = useState(p2);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedOption === "Host") {
            const anchor = document.createElement('a');
            anchor.href = globalIsPremium ? AUTH_URL : AUTH_URL_SHOW_DIALOG;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        }
        else {
            setShowJoinRoomForm(true)
        }
    };

    const handleClick = (option) => {
        setSelectedOption(option);

        if (option === 'Host') {
            setP1Src(p1_enable);
            setP2Src(p2);
        } else {
            setP1Src(p1);
            setP2Src(p2_enable);
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center" style={{ height: "80vh"}}>
            <form onSubmit={handleSubmit}>
                <div className="row my-4">
                    <div className="col-12 text-center">
                        <h1 style={{ fontSize: '50px' }}>I'm...</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 text-center">
                        <label className='roleImg'>
                            <img
                                width="130"
                                height="130"
                                src={p1Src}
                                alt="Host"
                                onClick={() => handleClick('Host')}
                                style={{ cursor: 'pointer' }}
                            />
                        </label>
                    </div>
                    <div className="col-sm-6 text-center">
                        <label className='roleImg'>
                            <img
                                width="130"
                                height="130"
                                src={p2Src}
                                alt="Participant"
                                onClick={() => handleClick('Participant')}
                                style={{ cursor: 'pointer' }}
                            />
                        </label>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-12 text-center">
                        <button type="submit" className="button btn btn-primary mt-3">
                            Continue
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default RoleSelection;
