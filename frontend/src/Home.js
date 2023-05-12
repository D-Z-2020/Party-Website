import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import "./styles/Home.css";
import "./styles/Login.css";

export default function Home({ setUserName }) {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [step, setStep] = useState("1");
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [passwordErr, setPasswordErr] = useState(false);
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (isLogin && localStorage.getItem("token")) {
      navigate('/start')
    }
  }, [])

  const btn_submit = async (e) => {
    e.preventDefault();
    if (step === "1") {
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
    else {
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
  }
  return (
    <div className="login">
      <div className="content">
        <div className="position-absolute text-center">
          <h1>Welcome to MSc in Partying </h1>
          <h2>
            <div>Party like a pro: </div>
            <div>
              Groove and share memories with the ultimate platform for hosts and
              guests!
            </div>
          </h2>
          <div>
            <button
              type="button"
              onClick={() => setStep("1")}
              className={`top-btn btn-success ${step === "1" ? "active-button" : ""
                }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setStep("2")}
              className={`top-btn btn-success ${step === "2" ? "active-button" : ""
                }`}
            >
              Register
            </button>
          </div>
          <form onSubmit={btn_submit}>
            <div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="input"
                placeholder='username'
                required={true} />
            </div>
            <div className="text-danger">
              {err ? "Oops! This name doesn’t exist!" : null}
            </div>
            <div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="input"
                placeholder='password'
                required={true} />
            </div>
            <div className="text-danger">
              {passwordErr ? "Oops! This password doesn’t exist!" : null}
            </div>
            <div>
              <button onClick={btn_submit} type="submit" className="btn btn-success button"            >
                {step === "1" ? "Login" : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
