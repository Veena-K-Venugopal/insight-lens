# InsightLens

**InsightLens** is a lightweight web app built for the **Google Chrome Built-in AI Challenge 2025**.  
It transforms pasted receipts, invoices, or order emails into concise 5-bullet action briefs — powered by Chrome’s built-in AI APIs: Prompt, Summarizer, and Proofreader.

---

## Current Stage: 1 — Core UI & Local Testing
✅ Base layout (textarea + buttons + status line)  
✅ Buttons wired: Summarize / Refine (5 bullets) / Proofread / Clear  
✅ Local server tested via **VS Code Live Server**  
🛠️ Next: Add output tabs (Summary / Brief / Proofreader) with copy/save placeholders  

---

## Project Structure

<pre>insightlens/
├─ public/
│  └─ index.html          # main UI
├─ src/
│  ├─ styles.css          # styling & dark theme
│  └─ main.js             # button wiring + status logic
└─ README.md
</pre>

---

### Tech Stack
- Frontend: HTML5 + CSS3 + Vanilla JavaScript  
- AI Layer: Chrome Built-in AI APIs *(Summarizer, Prompt, Proofreader – upcoming)*  
- Infra: No backend — lightweight, privacy-friendly  
- Deployment: GitHub Pages or Netlify  

---

### How to Run Locally
1. Open the project in VS Code  
2. Right-click `public/index.html` → **Open with Live Server**  
3. Visit [http://127.0.0.1:5500/public/index.html](http://127.0.0.1:5500/public/index.html)  
4. Paste text → test the buttons → see status updates in console
5. Watch status updates and console logs in DevTools

---

### Roadmap
| Stage | Goal | Status |
|-------|------|--------|
| 1 | Base UI + Local Server | ✅ Complete |
| 2 | Output Tabs (Summary / Brief / Proofreader) | 🔜 In Progress |
| 3 | Integrate Chrome AI APIs (Summarizer / Proofreader) | ⏳ |
| 4 | Save / Export / Deploy to Netlify | ⏳ |

---

### Inspiration
Managing digital receipts and order confirmations can get chaotic.  
InsightLens helps turn that clutter into **actionable insights** using Chrome’s native AI.
All within your browser, with no data ever leaving your device..

---

### Author
**Veena K. Venugopal**  
👩‍💻 [GitHub](https://github.com/Veena-K-Venugopal) • 🌐 [Portfolio (coming soon)](#)

---

