# FedLearn - Attack Simulation Frontend

A production-ready React + TypeScript + Tailwind CSS frontend for federated learning attack simulation and analysis.

## Features

- **Authentication**: Login/Signup with email & password (mocked locally)
- **Upload & Configure**: Upload FL models and attack scripts, or use demo files
- **Attack Types**: Label Flip, Manzantan, Backdoor, Cycle, Freeride, Scaling
- **Real-time Progress**: Live progress tracking with animated progress bar and logs
- **Results Dashboard**: Comprehensive metrics, charts, and verdict analysis
- **Job History**: Track and review previous simulations
- **Mock Simulator**: Fully functional offline simulator with realistic data generation

## Quick Start (Mock Mode - Default)

### Requirements
- Node.js >= 18
- npm or yarn

### Installation & Running

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Demo Credentials:**
- Email: `demo@local`
- Password: `password123`

## Project Structure

\`\`\`
src/
├── pages/              # Route pages
├── components/         # Reusable UI components
├── context/           # React Context (Auth, Job state)
├── services/          # API client & mock simulator
├── types/             # TypeScript interfaces
└── utils/             # Helper functions
\`\`\`

## Switching to Real API

1. Edit `src/services/apiClient.ts`:
   \`\`\`ts
   const MOCK_MODE = false;
   const BASE_URL = 'https://your-api.com/api';
   \`\`\`

2. Your backend should implement:
   - `POST /api/simulate` → `{ jobId }`
   - `GET /api/simulate/{jobId}/status` → `ProgressMessage`
   - `GET /api/simulate/{jobId}/results` → `AttackResult`
   - `POST /api/simulate/{jobId}/cancel`

## Data Contracts

### Simulate Request
\`\`\`ts
interface SimulateRequest {
  modelFiles: { name: string; path?: string }[];
  attackFiles: { name: string; path?: string }[];
  attackType: "Label Flip" | "Manzantan" | "Backdoor" | "Cycle" | "Freeride" | "Scaling";
  intensityPercent: number;
  numClients: number;
  clients?: number[];
  userId?: string;
}
\`\`\`

### Progress Message
\`\`\`ts
interface ProgressMessage {
  jobId: string;
  stage: "preprocessing" | "split_clients" | "load_models" | "train_local_models" | "apply_attack" | "aggregate" | "evaluate" | "save_results";
  percent: number;
  message: string;
  timestamp: string;
}
\`\`\`

### Attack Result
\`\`\`ts
interface AttackResult {
  jobId: string;
  attack: string;
  intensityPercent: number;
  clientsAttacked: number[];
  metrics: {
    perClient: ClientMetric[];
    baselineGlobal: GlobalMetrics;
    attackedGlobal: GlobalMetrics;
  };
  plots?: { [key: string]: string };
  csvs?: { per_client_metrics?: string; global_metrics?: string };
  logs?: string[];
  verdict?: { label: "Safe" | "Warning" | "Compromised"; explanation: string };
  createdAt?: string;
}
\`\`\`

## Testing

\`\`\`bash
npm run test
\`\`\`

Test stubs provided for:
- `components/AuthForm.tsx`
- `components/ProgressBar.tsx`
- `components/AttackControls.tsx`

## Production Build

\`\`\`bash
npm run build
npm run preview
\`\`\`

## Authentication Flow

- Login/Signup pages validate email format and password length (≥8 chars)
- Mock mode stores auth token in `localStorage`
- Protected routes redirect to login if not authenticated
- All routes under `/upload`, `/progress`, `/results`, `/history` are protected

## Styling

- **Framework**: Tailwind CSS v3.5
- **Theme**: Dark mode by default with custom design tokens
- **Colors**: GitHub-inspired dark theme (background: #0f1117, primary: #1f6feb, accent: #58a6ff)
- **Responsive**: Mobile-first, fully responsive design

## Performance & Accessibility

- ✅ All interactive elements have `aria-label` and `aria-pressed` attributes
- ✅ Keyboard navigation support with tab indices
- ✅ Color-blind friendly palette
- ✅ High contrast text for readability
- ✅ Screen reader compatible

## Mock Simulator Details

The mock simulator generates:
- **Realistic F1 drops** based on attack type and intensity
- **Per-client perturbations** with attacked clients showing larger drops
- **Plausible metrics** (precision, recall, accuracy) aligned with F1 scores
- **Automated verdicts** (Safe/Warning/Compromised) based on thresholds

Attack type sensitivity factors:
- Label Flip: 15% base sensitivity
- Manzantan: 25%
- Backdoor: 35%
- Cycle: 20%
- Freeride: 10%
- Scaling: 18%

## Environment Variables

For real API mode, set:
- `REACT_APP_API_URL` - Your backend API base URL

## Support & Contributing

For issues or feature requests, open an issue in the repository.

---

Built with ❤️ using React 18, TypeScript 5, and Tailwind CSS 3.
