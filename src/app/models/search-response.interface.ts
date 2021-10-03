import { SearchResponseArtists } from './search-response-artists.interface';
import { SearchResponseTracks } from './search-response-tracks.interface';

export interface SearchResponse {
  artists: SearchResponseArtists;
  tracks: SearchResponseTracks;
}
