# Project Documentation: Communication Systems Interactive Learning Platform

## 1. Project Overview
This application is an interactive educational platform designed to teach the fundamentals of modern telecommunications. It visualizes complex concepts such as Pulse Code Modulation (PCM), Digital Modulation techniques, and Signal Transforms through real-time simulations and interactive graphs.

## 2. Tech Stack
- **Framework**: React 19 (via Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts/Visualization**: Recharts
- **Build Tool**: Vite

## 3. Project Structure

```
/
├── App.tsx                 # Main entry point, handles routing and layout
├── components/             # Reusable UI components
│   ├── GlobalIntro.tsx     # Landing page for domain selection
│   ├── Sidebar.tsx         # Navigation sidebar for modules
│   └── modules/            # Educational content modules
│       ├── Introduction.tsx
│       ├── SamplingQuantization.tsx
│       ├── PcmDpcm.tsx
│       ├── LineCodes.tsx
│       ├── DeltaModulation.tsx
│       ├── AdaptiveDeltaModulation.tsx
│       ├── Quiz.tsx
│       ├── Transforms.tsx
│       └── dm/             # Digital Modulation specific modules
│           ├── DmIntroduction.tsx
│           ├── InformationCapacity.tsx
│           └── DigitalModulationTechniques.tsx
├── types.ts                # Global type definitions and Enums
├── index.tsx               # React DOM rendering
└── index.html              # HTML entry point
```

## 4. Architecture & Design

### 4.1. Navigation & Routing
The application uses a custom state-based routing system instead of a library like `react-router`. This is managed in `App.tsx`.

- **Domains**: The app is divided into three main "Domains" (`DomainId` in `types.ts`):
    1.  **PCM (Pulse Code Modulation)**: Covers sampling, quantization, line codes, etc.
    2.  **Digital Modulation**: Covers ASK, FSK, PSK, QAM, etc.
    3.  **Transforms**: Covers Fourier, Laplace, and Z-transforms.

- **Modules**: Each domain contains specific "Modules" (`ModuleId` in `types.ts`).

**Flow:**
1.  User starts at `GlobalIntro` (Home).
2.  Selecting a card sets the `activeDomain`.
3.  `App.tsx` switches the view to the main layout with a `Sidebar`.
4.  The `Sidebar` displays modules relevant to the `activeDomain`.
5.  Clicking a sidebar item sets the `activeModule`, which renders the corresponding component in the main content area.

### 4.2. State Management
- **Local State**: `App.tsx` holds the source of truth for navigation (`activeDomain`, `activeModule`, `isSidebarOpen`).
- **Props**: State setters are passed down to `Sidebar` and `GlobalIntro` to trigger navigation changes.

### 4.3. Component Design
- **Container/Presenter Pattern**: `App.tsx` acts as the container, determining which module to render.
- **Module Components**: Each module (e.g., `SamplingQuantization.tsx`) is a self-contained view responsible for its own interactive logic and visualizations.

## 5. Key Components

### `App.tsx`
The backbone of the application. It handles:
-   Conditional rendering between the Landing Page (`GlobalIntro`) and the Learning Interface.
-   Responsive layout (Sidebar toggle for mobile).
-   Switch statement to render the correct module based on `activeModule`.

### `GlobalIntro.tsx`
The landing page featuring three main cards. It uses a grid layout and hover effects to guide the user to a specific domain.

### `Sidebar.tsx`
A dynamic navigation menu that changes its content based on the `activeDomain`.
-   **Props**: Receives `activeDomain` to decide which list of items (PCM, DM, or Transforms) to display.
-   **Styling**: Uses conditional classes to theme the sidebar (Indigo for PCM, Emerald for DM, Violet for Transforms).

### `types.ts`
Centralized definition of:
-   `DomainId` (Enum): High-level categories.
-   `ModuleId` (Enum): Specific pages/topics.
-   Data interfaces for quizzes and charts.

## 6. Styling
The project uses **Tailwind CSS** for all styling.
-   **Color Palette**:
    -   Slate: Neutral text and backgrounds.
    -   Indigo: Primary accent for PCM.
    -   Emerald: Primary accent for Digital Modulation.
    -   Violet: Primary accent for Transforms.
-   **Responsiveness**: Mobile-first approach. The sidebar is hidden behind a hamburger menu on small screens (`lg:hidden`).
-   **Animations**: Custom keyframe animations (`slideIn`, `fadeIn`) are defined in `Sidebar.tsx` for smooth transitions.
