import { Route, Routes} from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import Start from './Start';
import { useState, useEffect } from 'react';
import { isExpired, decodeToken } from "react-jwt";

function App() {
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
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
    <Routes>
      <Route path="/" element={<Layout userName={userName} setUserName={setUserName} />}>
        <Route index element={<Home setUserName={setUserName}/>} />
        <Route path="start" element={<Start setUserName={setUserName}/>} />
      </Route>
    </Routes>
  );
}

export default App;
