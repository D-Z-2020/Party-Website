const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=5c9e849201d24dfb8f563a7a081e3be9&response_type=code&redirect_uri=http://localhost:3000/start/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"
const AUTH_URL_SHOW_DIALOG = AUTH_URL + "&show_dialog=true"

export default function Login({globalIsPremium}) {
    return (
        <div>
            <a className="spotifyHref" href={globalIsPremium ? AUTH_URL : AUTH_URL_SHOW_DIALOG} >
                Login With Spotify And Create New Room
            </a>
        </div>
    )
}