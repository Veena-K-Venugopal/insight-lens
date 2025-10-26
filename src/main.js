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
});