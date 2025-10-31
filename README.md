# InsightLens

**InsightLens** is a lightweight web app built for the **Google Chrome Built-in AI Challenge 2025**.  
It transforms pasted receipts, invoices, or order emails into concise 5-bullet action briefs — powered by Chrome’s built-in AI APIs: Prompt, Summarizer, and Proofreader.

---

✅ Stage 1 – Base UI & Local Testing  
✅ Stage 2 – Output Tabs (Summary / Brief / Proofreader) + Copy/Save Placeholders  
✅ **Stage 3 – Input Validation & Dynamic Status System**  
 • `aria-live` status region for accessible feedback  
 • `setStatus()` helper with `info / success / error` states  
 • Red outline + shake animation for invalid input  
 • Updated handlers with progress messages (“Summarizing… → Done.”)  
 • Colored feedback for Copy / Save actions    

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
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript  
- **AI Layer**: Chrome Built-in AI APIs *(Summarizer, Prompt, Proofreader – upcoming)*  
- **Infra**: No backend — lightweight, privacy-friendly  
- **Deployment**: GitHub Pages or Netlify  

---

### How to Run Locally
1. Open the project in VS Code  
2. Right-click `public/index.html` → **Open with Live Server**  
3. Visit [http://127.0.0.1:5500/public/index.html](http://127.0.0.1:5500/public/index.html)  
4. Paste text → click **Summarize**, **Refine**, or **Proofread**
5. Observe status messages (Ready / Summarizing… / Done.) and colored feedback below buttons

---

### Roadmap
| Stage | Goal | Status |
|-------|------|--------|
| 1 | Base UI + Local Server | ✅ Complete |
| 2 | Output Tabs + Copy/Save Placeholders | ✅ Complete |
| 3 | Input Validation + Status Feedback | ✅ Complete |
| 4 | Save / Export / localStorage Persistence | ⏳ Next |
| 5 | Chrome AI API Integration (Summarizer / Proofreader) | ⏳ Planned |
| 6 | Deployment + Final Polish | ⏳ Planned |

---

### Inspiration
Managing digital receipts and order confirmations can get chaotic.  
InsightLens helps turn that clutter into **actionable insights** using Chrome’s native AI.
All within your browser, with no data ever leaving your device..

---

### Author
**Veena K. Venugopal**  
👩‍💻 [GitHub](https://github.com/Veena-K-Venugopal) 



---

### Releases
- **v1-stage1:** Core UI + Local Testing  
- **v2-stage2:** Output Tabs + Copy/Save Placeholders  
- **v3-stage3:** Input Validation + Status Feedback  