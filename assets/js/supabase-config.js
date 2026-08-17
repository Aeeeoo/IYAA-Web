// Supabase 연결 설정. 아래 두 값을 본인 프로젝트 값으로 채우세요.
//
// Supabase 대시보드 → Settings → API 에서 확인:
//   - Project URL      → SUPABASE_URL
//   - anon public 키   → SUPABASE_ANON_KEY
//
// anon 키는 공개해도 안전한 키입니다 (RLS 정책이 실제 접근 제어를 함).

window.SUPABASE_URL = "https://yggzqaoowpfmjddwwqea.supabase.co";
window.SUPABASE_ANON_KEY = "sb_publishable_-JdsGtya7J4ZUab-YVcaMg_V48PxCCp";

// Supabase JS SDK가 이 스크립트보다 먼저 로드되어야 합니다.
// (HTML의 <head>에서 supabase-js CDN → 이 파일 순서)
if (!window.supabase || !window.supabase.createClient) {
  throw new Error("Supabase SDK가 로드되지 않았습니다. HTML의 <script> 순서 확인.");
}
window.sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
