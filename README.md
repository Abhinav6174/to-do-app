# TaskMaster — Modern To-Do & Task Management App

A sleek, fast, and feature-rich task management application built with **React 19**, **Vite 8**, and a deeply customizable design system.

---

## ✨ Features & Customizations

### 🎨 Deep Visual & Theme Customization
- **3 Color Themes**:
  - `Light Mode`: Crisp, soft grays and clean backgrounds.
  - `Dark Mode`: Deep midnight navy with elevated card contrast.
  - `OLED Pitch Black`: Pure `#000000` dark mode optimized for OLED screens and battery saving.
- **7 Vibrant Accent Colors**:
  - Ocean Blue (`#3b82f6`)
  - Royal Indigo (`#6366f1`)
  - Deep Violet (`#8b5cf6`)
  - Sunset Rose (`#f43f5e`)
  - Warm Amber (`#f59e0b`)
  - Fresh Emerald (`#10b981`)
  - Vibrant Cyan (`#06b6d4`)
- **4 Typography Options**:
  - `Plus Jakarta Sans`: Modern, geometric, clean.
  - `JetBrains Mono`: Precise code/monospace font.
  - `Editorial Serif`: Warm, classic, elegant serif.
  - `System Humanist`: Native high-legibility system UI.
- **2 Display Density Modes**:
  - `Comfortable`: Spacious cards with full previews.
  - `Compact`: Tight single-line rows for power users managing high volume.

### 📌 Smart Task Capabilities
- **Subtasks & Interactive Checklists**: Break down complex tasks into subtasks with individual checkboxes and a visual mini progress bar (`X of Y steps completed`).
- **Pin to Top**: Pin critical tasks with a single click to keep them anchored at the top.
- **Estimated Duration**: Set time estimates (e.g. `15m`, `45m`, `2h`) with dedicated visual timer badges.
- **Quick Templates**: 1-click preset task generation for:
  - 🌅 *Morning Productivity Routine*
  - 💼 *Daily Team Sync & Updates*
  - 🛒 *Weekly Grocery Shopping*
  - 🧠 *Focused Deep Work Sprint*
- **Custom Categories**: Create, customize, and delete custom tags on the fly.
- **Audio Feedback**: Harmonious Web Audio synthesizer chime upon completing tasks (with toggle switch).
- **Celebration Confetti**: Particle burst animations upon completing tasks.

### 📊 Productivity Insights & Controls
- **Overview Dashboard**: Real-time counter of total, pending, and completed tasks with animated progress bar.
- **Live Search, Filter & Sort**:
  - Instant search across title, notes, and tags.
  - Multi-attribute filter by status (`All`, `In Progress`, `Completed`), category, and priority.
  - Sort by newest, oldest, priority, due date, or alphabetically.
- **In-App Modals**: Detailed task inspection view and custom confirmation dialogs.
- **Data Portability**: Full JSON backup export and restore.

---

## 🚀 Getting Started

### Prerequisites

- Node.js `^18.0.0` or higher (tested on Node v22)
- npm `^9.0.0` or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/abhinav6174/to-do-app.git

# Navigate to project directory
cd to-do-app

# Install dependencies
npm install
```

### Available Scripts

- **`npm run dev`** or **`npm start`**: Launches local development server at `http://localhost:3000` with instant HMR.
- **`npm test`**: Runs the Vitest automated test suite.
- **`npm run build`**: Generates minified production bundle in `dist/` (<300ms).
- **`npm run preview`**: Locally serves the production build.
- **`npm run deploy`**: Deploys the production build to GitHub Pages.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Test Runner**: [Vitest](https://vitest.dev/) + React Testing Library
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio Engine**: Web Audio API Synthesizer (Zero asset dependencies)
- **Styles**: CSS Custom Properties & Responsive Flex/Grid
