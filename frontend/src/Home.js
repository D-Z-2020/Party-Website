import React from 'react'
import UserLogin from './UserLogin'
import UserRegister from './UserRegister'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home({ setUserName }) {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogin && localStorage.getItem("token")) {
      navigate('/start')
    }
  }, [])

  return (
    <div>
      <h1>Party App</h1>
      <input type="button" value={isLogin ? "go register" : "go login"} onClick={() => setIsLogin(!isLogin)} />
      {isLogin && <UserLogin setUserName={setUserName} />}
      {!isLogin && <UserRegister setUserName={setUserName} />}
    </div>
  )
}
