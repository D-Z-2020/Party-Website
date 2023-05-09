import { Route, Routes} from 'react-router-dom';
import Layout from './Layout';
import { Home } from './pages/Home';
import { LoginType } from './pages/LoginType';
import Start from './Start';
import PartySpaceSeting from './pages/PartySpaceSeting';
import { LoginSpotify } from './pages/LoginSpotify';
import { LoginCode } from './pages/LoginCode';
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
    <Routes>
      <Route path="/" element={<Layout userName={userName} setUserName={setUserName} />}>
        <Route index element={<Home setUserName={setUserName}/>} />
        <Route path='loginType' element={<LoginType />} />
        <Route path='loginSpotify' element={<LoginSpotify />} />
        <Route path='loginCode' element={<LoginCode />} />
        
        <Route path="start" element={<Start />} />
        <Route path="partySpaceSeting" element={<PartySpaceSeting />} />
      </Route>
    </Routes>
  );
}

export default App;
