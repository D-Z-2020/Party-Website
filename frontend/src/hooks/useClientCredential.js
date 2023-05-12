import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useClientCredential() {
    const [accessToken, setAccessToken] = useState();
    const [expiresIn, setExpiresIn] = useState();

    useEffect(() => {
        axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/clientCredentialsFlow`)
            .then(res => {
                setAccessToken(res.data["accessToken"])
                setExpiresIn(res.data["expiresIn"])
                window.history.pushState({}, null, "/start")
            }).catch((err) => {
                window.location = '/start'
            })
    }, [])

    useEffect(() => {
        if (!expiresIn) return
        const interval = setInterval(() => {
            axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/clientCredentialsFlow`)
                .then(res => {
                    setAccessToken(res.data["accessToken"])
                    setExpiresIn(res.data["expiresIn"])
                    window.history.pushState({}, null, "/start")
                }).catch((err) => {
                    window.location = '/start'
                })
        }, (expiresIn - 60) * 1000)

        return () => clearInterval(interval)
    }, [expiresIn])

    return accessToken
}
