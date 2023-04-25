import { memo, useState } from "react"
import { useNavigate } from "react-router-dom"
import Logo from '../../assets/logo.png'

import './index.scss'

export const Home = memo(() => {
    const navigate = useNavigate()
    const [val, setVal] = useState()
    const [err,setErr] = useState(false)
    const login = () => {
        if(!val){
            setErr(true)
        }else{
            setErr(false)
        }
        navigate('/login')
    }
    console.log(val,err)
    return <div className="login">
        <div className="d-flex justify-content-between align-items-center h-10 header">
            <img src={Logo} alt="" />
            <button type="button" className="btn btn-success">Log in</button>
        </div>
        <div className="content">
            <div className="position-absolute text-center w-75">
                <h1>Welcome to MSc in Partying </h1>
                <div><input value={val} onChange={(e)=>{setVal(e.target.value);console.log(e)}} className="input" type="text" placeholder="Party code" /></div>
                <div className="text-danger">{err?'Oops! This party doesn’t exist!':null}</div>
                <div><button onClick={login} type="button" className="btn btn-success button">enter</button></div>
            </div>
        </div>
    </div>
})