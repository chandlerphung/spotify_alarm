import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Day {
  short: string;
  full: string;
  selected: boolean;
}

interface SavedAlarm {
  time: string;
  days: string[];
  daysText: string;
}

interface DecodedToken {
  spotify_id: string;
  display_name: string;
  exp: number;
}

interface UserData {
  _id: string;
  spotify_id: string;
  display_name: string;
  access_token: string;
  refresh_token: string;
  scope: string;
  token_expires_at: string;
  playlists: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  username: string = '';
  spotifyId: string = '';

  alarmTime: string = '08:00';
  showSuccessMessage: boolean = false;
  savedAlarms: SavedAlarm[] = [];

  // User data from backend
  userData: UserData | null = null;
  loadingUserData: boolean = false;
  userDataError: string | null = null;

  private subscriptions = new Subscription();

  daysOfWeek: Day[] = [
    { short: 'M', full: 'Monday', selected: false },
    { short: 'T', full: 'Tuesday', selected: false },
    { short: 'W', full: 'Wednesday', selected: false },
    { short: 'T', full: 'Thursday', selected: false },
    { short: 'F', full: 'Friday', selected: false },
    { short: 'S', full: 'Saturday', selected: false },
    { short: 'S', full: 'Sunday', selected: false },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef, // Add this
  ) {}

  ngOnInit(): void {
    const paramsSub = this.route.queryParams.pipe(take(1)).subscribe((params) => {
      const token = params['token'];

      if (token) {
        localStorage.setItem('spotify_token', token);

        const decoded = this.decodeToken(token);

        if (decoded) {
          this.username = decoded.display_name;
          this.spotifyId = decoded.spotify_id;

          localStorage.setItem('spotify_username', decoded.display_name);
          localStorage.setItem('spotify_id', decoded.spotify_id);
        }

        this.router.navigate([], {
          queryParams: {},
          replaceUrl: true,
        });
      } else {
        const storedToken = localStorage.getItem('spotify_token');

        if (!storedToken) {
          this.router.navigate(['/']);
          return;
        }

        const decoded = this.decodeToken(storedToken);

        if (!decoded || !this.isTokenValid(decoded)) {
          this.logout();
          return;
        }

        this.username = decoded.display_name;
        this.spotifyId = decoded.spotify_id;
      }

      this.loadSavedAlarms();
    });

    this.subscriptions.add(paramsSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  decodeToken(token: string): DecodedToken | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );

      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  isTokenValid(decoded: DecodedToken): boolean {
    return decoded.exp * 1000 > Date.now();
  }

  toggleDay(day: Day): void {
    day.selected = !day.selected;
  }

  onTimeChange(): void {}

  saveAlarm(): void {
    const selectedDays = this.daysOfWeek.filter((d) => d.selected).map((d) => d.short);

    const alarm: SavedAlarm = {
      time: this.alarmTime,
      days: selectedDays,
      daysText: selectedDays.length > 0 ? selectedDays.join(', ') : 'One time',
    };

    this.savedAlarms.push(alarm);

    localStorage.setItem('spotify_alarms', JSON.stringify(this.savedAlarms));

    this.showSuccessMessage = true;

    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);

    this.daysOfWeek.forEach((d) => (d.selected = false));
  }

  deleteAlarm(alarm: SavedAlarm): void {
    const index = this.savedAlarms.indexOf(alarm);

    if (index > -1) {
      this.savedAlarms.splice(index, 1);

      localStorage.setItem('spotify_alarms', JSON.stringify(this.savedAlarms));
    }
  }

  loadSavedAlarms(): void {
    const stored = localStorage.getItem('spotify_alarms');

    if (stored) {
      this.savedAlarms = JSON.parse(stored);
    }
  }

  fetchUserInfo(): void {
    const token = localStorage.getItem('spotify_token');

    if (!token || !this.spotifyId) {
      this.userDataError = 'No token or Spotify ID found';
      return;
    }

    console.log('Starting fetch...');
    this.loadingUserData = true;
    this.userDataError = null;
    this.userData = null;
    this.cdr.detectChanges(); // Force update UI

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
    });

    const apiUrl = `https://nonrectifiable-isotopic-venita.ngrok-free.dev/api/users/${this.spotifyId}`;

    this.http.get<UserData>(apiUrl, { headers }).subscribe({
      next: (data) => {
        console.log('SUCCESS - Setting userData:', data);
        this.userData = data;
        this.loadingUserData = false;
        console.log('Loading state after success:', this.loadingUserData);
        this.cdr.detectChanges(); // Force update UI
      },
      error: (error) => {
        console.error('ERROR - Full error:', error);
        this.loadingUserData = false;

        if (error.status === 403) {
          this.userDataError = 'Unauthorized: Cannot access this user data';
        } else if (error.status === 404) {
          this.userDataError = 'User not found';
        } else {
          this.userDataError = error.error?.error || 'Failed to fetch user data';
        }
        this.cdr.detectChanges(); // Force update UI
      },
      complete: () => {
        console.log('HTTP request completed');
      },
    });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
