import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/logo.png";

import "./index.scss";

export const LoginCode = memo(({ setUserName }) => {
  const navigate = useNavigate();
  const [err, setErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("1");

  const login = async (e) => {
    e.preventDefault();
    try {
      navigate("/start");
    } catch (err) {
      alert(err.response.data);
    }
  };
 

  return (
    <div className="loginCode">
      <div className="d-flex justify-content-between align-items-center h-10 header">
        <img src={Logo} alt="" />
        <button type="button" className="btn btn-success">
          Log in
        </button>
      </div>
      <div className="content">
        <div className="position-absolute text-center">
          <h1>Welcome to MSc in Partying </h1>
          <div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Party code"
              required={true}
              className="input"
            />
          </div>
          <div className="text-danger">
            {err ? "Oops! This name doesn’t exist!" : null}
          </div>
          
          <div>
            <button
              onClick={login}
              type="gost"
              className="btn btn-success button"
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
