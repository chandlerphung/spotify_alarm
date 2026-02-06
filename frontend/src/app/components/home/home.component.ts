import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  signIn(): void {
    // Add your Spotify OAuth logic here
    alert('Sign in with Spotify - Connect your OAuth flow here!');
    // Example for Spotify OAuth:
    // window.location.href = 'YOUR_SPOTIFY_AUTH_URL';
  }
}
