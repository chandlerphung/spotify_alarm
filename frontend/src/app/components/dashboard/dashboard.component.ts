import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

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

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
