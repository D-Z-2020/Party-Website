import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserLogin({ setUserName }) {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")

    const login = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/userLogin`, {
                name: name,
                password: password
            })
            alert("login success!")
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
            <form onSubmit={login}>
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
                    <input className="btn btn-primary" type="submit" value="Login" />
                </div>
            </form>
        </div>
    )
}
