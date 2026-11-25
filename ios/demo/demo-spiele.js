// Lumvero-Spiele-Rundgang (seitenuebergreifend): Einfuehrung, Spieleliste, Reversi gegen die KI, zurueck, Taeglich/Erfolge/Profil.
(function () {
  const D = window.DEMO;
  let step = +(sessionStorage.getItem('demoStep') || 0);
  const setStep = (n) => sessionStorage.setItem('demoStep', String(n));
  const vis = (b) => b.getClientRects().length;
  const btnText = (re) => [...document.querySelectorAll('button')].filter((b) => vis(b) && re.test(b.innerText.trim())).pop();
  const isGame = /\/games\/reversi\//.test(location.pathname);

  if (!isGame && step === 0) {
    D.run([
      () => D.wait(1500),
      async () => { for (let i = 0; i < 5; i++) { const b = document.querySelector('.ch-btn--primary'); if (!b || !vis(b)) break; await D.tap(b, { after: 1300 }); } },
      () => D.wait(800),
      () => D.scroll(600), () => D.scroll(600), () => D.scroll(-1200),
      async () => { const b = btnText(/^(Brett|Board)$/); if (b) await D.tap(b, { after: 1500 }); },
      () => D.scroll(300),
      async () => { setStep(1); const c = document.querySelector('.ch-game[aria-label="Reversi"]'); if (c) await D.tap(c, { after: 3000 }); },
    ], 2500);
  } else if (isGame && step === 1) {
    const sess = () => { try { return JSON.parse(localStorage.getItem('chogan.reversi.session')).s; } catch (e) { return null; } };
    const E = ReversiEngineFactory();
    const cellPt = (i) => { const cv = document.querySelector('canvas'); const r = cv.getBoundingClientRect(); const pad = Math.round(r.width * 0.025), c = (r.width - pad * 2) / 8; return { dx: pad + c * (i % 8 + 0.5), dy: pad + c * (Math.floor(i / 8) + 0.5) }; };
    const initial = [19, 26, 37, 44];
    const myMove = async () => {
      // warten, bis Schwarz (Mensch) am Zug ist
      for (let t = 0; t < 40; t++) { const s = sess(); if (!s || (s.turn === 1 && !document.querySelector('.rv-thinking'))) break; await D.wait(300); }
      const s = sess(); const board = s ? s.board : null; const turn = s ? s.turn : 1;
      let moves = board ? [...Array(64).keys()].filter((i) => !board[i] && E.flipsFor(board, i, turn).length) : initial;
      if (!moves.length) return;
      // bevorzugt Ecken/Raender, sonst die meisten Umdrehungen
      const score = (i) => ([0, 7, 56, 63].includes(i) ? 100 : 0) + (board ? E.flipsFor(board, i, turn).length : 0);
      moves.sort((a, b) => score(b) - score(a));
      const p = cellPt(moves[0]);
      await D.tap(document.querySelector('canvas'), { dx: p.dx, dy: p.dy, after: 2200 });
    };
    D.run([
      () => D.wait(1200),
      async () => { for (let i = 0; i < 6; i++) { const skip = btnText(/^(Überspringen|Skip)$/); if (!skip) break; const nx = btnText(/^(Weiter|Next|Los geht.*|Let.?s go|Fertig|Done)$/); await D.tap(nx || skip, { after: 1400 }); } },
      myMove, myMove, myMove,
      async () => { const u = document.querySelector('button[aria-label="Zug zurück"], button[aria-label="Undo"], button[aria-label*="ndo"]'); if (u) await D.tap(u, { after: 1800 }); },
      myMove, myMove, myMove, myMove,
      async () => { const h = document.querySelector('button[aria-label="Hilfe"], button[aria-label="Help"]'); if (h) { await D.tap(h, { after: 2500 }); const c = btnText(/^(Schließen|Close|OK|Weiter|Next|Fertig|Done|Verstanden|Got it)$/); if (c) await D.tap(c, { after: 1200 }); } },
      async () => { setStep(2); const b = document.querySelector('button[aria-label="Zurück"], button[aria-label="Back"]'); if (b) await D.tap(b, { after: 2500 }); },
    ], 2500);
  } else if (!isGame && step === 2) {
    D.run([
      () => D.wait(1000),
      async () => { const b = btnText(/^(Täglich|Daily)$/); if (b) await D.tap(b, { after: 2200 }); },
      () => D.scroll(400), () => D.scroll(-400),
      async () => { const b = btnText(/^(Erfolge|Achievements)$/); if (b) await D.tap(b, { after: 2200 }); },
      () => D.scroll(400), () => D.scroll(-400),
      async () => { const b = btnText(/^(Profil|Profile)$/); if (b) await D.tap(b, { after: 2200 }); },
      () => D.scroll(400), () => D.scroll(-400),
      async () => { setStep(3); const b = btnText(/^(Start|Home)$/); if (b) await D.tap(b, { after: 2500 }); },
    ], 2000);
  }
})();
