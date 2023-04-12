import React, { Component } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MusicMap.css";
import songs from "./songs.json";
import ReactGA from "react-ga";

class MusicMap extends Component {
  state = {
    lat: 13.746447064034877,
    lng: 100.54716136928202,
    zoom: 12.5,
  };

  componentDidMount() {
    ReactGA.initialize("G-0CJ9NC2NPB");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

handleSongSelect = (song) => {
  const { latitude, longitude } = song;
  this.setState({
    lat: latitude,
    lng: longitude,
    zoom: 17,
  });

  console.log("Sending GA4 event:", {
    name: "song_clicked",
    params: {
      item_name: `${song.title}-${song.artist}`,
    },
  });

  window.gtag("event", "song_clicked", {
    item_name: `${song.title}-${song.artist}`,
  });
};


  render() {
    const { lat, lng, zoom } = this.state;

    const markerIcon = (song) => {
      return L.icon({
        iconUrl: song.image,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -34],
      });
    };

    const adjustPopupHeight = (popup) => {
      setTimeout(() => {
        popup._adjustPan();
      });
    };

    return (
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        maxZoom={18}
        minZoom={5}
        className="map"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {songs.map((song) => (
          <Marker
            key={`${song.title}-${song.artist}`}
            position={[song.latitude, song.longitude]}
            icon={markerIcon(song)}
            onClick={() => this.handleSongSelect(song)}
          >
            <Popup
              autoPanPaddingBottomRight={[50, 50]}
              onOpen={(e) => adjustPopupHeight(e.target)}
            >
              <div className="popup-container">
                <div className="popup-image-container">
                  <img src={song.image} alt="Album Cover" />
                </div>
                <div className="popup-text-container">
                  <h2>{song.title}</h2>
                  <p className="popup-text">Artist: {song.artist}</p>
                  <p className="popup-text">Album: {song.album}</p>
                  <p className="popup-text-lyrics">
                    Related Lyrics: <br></br>
                    {song.related_lyrics}
                  </p>
                  <a href={song.lyrics}>Lyrics</a>
                  <br />
                  <a href={song.video}>Listen to the Song</a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  }
}

export default MusicMap;