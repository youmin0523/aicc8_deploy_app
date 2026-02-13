const PptxGenJS = require('pptxgenjs');

const createPresentation = async () => {
  let pres = new PptxGenJS();

  // Define Colors (Hex without #)
  const DARK_BG = '121212';
  const TEXT_WHITE = 'FFFFFF';
  const ACCENT_BLUE = '4A90E2';
  const ACCENT_EMERALD = '50C878';

  // Define Slide Master
  pres.defineSlideMaster({
    title: 'MASTER_SLIDE',
    background: { color: DARK_BG },
    objects: [
      {
        placeholder: {
          options: {
            name: 'title',
            type: 'title',
            x: 0.5,
            y: 0.5,
            w: 9.0,
            h: 1.0,
            align: 'left',
            fontSize: 32,
            color: ACCENT_BLUE,
            bold: true,
          },
          text: 'Slide Title',
        },
      },
      {
        placeholder: {
          options: {
            name: 'body',
            type: 'body',
            x: 0.5,
            y: 1.5,
            w: 9.0,
            h: 5.5,
            fontSize: 18,
            color: TEXT_WHITE,
            align: 'left',
            // bullet: { type: "check", code: "2022" }, // Optional
          },
          text: 'Slide Body',
        },
      },
    ],
  });

  // Helper function to add slide
  const addSlide = (title, contentLines) => {
    let slide = pres.addSlide({ masterName: 'MASTER_SLIDE' });
    slide.addText(title, { placeholder: 'title' });

    // Add content as text with bullets
    let formattedText = contentLines.map((line) => ({
      text: line,
      options: {
        bullet: true,
        breakLine: true,
        color: TEXT_WHITE,
        fontSize: 18,
      },
    }));
    slide.addText(formattedText, { placeholder: 'body' });
  };

  // --- Slide 1: Title Slide ---
  let slide1 = pres.addSlide();
  slide1.background = { color: DARK_BG };
  slide1.addText('AICC8 Deploy App: V2 Upgrade Project', {
    x: 1,
    y: 2,
    w: 8,
    h: 1,
    fontSize: 40,
    color: ACCENT_BLUE,
    bold: true,
    align: 'center',
  });
  slide1.addText(
    'Next-Generation Task Management System\nProject Report & Technical Overview',
    {
      x: 1,
      y: 3.5,
      w: 8,
      h: 1.5,
      fontSize: 24,
      color: TEXT_WHITE,
      align: 'center',
    },
  );

  // --- Slide 2: Project Overview ---
  addSlide('1. Project Overview', [
    'Mission: Upgrade existing V1 Task Manager to a Premium V2 Dashboard.',
    'Key Goal: Gamification, Enhanced UX, and Data Integrity.',
    "Core Concept: 'Space Mission' theme with immersive animations.",
    'Architecture: Hybrid System supporting both V1 and V2 data structures simultaneously.',
  ]);

  // --- Slide 3: Key Features (V2) ---
  addSlide('2. Key Features (V2 Dashboard)', [
    'DASHBOARD & UX:',
    '  - Dark Mode & Glassmorphism Design System.',
    '  - Intro: Cinematic Space Launch Animation (Zoom-in effect).',
    '  - Version Loader: Seamless transition between V1 and V2.',
    '',
    'TASK MANAGEMENT:',
    '  - Neon Orb System: Visual status indicators (Today/Tomorrow).',
    '  - Audit History: Detailed log of value changes (Title, Desc, Status).',
    '  - Integrated Calendar: Sunday-start layout with drag-free navigation.',
  ]);

  // --- Slide 4: Technical Stack ---
  addSlide('3. Technical Stack', [
    'FRONTEND:',
    '  - Framework: React 19 + Vite',
    '  - State Management: Redux Toolkit (Slices for Auth, Tasks, Modals)',
    '  - Styling: TailwindCSS + Vanilla CSS (No Styled-Components)',
    '  - Libraries: react-calendar, react-toastify, react-icons, react-oauth/google',
    '',
    'BACKEND:',
    '  - Runtime: Node.js + Express',
    '  - Database: PostgreSQL (Hybrid Schema: tasks & tasks_v2)',
    '  - Security: Google OAuth 2.0 Integration',
  ]);

  // --- Slide 5: System Architecture ---
  addSlide('4. System Architecture', [
    'HYBRID DATA MODEL:',
    "  - V1 Compatibility: Legacy 'tasks' table retained.",
    "  - V2 Innovation: New 'tasks_v2' table with 'categoryid', 'updated_at'.",
    "  - Unified View: 'UNION ALL' query to display V1 & V2 tasks in one list.",
    '',
    'DATA FLOW:',
    '  - User Action -> Redux Thunk (Async) -> API Controller -> PostgreSQL.',
    "  - Audit Log: 'logTaskChange' function tracks every modification.",
  ]);

  // --- Slide 6: Troubleshooting & Improvements ---
  addSlide('5. Major Troubleshooting History', [
    "Rendering: Fixed 'react-calendar' v6 blank screen issue by switching to 'gregory' type.",
    "API: Solved 'Empty Body' issue in PATCH requests by fixing JSON stringification.",
    "Stability: Implemented Fail-Safe logic for Audit Logging (Log failure doesn't block Task update).",
    "UX: Resolved 'Black Screen' on version transition with persistent Overlay Loader.",
  ]);

  // --- Slide 7: Future Roadmap ---
  addSlide('6. Future Roadmap', [
    'Mobile Optimization: Fully responsive layout for mobile devices.',
    'Advanced Analytics: Productivity charts based on History data.',
    'Team Collaboration: Shared workspaces and task delegation.',
    'AI Integration: Smart task suggestions and auto-categorization.',
  ]);

  // Save Presentation to root dir
  const path = require('path');
  const outputPath = path.join(__dirname, '..', 'AICC8_Project_Report_v2.pptx');

  try {
    await pres.writeFile({ fileName: outputPath });
    console.log(`Presentation saved successfully as ${outputPath}`);
  } catch (err) {
    console.error('Error saving presentation:', err);
  }
};

createPresentation();
