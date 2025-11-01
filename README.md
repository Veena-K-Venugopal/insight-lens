# InsightLens

**InsightLens** is a lightweight web app built for the **Google Chrome Built-in AI Challenge 2025**.  
It transforms pasted receipts, invoices, or order emails into concise 5-bullet action briefs — powered by Chrome’s built-in AI APIs: Prompt, Summarizer, and Proofreader.

---

## Live Demo

🔗 [Try InsightLens on GitHub Pages](link)

---

## Hackathon Submission

🔗 [Devpost Submission – Google Chrome Built-in AI Challenge 2025](link)

---


✅ Stage 1 – Base UI & Local Testing  
✅ Stage 2 – Output Tabs (Summary / Brief / Proofreader) + Copy/Save Placeholders  
✅ Stage 3 – Input Validation & Dynamic Status System  
✅ Stage 4 – Save & Copy Persistence (LocalStorage Across Sessions)
✅ Stage 5 – Simulated Chrome AI Integration (Mock Async API)
✅ Stage 6 – Real Chrome AI Integration (Final Submission)
 • Implements Prompt API and Summarizer with graceful fallbacks
 • Detects on-device model availability and download progress
 • Adds busy-state management and consistent status feedback
 • Maintains autosave / restore / manual save workflow
 • Final submission build for Google Chrome Built-in AI Challenge 2025
---

## Project Structure

<pre>insightlens/
├─ public/
│  └─ index.html          # main UI
├─ src/
│  ├─ styles.css          # styling & dark theme
│  └─ main.js             # Chrome AI integration + logic
└─ README.md
</pre>

---

### Tech Stack
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript  
- **AI Layer**: Chrome Built-in AI APIs (Summarizer, Prompt, Proofreader)
- **Infra**: No backend — lightweight, privacy-friendly, on-device processing 
- **Deployment**: GitHub Pages or Netlify  

---

### How to Run Locally
1. Open the project in VS Code  
2. Right-click `public/index.html` → **Open with Live Server**  
3. Visit [http://127.0.0.1:5500/public/index.html](http://127.0.0.1:5500/public/index.html)  
4. Paste text → click **Summarize**, **Refine**, or **Proofread**
5. Observe status messages (Ready / Summarizing… / Done.) and tab outputs

---

### Roadmap
| Stage | Goal | Status |
|-------|------|--------|
| 1 | Base UI + Local Server | ✅ Complete |
| 2 | Output Tabs + Copy/Save Placeholders | ✅ Complete |
| 3 | Input Validation + Status Feedback | ✅ Complete |
| 4 | Save / Export / localStorage Persistence | ✅ Complete |
| 5 | Simulated Chrome AI API Integration (Mock API) | ✅ Complete |
| 6 | Real Chrome AI Integration | ✅ Complete |

---

### Inspiration
Managing digital receipts and order confirmations can get chaotic.  
**InsightLens** helps turn that clutter into **actionable insights** using Chrome’s native AI.
All within your browser, with no data ever leaving your device..

---

### Author
**Veena K. Venugopal**  
[GitHub](https://github.com/Veena-K-Venugopal) 

---

### Releases
- **v1-stage1:** Core UI + Local Testing  
- **v2-stage2:** Output Tabs + Copy/Save Placeholders  
- **v3-stage3:** Input Validation + Status Feedback  
- **v4-stage4:** Save & Copy Persistence (LocalStorage)
- **v5-stage5:** Simulated Chrome AI Integration
- **v6-stage6:** Real Chrome AI Integration