// 로그인 없는 배포용: 진행 기록을 이 브라우저(localStorage)에만 저장해요.
// 서버로 보내는 정보는 없어요. 다른 컴퓨터나 브라우저에서는 기록이 따로예요.
const PROGRESS_KEY = 'turtle-playground-progress';

function getProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
  catch (e) { return {}; }
}

function markChapterComplete(chapterNum) {
  const progress = getProgress();
  progress[String(chapterNum)] = true;
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); } catch (e) {}
}

function resetAllProgress() {
  try { localStorage.removeItem(PROGRESS_KEY); } catch (e) {}
}
