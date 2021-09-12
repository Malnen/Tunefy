window.onSpotifyWebPlaybackSDKReady = () => {
  const token = window.localStorage.getItem('accessToken');
  const player = new Spotify.Player({
    name: 'Tunefy',
    getOAuthToken: cb => {
      cb(token)
    }
  });

  player.addListener('ready', ({device_id}) => {
    const event = new Event('playerInitialized');
    event.id = device_id;
    window.dispatchEvent(event);
  });

  player.connect();
}
