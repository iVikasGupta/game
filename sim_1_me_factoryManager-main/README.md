# Factory Manager - Production Economics Learning Platform
### Frontend Demo with Complete UI Showcase

An interactive educational web application for teaching microeconomic principles including production functions, returns to scale, and cost curves. This is a **complete frontend demo** with realistic dummy data showcasing all features.

## Features

### Fully Functional Pages
- **Landing Page**: Beautiful introduction with feature highlights
- **Authentication**: Login/Register with demo accounts
- **Student Dashboard**: Complete overview with charts and performance metrics
- **Decision Submission (Level 1)**: Interactive production decision interface with live calculator
- **Results Analysis**: Detailed round results with cost curve visualizations
- **Leaderboard**: Class rankings with sortable metrics
- **Strategy Guide**: Educational content explaining production economics
- **Additional Pages**: Analytics, Cost Curves Viewer placeholders

### Key Highlights
- **Live Calculator**: Real-time cost and profit calculations as you adjust inputs
- **Interactive Charts**: Recharts visualizations for trends and cost curves
- **Realistic Demo Data**: 8 rounds of historical results with rankings
- **Production Function**: Level 1 (Q = 10√L) fully implemented
- **Responsive Design**: Works on desktop, tablet, and mobile
- **No Backend Required**: All data stored in dummy data file

## Getting Started

### Prerequisites
- Node.js 16+

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

Visit `http://localhost:5173` and you'll see the landing page.

### Build
```bash
npm run build
```

## Demo Mode

The application works in two ways:

### 1. Browse Without Login (Demo Data)
Simply navigate through the app to see all features with pre-loaded demo data for user "John Doe". All pages work without authentication!

### 2. Login to Persist Data
To save your own data in localStorage:

**Email**: `john.doe@university.edu`
**Password**: Any password (6+ characters)

You can also register a new account - all data is stored in localStorage.

## Application Structure

```
src/
├── data/
│   └── dummyData.ts          # All dummy data and mock functions
├── components/
│   └── Layout.tsx            # Main navigation layout
├── hooks/
│   └── useAuth.ts            # Authentication logic (localStorage)
├── pages/
│   ├── Landing.tsx           # Landing page
│   ├── Login.tsx             # Login with demo credentials
│   ├── Register.tsx          # Registration
│   ├── Dashboard.tsx         # Student dashboard with charts
│   ├── SubmitDecision.tsx    # Level 1 decision submission
│   ├── Results.tsx           # Results with cost curves
│   ├── Leaderboard.tsx       # Rankings
│   ├── Guide.tsx             # Strategy guide
│   ├── Analytics.tsx         # Placeholder
│   └── CostCurves.tsx        # Placeholder
├── store/
│   └── useStore.ts           # Zustand state management
├── utils/
│   └── productionFunctions.ts # All 5 levels of production functions
└── App.tsx                   # Main app with routing
```

## Key Features Demonstrated

### 1. Dashboard
- **Financial Overview**: Budget, profit, output, avg cost cards
- **Interactive Charts**: Profit trend and output/cost trends using Recharts
- **Recent Rounds Table**: Complete history with rankings
- **Real Data**: 8 rounds of dummy results

### 2. Decision Submission (Level 1)
- **Production Function Display**: Q = 10√L
- **Interactive Slider**: Adjust labor from 1-100 workers
- **Live Calculator**: Instant calculations for:
  - Output (units)
  - Total Cost
  - Total Revenue
  - Profit
  - Marginal Product of Labor (MP<sub>L</sub>)
  - Average Variable Cost (AVC)
  - Marginal Cost (MC)
- **Strategy Helper**: Shows optimal labor level
- **Market Parameters**: Output price and wage rate displayed

### 3. Results Page
- **Result Selection**: Toggle between last 4 rounds
- **Key Metrics Cards**: Output, Profit, Avg Cost with rankings
- **Production Details**: Labor, capital, marginal products
- **Cost Breakdown Table**: TFC, TVC, TC with per-unit costs
- **Cost Curves Chart**: Interactive visualization of ATC, AVC, MC, AFC
- **Learning Insights**: Automated feedback on performance

### 4. Leaderboard
- **Top 3 Podium**: Special display for top performers
- **Full Rankings Table**: All students with metrics
- **Sortable Columns**: By profit, efficiency, or output
- **Your Position**: Highlighted row for current user
- **Visual Indicators**: Trophy/medal icons for top 3

### 5. All Production Functions Implemented

Even though only Level 1 is demonstrated in the UI, all 5 levels are mathematically implemented:

**Level 1**: Q = 10√L (Single input)
**Level 2**: Q = A·L^α·K^β (Cobb-Douglas)
**Level 3**: Returns to scale variations (IRS, CRS, DRS)
**Level 4**: Short-run costs with fixed capital
**Level 5**: Long-run costs with plant size decisions

## Production Function Calculations

### Level 1 Example
```typescript
// Input
Labor (L) = 4 workers

// Production
Q = 10√4 = 20 units

// Costs (w = Rs. 50,000/worker)
TVC = 50,000 × 4 = Rs. 200,000
TC = Rs. 200,000 (no fixed costs)

// Revenue (P = Rs. 20,000/unit)
Revenue = 20 × 20,000 = Rs. 400,000

// Profit
Profit = 400,000 - 200,000 = Rs. 200,000

// Marginal Product
MP_L = 5/√4 = 2.5 units/worker

// Marginal Cost
MC = 50,000 / 2.5 = Rs. 20,000/unit
```

## Dummy Data Overview

### Users
- John Doe (STU001) - Student (you)
- Jane Smith (STU002) - Student
- Prof. Robert Johnson - Instructor

### Game Session
- "Economics 101 - Fall 2024"
- 8 rounds completed
- Current budget: Rs. 485 lakhs
- Cumulative profit: -Rs. 15 lakhs

### Results
8 complete round results with varied outcomes:
- Round 1: 4 workers → Rs. 2L profit (#1 rank)
- Round 2: 9 workers → Rs. 0.9L profit (#2 rank)
- Round 3-8: Various decisions showing learning progression

### Leaderboard
5 students with realistic performance metrics:
1. Sarah Chen - Rs. 25L profit (95.5% efficiency)
2. John Doe (you) - -Rs. 15L profit (72.3% efficiency)
3-5. Other students

## Technical Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Router** for navigation
- **Zustand** for state management
- **Framer Motion** for animations
- **Lucide React** for icons
- **Vite** for build tooling

## Educational Value

This platform teaches:
- Production functions and diminishing returns
- Marginal product and marginal cost relationships
- Cost minimization strategies
- Input-output relationships
- Cost curve analysis (TFC, TVC, TC, AFC, AVC, ATC, MC)
- Decision-making under constraints
- Economic efficiency and optimization

## Design Features

### Color Scheme
- Primary: Blue tones (#1F4E78, #4472C4)
- Success: Green (#00AA55)
- Warning: Orange (#E26B0A, #FFAA00)
- Danger/Loss: Red (#DD3333)
- Backgrounds: Clean whites and light grays

### UX Highlights
- Smooth transitions and hover states
- Clear visual hierarchy
- Responsive breakpoints for all devices
- Intuitive navigation
- Real-time feedback
- Color-coded profit/loss indicators

## Future Enhancements (Not Implemented)

If this were connected to a real backend:
- Instructor dashboard for session management
- Real-time multiplayer sessions
- Automatic round processing
- Levels 2-5 decision submission interfaces
- Email notifications
- Export results to CSV
- Advanced analytics
- Achievement system

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Modern mobile browsers

## License

Educational use only.

---

**Note**: This is a frontend demonstration. All data is dummy data stored in `/src/data/dummyData.ts`. In a production version, this would be connected to a backend API and database (Supabase, PostgreSQL, etc.).

Built with React, TypeScript, Tailwind CSS, and Recharts.
