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
    let isPremium;

    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        accessToken = data.body.access_token;
        refreshToken = data.body.refresh_token;
        expiresIn = data.body.expires_in;
        spotifyApi.setAccessToken(accessToken);

        const meData = await spotifyApi.getMe();
        isPremium = meData.body.product === 'premium';

        res.status(200)
        res.json({
            accessToken,
            refreshToken,
            expiresIn,
            isPremium
        });
    } catch (err) {
        res.sendStatus(400);
    }
}

module.exports = { login };
