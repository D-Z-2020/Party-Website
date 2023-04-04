var convert = require('xml-js');
const getLyrics = async (req, res) => {
    encodedArtist = encodeURIComponent(req.query.artist)
    encodedTrack = encodeURIComponent(req.query.track)
    url = 'http://api.chartlyrics.com/apiv1.asmx/SearchLyric?artist=' + encodedArtist + '&song=' + encodedTrack
    fetch(url)
        .then((response) => response.text())
        .then((body) => {
            var result = JSON.parse(convert.xml2json(body, { compact: true, spaces: 4 }));
            let firstTrack = result.ArrayOfSearchLyricResult.SearchLyricResult[0]
            lyricURI = "http://api.chartlyrics.com/apiv1.asmx/GetLyric?lyricId=" + firstTrack.LyricId._text + "&lyricCheckSum=" + firstTrack.LyricChecksum._text
            return fetch(lyricURI)
        }).then((response) => response.text())
        .then((body) => {
            var result = JSON.parse(convert.xml2json(body, { compact: true, spaces: 4 }));
            let lyric = result.GetLyricResult.Lyric._text
            console.log(result.GetLyricResult.Lyric, result.GetLyricResult.LyricArtist, result.GetLyricResult.LyricSong)
            res.json({ lyric, artist: result.GetLyricResult.LyricArtist._text, song: result.GetLyricResult.LyricSong._text })
        })
        .catch((err) => res.sendStatus(404));
    // const lyrics =
    //   (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
    // res.json({ lyrics })
}

module.exports = { getLyrics }