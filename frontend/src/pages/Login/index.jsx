import { memo } from "react"
import Logo from '../../assets/logo.png'
import BtnLogo from '../../assets/btnLogo.png'

import './index.scss'

export const Login = memo(() => {
    return <div className="home">
        <div className="d-flex justify-content-between align-items-center h-10 header">
            <img src={Logo} alt="" />
            <div></div>
        </div>
        <div className="content">
            <div className="position-absolute text-center w-75">
                <h1>Log in</h1>
                <div><button type="button" className="btn btn-success button"><img src={BtnLogo} alt='' />Log in with Spotify</button></div>
            </div>
        </div>
    </div>
})