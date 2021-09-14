window.onSpotifyWebPlaybackSDKReady = () => {
  const token = window.localStorage.getItem('accessToken');
  const player = new Spotify.Player({
    name: 'Tunefy',
    getOAuthToken: cb => {
      cb(token)
    }
  });

  // Error handling
  player.addListener('initialization_error', ({message}) => {
    console.error(message);
  });
  player.addListener('authentication_error', ({message}) => {
    console.error(message);
  });
  player.addListener('account_error', ({message}) => {
    console.error(message);
  });
  player.addListener('playback_error', ({message}) => {
    console.error(message);
  });


  player.addListener('ready', ({device_id}) => {
    const event = new Event('playerInitialized');
    event.id = device_id;
    window.dispatchEvent(event);
    console.log('Ready with Device ID: ' + device_id);
  });

  player.connect();
}
