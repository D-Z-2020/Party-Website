import React, { useState } from 'react';

function RoleSelection({ globalIsPremium, restorePrevRoom, AUTH_URL, AUTH_URL_SHOW_DIALOG, setShowJoinRoomForm}) {
    const [selectedOption, setSelectedOption] = useState('Host');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(selectedOption);
        if (selectedOption === "Host") {
            const anchor = document.createElement('a');
            anchor.href = globalIsPremium ? AUTH_URL : AUTH_URL_SHOW_DIALOG;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        }
        else if (selectedOption === "Restore") {
            restorePrevRoom();
        }
        else {
            setShowJoinRoomForm(true)
        }
    };

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    <input
                        type="radio"
                        name="option"
                        value="Host"
                        checked={selectedOption === 'Host'}
                        onChange={handleChange}
                    />
                    Host
                </label>
                <br />
                <label>
                    <input
                        type="radio"
                        name="option"
                        value="Participant"
                        checked={selectedOption === 'Participant'}
                        onChange={handleChange}
                    />
                    Participant
                </label>
                <br />
                <label>
                    <input
                        type="radio"
                        name="option"
                        value="Restore"
                        checked={selectedOption === 'Restore'}
                        onChange={handleChange}
                    />
                    Restore
                </label>
                <br />
                <button type="submit">Continue</button>
            </form>
        </div>
    );
}

export default RoleSelection;
