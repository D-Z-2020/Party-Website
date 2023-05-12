const SpotifyWebApi = require('spotify-web-api-node');
const clientCredentialsFlowController = async (req, res) => {
    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    })
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        res.status(200)
        res.json({
            accessToken: data.body['access_token'],
            expiresIn: data.body['expires_in']
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
}

module.exports = clientCredentialsFlowController