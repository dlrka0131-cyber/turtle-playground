// 거북이 코딩 놀이터 — 한 걸음씩 차시 공통 엔진
// 각 차시 페이지는 이 파일보다 먼저 LESSON = { num, topic, words, preview, missions } 를 정의한다.
//
// 미션 종류(kind): 기본(코드 카드) / 'preview'(미리보기) / 'more'(한 번 더 버튼) / 'free'(자유 편집기)
// 코드 줄 종류: { prep: true }        거북이 데려오기 3줄
//               { given: '...' }      이미 써 있는 줄
//               { type: '...' }       따라 치는 줄
//               { blank: '..@..', answers: [...] }  빈칸(@). 답 null=아무 숫자, '*'=아무 글자, 그 밖엔 그 단어
//               { box: [...], label } 안쪽(띄어쓰기 4칸) 상자. 상자 안에 상자도 된다.
// 모든 줄에 note(한국어 설명)를 붙일 수 있다.

(function () {
  const L = LESSON;
  const lineKey = l => l.given !== undefined ? l.given : l.type !== undefined ? l.type : l.blank;

  // ---------- 추가 내용(extras.js) 끼워 넣기: 복습·도전 미션, 생각 힌트, 기억해서 쓰는 빈칸 ----------
  const X = (window.LESSON_EXTRAS || {})[L.num] || {};
  const cloneLines = ls => JSON.parse(JSON.stringify(ls));
  // lines 안에서 원래 줄(match)을 찾아 새 줄로 바꾼다. 상자·접힌 코드 안까지 찾는다.
  function applyEdits(lines, edits) {
    (edits || []).forEach(([match, repl]) => {
      const swap = ls => ls.some((l, i) => {
        if (l.box) return swap(l.box);
        if (l.fold) return swap(l.fold);
        if (l.prep || lineKey(l) !== match) return false;
        const next = Object.assign({}, repl);
        if (next.note === undefined) next.note = l.note;
        ls[i] = next;
        return true;
      });
      if (!swap(lines)) console.error('extras.js: ' + L.num + '차시에서 줄을 찾지 못했어요 → ' + match);
    });
    return lines;
  }
  const BASE = L.missions;
  // 도전 미션은 "바꾸기 전" 원래 코드로 만든다
  let challenge = null;
  if (X.challenge) {
    const c = X.challenge;
    challenge = c.kind ? Object.assign({ challenge: true, done: '스스로 만들어 냈어요! 🏆 이게 진짜 코딩이에요. <b>다음 →</b>' }, c, { title: '🏆 도전! ' + c.title }) : {
      challenge: true, title: '🏆 도전! ' + c.title, talk: c.talk, clue: c.clue, hint: c.hint,
      lines: c.lines || applyEdits(cloneLines(BASE[c.base].lines), c.edits),
      done: c.done || '힌트 없이 해냈어요! 🏆 이게 진짜 실력이에요. <b>다음 →</b>',
    };
  }
  Object.keys(X.recall || {}).forEach(i => {
    BASE[i].lines = applyEdits(cloneLines(BASE[i].lines), X.recall[i]);
    BASE[i].talk = BASE[i].talk.replace(/직접 써 보세요/g, '빈칸을 채워 보세요');
  });
  Object.keys(X.talk || {}).forEach(i => { BASE[i].talk = X.talk[i]; });
  Object.keys(X.clues || {}).forEach(i => { BASE[i].clue = X.clues[i]; });
  // rebuild: 원래 미션 목록을 받아 새 목록을 돌려준다 (차시 흐름을 통째로 다시 짤 때)
  const MISSIONS = X.rebuild ? X.rebuild(BASE) : BASE.slice();
  // insert: [[원래 미션 번호, 새 미션]] — 그 미션 "바로 앞"에 끼워 넣는다
  (X.insert || []).forEach(([at, m]) => MISSIONS.splice(MISSIONS.indexOf(BASE[at]), 0, m));
  if (challenge) MISSIONS.splice(MISSIONS.length - 1, 0, challenge);
  if (X.review) {
    const r = X.review;
    MISSIONS.splice(1, 0, {
      review: true, title: '🔁 복습: ' + r.title, talk: r.talk, clue: r.clue, hint: r.hint, lines: r.lines,
      done: r.done || '잘 기억하고 있네요! 👏 이제 오늘 공부를 시작해요. <b>다음 →</b>',
    });
  }
  const WORDS = L.words || [];
  const PREP = [
    { given: 'import turtle', note: '거북이 상자 열기' },
    { given: 't = turtle.Turtle()', note: '내 거북이 t 만들기' },
    { given: 't.shape("turtle")', note: '거북이 모양으로' },
  ];
  const COLORS = [
    ['red', '빨강', '#E53935'], ['blue', '파랑', '#1E63D6'], ['green', '초록', '#2E9E4F'],
    ['gold', '금색', '#E0A800'], ['purple', '보라', '#8E3FC4'], ['pink', '분홍', '#F06292'], ['orange', '주황', '#FB8C00'],
  ];
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const wordCard = w => `<div class="word"><div class="emo">${w.emo}</div><div class="en">${esc(w.en)}</div>${w.say ? `<div class="say">[${w.say}]</div>` : ''}<div class="ko">${w.ko}</div></div>`;

  // ---------- 화면 뼈대 ----------
  document.title = `${L.num}차시: 거북이 코딩 놀이터`;
  document.body.insertAdjacentHTML('afterbegin', `
<a class="home-btn" href="index.html" title="처음으로"><i class="fa-solid fa-house"></i></a>
<div class="board">
  <div class="pane">
    <div class="mission-top">
      <span class="chapter">${L.num}차시 · ${L.topic}</span>
      <div class="dots" id="dots"></div>
      <button class="word-btn" id="word-open" type="button">📒 단어장</button>
    </div>
    <div class="mission-body" id="mission"></div>
    <div class="nav">
      <button class="prev" id="prev-btn" type="button">← 이전</button>
      <button class="big-btn next" id="next-btn" type="button">다음 →</button>
    </div>
  </div>
  <div class="pane stage-pane">
    <div id="ask"><div class="card">
      <div class="who">🐢 거북이가 물어봐요</div>
      <div class="q" id="ask-q"></div>
      <input id="ask-input" autocomplete="off">
      <button class="big-btn run" id="ask-ok" type="button">확인 ✔</button>
    </div></div>
    <div class="stage-top">🐢 거북이 무대 <span id="stage-status" style="font-weight:700;font-size:1rem;color:var(--muted)"></span></div>
    <div id="stage"><div id="stage-empty"><div class="t">🐢</div>▶ 실행하기를 누르면<br>여기서 거북이가 움직여요</div></div>
    <div class="say-box"><div class="say-label">💬 거북이가 한 말</div><div id="output" aria-live="polite"></div></div>
    <details class="full-code" id="full-code">
      <summary>👀 진짜 파이썬 코드 전체 보기</summary>
      <pre id="full-code-pre"></pre>
    </details>
  </div>
</div>
<div id="word-modal"><div class="box">
  <h2>📒 오늘의 영어 단어 <button class="close-btn" id="word-close" type="button">✖</button></h2>
  <div class="words">${WORDS.map(wordCard).join('')}</div>
</div></div>`);
  const $ = id => document.getElementById(id);
  $('word-open').onclick = () => $('word-modal').classList.add('open');
  $('word-close').onclick = () => $('word-modal').classList.remove('open');
  $('word-modal').onclick = e => { if (e.target.id === 'word-modal') e.target.classList.remove('open'); };

  // ---------- 상태 ----------
  const KEY = 'turtle-lesson-' + L.num;
  let reached = 0;
  try { reached = Math.min(+localStorage.getItem(KEY) || 0, MISSIONS.length - 1); } catch (e) {}
  let cur = reached;
  const state = MISSIONS.map(() => ({ done: false, count: 1 }));
  for (let i = 0; i < reached; i++) state[i].done = true;

  const missionEl = $('mission'), nextBtn = $('next-btn'), prevBtn = $('prev-btn');

  // ---------- 글자 비교 도우미 ----------
  const norm = s => s.replace(/\s+/g, ' ').trim().replace(/\s*([().:,=+\-*\/%<>\[\]])\s*/g, '$1');
  const CHAR_NAME = { '{': '여는 중괄호 {', '}': '닫는 중괄호 }', '+': '더하기 +', '-': '빼기 -', '%': '나머지 %', '[': '대괄호 [', ']': '닫는 대괄호 ]', '(': '여는 괄호 (', ')': '닫는 괄호 )', '.': '점 .', ':': '두 점 :', ' ': '띄어쓰기', '"': '따옴표 "', '_': '밑줄 _', '=': '같다 =', ',': '쉼표 ,' };
  function compare(typed, target) {
    const t = typed.trim();
    if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(typed) && !/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(target)) return { ok: false, n: 0, msg: '⌨️ 한글로 써지고 있어요! <b>한/영</b> 키를 눌러서 영어로 바꿔요.' };
    if (norm(t) === norm(target)) return { ok: true, n: target.length, msg: '✅ 딱 맞았어요!' };
    let n = 0;
    while (n < t.length && n < target.length && t[n] === target[n]) n++;
    if (n === t.length) {
      if (n === 0) return { ok: false, n, msg: '👆 위 글자를 보고 그대로 따라 쳐요.' };
      const c = target[n];
      return { ok: false, n, msg: '👍 잘하고 있어요! 다음 글자: <b>' + (CHAR_NAME[c] || esc(c)) + '</b>' };
    }
    if (n === target.length) return { ok: false, n, msg: '✂️ 뒤에 글자가 더 있어요. 지워 볼까요?' };
    const a = t[n], b = target[n];
    if (a.toLowerCase() === b.toLowerCase()) {
      return { ok: false, n, msg: b === b.toLowerCase()
        ? `🔡 <b>${esc(a)}</b> → 작은 글자 <b>${esc(b)}</b> 로 바꿔요. (Caps Lock이 켜져 있나요?)`
        : `🔠 <b>${esc(a)}</b> → 큰 글자 <b>${esc(b)}</b> 로 바꿔요. (Shift 누르고!)` };
    }
    return { ok: false, n, msg: `🔍 <b>${n + 1}번째</b> 글자가 달라요: <b>${a === ' ' ? '띄어쓰기' : esc(a)}</b> 대신 <b>${CHAR_NAME[b] || esc(b)}</b>` };
  }
  function targetHtml(target, n) {
    return `<span class="ok">${esc(target.slice(0, n))}</span>` +
      (n < target.length ? `<span class="next">${esc(target[n] === ' ' ? ' ' : target[n])}</span><span class="rest">${esc(target.slice(n + 1))}</span>` : '');
  }

  // ---------- 코드 카드 ----------
  function lineHtml(l, idx) {
    const note = l.note ? `<span class="note">${l.note}</span>` : '';
    if (l.given !== undefined) return `<div class="cline given"><span class="code">${esc(l.given) || '&nbsp;'}</span>${note}</div>`;
    if (l.type !== undefined) return `<div class="cline"><div class="type-wrap">
        <div class="target-row" data-tr="${idx}">${targetHtml(l.type, 0)}</div>
        <input class="type-input" data-type="${idx}" autocomplete="off" spellcheck="false" autocapitalize="off" placeholder="✏️ 위 글자를 똑같이 쳐 보세요">
        <div class="type-hint" data-th="${idx}"></div></div>${note}</div>`;
    if (l.blank !== undefined) {
      let k = 0;
      const html = esc(l.blank).split('@').map((part, i, arr) => part + (i < arr.length - 1 ? blankInput(l, idx, k++) : '')).join('');
      return `<div class="cline"><span class="code">${html}</span>${note}</div>`;
    }
    return '';
  }
  function blankInput(l, idx, k) {
    const ans = l.answers[k], start = (l.start && l.start[k]) || '';
    const num = ans === null || /^\d+$/.test(ans);
    const width = ans === '*' ? '9em' : Math.max(3.6, (ans || '').length + 1.6, start.length + 1.6) + 'ch';
    return `<input class="blank${num ? '' : ' text'}" data-blank="${idx}" data-k="${k}" value="${start.replace(/"/g, '&quot;')}" style="width:${width}" autocomplete="off" spellcheck="false" autocapitalize="off">`;
  }
  // 줄들을 [{ l, indent }] 한 줄 목록으로 펼친다
  function flatten(lines, indent = 0, out = []) {
    lines.forEach(l => {
      if (l.prep) PREP.forEach(p => out.push({ l: p, indent }));
      else if (l.box) flatten(l.box, indent + 1, out);
      else if (l.fold) flatten(l.fold, indent, out);
      else out.push({ l, indent });
    });
    return out;
  }
  function codeCardHtml(lines) {
    let idx = 0;
    const walk = ls => ls.map(l => {
      if (l.prep) {
        idx += PREP.length;
        return `<div class="prep-bar" onclick="this.nextElementSibling.classList.toggle('open')">🐢 거북이 데려오기 주문 3줄 <span style="font-weight:400">(이미 써 있어요 · 눌러서 보기)</span></div>
          <div class="prep-lines${X.showPrep ? ' open' : ''}">${PREP.map(p => lineHtml(p)).join('')}</div>`;
      }
      if (l.fold) return `<div class="prep-bar" onclick="this.nextElementSibling.classList.toggle('open')">📜 ${l.title || '지난 시간 코드'} <span style="font-weight:400">(이미 써 있어요 · 눌러서 보기)</span></div>
          <div class="prep-lines">${walk(l.fold)}</div>`;
      if (l.box) return `<div class="indent-box"><div class="indent-label">${l.label || '🔁 반복 상자 안'} (앞에 띄어쓰기 4칸)</div>${walk(l.box)}</div>`;
      return lineHtml(l, idx++);
    }).join('');
    return `<div class="code-card">${walk(lines)}</div>`;
  }
  // ---------- 2단계 힌트 ----------
  // 1단계 "생각 힌트"(clue): 정답은 말하지 않고 실마리만 준다.
  // 2단계 "정답 힌트"(hint): 서로 다른 답으로 몇 번 틀린 뒤에만 열린다.
  const fixedBlanks = m => {
    const out = [];
    if (m.lines) flatten(m.lines).forEach(f => (f.l.answers || []).forEach(a => { if (a !== null && a !== '*') out.push({ ans: a, note: f.l.note }); }));
    return out;
  };
  const isGoal = m => m.kind === 'goal' || m.kind === 'order';
  const NEED_WRONG = m => m.challenge || isGoal(m) ? 3 : 2;   // 정답 힌트가 열리는 틀린 횟수
  const CLUE_AFTER = m => m.challenge || isGoal(m) ? 1 : 0;   // 생각 힌트가 열리는 틀린 횟수
  function maskWord(a) {
    const show = a.length <= 2 ? 0 : a.length <= 5 ? 1 : a.length <= 9 ? 2 : 3;
    return a.split('').map((c, i) => i < show || c === '_' ? c : '▢').join(' ');
  }
  function autoClue(m) {
    const fb = fixedBlanks(m);
    return fb.map((b, i) => {
      const who = (fb.length > 1 ? `<b>${i + 1}번째 빈칸</b>` : '<b>빈칸</b>') + (b.note ? ` (${b.note})` : '');
      if (/^-?\d+$/.test(b.ans)) return `${who}: 숫자예요. 위 설명과 줄 옆의 설명을 다시 읽어 보세요.`;
      if (!/^[A-Za-z_][A-Za-z_0-9]*$/.test(b.ans)) return `${who}: 기호나 짧은 식이에요. 위 설명을 다시 읽어 보세요.`;
      return `${who}: <code class="mask">${maskWord(b.ans)}</code> 영어 ${b.ans.length}글자`;
    }).join('<br>');
  }
  function autoHint(m) {
    const fb = fixedBlanks(m);
    return '정답: ' + fb.map((b, i) => (fb.length > 1 ? `${i + 1}번째 빈칸 ` : '') + `<b>${esc(b.ans)}</b>`).join(', ') + '<br>왜 그런지 한 번 생각해 보고 써요!';
  }
  const hasHint = m => isGoal(m) || (m.kind === undefined && fixedBlanks(m).length > 0);
  const goalAnswer = m => '이렇게 하면 돼요. 보고 <b>직접</b> 고쳐 보세요!<pre class="answer-code">' + esc((m.noPrep || m.fullAnswer ? solutionOf(m) : solutionOf(m).replace(PREP_TEXT, '')).trim()) + '</pre>';
  function hintHtml(m) {
    const wrong = state[cur].wrong || 0;
    if (wrong < CLUE_AFTER(m)) return '🏆 이 미션은 <b>먼저 스스로</b> 해 봐요!<br>한 번 실행해 본 뒤에도 어려우면 생각 힌트가 열려요.';
    let html = `<div class="clue-label">💡 생각 힌트</div>${m.clue || (isGoal(m) ? '흐린 목표 그림과 내 그림을 나란히 비교해 보세요. 어디서부터 달라지나요?' : autoClue(m))}`;
    const left = NEED_WRONG(m) - wrong;
    if (left > 0) html += `<div class="answer-lock">🔒 그래도 어려우면 <b>${left}번</b> 더 도전해 보세요. 그러면 정답 힌트가 열려요.</div>`;
    else if (!state[cur].answerOpen) html += `<div class="answer-lock"><button class="big-btn soft" id="answer-btn" type="button">🔑 정답 힌트 열기</button></div>`;
    else html += `<div class="answer-open"><div class="clue-label">🔑 정답 힌트</div>${m.hint || (isGoal(m) ? goalAnswer(m) : autoHint(m))}</div>`;
    return html;
  }
  function drawHint(m) {
    const box = $('hint');
    if (!box) return;
    box.innerHTML = hintHtml(m);
    const ab = $('answer-btn');
    if (ab) ab.onclick = () => { state[cur].answerOpen = true; drawHint(m); };
  }

  const moreLines = m => (m.noPrep ? [] : [{ prep: true }]).concat(m.before || [], ...Array(state[cur].count).fill(m.pair));

  // 지금 화면의 입력값으로 진짜 파이썬 코드를 만든다
  function composeCode(m) {
    if (m.kind === 'free' || m.kind === 'goal') return { text: $('free-code').value, mine: [] };
    if (m.kind === 'predict') return { text: (m.noPrep ? '' : PREP_TEXT) + m.code + '\n', mine: [] };
    if (m.kind === 'order') return { text: (m.noPrep ? '' : PREP_TEXT) + state[cur].order.map(i => m.lines[i]).join('\n') + '\n', mine: [] };
    if (m.kind === 'preview') return { text: L.preview, mine: [] };
    const flat = flatten(m.kind === 'more' ? moreLines(m) : m.lines);
    const mine = [];
    const code = flat.map((f, i) => {
      const l = f.l;
      let text = l.given;
      if (l.type !== undefined) { text = missionEl.querySelector(`[data-type="${i}"]`).value.trim(); mine.push(i); }
      if (l.blank !== undefined) {
        let k = 0;
        text = l.blank.replace(/@/g, () => missionEl.querySelector(`[data-blank="${i}"][data-k="${k++}"]`).value.trim() || '0');
        mine.push(i);
      }
      return text ? '    '.repeat(f.indent) + text : '';
    });
    return { text: code.join('\n') + '\n', mine };
  }

  // ---------- 미션 화면 ----------
  function renderDots() {
    $('dots').innerHTML = MISSIONS.map((m, i) =>
      `<button class="dot ${i === cur ? 'now' : ''} ${state[i].done || i <= reached ? 'done' : ''}" data-go="${i}" type="button" title="${m.title}">${i + 1}</button>`).join('');
    document.querySelectorAll('.dot.done').forEach(d => d.onclick = () => go(+d.dataset.go));
  }

  function render() {
    const m = MISSIONS[cur];
    const last = cur === MISSIONS.length - 1;
    let gateFrom = null;
    let html = `<div class="mission-num">미션 ${cur + 1} / ${MISSIONS.length}${m.challenge ? ' <span class="tag challenge">스스로 해결하기</span>' : m.review ? ' <span class="tag review">지난 시간 기억하기</span>' : ''}</div><h2 class="mission-title">${m.title}</h2><div class="talk">${m.talk}</div>`;
    if (m.words) html += `<div class="words">${WORDS.slice(0, 4).map(wordCard).join('')}</div>`;
    if (m.chips) html += `<div class="chips">${m.chips.map(([c, mm]) => `<div class="chip"><div class="c">${esc(c)}</div><div class="m">${mm}</div></div>`).join('')}</div>`;
    if (m.sentence) html += `<div class="sentence">${m.sentence}</div>`;

    if (m.kind === 'preview') {
      html += `<div class="actions"><button class="big-btn run" id="run" type="button">▶ 미리보기</button></div>`;
    } else if (m.kind === 'more') {
      gateFrom = html.length;
      html += `<div id="more-card"></div><div class="actions"><button class="big-btn more" id="more" type="button">➕ 한 번 더!</button><button class="big-btn soft" id="more-reset" type="button">↺ 처음부터</button></div>`;
    } else if (m.kind === 'predict') {
      const st = state[cur];
      html += `<pre class="read-code">${esc(m.code)}</pre>
        <div class="q-label">🤔 ${m.question} <span>실행하기 전에 먼저 골라 보세요!</span></div>
        <div class="options">${m.options.map((o, i) => `<button class="option${st.pick === i ? ' picked' : ''}" data-opt="${i}" type="button"${st.done ? ' disabled' : ''}>${o}</button>`).join('')}</div>
        <div class="actions"><button class="big-btn run" id="run" type="button"${st.pick === undefined ? ' disabled' : ''}>▶ 실행해서 확인하기</button></div>`;
    } else if (m.kind === 'goal') {
      if (m.bank) html += `<div class="bank"><span class="bank-label">🧩 단어 버튼 (누르면 써져요)</span>${m.bank.map(b => `<button class="bank-btn" data-bank="${esc(b).replace(/"/g, '&quot;')}" type="button">${esc(b)}</button>`).join('')}</div>`;
      html += `<textarea class="free-editor" id="free-code" spellcheck="false"></textarea>
        <div class="actions"><button class="big-btn run" id="run" type="button">▶ 실행하기</button><button class="big-btn soft" id="free-reset" type="button">↺ 처음 코드로</button><button class="big-btn soft" id="hint-btn" type="button">💡 힌트 보기</button></div>
        <div class="hint-box" id="hint"></div>`;
    } else if (m.kind === 'order') {
      html += `<div class="order-list" id="order-list"></div>
        <div class="actions"><button class="big-btn run" id="run" type="button">▶ 실행하기</button><button class="big-btn soft" id="hint-btn" type="button">💡 힌트 보기</button></div>
        <div class="hint-box" id="hint"></div>`;
    } else if (m.kind === 'free') {
      if (m.colors !== false) html += `<div class="color-cards">${COLORS.map(([en, ko, hex]) => `<span class="color-card"><i style="background:${hex}"></i><code>"${en}"</code> ${ko}</span>`).join('')}</div>`;
      html += `<textarea class="free-editor" id="free-code" spellcheck="false"></textarea>
        <div class="actions"><button class="big-btn run" id="run" type="button">▶ 실행하기</button><button class="big-btn soft" id="free-reset" type="button">↺ 처음 코드로</button></div>`;
    } else {
      gateFrom = html.length;
      html += codeCardHtml(m.lines);
      html += `<div class="actions"><button class="big-btn run" id="run" type="button">▶ 실행하기</button>`;
      if (m.quick) html += m.quick.map(q => `<button class="big-btn quick" data-quick="${q}" type="button">${q}</button>`).join('');
      if (hasHint(m)) html += `<button class="big-btn soft" id="hint-btn" type="button">💡 힌트 보기</button>`;
      html += `</div>`;
      if (hasHint(m)) html += `<div class="hint-box" id="hint"></div>`;
    }
    // 설명을 읽기 전에 코드부터 따라 치지 않도록, 코드 카드는 "읽었어요!"를 눌러야 열린다
    if (gateFrom !== null) {
      const locked = !(state[cur].read || state[cur].done || cur < reached);
      html = html.slice(0, gateFrom) + `<div class="gate${locked ? ' locked' : ''}" id="gate">
        <div class="gate-body"${locked ? ' inert' : ''}>${html.slice(gateFrom)}</div>
        <div class="gate-cover"><div class="gate-msg">👆 위의 설명을 먼저 읽어 보세요!</div><button class="big-btn more" id="gate-btn" type="button">✅ 읽었어요! 코드 보기</button></div>
      </div>`;
    }
    html += `<div class="feedback" id="feedback"></div>`;
    if (last) html += `<div class="actions"><button id="complete-btn" class="complete-btn" type="button">✅ ${L.num}차시 완료!</button></div>`;
    missionEl.innerHTML = html;
    missionEl.scrollTop = 0;
    if (isGoal(m) && !m.exact) showGoal(m); else clearGoal();
    bindMission(m);
    renderDots();
    updateNav();
    if (last) bindComplete();
  }

  function bindMission(m) {
    const gateBtn = $('gate-btn');
    if (gateBtn) gateBtn.onclick = () => {
      state[cur].read = true;
      const g = $('gate');
      g.classList.remove('locked');
      g.querySelector('.gate-body').removeAttribute('inert');
      const first = g.querySelector('.type-input, .blank');
      if (first) first.focus({ preventScroll: true });
    };
    const run = $('run');
    if (run) run.onclick = () => runMission();
    missionEl.querySelectorAll('[data-type]').forEach(inp => {
      const i = +inp.dataset.type;
      const target = flatten(m.lines)[i].l.type;
      inp.addEventListener('input', () => {
        const r = compare(inp.value, target);
        missionEl.querySelector(`[data-tr="${i}"]`).innerHTML = targetHtml(target, r.ok ? target.length : r.n);
        const hint = missionEl.querySelector(`[data-th="${i}"]`);
        hint.innerHTML = inp.value ? r.msg : '';
        hint.classList.toggle('good', r.ok);
        inp.classList.toggle('correct', r.ok);
      });
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') runMission(); });
    });
    missionEl.querySelectorAll('.blank').forEach(b => {
      b.addEventListener('input', () => b.classList.remove('correct', 'wrong'));
      b.addEventListener('keydown', e => { if (e.key === 'Enter') runMission(); });
    });
    missionEl.querySelectorAll('[data-quick]').forEach(q => q.onclick = () => {
      missionEl.querySelector('.blank').value = q.dataset.quick;
      runMission();
    });
    const hb = $('hint-btn');
    if (hb) { drawHint(m); hb.onclick = () => $('hint').classList.toggle('open'); }

    if (m.kind === 'more') {
      const draw = () => {
        $('more-card').innerHTML = codeCardHtml(moreLines(m)) +
          `<div style="font-size:1.2rem;font-weight:700;color:var(--shell-dark)">${m.moreLabel || '앞으로+돌기'}: <b style="color:var(--coral)">${state[cur].count}번</b> / ${m.need}번</div>`;
      };
      draw();
      $('more').onclick = () => { if (state[cur].count < m.need) state[cur].count++; draw(); runMission(); };
      $('more-reset').onclick = () => { state[cur].count = 1; draw(); runMission(); };
    }
    if (m.kind === 'free' || m.kind === 'goal') {
      const first = m.kind === 'goal' ? m.start : m.code;
      const ta = $('free-code');
      ta.value = state[cur].code || first;
      ta.addEventListener('input', () => { state[cur].code = ta.value; });
      ta.addEventListener('keydown', e => {
        if (e.key === 'Tab') { e.preventDefault(); ta.setRangeText('    ', ta.selectionStart, ta.selectionEnd, 'end'); state[cur].code = ta.value; }
        // 줄을 바꾸면 윗줄의 띄어쓰기를 그대로 잇고, 윗줄이 : 로 끝나면 4칸 더 들여 쓴다
        if (e.key === 'Enter' && !e.isComposing) {
          e.preventDefault();
          const line = ta.value.slice(0, ta.selectionStart).split('\n').pop();
          const indent = line.match(/^ */)[0] + (/:\s*$/.test(line) ? '    ' : '');
          ta.setRangeText('\n' + indent, ta.selectionStart, ta.selectionEnd, 'end'); state[cur].code = ta.value;
        }
      });
      $('free-reset').onclick = () => { ta.value = first; state[cur].code = first; };
      // 단어 버튼: 커서 자리에 써 준다. 괄호 안이 비어 있으면 커서를 괄호 안에 둔다
      missionEl.querySelectorAll('[data-bank]').forEach(bt => bt.onclick = () => {
        let text = bt.dataset.bank.replace('( )', '()');
        // 지금 줄에 이미 글자가 있으면 그 줄 끝에서 줄을 바꾸고(들여쓰기도 이어서) 쓴다
        const v = ta.value, lineStart = v.lastIndexOf('\n', ta.selectionStart - 1) + 1;
        let lineEnd = v.indexOf('\n', ta.selectionStart); if (lineEnd < 0) lineEnd = v.length;
        const line = v.slice(lineStart, lineEnd);
        let at = ta.selectionStart, pre = '';
        if (line.trim()) { at = lineEnd; pre = '\n' + line.match(/^ */)[0] + (/:\s*$/.test(line) ? '    ' : ''); }
        ta.setRangeText(pre + text, at, line.trim() ? at : ta.selectionEnd, 'end');
        at += pre.length;
        const hole = bt.dataset.bank.indexOf('( )');
        if (hole >= 0) ta.setSelectionRange(at + hole + 1, at + hole + 1);
        state[cur].code = ta.value; ta.focus();
      });
    }
    if (m.kind === 'predict') {
      missionEl.querySelectorAll('[data-opt]').forEach(o => o.onclick = () => {
        state[cur].pick = +o.dataset.opt;
        missionEl.querySelectorAll('[data-opt]').forEach(x => x.classList.toggle('picked', x === o));
        $('run').disabled = false;
      });
    }
    if (m.kind === 'order') {
      const st = state[cur];
      // 처음에는 섞어서 보여 준다 (뒤집은 순서. shuffle 로 직접 정할 수도 있다)
      if (!st.order) st.order = m.shuffle ? m.shuffle.slice() : m.lines.map((_, i) => m.lines.length - 1 - i);
      const draw = () => {
        $('order-list').innerHTML = st.order.map((li, pos) => `<div class="order-row">
          <span class="order-btns"><button data-up="${pos}" type="button"${pos === 0 ? ' disabled' : ''}>▲</button><button data-down="${pos}" type="button"${pos === st.order.length - 1 ? ' disabled' : ''}>▼</button></span>
          <code>${esc(m.lines[li]).replace(/^ +/, sp => '<i class="ind"></i>'.repeat(sp.length / 4))}</code>${m.notes ? `<span class="order-note">${m.notes[li]}</span>` : ''}</div>`).join('');
        const swap = (a, b) => { [st.order[a], st.order[b]] = [st.order[b], st.order[a]]; draw(); };
        $('order-list').querySelectorAll('[data-up]').forEach(b => b.onclick = () => swap(+b.dataset.up, +b.dataset.up - 1));
        $('order-list').querySelectorAll('[data-down]').forEach(b => b.onclick = () => swap(+b.dataset.down, +b.dataset.down + 1));
      };
      draw();
    }
  }

  function feedback(html, good) {
    const f = $('feedback');
    f.innerHTML = html;
    f.className = 'feedback show ' + (good ? 'good' : 'bad');
    f.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  // 빈칸·따라치기가 다 맞았는지
  function checkAnswers(m) {
    if (!m.lines) return { ok: true };
    let ok = true, typeMiss = false, blankMiss = false;
    flatten(m.lines).forEach((f, i) => {
      if (f.l.type !== undefined && !compare(missionEl.querySelector(`[data-type="${i}"]`).value, f.l.type).ok) { ok = false; typeMiss = true; }
      if (f.l.blank !== undefined) {
        f.l.answers.forEach((ans, k) => {
          const b = missionEl.querySelector(`[data-blank="${i}"][data-k="${k}"]`);
          const v = b.value.trim();
          const good = ans === null ? /^-?\d+$/.test(v) : ans === '*' ? v && !v.includes('"') : v.replace(/\s+/g, '') === ans;
          if (ans !== null && ans !== '*') b.classList.toggle('correct', !!good);
          b.classList.toggle('wrong', !good);
          if (!good) { ok = false; blankMiss = true; }
        });
      }
    });
    return { ok, typeMiss, blankMiss };
  }

  function runMission() {
    const m = MISSIONS[cur];
    const hintTip = hasHint(m) ? ' 어려우면 <b>💡 힌트 보기</b>!' : '';
    const check = checkAnswers(m);
    // 빈칸을 다 채우고 틀렸을 때만, 그리고 지난번과 다른 답일 때만 "도전 1번"으로 센다
    const blanks = [...missionEl.querySelectorAll('.blank')];
    if (check.blankMiss && blanks.length && blanks.every(b => b.value.trim())) {
      const sig = blanks.map(b => b.value.trim()).join('\u0001');
      if (sig !== state[cur].lastWrong) {
        state[cur].lastWrong = sig;
        state[cur].wrong = (state[cur].wrong || 0) + 1;
        drawHint(m);
      }
    }
    if ([...missionEl.querySelectorAll('.blank')].some(b => !b.value.trim())) {
      feedback('빈칸을 먼저 채워 볼까요? ✏️ <b>빨간 빈칸</b>에 알맞은 걸 써 보세요.' + hintTip, false);
      return;
    }
    const { text, mine } = composeCode(m);
    showFullCode(text, mine);
    runPython(text).then(() => {
      if (m.kind === 'predict') {
        const right = state[cur].pick === m.answer;
        if (!state[cur].done) state[cur].right = right;
        state[cur].done = true;
        missionEl.querySelectorAll('[data-opt]').forEach((o, i) => { o.disabled = true; o.classList.toggle('answer', i === m.answer); });
        feedback((right ? '🎯 <b>예측 성공!</b> ' : '🙈 <b>예측과 달랐어요!</b> 오른쪽 결과를 잘 보세요.<br>') + m.why + ' <b>다음 →</b>', right);
        updateNav();
        return;
      }
      if (isGoal(m)) {
        // exact: 그림이 아니라 줄 순서 자체가 답인 순서 맞추기 (거북이 데려오기 3줄)
        const verdict = m.exact ? { ok: state[cur].order.every((li, pos) => li === pos) } : matchGoal(m);
        const missed = !verdict.ok ? null : (m.must || []).find(([word]) => !text.includes(word));
        if (!verdict.ok || missed) {
          if (text !== state[cur].lastWrong) { state[cur].lastWrong = text; state[cur].wrong = (state[cur].wrong || 0) + 1; drawHint(m); }
          feedback(missed ? missed[1] : m.fail ? m.fail : (verdict.close ? '거의 다 왔어요! 🔍 ' : '아직 목표 그림과 달라요! 🔍 ') + '<b>흐린 그림</b>과 내 그림을 비교해 보세요. 어디가 다른가요?' + ((state[cur].wrong || 0) >= 1 ? ' 어려우면 <b>💡 힌트 보기</b>!' : ''), false);
          return;
        }
      }
      if (m.kind === 'more' && state[cur].count < m.need) {
        feedback(`좋아요! 🙌 <b>➕ 한 번 더!</b>를 ${m.need - state[cur].count}번 더 눌러 보세요.`, true);
        return;
      }
      if (!check.ok) {
        if (check.typeMiss) feedback('거의 다 왔어요! ✏️ 노란 글자 힌트를 보고 <b>위 글자와 똑같이</b> 고쳐 봐요.', false);
        else feedback('조금만 더! 🤔 <b>빨간 빈칸</b>을 다시 확인해 보세요.' + hintTip, false);
        return;
      }
      // 자유 미션: 처음 코드 그대로면 아직 "나만의 작품"이 아니다
      if (m.kind === 'free' && !state[cur].done && text.replace(/\s+/g, '') === m.code.replace(/\s+/g, '')) {
        feedback('실행은 잘 됐어요! 👍 이제 <b>숫자나 색깔을 하나라도 바꿔서</b> 다시 실행해 보세요. 그래야 나만의 작품이에요!', false);
        return;
      }
      state[cur].done = true;
      feedback(m.challenge && state[cur].answerOpen ? '해냈어요! 👏 다음 차시 도전 미션은 <b>정답 힌트 없이</b> 풀어 봐요. <b>다음 →</b>' : m.done, true);
      updateNav();
      if (cur === MISSIONS.length - 1) bindComplete();
    }, msg => {
      // 빈칸이 틀려서 난 에러면, 에러 대신 빈칸을 가리킨다
      if (check.blankMiss) feedback('빈칸을 다시 확인해 볼까요? ✏️ <b>빨간 빈칸</b>을 고쳐 보세요.' + hintTip, false);
      else if (m.kind === 'order') {
        // 줄 순서가 틀려서 난 에러는 "글자가 틀렸다"가 아니라 "순서가 틀렸다"고 알려 준다
        if (text !== state[cur].lastWrong) { state[cur].lastWrong = text; state[cur].wrong = (state[cur].wrong || 0) + 1; drawHint(m); }
        feedback(m.fail || '이 순서로는 거북이가 이해하지 못해요! 🧩 <b>안쪽으로 들어간 줄</b>은 for 줄 <b>바로 아래</b>에 모여 있어야 해요.', false);
      }
      else feedback(msg, false);
    });
  }

  function showFullCode(code, mine) {
    $('full-code-pre').innerHTML = code.replace(/\n$/, '').split('\n')
      .map((l, i) => mine.includes(i) ? `<span class="mine">${esc(l)}</span>` : esc(l)).join('\n');
  }

  function updateNav() {
    prevBtn.disabled = cur === 0;
    nextBtn.style.visibility = cur === MISSIONS.length - 1 ? 'hidden' : 'visible';
    nextBtn.disabled = !state[cur].done;
    nextBtn.classList.toggle('pulse', state[cur].done);
    if (state[cur].done && cur + 1 > reached) {
      reached = cur + 1;
      try { localStorage.setItem(KEY, reached); } catch (e) {}
      renderDots();
    }
  }
  function go(i) {
    stopOldTimers(); // 다른 미션으로 넘어가면 이전 게임은 멈춘다
    cur = Math.max(0, Math.min(MISSIONS.length - 1, i));
    render();
  }
  nextBtn.onclick = () => { if (state[cur].done) go(cur + 1); };
  prevBtn.onclick = () => go(cur - 1);

  // ---------- 파이썬 실행 (Skulpt) ----------
  const outputEl = $('output'), stage = $('stage');
  // Skulpt 거북이에는 textinput이 없어서, 맨 앞에 몰래 input()으로 연결해 둔다
  const PRELUDE = 'import turtle\nturtle.textinput = lambda title, q: input(q)\n';
  const PRELUDE_LINES = 2;
  function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles.files[x] === undefined) throw "파일을 찾을 수 없어요: '" + x + "'";
    return Sk.builtinFiles.files[x];
  }
  // 게임 타이머(ontimer)가 이전 실행에서 계속 도는 걸 막는다: 마지막 타이머 번호를 기억해 두었다가 새로 실행할 때 끈다
  (function () {
    const f = 'src/lib/turtle.js', old = 'this._timer=window.setTimeout(e,Math.max(0,0|t))';
    const src = Sk.builtinFiles && Sk.builtinFiles.files[f];
    if (src && src.includes(old)) Sk.builtinFiles.files[f] = src.replace(old, 'this._timer=(window.__turtleUsed=true,window.__turtleTimer=window.setTimeout(e,Math.max(0,0|t)))');
  })();
  // 이전 실행의 게임 타이머를 확실히 끈다. 끄는 순간 한 틱이 진행 중이면 그 틱이 타이머를 다시 켜므로,
  // 잠시 기다렸다가 다시 켜진 게 있으면 또 끄는 걸 반복한다.
  async function stopOldTimers() {
    if (!window.__turtleUsed) return;
    for (let i = 0; i < 5; i++) {
      if (window.__turtleTimer) { clearTimeout(window.__turtleTimer); window.__turtleTimer = null; }
      await new Promise(r => setTimeout(r, 250));
      if (!window.__turtleTimer) return;
    }
    clearTimeout(window.__turtleTimer); window.__turtleTimer = null;
  }
  function friendlyError(err, code) {
    const s = err.toString();
    let line = '';
    try {
      const n = err.traceback && err.traceback[0] && err.traceback[0].lineno;
      const text = n > PRELUDE_LINES && code.split('\n')[n - 1 - PRELUDE_LINES];
      if (text && text.trim()) line = `<br><span style="font-family:'JetBrains Mono',monospace;background:#fff;padding:2px 8px;border-radius:6px">${esc(text.trim())}</span> 이 줄을 확인해 보세요.`;
    } catch (e) {}
    if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(code.replace(/#.*$/gm, '').replace(/"[^"]*"/g, ''))) return '⌨️ 코드에 한글이 들어갔어요! <b>한/영</b> 키를 눌러 영어로 바꿔 주세요.' + line;
    if (s.includes('UnboundLocalError') || s.includes('referenced before assignment')) return '🌐 명령 <b>안</b>에서 <b>밖에 있는 상자</b>의 숫자를 바꾸려면, 명령 맨 윗줄에 <b>global 상자이름</b> 을 써야 해요! (예: global score)' + line;
    if (s.includes('IndexError')) return '🚂 그 번호의 칸이 없어요! 칸 번호는 <b>0부터</b> 시작해서, 칸이 3개면 <b>0, 1, 2</b> 까지만 있어요.' + line;
    if (s.includes('ZeroDivisionError')) return '0으로는 나눌 수 없어요! 😄 <b>0보다 큰</b> 숫자를 써 주세요.';
    if (s.includes('ValueError') && s.includes('int')) return '🔢 숫자를 물어봤는데 <b>숫자가 아닌 대답</b>이 들어왔어요! 질문 창에는 <b>숫자만</b> 써 주세요. (예: 5)';
    if (/color|colour/i.test(s)) return '🎨 거북이가 모르는 색깔이에요! 아래 색깔 카드의 <b>영어 이름</b>을 써 보세요. (예: "red")' + line;
    if (s.includes('TypeError') && s.includes('str')) return '🔢 글자로는 계산하거나 걸을 수 없어요! 대답을 <b>int( )</b>로 감싸서 숫자로 바꿔 주세요.' + line;
    if (s.includes('IndentationError')) return '🔁 줄 맞추기가 틀렸어요! 상자 안의 줄은 앞에 <b>띄어쓰기 4칸</b>이 있어야 해요.' + line;
    if (s.includes('has no attribute')) return '🐢 거북이가 모르는 단어예요! <b>영어 철자</b>가 맞는지 확인해 보세요.' + line;
    if (s.includes('NameError') && !/=\s*turtle\.Turtle\(\)/.test(code)) return '🐢 거북이를 아직 안 데려왔어요! 맨 위에 <b>거북이 데려오기 3줄</b>이 있어야 해요. (상자 열기 → 거북이 만들기 → 거북이 모양)';
    if (s.includes('NameError')) return '🔤 모르는 이름이에요! <b>철자</b>와 <b>큰 글자/작은 글자</b>를 확인해 보세요. (t 는 작은 글자!)' + line;
    if (/ParseError|SyntaxError|TokenError/.test(s)) return '✏️ 글자가 하나 빠졌거나 더 있어요! <b>괄호 ( )</b>, <b>따옴표 " "</b>, <b>두 점 :</b> 을 확인해 보세요.' + line;
    return '앗! 에러가 났어요 😅 위 글자와 똑같은지 다시 확인해 보세요.' + line;
  }

  const askEl = $('ask'), askInput = $('ask-input');
  let askResolve = null;
  function ask(q) {
    return new Promise(resolve => {
      askResolve = resolve;
      $('ask-q').textContent = q;
      askInput.value = '';
      askEl.classList.add('open');
      setTimeout(() => askInput.focus(), 50);
    });
  }
  function askSubmit() {
    if (!askResolve) return;
    askEl.classList.remove('open');
    const r = askResolve; askResolve = null; r(askInput.value);
  }
  $('ask-ok').onclick = askSubmit;
  askInput.addEventListener('keydown', e => { if (e.key === 'Enter') askSubmit(); });

  function runPython(code) {
    $('stage-status').textContent = '움직이는 중…';
    return stopOldTimers().then(() => runPythonNow(code));
  }
  function runPythonNow(code) {
    askEl.classList.remove('open'); askResolve = null;
    outputEl.textContent = '';
    stage.innerHTML = '<div id="mycanvas"></div>';
    $('stage-status').textContent = '움직이는 중…';
    Sk.configure({ output: t => { outputEl.textContent += t; }, read: builtinRead, __future__: Sk.python3, inputfunTakesPrompt: true, inputfun: ask });
    Sk.TurtleGraphics = Sk.TurtleGraphics || {};
    Sk.TurtleGraphics.target = 'mycanvas';
    Sk.TurtleGraphics.width = Math.max(320, stage.clientWidth);
    Sk.TurtleGraphics.height = Math.max(300, stage.clientHeight);
    return Sk.misceval.asyncToPromise(() => Sk.importMainWithBody('<stdin>', false, PRELUDE + code, true)).then(
      () => {
        $('stage-status').textContent = '✨ 완성!';
        // 키보드 입력은 거북이 무대가 선택되어 있어야 들린다 (▶ 버튼에 선택이 남아 있으면 키가 안 먹는다)
        const c = $('mycanvas');
        if (c) c.focus({ preventScroll: true });
      },
      err => { $('stage-status').textContent = '😵 에러'; throw friendlyError(err, code); }
    );
  }

  // ---------- 목표 그림: 정답 코드를 몰래 돌려 흐린 그림으로 깔고, 내 그림과 비교한다 ----------
  const PREP_TEXT = PREP.map(p => p.given).join('\n') + '\n';
  const solutionOf = m => m.kind === 'order' ? (m.noPrep ? '' : PREP_TEXT) + m.lines.join('\n') + '\n' : m.solution;
  const CELL = 6;
  // 거북이 모양(맨 위 층)은 빼고, 그려진 선·색만 한 장으로 모은다
  function capture(boxId) {
    const cs = [...document.querySelectorAll('#' + boxId + ' canvas')].filter(c => c.style.zIndex !== '3' && c.style.display !== 'none');
    if (!cs.length) return null;
    const out = document.createElement('canvas');
    out.width = cs[0].width; out.height = cs[0].height;
    const g = out.getContext('2d');
    cs.forEach(c => g.drawImage(c, 0, 0));
    return out;
  }
  // 그림을 작은 칸으로 나눠, 칸마다 "잉크가 있나"와 평균 색을 적어 둔다
  function toGrid(cv) {
    const w = cv.width, h = cv.height, d = cv.getContext('2d').getImageData(0, 0, w, h).data;
    const cols = Math.ceil(w / CELL), rows = Math.ceil(h / CELL), cells = new Array(cols * rows).fill(null);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const p = (y * w + x) * 4;
      if (d[p + 3] < 60) continue;
      const k = Math.floor(y / CELL) * cols + Math.floor(x / CELL);
      const c = cells[k] || (cells[k] = [0, 0, 0, 0]);
      c[0] += d[p]; c[1] += d[p + 1]; c[2] += d[p + 2]; c[3]++;
    }
    return { cols, rows, cells };
  }
  function compareGrids(ref, mine) {
    if (ref.cols !== mine.cols || ref.rows !== mine.rows) return { ok: false };
    const near = (g, k) => {
      const x = k % g.cols, y = (k - x) / g.cols;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx >= 0 && yy >= 0 && xx < g.cols && yy < g.rows && g.cells[yy * g.cols + xx]) return true;
      }
      return false;
    };
    let refN = 0, covered = 0, mineN = 0, valid = 0, both = 0, sameColor = 0;
    ref.cells.forEach((c, k) => { if (c) { refN++; if (near(mine, k)) covered++; } });
    mine.cells.forEach((c, k) => {
      if (!c) return;
      mineN++; if (near(ref, k)) valid++;
      const r = ref.cells[k];
      if (r) { both++; if (Math.abs(c[0] / c[3] - r[0] / r[3]) + Math.abs(c[1] / c[3] - r[1] / r[3]) + Math.abs(c[2] / c[3] - r[2] / r[3]) < 150) sameColor++; }
    });
    if (!refN || !mineN) return { ok: false };
    const cover = covered / refN, clean = valid / mineN, color = both ? sameColor / both : 0;
    return { ok: cover >= 0.94 && clean >= 0.94 && color >= 0.8, close: cover >= 0.7 && clean >= 0.7, cover, clean, color };
  }
  let goalRef = null, goalToken = 0;
  function clearGoal() { goalToken++; goalRef = null; stage.style.backgroundImage = ''; }
  function showGoal(m) {
    clearGoal();
    const token = goalToken, run = $('run');
    if (run) run.disabled = true;
    stopOldTimers().then(() => {
      if (token !== goalToken) return;
      const w = Math.max(320, stage.clientWidth), h = Math.max(300, stage.clientHeight);
      const holder = document.createElement('div');
      holder.id = 'goalcanvas';
      holder.style.cssText = `position:absolute;left:-99999px;top:0;width:${w}px;height:${h}px`;
      document.body.appendChild(holder);
      Sk.configure({ output: () => {}, read: builtinRead, __future__: Sk.python3 });
      Sk.TurtleGraphics = Sk.TurtleGraphics || {};
      Object.assign(Sk.TurtleGraphics, { target: 'goalcanvas', width: w, height: h, animate: false });
      const finish = () => { Sk.TurtleGraphics.animate = true; holder.remove(); if (token === goalToken && $('run')) $('run').disabled = false; };
      return Sk.misceval.asyncToPromise(() => Sk.importMainWithBody('<stdin>', false, PRELUDE + 'turtle.tracer(0)\n' + solutionOf(m) + '\nturtle.update()\n', true)).then(() => {
        const cv = capture('goalcanvas');
        if (cv && token === goalToken) {
          goalRef = toGrid(cv);
          const faded = document.createElement('canvas');
          faded.width = cv.width; faded.height = cv.height;
          const g = faded.getContext('2d');
          g.globalAlpha = 0.3; g.drawImage(cv, 0, 0);
          stage.style.backgroundImage = `url(${faded.toDataURL()})`;
          stage.style.backgroundSize = '100% 100%';
          stage.style.backgroundRepeat = 'no-repeat';
          if (!$('mycanvas')) stage.innerHTML = '<div class="goal-note">👻 흐린 그림이 <b>목표</b>예요.<br>똑같이 그려지게 만들어 보세요!</div>';
        }
        finish();
      }, err => { console.error('목표 그림을 만들지 못했어요', err && err.toString()); finish(); });
    });
  }
  // 창 크기가 바뀌면 무대 크기도 바뀌므로 목표 그림을 다시 만든다
  let resizeTimer = null;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { if (isGoal(MISSIONS[cur])) showGoal(MISSIONS[cur]); }, 400); });
  function matchGoal() {
    const cv = capture('mycanvas');
    if (!goalRef || !cv) return { ok: false };
    return compareGrids(goalRef, toGrid(cv));
  }

  // ---------- 완료 버튼 (이 브라우저에 저장) ----------
  let chapterDone = !!getProgress()[String(L.num)];
  function bindComplete() {
    const btn = $('complete-btn');
    if (!btn) return;
    if (chapterDone) { btn.textContent = '✔️ 완료했어요!'; btn.classList.add('done'); }
    const ready = chapterDone || state[MISSIONS.length - 1].done;
    btn.classList.toggle('not-yet', !ready);
    btn.onclick = () => {
      if (chapterDone) return;
      if (!state[MISSIONS.length - 1].done) {
        feedback('아직이에요! ✏️ 코드를 <b>내 마음대로 바꾸고 ▶ 실행하기</b>를 눌러야 완료할 수 있어요.', false);
        return;
      }
      markChapterComplete(L.num);
      chapterDone = true; bindComplete();
    };
  }

  // 테스트할 때 콘솔에서 쓸 수 있게
  window.lessonGo = go;
  window.lessonMissions = MISSIONS;
  render();
})();
