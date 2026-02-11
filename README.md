# Alarmify - Spotify Alarm Clock

Wake up to your favorite Spotify playlists automatically.

**Live at: [alarmifyhub.com]([https://www.alarmifyhub.com])**

---

## Perfect for Smart Speaker Users

If you use **Google Home or Amazon Alexa** as your alarm clock, you've probably noticed they can play music but won't let you select a specific playlist to wake up to.

Alarmify solves this:

1. Set your smart speaker's alarm to play Spotify
2. Use Alarmify to choose which playlist should play at that time
3. When your alarm goes off, Alarmify automatically switches your speaker to your chosen playlist

Now you can wake up to exactly the music you want, not just random Spotify songs.

---

## Why I Built This

I wanted to wake up to my custom Spotify playlists every morning, but:

- **iOS doesn't allow Spotify automation** due to Apple Music competition
- **Third-party alarm apps** lock playlist selection behind premium subscriptions ($5-10/month)
- I wanted a **free, web-based solution** that works on any device

So I built Alarmify - a simple web app that plays your chosen Spotify playlists at scheduled times.

---

## Features

- 🎵 **Choose any playlist** from your Spotify library
- ⏰ **Set recurring alarms** for specific days of the week (M, T, W, etc.)
- 🔐 **Secure login** with Spotify OAuth 2.0
- ☁️ **Cloud-hosted** - runs 24/7, no app installation needed
- 💯 **100% free** - no paywalls or premium features

---

## How It Works

1. Sign in with your Spotify account
2. Select a playlist and set your alarm time
3. Choose which days it should repeat
4. Wake up to your music automatically playing on your Spotify device

The app uses a cron scheduler that checks alarms every minute and triggers playback via the Spotify Web API.

---

## Tech Stack

**Frontend:** Angular, TypeScript, CSS  
**Backend:** Node.js, Express, MongoDB  
**APIs:** Spotify Web API (OAuth 2.0)  
**Infrastructure:** AWS (EC2, Route 53, ALB, Certificate Manager), PM2

---

## Local Development

### Prerequisites

- Node.js 16+
- MongoDB
- Spotify Developer Account ([Get credentials here](https://developer.spotify.com/dashboard))

### Setup

1. Clone the repo

```bash
git clone https://github.com/yourusername/alarmify.git
```

2. Set up environment variables (see `.env.example`)

3. Install and run backend

```bash
cd backend
npm install
npm start
```

4. Install and run frontend

```bash
cd frontend
npm install
ng serve
```

---

## Known Limitations

- Requires an active Spotify device (phone, computer, etc.) to be available
- Alarms trigger on the server, so your Spotify app must be reachable

---

## License

MIT License - feel free to use this for your own projects!

---

**Built by Chandler Phung** | [Portfolio](https://chandlerphung.github.io/chandlerphung) | [LinkedIn](https://linkedin.com/in/chandler-phung-b0b269218)
