import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import Host from '../../assets/image/host.png'
import HostActive from '../../assets/image/hostActive.png'
import Guest from '../../assets/image/guest.png'
import GuestActive from '../../assets/image/guestActive.png'

import "./index.scss";

export const LoginType = memo(({ setUserName }) => {
  const navigate = useNavigate();
  const [type, setType] = useState('host')

  const typeLogin = () => {
    if(type === 'host'){
      navigate('/loginSpotify')
    }else if(type === 'guest'){
      navigate('/loginCode')
    }
  }

  return (
    <div className="loginType">
      <div className="d-flex justify-content-between align-items-center h-10 header">
        <img src={Logo} alt="" />
        <button type="button" className="btn btn-success">
          Log in
        </button>
      </div>
      <div className="content">
        <div className="position-absolute text-center">
          <h1>I’m...</h1>
          <div className="typeBtn">
            <img src={type === 'host'?HostActive : Host} alt='' onClick={() => setType('host')}/>
            <img src={type === 'guest'?GuestActive : Guest} alt=''  onClick={() => setType('guest')}/>
          </div>
         
          <div>
            <button
              type="gost"
              className="btn btn-success button"
              onClick={typeLogin}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
