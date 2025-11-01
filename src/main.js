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
            // keep status calm
        }, 300);
    });

    // button handlers
    btnSummarize.addEventListener('click', () => {
        const src = getInputOrFlag();
        if (!src) return;
        setStatus('Summarizing...', 'info');

        setTimeout(() => {
            const len = src.length;
            console.log('[Summarize]', len);
            tabs.summary.out.textContent = src ? `- Summary (stub) -\nLength: ${len} chars\n\n${src.slice(0, 400)}${len > 400 ? '...' : ''} ` : '';
            activateTab('summary');
            saveState(undefined, {
                summary: tabs.summary.out.textContent || '',
                bullets: tabs.bullets.out.textContent || '',
                proofread: tabs.proof.out.textContent || '',
            })
            setStatus('Done.', 'success');
        }, 600);
    });

    btnActionize.addEventListener('click', () => {
        const src = getInputOrFlag();
        if (!src) return;
        setStatus('Refining...', 'info');

        setTimeout(() => {
            const len = src.length;
            const lines = src.split(/\n+/).map(s => s.trim()).filter(Boolean);
            console.log('[Refine]', len);
            const bullets = lines.slice(0, 5).map((l, i) => `• (${i + 1}) ${l.slice(0, 140)}${l.length > 140 ? '...' : ''}`);
            tabs.bullets.out.textContent = bullets.length ? bullets.join('\n') : '';
            activateTab('bullets');

            saveState(undefined, {
                summary: tabs.summary.out.textContent || '',
                bullets: tabs.bullets.out.textContent || '',
                proofread: tabs.proof.out.textContent || '',
            })

            setStatus('Done.', 'success');
        }, 600);
    });

    btnProofread.addEventListener('click', () => {
        const src = getInputOrFlag();
        if (!src) return;
        setStatus('Proofreading...', 'info');

        setTimeout(() => {
            const len = src.length;
            console.log('[Proofread]', len);
            const proof = src ? src.split('\n').map((l, i) => `${String(i + 1).padStart(3, ' ')} | ${l}`).join('\n') : '';
            tabs.proof.out.textContent = proof;
            activateTab('proof');

            saveState(undefined, {
                summary: tabs.summary.out.textContent || '',
                bullets: tabs.bullets.out.textContent || '',
                proofread: tabs.proof.out.textContent || '',
            })
            setStatus('Done.', 'success');
        }, 600);
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

    // --- Stage 2: Output tabs + copy/save ---

    function activateTab(name) {
        Object.entries(tabs).forEach(([key, { btn, panel }]) => {
            const isActive = key === name;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            panel.classList.toggle('hidden', !isActive);
        });
    }

    tabs.summary.btn.addEventListener('click', () => activateTab('summary'));
    tabs.bullets.btn.addEventListener('click', () => activateTab('bullets'));
    tabs.proof.btn.addEventListener('click', () => activateTab('proof'));

    function currentTab() {
        if (tabs.summary.btn.classList.contains('active')) return 'summary';
        if (tabs.bullets.btn.classList.contains('active')) return 'bullets';
        return 'proof';
    }

    btnCopy.addEventListener('click', async () => {
        const t = currentTab();
        const content = tabs[t].out.textContent || '';
        if (!content) {
            setStatus('Nothing to copy.', 'error');
            return;
        }
        try {
            await navigator.clipboard.writeText(content);
            setStatus(`Copied ${content.length} chars from ${t}.`, 'success');
        } catch (err) {
            console.error('Clipboard failed', err);
            setStatus('Failed to copy (clipboard not available?).', 'error');
        }
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