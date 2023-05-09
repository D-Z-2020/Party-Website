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
      <div className="row justify-content-center">
        <h1 className="text-center my-3">Welcome to MSc in Partying</h1>
        <div className="col-md-6">
          <div className='text-center my-3'>
            <input type="button" className="btn btn-primary" value={isLogin ? "Go Register" : "Go Login"} onClick={() => setIsLogin(!isLogin)} />
          </div>
          {isLogin && <UserLogin setUserName={setUserName} />}
          {!isLogin && <UserRegister setUserName={setUserName} />}
        </div>
      </div>
    </div>
  )
}
