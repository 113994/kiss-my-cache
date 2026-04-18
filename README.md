# Kiss My Cache 🥗

**Strava for Nutrition** — A lightweight, social-first healthy eating app built for a 3-hour hackathon.

Share meals, see what others are eating, and get lightweight accountability with a beautiful, mobile-first UI.

## ✨ Features

### Core
- **Social Feed**: Strava-inspired activity feed showing meals from friends
- **Post a Meal**: Simple form with photo upload, name, and macros
- **Like & React**: Engage with meals using emojis (🔥 💪 🥗)
- **Daily Progress**: Track how many meals you've logged today
- **User Profile**: View your stats, streaks, and posted meals

### Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Data**: localStorage (mocked, no backend required)
- **Deployment**: Ready for Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm installed

### Installation

1. **Clone or enter the project**
```bash
cd /Users/mrinalijain/src/kiss-my-cache
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
Navigate to `http://localhost:3000`

## 🎯 Demo Flow (30 seconds)

1. **Onboarding** (3 quick steps)
   - Enter email & name
   - Select health goals
   - Pick dietary preference

2. **Feed** → See pre-loaded meals from friends

3. **Post** → Share a meal instantly

4. **Engagement** → Like and react to meals using emojis

5. **Profile** → View your stats and meal history

## 📁 Project Structure

```
app/
  ├── layout.tsx          # Root layout
  ├── page.tsx            # Auth router
  ├── globals.css         # Global styles
  ├── onboarding/
  │   └── page.tsx        # Multi-step onboarding
  ├── feed/
  │   └── page.tsx        # Social feed
  ├── post/
  │   └── page.tsx        # Post a meal form
  └── profile/
      └── page.tsx        # User profile & stats

components/
  ├── BottomNav.tsx       # Navigation bar
  └── MealCard.tsx        # Meal post component

lib/
  ├── types.ts            # TypeScript interfaces
  ├── dataStore.ts        # localStorage management
  ├── hooks.ts            # Custom React hooks
  └── utils.ts            # Utilities (date formatting, etc.)
```

## 🎨 Design Highlights

- **Mobile-first**: Optimized for 375px+ viewports
- **Color Scheme**: 
  - Primary: Fresh green (#10B981)
  - Neutral: Soft grays and whites
  - Accent: Purple for interactions
- **Inspired by**: Strava (feed) + Instagram (post flow)

## 💾 Data Storage

All data is stored in browser's `localStorage`:
- User profile & preferences
- Meal posts & engagement
- Mock friend data

No backend or database required — perfect for hackathons!

## 🚀 Deployment to Vercel

1. Push code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

2. Import to Vercel
   - Go to [vercel.com/new](https://vercel.com/new)
   - Connect your Git repo
   - Click "Deploy"

That's it! Your app is live.

## 📝 Optional Enhancements

If you have extra time, consider:
- **Health Score**: AI-generated nutrition rating
- **Streaks**: "Logged meals 5 days in a row!"
- **Leaderboard**: Friend rankings by consistency
- **Real photos**: Use Cloudinary or imgbb for hosting
- **Push notifications**: Toast notifications for new friend meals

## 🤝 How It Works

1. **No Authentication**: Uses email + localStorage for "login"
2. **Mock Friends**: Pre-populated with sample data
3. **Local State**: All meal data syncs to localStorage
4. **Real Interactions**: Likes and reactions update instantly

## 📱 Mobile Testing

For best development experience, test on mobile via:
```bash
# Your dev server will be available at:
http://[YOUR_IP]:3000
```

Or use Chrome DevTools device emulation (F12 → Toggle device toolbar).

## 🎓 Code Notes

- Uses React hooks for state management
- TypeScript for type safety
- Tailwind CSS with custom color theme
- Mobile-safe area support for notched phones
- Server-safe localStorage checks with `typeof window`

## 📄 License

Built for a 3-hour hackathon. Use freely!

---

**Happy hacking! 🚀**

OMG
