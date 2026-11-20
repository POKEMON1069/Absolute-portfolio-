/* ── Portfolio · Designer Daishu ─────────────────────────────
   ✏️  EDIT HERE: change your name, projects & contact info.   */
const PROJECTS = [
  { id:1, cat:"brand", catLabel:"品牌视觉", year:"2025", title:"山茶花 · 茶饮品牌视觉", desc:"品牌 Logo、包装与门店视觉的完整体系，围绕「东方茶香」构建清新、克制的视觉语言。", g:"g1", tag:"BRAND IDENTITY" },
  { id:2, cat:"ops",   catLabel:"运营视觉", year:"2025", title:"618 大促运营视觉体系", desc:"主会场、活动页与社交媒体物料的统一视觉规范，支撑全渠道投放。", g:"g2", tag:"CAMPAIGN" },
  { id:3, cat:"aigc",  catLabel:"AIGC",     year:"2025", title:"AIGC 概念海报系列", desc:"使用 AI 生成工具探索超现实视觉风格，人工精修与排版形成最终海报。", g:"g3", tag:"AI VISUAL" },
  { id:4, cat:"brand", catLabel:"品牌视觉", year:"2024", title:"城市咖啡 · 品牌升级", desc:"从 Logo 到杯身、菜单与周边，打造年轻化的咖啡品牌新形象。", g:"g4", tag:"BRAND IDENTITY" },
  { id:5, cat:"ops",   catLabel:"运营视觉", year:"2024", title:"新品上市 · 社交媒体视觉", desc:"小红书 / 抖音双平台运营视觉，单篇笔记曝光提升 3 倍。", g:"g5", tag:"SOCIAL" },
  { id:6, cat:"aigc",  catLabel:"AIGC",     year:"2024", title:"虚拟形象 · 角色设计", desc:"为品牌打造的虚拟代言人形象，含三视图与表情包系统。", g:"g6", tag:"CHARACTER" },
  { id:7, cat:"brand", catLabel:"品牌视觉", year:"2023", title:"独立书店 · 品牌视觉", desc:"以纸张纹理与手写字体为核心的文艺品牌视觉。", g:"g7", tag:"BRAND IDENTITY" },
  { id:8, cat:"ops",   catLabel:"运营视觉", year:"2023", title:"双十一 · 电商视觉", desc:"高转化电商主图与详情页视觉体系。", g:"g8", tag:"E-COMMERCE" },
  { id:9, cat:"aigc",  catLabel:"AIGC",     year:"2022", title:"早期 AI 实验作品集", desc:"Stable Diffusion 早期探索：梦境、建筑与抽象构成。", g:"g9", tag:"EXPERIMENT" },
];

let activeFilter = "all";
let activeYear = "all";

const grid = document.getElementById("grid");
const empty = document.getElementById("empty");
const count = document.getElementById("count");
const hash = document.getElementById("hash");

function render(){
  const list = PROJECTS.filter(p =>
    (activeFilter === "all" || p.cat === activeFilter) &&
    (activeYear === "all" || p.year === activeYear)
  );
  grid.innerHTML = list.map(p => `
    <button class="card" data-id="${p.id}">
      <span class="card-art ${p.g}">
        <span class="art-ring"></span>
        <span class="art-no">${p.year}</span>
        <b>${p.tag}</b>
      </span>
      <span class="card-body">
        <span class="card-cat">${p.catLabel} · ${p.year}</span>
        <span class="card-title">${p.title}</span>
        <span class="card-desc">${p.desc}</span>
        <span class="card-meta"><span>#${String(p.id).padStart(2,"0")}</span><span>查看详情 →</span></span>
      </span>
    </button>`).join("");
  empty.hidden = list.length > 0;
  count.textContent = `共 ${list.length} 件作品`;
  hash.textContent = activeYear !== "all" ? `#${activeYear}` : "#00";
}

/* filter buttons */
document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    render();
  });
});

/* year chips */
document.querySelectorAll(".year-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    activeYear = chip.dataset.year;
    document.querySelectorAll(".year-chip").forEach(c => c.classList.toggle("active", c === chip));
    render();
  });
});

/* folders → filter by year + scroll to works */
function goYear(year){
  activeYear = year;
  document.querySelectorAll(".year-chip").forEach(c => c.classList.toggle("active", c.dataset.year === year));
  render();
  document.getElementById("works").scrollIntoView({ behavior:"smooth" });
}
document.querySelectorAll(".hotspot").forEach(f => {
  f.addEventListener("click", () => goYear(f.dataset.year));
});

/* modal */
const modal = document.getElementById("modal");
function openModal(id){
  const p = PROJECTS.find(x => x.id === id);
  if(!p) return;
  document.getElementById("modalArt").className = "modal-art " + p.g;
  document.getElementById("modalCat").textContent = `${p.catLabel} · ${p.year} · ${p.tag}`;
  document.getElementById("modalTitle").textContent = p.title;
  document.getElementById("modalDesc").textContent = p.desc;
  document.getElementById("modalMeta").textContent = "Designer Daishu · 2025 Work Collection";
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeModal(){ modal.hidden = true; document.body.style.overflow = ""; }
grid.addEventListener("click", e => {
  const card = e.target.closest(".card");
  if(card) openModal(+card.dataset.id);
});
document.getElementById("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if(e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if(e.key === "Escape") closeModal(); });

/* + menu */
const plusBtn = document.getElementById("plusBtn");
const menu = document.getElementById("menu");
plusBtn.addEventListener("click", () => {
  menu.hidden = !menu.hidden;
  plusBtn.setAttribute("aria-expanded", String(!menu.hidden));
});
menu.addEventListener("click", () => { menu.hidden = true; plusBtn.setAttribute("aria-expanded","false"); });
document.addEventListener("click", e => {
  if(!menu.hidden && !menu.contains(e.target) && !plusBtn.contains(e.target)){
    menu.hidden = true;
    plusBtn.setAttribute("aria-expanded","false");
  }
});

/* reveal on scroll */
document.documentElement.classList.add("js");
if("IntersectionObserver" in window){
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold:.08, rootMargin:"0px 0px -4% 0px" });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  window.addEventListener("load", () => {
    document.querySelectorAll(".reveal").forEach(el => {
      const r = el.getBoundingClientRect();
      if(r.top < window.innerHeight) el.classList.add("in");
    });
  });
}

render();
