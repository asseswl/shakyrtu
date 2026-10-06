/* ===== НАСТРОЙКИ (меняйте только здесь) ===== */
const CONFIG = {
  weddingDate: "2026-11-11T18:00:00+05:00",  // дата и время тоя (Алматы +05:00)
  dateText: "11.11 2026",
  name1: "Заманбек",                          // бірінші (жігіт)
  name2: "Светлана",                          // екінші (қалыңдық)
  venue: "Samir Meiramhanasy",
  address: "Егінсу көшесі, 29/11а",
  addressLink: "https://2gis.kz/almaty/search/%D2%AE%D0%BB%D0%B8%D1%86%D0%B0%20%D0%95%D0%B3%D0%B8%D0%BD%D1%81%D1%83%2C%2029%2F11%D0%B0",
  mapLink: "https://2gis.kz/almaty/search/%D2%AE%D0%BB%D0%B8%D1%86%D0%B0%20%D0%95%D0%B3%D0%B8%D0%BD%D1%81%D1%83%2C%2029%2F11%D0%B0",
  yandexLink: "https://yandex.com/maps/-/CXewmYjJ",
  lat: 43.177428, lon: 76.801661,             // координаты точки на карте (из ссылки Яндекса)
  heroPhoto: "",                              // напр. "img/hero.jpg"
  music: "",                                  // напр. "audio/music.mp3"
  whatsapp: ""                                // номер без +, напр. "77011234567"
};
/* ============================================ */
const $ = id => document.getElementById(id);
$("n1").textContent = CONFIG.name1; $("n2").textContent = CONFIG.name2;
$("dateText").textContent = CONFIG.dateText;
$("venueName").textContent = CONFIG.venue;
if (CONFIG.heroPhoto) document.documentElement.style.setProperty("--photo-hero", `url(${CONFIG.heroPhoto})`);
$("b2gis").href = CONFIG.mapLink;
const mapQuery = encodeURIComponent(`${CONFIG.address}, Алматы`);
$("bgoogle").href = `https://www.google.com/maps/search/?api=1&query=${CONFIG.lat},${CONFIG.lon}`;
$("byandex").href = CONFIG.yandexLink;
$("map").src = `https://yandex.com/map-widget/v1/?ll=${CONFIG.lon}%2C${CONFIG.lat}&z=17&pt=${CONFIG.lon},${CONFIG.lat},pm2rdl`; /* карта Яндекс на сайте */

/* появление при прокрутке */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
document.querySelectorAll(".r").forEach((el, i) => { if (el.closest(".hero")) setTimeout(() => el.classList.add("in"), 300 + i * 250); else io.observe(el); });

/* таймер */
const target = new Date(CONFIG.weddingDate).getTime();
function tick() {
  let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
  const v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
  ["cd", "ch", "cm", "cs"].forEach((id, i) => $(id).textContent = String(v[i]).padStart(2, "0"));
}
tick(); setInterval(tick, 1000);

/* календарь (по дате тоя) */
(function () {
  const d = new Date(CONFIG.weddingDate), y = d.getFullYear(), m = d.getMonth(), day = d.getDate();
  const first = (new Date(y, m, 1).getDay() + 6) % 7, n = new Date(y, m + 1, 0).getDate();
  $("monthLbl").innerHTML = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"][m] + "<small>" + y + "</small>";
  let h = ["Дс", "Сс", "Ср", "Бс", "Жм", "Сб", "Жс"].map(x => `<div class="h">${x}</div>`).join("");
  h += '<div></div>'.repeat(first);
  for (let i = 1; i <= n; i++) h += `<div class="d${i === day ? " on" : ""}${(first + i - 1) % 7 > 4 ? " we" : ""}">${i}</div>`;
  $("cal").innerHTML = h;
})();

/* музыка */
const a = $("bgm"), mb = $("musicBtn");
if (CONFIG.music) a.src = CONFIG.music; else mb.hidden = true;
function setMusic(on) {
  if (!CONFIG.music) return;
  (on ? a.play() : Promise.resolve(a.pause())).catch(() => on = false);
  mb.classList.toggle("on", on); mb.classList.toggle("off", !on);
}
mb.classList.add("off");
mb.onclick = () => setMusic(a.paused);

/* ===== золотые блёстки: идут снизу вверх; burst() — всплеск при открытии ===== */
const sparks = (() => {
  const cv = $("sparks"), ctx = cv.getContext("2d");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dot = document.createElement("canvas"); dot.width = dot.height = 32;
  { const g = dot.getContext("2d"), r = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    r.addColorStop(0, "rgba(255,244,205,1)"); r.addColorStop(.25, "rgba(226,190,110,.85)"); r.addColorStop(1, "rgba(201,164,92,0)");
    g.fillStyle = r; g.fillRect(0, 0, 32, 32); }
  let W, H, ps = [], bs = [], last = 0, running = false;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const want = () => Math.round(Math.min(46, Math.max(18, innerWidth / 26)));
  function size() {
    const dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ps = Array.from({ length: want() }, () => make(true));
  }
  function make(init) {
    return { x: rnd(0, W), y: init ? rnd(0, H) : H + 20, vy: H / rnd(18, 32), s: rnd(3, 9),
             sw: rnd(6, 18), f: rnd(.4, 1.1), ph: rnd(0, 6.28), star: Math.random() < .28 };
  }
  function star(x, y, r, rot) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) { const a = rot + i * Math.PI / 4, d = i % 2 ? r * .25 : r; ctx.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d); }
    ctx.closePath(); ctx.fill();
  }
  function frame(now) {
    if (!running) return;
    const dt = Math.min(.05, (now - last) / 1000 || 0), t = now / 1000; last = now;
    ctx.clearRect(0, 0, W, H);
    for (const p of ps) {
      p.y -= p.vy * dt; p.x += Math.sin(t * .6 + p.ph) * p.sw * dt;
      if (p.y < -20) Object.assign(p, make(false));
      const k = (H + 20 - p.y) / (H + 40);                                  /* путь снизу вверх 0…1 */
      const a = Math.min(1, k / .1) * Math.min(1, (1 - k) / .3) * (.55 + .45 * Math.sin(t * p.f * 6.28 + p.ph)) * .85;
      if (a <= .01) continue;
      ctx.globalAlpha = a; ctx.drawImage(dot, p.x - p.s, p.y - p.s, p.s * 2, p.s * 2);
      if (p.star) { ctx.fillStyle = "#e2be6e"; star(p.x, p.y, p.s * .9, t * .4 + p.ph); }
    }
    for (let i = bs.length - 1; i >= 0; i--) {
      const b = bs[i]; b.age += dt;
      if (b.age >= b.life) { bs.splice(i, 1); continue; }
      const drag = Math.pow(.05, dt); b.vx *= drag; b.vy = b.vy * drag - 14 * dt;
      b.x += b.vx * dt; b.y += b.vy * dt;
      ctx.globalAlpha = (1 - b.age / b.life) * .95;
      ctx.drawImage(dot, b.x - b.s, b.y - b.s, b.s * 2, b.s * 2);
    }
    ctx.globalAlpha = 1; requestAnimationFrame(frame);
  }
  function start() { if (running || still) return; running = true; last = performance.now(); requestAnimationFrame(frame); }
  function burst(x, y) {
    if (still) return;
    for (let i = 0; i < 70; i++) { const a = rnd(0, 6.28), v = rnd(60, 280); bs.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, s: rnd(3, 8), age: 0, life: rnd(.9, 1.7) }); }
  }
  if (!still) { size(); addEventListener("resize", size); start();
    document.addEventListener("visibilitychange", () => { if (document.hidden) running = false; else start(); }); }
  return { burst };
})();

/* ===== обложка: скролл закрыт, пока не нажали «Шақыруды ашу» ===== */
const root = document.documentElement, hero = $("hero"), main = $("main"), veil = $("veil"), openBtn = $("openBtn");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
root.classList.add("locked"); window.scrollTo(0, 0);
let opened = false;
/* жёсткая блокировка (iOS/Safari игнорируют overflow:hidden): колесо, свайп, клавиши */
const lockKeys = new Set([" ", "Spacebar", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"]);
addEventListener("wheel", e => { if (!opened) e.preventDefault(); }, { passive: false });
addEventListener("touchmove", e => { if (!opened) e.preventDefault(); }, { passive: false });
addEventListener("keydown", e => { if (!opened && lockKeys.has(e.key) && e.target !== openBtn) e.preventDefault(); });
function openInvitation() {
  if (opened) return; opened = true;          /* повторные нажатия игнорируются */
  openBtn.disabled = true;
  setMusic(true);                              /* музыка стартует по жесту пользователя */
  hero.classList.add("opening");               /* рамка и ветви расходятся, кнопка тает */
  if (!reduceMotion) {                         /* золотой всплеск из кнопки + вспышка света внизу */
    const b = openBtn.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2;
    sparks.burst(x, y);
    $("bloom").style.setProperty("--x", x + "px"); $("bloom").style.setProperty("--y", y + "px"); $("bloom").classList.add("go");
    $("glow").classList.add("flare");
  }
  const unlock = () => {
    root.classList.remove("locked");           /* снимаем блокировку скролла */
    main.classList.add("main-in");
    main.setAttribute("tabindex", "-1");
    main.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    main.focus({ preventScroll: true });
  };
  if (reduceMotion) { unlock(); hero.classList.add("opened"); return; }
  setTimeout(() => veil.classList.add("on"), 450);      /* светлая вуаль сгущается */
  setTimeout(unlock, 1050);                              /* на пике — открываем приглашение */
  setTimeout(() => veil.classList.remove("on"), 1150);  /* вуаль рассеивается, идёт плавный скролл */
  setTimeout(() => { hero.classList.add("opened"); openBtn.tabIndex = -1; openBtn.setAttribute("aria-hidden", "true"); }, 2600);
}
openBtn.onclick = openInvitation;

/* RSVP: отправка в WhatsApp (или просто подтверждение, если номер не указан) */
$("rsvp").onsubmit = e => {
  e.preventDefault();
  const ans = document.querySelector('input[name=a]:checked').value;
  const going = ans.startsWith("Иә"), pair = going ? " (" + document.querySelector('input[name=p]:checked').value + ")" : "";
  if (CONFIG.whatsapp) window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent($("guest").value + " — " + ans + pair)}`, "_blank");
  $("ok").hidden = false;
};

/* выбор «вдвоём» показываем только тем, кто придёт */
document.querySelectorAll('input[name=a]').forEach(r => r.onchange = () => { $("pairBox").hidden = !r.value.startsWith("Иә") || !r.checked; });
