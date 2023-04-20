import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserLogin({setUserName}) {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")

    const login = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/userLogin', {
                name: name,
                password: password
            })
            alert("login success!")
            //console.log(response)
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
            <h3>User Login</h3>
            <form onSubmit={login}>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder='name'
                    required={true} />

                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="text"
                    placeholder='password'
                    required={true} />
                <input type="submit" value="Login" />
            </form>
        </div>
    )
}
