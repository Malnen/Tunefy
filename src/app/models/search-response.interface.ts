import { SearchResponseArtists } from './search-response-artists.interface';
import { SearchResponseTracks } from './search-response-tracks.interface';
import { SearchResponseAlbum } from './search-response-album.interface';

export interface SearchResponse {
  artists?: SearchResponseArtists;
  tracks?: SearchResponseTracks;
  albums?: SearchResponseAlbum;
}
