document.addEventListener('DOMContentLoaded', () => {
    const rawInput = document.getElementById('rawInput');
    const statusEl = document.getElementById('status');
    const btnSummarize = document.getElementById('btnSummarize');
    const btnActionize = document.getElementById('btnActionize');
    const btnProofread = document.getElementById('btnProofread');
    const btnClear = document.getElementById('btnClear');

    const setStatus = (msg = '') => { statusEl.textContent = msg; };

    btnSummarize.addEventListener('click', () => {
        const len = (rawInput.value || '').trim().length;
        console.log('[Summarize]', len);
        setStatus('Summarize clicked. (Not implemented yet)');
    });

    btnActionize.addEventListener('click', () => {
        const len = (rawInput.value || '').trim().length;
        console.log('[Refine]', len);
        setStatus('Refine clicked. (Not implemented yet)');
    });

    btnProofread.addEventListener('click', () => {
        const len = (rawInput.value || '').trim().length;
        console.log('[Proofread]', len);
        setStatus('Proofread clicked. (Not implemented yet)');
    });

    btnClear.addEventListener('click', () => {
        rawInput.value = '';
        setStatus('Cleared.');
    });

    setStatus('Ready.');

    // --- Stage 2: Output tabs + copy/save ---

    // Tab switching

    function showTab(name) {
        document.querySelectorAll('.tab').forEach(t => {
            const on = t.dataset.tab === name;
            t.classList.toggle('is-active', on);
            t.setAttribute('aria-selected', String(on));
        });
        document.querySelectorAll('[data-panel]').forEach(p => {
            const on = p.dataset.panel === name;
            p.toggleAttribute('hidden', !on);
            p.classList.toggle('is-active', on);
        });
    }

    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            showTab(tab.dataset.tab);
        });
    });

    // Copy/Save for the active panel

});