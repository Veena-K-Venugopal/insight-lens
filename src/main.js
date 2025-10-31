document.addEventListener('DOMContentLoaded', () => {

    const rawInput = document.getElementById('rawInput');
    const statusEl = document.getElementById('status');
    const btnSummarize = document.getElementById('btnSummarize');
    const btnActionize = document.getElementById('btnActionize');
    const btnProofread = document.getElementById('btnProofread');
    const btnClear = document.getElementById('btnClear');

    const tabs = {
        summary: { btn: document.getElementById('tabbtn-summary'), panel: document.getElementById('tabSummary'), out: document.getElementById('outSummary') },
        bullets: { btn: document.getElementById('tabbtn-bullets'), panel: document.getElementById('tabBullets'), out: document.getElementById('outBullets') },
        proof: { btn: document.getElementById('tabbtn-proofread'), panel: document.getElementById('tabProofread'), out: document.getElementById('outProofread') },
    };
    const btnCopy = document.getElementById('btnCopy');
    const btnSave = document.getElementById('btnSave');

    const setStatus = (msg = '') => { statusEl.textContent = msg; };

    btnSummarize.addEventListener('click', () => {
        const src = (rawInput.value || '').trim();
        const len = src.length;
        console.log('[Summarize]', len);
        tabs.summary.out.textContent = src ? `- Summary (stub) -\nLength: ${len} chars\n\n${src.slice(0, 400)}${len > 400 ? '...' : ''} ` : '';
        activateTab('summary');
        setStatus('Summarize clicked. (Stub: populated Summary tab)');
    });

    btnActionize.addEventListener('click', () => {
        const src = (rawInput.value || '').trim();
        const len = src.length;
        const lines = src.split(/\n+/).map(s => s.trim()).filter(Boolean);
        console.log('[Refine]', len);
        const bullets = lines.slice(0, 5).map((l, i) => `• (${i + 1}) ${l.slice(0, 140)}${l.length > 140 ? '…' : ''}`);
        tabs.bullets.out.textContent = bullets.length ? bullets.join('\n') : '';
        activateTab('bullets');
        setStatus('Refine clicked. (Stub: populated Bullets tab)');
    });

    btnProofread.addEventListener('click', () => {
        const src = (rawInput.value || '').trim();
        const len = src.length;
        console.log('[Proofread]', len);
        const proof = src ? src.split('\n').map((l, i) => `${String(i + 1).padStart(3, ' ')} | ${l}`).join('\n') : '';
        tabs.proof.out.textContent = proof;
        activateTab('proof');
        setStatus('Proofread clicked. (Stub: populated Proofread tab)');
    });

    btnClear.addEventListener('click', () => {
        rawInput.value = '';
        tabs.summary.out.textContent = '';
        tabs.bullets.out.textContent = '';
        tabs.proof.out.textContent = '';
        setStatus('Cleared.');
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
            setStatus('Nothing to copy.');
            return;
        }
        try {
            await navigator.clipboard.writeText(content);
            setStatus(`Copied ${content.length} chars from ${t}.`);
        } catch (err) {
            console.error('Clipboard failed', err);
            setStatus('Failed to copy (clipboard not available?).');
        }
    });

    btnSave.addEventListener('click', () => {
        const t = currentTab();
        const content = tabs[t].out.textContent || '';
        if (!content) {
            setStatus('Nothing to save. ');
            return;
        }
        const payload = {
            tab: t,
            createdAt: new Date().toISOString(),
            preview: content.slice(0, 120),
            length: content.length
        };
        console.log('[Save stub]', payload);
        setStatus(`Saved (stub) "${t}" - ${payload.length} chars.`);
    });

    setStatus('Ready.');

    activateTab('summary');
});