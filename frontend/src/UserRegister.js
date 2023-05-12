import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserRegister({ setUserName }) {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")

    const register = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/userRegister`, {
                name: name,
                password: password
            })

            const response = await axios.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/userLogin`, {
                name: name,
                password: password
            })
            alert("register success!")

            setUserName(name)
            localStorage.setItem("token", response.data.token)
            navigate("/start")
        }
        catch (err) {
            alert(err.response.data)
        }

    }

    return (
        <div>
            <form onSubmit={register}>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    className="form-control"
                    placeholder='name'
                    required={true} />
                <br />
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="text"
                    className="form-control"
                    placeholder='password'
                    required={true} />
                <div className="text-center my-3">
                    <input className="btn btn-primary" type="submit" value="Register" />
                </div>
            </form>
        </div>
    )
}
