import Login from './Login';
import Dashboard from "./Dashboard"
// import ChatRoom from "./ChatRoom"
import UserRegister from './UserRegister';
import UserLogin from './UserLogin';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import Start from './Start';
import { useState, useEffect } from 'react';
import { isExpired, decodeToken } from "react-jwt";

function App() {
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    //console.log(token)
    if (token) {
      const user = decodeToken(token)
      if (!user) {
        localStorage.removeItem("token")
      } else {
        setUserName(user.name)
      }
    }
  }, [])

  return (
    // <div>
    //   {code ? <Dashboard code={code} /> : <Login />}
    //   {/* <ChatRoom /> */}
    //   <UserRegister />
    //   <UserLogin />
    // </div>
    <Routes>
      <Route path="/" element={<Layout userName={userName} setUserName={setUserName} />}>
        <Route index element={<Home />} />
        <Route path="UserRegister" element={<UserRegister />} />
        <Route path="UserLogin" element={<UserLogin setUserName={setUserName} />} />
        {/* <Route path="start" element={code ? <Dashboard code={code} /> : <Login />} /> */}
        <Route path="start" element={<Start />} />
      </Route>
    </Routes>
  );
}

export default App;
