import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  username: string = 'John Doe'; // This would come from your auth service
  alarmTime: string = '07:00';
  showSuccessMessage: boolean = false;
  savedAlarms: SavedAlarm[] = [];

  daysOfWeek: Day[] = [
    { short: 'M', full: 'Monday', selected: false },
    { short: 'T', full: 'Tuesday', selected: false },
    { short: 'W', full: 'Wednesday', selected: false },
    { short: 'T', full: 'Thursday', selected: false },
    { short: 'F', full: 'Friday', selected: false },
    { short: 'S', full: 'Saturday', selected: false },
    { short: 'S', full: 'Sunday', selected: false },
  ];

  ngOnInit(): void {
    // Load username from localStorage or auth service
    const storedUsername = localStorage.getItem('spotify_username');
    if (storedUsername) {
      this.username = storedUsername;
    }

    // Load saved alarms from localStorage
    this.loadSavedAlarms();
  }

  onTimeChange(): void {
    console.log('Time changed to:', this.alarmTime);
  }

  toggleDay(day: Day): void {
    day.selected = !day.selected;
  }

  saveAlarm(): void {
    // Get selected days
    const selectedDays = this.daysOfWeek.filter((day) => day.selected).map((day) => day.short);

    // Create alarm object
    const alarm: SavedAlarm = {
      time: this.alarmTime,
      days: selectedDays,
      daysText: selectedDays.length > 0 ? selectedDays.join(', ') : 'One time',
    };

    // Add to saved alarms
    this.savedAlarms.push(alarm);

    // Save to localStorage
    localStorage.setItem('spotify_alarms', JSON.stringify(this.savedAlarms));

    // Show success message
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);

    // Reset form
    this.daysOfWeek.forEach((day) => (day.selected = false));

    console.log('Alarm saved:', alarm);
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
    // Clear localStorage
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_username');
    localStorage.removeItem('spotify_alarms');

    // Redirect to home page
    // In a real app, you'd use Angular Router
    // this.router.navigate(['/']);
    window.location.href = '/';
  }
}
