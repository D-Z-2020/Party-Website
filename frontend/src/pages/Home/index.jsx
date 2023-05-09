import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/logo.png";

import "./index.scss";

export const Home = memo(({ setUserName }) => {
  const navigate = useNavigate();
  const [err, setErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("1");

  const login = async (e) => {
    e.preventDefault();
    try {
      if (step === "2") {
        register(e);
        return;
      }
      if (!name) {
        setErr(true);
        return;
      } else {
        setErr(false);
      }
      if (!password) {
        setPasswordErr(true);
        return;
      } else {
        setPasswordErr(false);
      }
      const response = await axios.post("http://localhost:3001/userLogin", {
        name: name,
        password: password,
      });
      alert("login success!");
      //console.log(response)
      setUserName(name);
      localStorage.setItem("token", response.data.token);
      navigate("/loginType");
    } catch (err) {
      alert(err.response.data);
    }
  };
  const register = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/userRegister", {
        name: name,
        password: password,
      });

      const response = await axios.post("http://localhost:3001/userLogin", {
        name: name,
        password: password,
      });
      alert("register success!");

      setUserName(name);
      localStorage.setItem("token", response.data.token);
      navigate("/loginType");
    } catch (err) {
      alert(err.response.data);
    }
  };

  return (
    <div className="login">
      <div className="d-flex justify-content-between align-items-center h-10 header">
        <img src={Logo} alt="" />
        {/* <button type="button" className="btn btn-success">
          Log in
        </button> */}
        <div></div>
      </div>
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
              className={`top-btn btn-success ${
                step === "1" ? "active-button" : ""
              }`}
            >
              login
            </button>
            <button
              type="button"
              onClick={() => setStep("2")}
              className={`top-btn btn-success ${
                step === "2" ? "active-button" : ""
              }`}
            >
              register
            </button>
          </div>
          <div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="username"
              required={true}
              className="input"
            />
          </div>
          <div className="text-danger">
            {err ? "Oops! This name doesn’t exist!" : null}
          </div>
          <div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="text"
              placeholder="password"
              required={true}
              className="input"
            />
          </div>
          <div className="text-danger">
            {passwordErr ? "Oops! This password doesn’t exist!" : null}
          </div>
          <div>
            <button
              onClick={login}
              type="gost"
              className="btn btn-success button"
            >
              {step === "1" ? "Login" : "Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
