// Nur fuer den iOS-Bau: entfernt Spiele, die Apple als "simuliertes Gluecksspiel" werten wuerde
// (Blackjack = Casino-Spiel, Nain Jaune = Einsatz-Toepfe). Einzelentwickler duerfen so etwas nicht anbieten.
// Android bleibt unveraendert. Aufruf (im CI vor "npx cap sync ios"): node ios/ios-filter.mjs
import fs from 'node:fs'; import path from 'node:path';
const WWW = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..', 'www');
const DROP = { blackjack: 'bj', nainjaune: 'nj' };

const gj = path.join(WWW, 'games.json'); const data = JSON.parse(fs.readFileSync(gj, 'utf8'));
const list = Array.isArray(data) ? data : data.games; const before = list.length;
const kept = list.filter((g) => !(g.id in DROP));
if (Array.isArray(data)) data.splice(0, data.length, ...kept); else data.games = kept;
fs.writeFileSync(gj, JSON.stringify(data, null, 2) + '\n');

for (const id of Object.keys(DROP)) fs.rmSync(path.join(WWW, 'games', id), { recursive: true, force: true });

const cj = path.join(WWW, 'lib', 'chogan.js'); const src = fs.readFileSync(cj, 'utf8');
const re = new RegExp(`^\\s*\\{ id: '(${Object.values(DROP).join('|')})-[^']*',.*\\n`, 'gm');
const n = (src.match(re) || []).length; fs.writeFileSync(cj, src.replace(re, ''));

console.log(`iOS-Filter: ${before} -> ${kept.length} Spiele, ${n} Auszeichnungen entfernt`);
if (before - kept.length !== 2 || n < 4) { console.error('iOS-Filter: unerwartetes Ergebnis'); process.exit(1); }
