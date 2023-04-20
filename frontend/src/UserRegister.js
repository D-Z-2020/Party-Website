import React from 'react'
import { useState } from 'react'
import axios from 'axios';

export default function UserRegister() {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")

    const register = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/userRegister', {
                name: name,
                password: password
            })
            alert("register success!")
        }
        catch (err) {
            alert(err.response.data)
        }

    }

    return (
        <div>
            <h3>User Register</h3>
            <form onSubmit={register}>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder='name'
                    required = {true} />

                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="text"
                    placeholder='password'
                    required = {true} />
                <input type="submit" value="Register" />
            </form>
        </div>
    )
}
