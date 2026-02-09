import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { generateRandomString } from '../../utils/auth.util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  // first redirect user to the spotify login page and the once logged in
  // the user will be redirected to backend with code and state
  // once the user hits the redirect page it will send a post to spotify
  // api and then receive all of the necessary data to authenticate them
  signIn() {
    const spotify_auth_url =
      'https://accounts.spotify.com/authorize?' +
      `client_id=${environment.client_id}&` +
      `response_type=${environment.response_type}&` +
      `redirect_uri=${environment.redirect_uri}&` +
      `scope=user-read-private user-read-email&` +
      `state=${generateRandomString(16)}`;

    window.location.href = spotify_auth_url;
  }
}
