import { readdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
const DIR = "/Users/jwechols/Projects/echols-academy/lib/curriculum-spine";
const AUD = "/Users/jwechols/Projects/echols-academy/public/lesson-audio";
const VOICE = { titus:"ash", mercy:"coral", lois:"shimmer", truma:"sage" };
const spokenForm = t => t.replace(/Truma/g,"Trooma").replace(/truma/g,"trooma");
function audioKey(voice, text){ const s=spokenForm(text); let h=0x811c9dc5; const k=voice+"|"+s; for(let i=0;i<k.length;i++){h^=k.charCodeAt(i);h=Math.imul(h,0x01000193);} return `${voice}-${(h>>>0).toString(16).padStart(8,"0")}-${s.length}`; }
const dur = key => { const f=join(AUD,key+".mp3"); if(!existsSync(f)) return null; try { return parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${f}"`).toString().trim()); } catch { return null; } };
const words = s => (s.trim().match(/\S+/g)||[]).length;

const results = [];
for (const f of readdirSync(DIR).filter(f=>f.endsWith(".ts"))) {
  let mod; try { mod = await import(join(DIR,f)); } catch { continue; }
  for (const v of Object.values(mod)) {
    if (!v?.units || !v.kidId || !v.subject) continue;
    const voice = VOICE[v.kidId];
    for (const u of v.units) for (const l of (u.lessons??[])) {
      if (!(l.interactive?.length && l.quiz?.length)) continue; // complete only
      // Clean-run spoken path: each beat's say; try prompts spoken; onRight (assume correct); quiz prompts.
      const lines = [];
      for (const b of l.interactive) {
        if (b.kind==="try") { lines.push(b.say ?? b.prompt, b.onRight); }
        else lines.push(b.say ?? b.text);
      }
      for (const q of l.quiz) lines.push(q.prompt);
      let sec=0, missing=0, wc=0;
      for (const ln of lines) { if(!ln) continue; wc+=words(ln); const d=dur(audioKey(voice,ln)); if(d==null) missing++; else sec+=d; }
      results.push({ id:l.id, kid:v.kidId, beats:l.interactive.length, quiz:l.quiz.length, wc, sec, missing });
    }
  }
}
let tot=0;
for (const r of results.sort((a,b)=>a.id.localeCompare(b.id))) {
  tot+=r.sec;
  console.log(`${r.id.padEnd(28)} audio ${(r.sec/60).toFixed(1).padStart(4)}m  (${Math.round(r.sec)}s)  words:${String(r.wc).padStart(4)}  beats:${r.beats} quiz:${r.quiz}${r.missing?`  [${r.missing} unbaked]`:""}`);
}
console.log(`\nComplete lessons: ${results.length}`);
console.log(`Avg spoken instruction: ${(tot/results.length/60).toFixed(1)} min/lesson  (${Math.round(tot/results.length)}s)`);
