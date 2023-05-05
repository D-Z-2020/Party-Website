const SpotifyWebApi = require('spotify-web-api-node');

const login = async (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    })

    let accessToken;
    let refreshToken;
    let expiresIn;
    await spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            accessToken = data.body.access_token;
            refreshToken = data.body.refresh_token;
            expiresIn = data.body.expires_in;
            // res.json({
            //     accessToken: data.body.access_token,
            //     refreshToken: data.body.refresh_token,
            //     expiresIn: data.body.expires_in,
            // })
        })
        .catch((err) => {
            console.log(err)
            res.sendStatus(400)
        })

    let isPremium;
    spotifyApi.setAccessToken(accessToken);
    await spotifyApi.getMe()
        .then((data) => {
            console.log('Profile information:', data.body);
            isPremium = data.body.product === 'premium'
            console.log('Is user premium:', isPremium);
        });

    res.json({
        accessToken,
        refreshToken,
        expiresIn,
        isPremium
    })
}

module.exports = { login };