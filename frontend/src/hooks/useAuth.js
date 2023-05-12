import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// login and authentication logic(hook)
export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();
    const [isPremium, setIsPremium] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/login`, { code })
            .then(res => {
                // console.log(res)
                setAccessToken(res.data.accessToken)
                setRefreshToken(res.data.refreshToken)
                setExpiresIn(res.data.expiresIn)
                setIsPremium(res.data.isPremium)
                // if (!res.data.isPremium) {
                //     window.location = '/start'
                //     alert("you need premium account to be a host!")
                // } else {
                    window.history.pushState({}, null, "/start")
                // }
            }).catch((err) => {
                window.location = '/start'
            })
    }, [code])

    useEffect(() => {
        if (!refreshToken || !expiresIn) return
        const interval = setInterval(() => {
            axios.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/refresh`, { refreshToken })
                .then(res => {
                    setAccessToken(res.data.accessToken)
                    setExpiresIn(res.data.expiresIn)
                }).catch((err) => {
                    window.location = '/'
                })
        }, (expiresIn - 60) * 1000)

        return () => clearInterval(interval)
    }, [refreshToken, expiresIn])
    return [isPremium, accessToken]
}
