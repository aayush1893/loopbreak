# LoopBreak — CalmReceipt

**Stop rumination loops in 3 taps. Track your RRT.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)

Stop rumination loops in 3 taps. Track your RRT.

🔗 Live Demo: calm-loop-break.lovable.app  
🌐 Main: loopbreak.vercel.app  
📚 Prior Art Publication: https://doi.org/10.5281/zenodo.17625648

## What is LoopBreak?
LoopBreak is a privacy-first web app that helps you measure and shorten your Rumination Recovery Time (RRT)—the seconds between when you notice yourself spiraling and when you feel calm again.

Instead of just tracking how often you feel anxious, LoopBreak tracks how quickly you can self-regulate. Think of it like a fitness tracker, but for emotional regulation.

### Key Features
⏱️ RRT Tracking – Measure actual recovery time in seconds  
🎯 Three Evidence-Based Lanes:
- Ground – 5-4-3-2-1 sensory grounding + paced breathing
- Reframe – CBT-style cognitive reframing prompts
- Act – 2-minute behavioral activation micro-tasks
📊 Personal Analytics – See which techniques work best for YOU  
🤖 Auto Lane – Automatically suggests your most effective technique  
🔒 Privacy First – Everything stays on YOUR device (IndexedDB)  
📱 Works Offline – Progressive Web App (PWA)  
🖨️ QR Quick Access – Print QR codes for instant activation during distress  
🎨 Dark/Light Mode – System-aware theming

## Why RRT Matters
Research in affective neuroscience shows that recovery time (how long emotions last) is a better predictor of mental health than peak intensity (Davidson, 1998). Most mental health apps track frequency or severity—LoopBreak tracks the metric that actually matters: how fast you bounce back.

### Scientific Foundation
LoopBreak combines three evidence-based interventions:

1. Grounding + Paced Breathing → Activates parasympathetic nervous system (Zaccaro et al., 2018)  
2. Cognitive Reframing → Challenges distorted thinking patterns (Hofmann et al., 2012)  
3. Behavioral Activation → Interrupts avoidance cycles (Stein et al., 2021)

## Tech Stack
- Frontend: React 18 + TypeScript
- Styling: Tailwind CSS + shadcn/ui components
- Storage: IndexedDB (via idb) with localStorage fallback
- Routing: React Router v6
- Charts: Recharts
- PWA: Vite PWA plugin with service worker
- Export: jsPDF + html2canvas for receipt generation
- QR Codes: qrcode.react
- Build Tool: Vite 5
- Deployment: Lovable.app (currently)

## Getting Started

### Prerequisites
- Node.js 18+ (recommended via nvm)  
- npm or bun

### Installation
```bash
# Clone the repository
git clone https://github.com/aayush1893/loopbreak.git
cd loopbreak

# Install dependencies
npm install

# Start development server
npm run dev
```
How to Use
Quick Start

Start a Loop – Tap "Start Loop" when you notice rumination beginning

Choose Your Lane:

Ground – When feeling disconnected or overwhelmed

Reframe – For negative thought spirals

Act – When you need physical movement

Follow the Technique – Complete the guided activity (≤2 minutes)

Mark Calm – Tap "I'm Calmer" when you feel better

Log Your Experience – Rate your before/after distress (0-10)

Understanding Your Data

Each session creates a CalmReceipt:

interface ResetSession {
  session_id: string;
  started_at_iso: string;
  finished_at_iso: string;
  protocol_seconds: number;      // Always 90 (1.5 min protocol)
  tm_seconds: number | null;     // Your actual RRT (if you tapped "Calmer")
  completed_bool: boolean;
  lane: string;                  // "ground", "reframe", or "act"
  urge_delta_0to10: number | null;
  tags_json: string | null;
  app_version: string;
  device_info: string;
}

Features
Three Intervention Lanes

🏔️ Ground Lane

- 5 things you see

- 4 things you touch

- 3 things you hear

- 2 things you smell

- 1 slow breath (4-4-6 pattern)

🧠 Reframe Lane

- Identifies cognitive distortions

- Provides CBT-based prompts

- Guides you to write counter-thoughts

- Challenges: catastrophizing, mind-reading, etc.

⚡ Act Lane

- 2-minute micro-actions

- Simple physical tasks

- Interrupts mental loops with movement

- Examples: walk to sink, sip water, stretch

- Analytics Dashboard

- View your stats:

- Median RRT by lane

- Success rate (% completed)

- Urge reduction averages

- Weekly trends

- Personal effectiveness insights

- Privacy Features

✅ No accounts required

✅ No cloud storage

✅ No external analytics

✅ All data stays in your browser's IndexedDB

✅ Export your data anytime (CSV/PDF)

✅ One-click data deletion

Project Structure
loopbreak/
├── src/
│   ├── components/
│   │   ├── LoopTimer.tsx          # Main timer component
│   │   ├── ResetFlow.tsx          # Intervention flow UI
│   │   └── ui/                    # shadcn/ui components
│   ├── pages/
│   │   ├── Home.tsx               # Landing page
│   │   ├── Reset.tsx              # Main loop interface
│   │   ├── Stats.tsx              # Analytics dashboard
│   │   ├── Tutorial.tsx           # How-to guide
│   │   └── Privacy.tsx            # Privacy policy
│   ├── types/
│   │   └── calm-receipt.ts        # TypeScript definitions
│   ├── lib/
│   │   └── utils.ts               # Helper functions
│   ├── hooks/                     # Custom React hooks
│   └── App.tsx                    # Root component
├── public/
│   ├── manifest.json              # PWA manifest
│   ├── sw.js                      # Service worker
│   └── icons/                     # App icons
└── package.json

Roadmap
v1.0 (Current)

- Three-lane intervention system

- RRT tracking

- CalmReceipt storage (IndexedDB)

- Basic analytics

- PWA support

- QR code generation

- Dark/light mode

v1.1 (Planned)

- Custom domain deployment

- HRV integration (optional)

- Advanced analytics (trends, patterns)

- Customizable intervention content

- Multi-language support

- Accessibility improvements (WCAG 2.1 AA)

v2.0 (Future)

- Wearable integration (Apple Watch, Fitbit)

- Research mode (anonymous data sharing for studies)

- Therapist collaboration features

- Export to research-standard formats (BIDS, JSON-LD)

- Scientific Documentation

This system is documented in a defensive publication establishing prior art:

### 📌 Citation
If you use LoopBreak in research, please cite:

**Sisodia, A. (2025). LoopBreak: A Micro-Intervention System for Measuring Rumination Recovery Time (RRT). Zenodo. https://doi.org/10.5281/zenodo.17625648**


Key References

- Davidson, R. J. (1998). Cognition & Emotion, 12(3), 307–330.

- Hofmann, S. G., et al. (2012). Cognitive Therapy and Research, 36(5), 427–440.

- Stein, A. T., et al. (2021). Psychological Medicine, 51(9), 1491–1504.

- Zaccaro, A., et al. (2018). Frontiers in Human Neuroscience, 12, 353.

Contributing:

This is currently a personal research project, but contributions are welcome!

How to Contribute:

- Fork the repository

- Create a feature branch (git checkout -b feature/improvement)

- Make your changes

- Test thoroughly

- Commit with clear messages (git commit -am 'Add new feature')

- Push to your branch (git push origin feature/improvement)

- Open a Pull Request

Areas for Contribution:

🐛 Bug reports and fixes
✨ Feature suggestions
📚 Documentation improvements
🌍 Translations
♿ Accessibility enhancements
🧪 Test coverage

Privacy & Ethics:
- Data Practices

- No cloud storage – All data stays in your browser

- No accounts – Use completely anonymously

- No analytics – No tracking, no telemetry

- No third parties – No external services

- You own your data – Export or delete anytime

Medical Disclaimer:

⚠️ LoopBreak is NOT a substitute for professional mental health care.

This is a self-help tool for tracking and practicing emotion regulation techniques. If you're experiencing:

- Suicidal thoughts

- Severe anxiety or panic attacks

- Symptoms of depression

- Mental health crisis

- Please contact a professional:

- US 988 – Suicide & Crisis Lifeline

- US 1-800-662-4357 – SAMHSA National Helpline

🌍 International Crisis Lines


License

Code: MIT License – See LICENSE for details
Documentation: CC BY 4.0 (Attribution)

Contact

Aayush Sisodia
📧 aayushsisodia19@gmail.com

🐙 GitHub: [@aayush1893](https://github.com/aayush1893)
🔗 LinkedIn [(update with your profile)](https://www.linkedin.com/in/aayushsisodia/)

Acknowledgments

Built with Lovable for rapid prototyping and deployed via Vercel

UI components from shadcn/ui

Inspired by affective neuroscience research on emotional recovery time

Thanks to the open-source community for the amazing tools

**Built with ❤️ for better mental health**

*"The goal isn't to never ruminate—it's to recover faster."*
