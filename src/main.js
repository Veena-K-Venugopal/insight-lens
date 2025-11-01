const STORAGE_KEYS = { RAW: 'IL_RAW', OUT: 'IL_OUT' };

function saveState(raw, outs) {
    try {
        if (typeof raw === 'string') localStorage.setItem(STORAGE_KEYS.RAW, raw);
        if (outs && typeof outs === 'object') {
            localStorage.setItem(STORAGE_KEYS.OUT, JSON.stringify(outs));
        }
    } catch (err) {
        console.warn('localStorage save failed', err);
    }
}

function loadState() {
    const raw = localStorage.getItem(STORAGE_KEYS.RAW) || '';
    let outs = { summary: '', bullets: '', proofread: '' };
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.OUT) || '{}');
        outs = { ...outs, ...parsed };
    } catch { }
    return { raw, outs };
}

async function copyText(txt, notify = () => { }) {
    try {
        await navigator.clipboard.writeText(txt || '');
        notify('Copied to clipboard', 'success');
    } catch {
        const ta = document.createElement('textarea');
        ta.value = txt || '';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        notify('Copied to clipboard.', 'success');
    }
}

// --- Stage 6: Chrome AI adapter (Prompt API + Summarizer) ---
async function getPromptAvailability(options = {}) {
    try {
        if (!('LanguageModel' in self)) return 'unavailable';
        const avail = await LanguageModel.availability(options);
        if (avail === 'readily') return 'available';
        if (avail === 'after-download') return 'downloadable';
        return 'unavailable';
    } catch { return 'unavailable'; }
}

async function getSummarizerAvailability(options = {}) {
    try {
        if (!('Summarizer' in self)) return 'unavailable';
        const avail = await Summarizer.availability(options);
        if (avail === 'readily') return 'available';
        if (avail === 'after-download') return 'downloadable';
        return 'unavailable';
    } catch { return 'unavailable'; }
}

async function createPromptSession(opts = {}) {
    return await LanguageModel.create({
        expectedInputs: [{ type: 'text', languages: ['en'] }],
        expectedOutputs: [{ type: 'text', languages: ['en'] }],
        ...opts
    });
}

async function createSummarizer(opts = {}) {
    return await Summarizer.create({
        type: 'key-points',
        format: 'markdown',
        length: 'medium',
        monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
                if (typeof setStatus === 'function') {
                    setStatus(`Downloading on-device model… ${Math.round((e.loaded || 0) * 100)}%`);
                }
            });
        },
        ...opts
    });
}

// Core runner used by button handlers
async function runWithChromeAI(kind, text, { context = '' } = {}) {
    const promptAvail = await getPromptAvailability();
    if (promptAvail === 'available') {
        const session = await createPromptSession();
        const prompts = {
            summarize: `Summarize the input into 5 concise markdown bullet points.\n\nInput:\n${text}`,
            refine: `Rewrite the input as 5 crisp, action-focused bullets (keep key entities, numbers, and dates). Output markdown bullets only.\n\nInput:\n${text}`,
            proofread: `Proofread the input. Fix grammar/clarity, keep meaning and tone. Return corrected text only.\n\nInput:\n${text}`
        };
        return await session.prompt(prompts[kind] ?? text);
    }
    if (promptAvail === 'downloadable') {
        if (typeof setStatus === 'function') setStatus('Preparing on-device model (download required)…');
    }

    if (kind === 'summarize') {
        const sumAvail = await getSummarizerAvailability();
        if (sumAvail === 'available' || sumAvail === 'downloadable') {
            const summarizer = await createSummarizer();
            return await summarizer.summarize(text, { context });
        }
    }

    if (!('LanguageModel' in self) && ('ai' in self) && typeof window.ai?.createTextSession === 'function') {
        const s = await window.ai.createTextSession();
        return await s.prompt(text);
    }

    throw new Error('AI_UNAVAILABLE');
}


document.addEventListener('DOMContentLoaded', () => {

    const rawInput = document.getElementById('rawInput');
    const statusMsg = document.getElementById('statusMsg');
    const btnSummarize = document.getElementById('btnSummarize');
    const btnActionize = document.getElementById('btnActionize');
    const btnProofread = document.getElementById('btnProofread');
    const btnClear = document.getElementById('btnClear');
    const btnCopy = document.getElementById('btnCopy');
    const btnSave = document.querySelector('.input-panel #btnSave');

    const tabs = {
        summary: { btn: document.getElementById('tabbtn-summary'), panel: document.getElementById('tabSummary'), out: document.getElementById('outSummary') },
        bullets: { btn: document.getElementById('tabbtn-bullets'), panel: document.getElementById('tabBullets'), out: document.getElementById('outBullets') },
        proof: { btn: document.getElementById('tabbtn-proofread'), panel: document.getElementById('tabProofread'), out: document.getElementById('outProofread') },
    };

    // busy gate (disable buttons during async work)
    const container = document.querySelector('.container') || document.body;
    const allActionButtons = [btnSummarize, btnActionize, btnProofread, btnClear, btnCopy, btnSave].filter(Boolean);
    let BUSY = false;
    function setBusy(flag, msg = '') {
        BUSY = !!flag;
        allActionButtons.forEach(b => b.disabled = BUSY);
        container.setAttribute('aria-busy', String(BUSY));
        if (flag && msg) {
            setStatus(msg, 'info');
        }
    }

    // status helper
    function setStatus(text, type = 'info') {
        if (!statusMsg) return;
        statusMsg.textContent = text;
        statusMsg.classList.remove('info', 'success', 'error');
        statusMsg.classList.add(type);
    }

    // restore state
    const { raw, outs } = loadState();
    if (raw) rawInput.value = raw;
    if (outs.summary) tabs.summary.out.textContent = outs.summary;
    if (outs.bullets) tabs.bullets.out.textContent = outs.bullets;
    if (outs.proofread) tabs.proof.out.textContent = outs.proofread;
    if (raw || outs.summary || outs.bullets || outs.proofread) {
        setStatus('Restored last session.', 'success');
    }

    // input validator
    function getInputOrFlag() {
        const v = rawInput.value.trim();
        if (!v) {
            rawInput.classList.add('invalid', 'shake');
            setStatus('Please paste some text first.', 'error');
            setTimeout(() => rawInput.classList.remove('shake'), 300);
            return null;
        }
        rawInput.classList.remove('invalid');
        return v;
    }

    //input listener + autosave
    let autosaveTimer;
    rawInput.addEventListener('input', () => {
        if (rawInput.value.trim()) {
            rawInput.classList.remove('invalid');
            setStatus('Ready.', 'info');
        }
        clearTimeout(autosaveTimer);
        autosaveTimer = setTimeout(() => {
            saveState(rawInput.value);
        }, 300);
    });

    function activateTab(name) {
        Object.entries(tabs).forEach(([key, { btn, panel }]) => {
            const isActive = key === name;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            panel.classList.toggle('hidden', !isActive);
        });
    }

    function currentTab() {
        if (tabs.summary.btn.classList.contains('active')) return 'summary';
        if (tabs.bullets.btn.classList.contains('active')) return 'bullets';
        return 'proof';
    }

    // wire tab buttons (define then wire — keeps helpers and wiring together)
    Object.entries(tabs).forEach(([key, { btn }]) => {
        if (btn) btn.addEventListener('click', () => activateTab(key));
    });

    // button handlers
    btnSummarize.addEventListener('click', async () => {
        const src = getInputOrFlag();
        if (!src || BUSY) return;
        setBusy(true, 'Summarizing...');

        try {
            const out = await runWithChromeAI('summarize', src);
            tabs.summary.out.textContent = out;
            activateTab('summary');
            saveState(undefined, {
                summary: tabs.summary.out.textContent || '',
                bullets: tabs.bullets.out.textContent || '',
                proofread: tabs.proof.out.textContent || '',
            });
            setStatus('Done.', 'success');
        } catch (err) {
            console.error(err);
            setStatus(err?.message === 'AI_UNAVAILABLE'
                ? 'AI unavailable on this device/browser.'
                : 'Failed to summarize.', 'error');
        } finally {
            setBusy(false);
        }
    });

    btnActionize.addEventListener('click', async () => {
        const src = getInputOrFlag();
        if (!src || BUSY) return;
        setBusy(true, 'Generating 5 bullets...');

        try {
            const out = await runWithChromeAI('refine', src);
            tabs.bullets.out.textContent = out;
            activateTab('bullets');
            saveState(undefined, {
                summary: tabs.summary.out.textContent || '',
                bullets: tabs.bullets.out.textContent || '',
                proofread: tabs.proof.out.textContent || '',
            });
            setStatus('Done.', 'success');
        } catch (err) {
            console.error(err);
            setStatus(err?.message === 'AI_UNAVAILABLE'
                ? 'AI unavailable on this device/browser.'
                : 'Failed to refine.', 'error');
        } finally {
            setBusy(false);
        }
    });

    btnProofread.addEventListener('click', async () => {
        const src = getInputOrFlag();
        if (!src || BUSY) return;
        setBusy(true, 'Proofreading...');

        try {
            const out = await runWithChromeAI('proofread', src);
            tabs.proof.out.textContent = out;
            activateTab('proof');
            saveState(undefined, {
                summary: tabs.summary.out.textContent || '',
                bullets: tabs.bullets.out.textContent || '',
                proofread: tabs.proof.out.textContent || '',
            });
            setStatus('Done.', 'success');
        } catch (err) {
            console.error(err);
            setStatus(err?.message === 'AI_UNAVAILABLE'
                ? 'AI unavailable on this device/browser.'
                : 'Failed to proofread.', 'error');
        } finally {
            setBusy(false);
        }
    });

    btnClear.addEventListener('click', () => {
        rawInput.value = '';
        tabs.summary.out.textContent = '';
        tabs.bullets.out.textContent = '';
        tabs.proof.out.textContent = '';
        setStatus('Cleared. Paste new text to begin.', 'info');
        saveState('', {
            summary: '',
            bullets: '',
            proofread: '',
        });
    });


    btnCopy.addEventListener('click', async () => {
        const t = currentTab();
        const content = tabs[t].out.textContent || '';
        if (!content) return setStatus('Nothing to copy.', 'error');

        await copyText(content, (m, kind = 'success') => setStatus(m, kind));
        setStatus(`Copied ${content.length} chars from ${t}.`, 'success');
    });

    btnSave.addEventListener('click', () => {
        const outs = {
            summary: tabs.summary.out.textContent || '',
            bullets: tabs.bullets.out.textContent || '',
            proofread: tabs.proof.out.textContent || '',
        }
        saveState(rawInput.value, outs);
        setStatus('Saved.', 'success');
    });

    setStatus('Ready.', 'info');

    activateTab('summary');
});