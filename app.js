/* ═══════════════════════════════════════════════════════════════
   🏔️ PLAN ĐÀ LẠT — chia tiền nhóm + kế hoạch du lịch
   Logic tính tiền mô phỏng đúng file Google Sheet gốc.
═══════════════════════════════════════════════════════════════ */

const GROUP='Cả nhóm';
const PALETTE=['#1D9E75','#D85A30','#378ADD','#BA7517','#534AB7','#D4537E','#3AAFA9','#E24B4A','#7C5CFF','#EF9F27'];
const THEMES=[
  {id:'dark',name:'🌙 Dark',ac:'#5DCAA5'},{id:'light',name:'☀️ Light',ac:'#1D9E75'},
  {id:'midnight',name:'🌊 Midnight',ac:'#5b8cff'},{id:'ocean',name:'🐚 Ocean',ac:'#2fd4c4'},
  {id:'forest',name:'🌲 Forest',ac:'#4ade80'},{id:'sunset',name:'🌅 Sunset',ac:'#ff8a5c'},
  {id:'grape',name:'🍇 Grape',ac:'#b794f6'},{id:'mocha',name:'☕ Mocha',ac:'#d4a373'},
  {id:'nord',name:'❄️ Nord',ac:'#88c0d0'},{id:'rose',name:'🌹 Rose',ac:'#fb7185'}
];
const EXP_CATS=[
  {name:'Lưu trú',emoji:'🏨',color:'#378ADD'},
  {name:'Ăn uống',emoji:'🍜',color:'#D85A30'},
  {name:'Di chuyển',emoji:'🛵',color:'#BA7517'},
  {name:'Vé / giải trí',emoji:'🎫',color:'#534AB7'},
  {name:'Mua sắm',emoji:'🛍️',color:'#D4537E'},
  {name:'Khác',emoji:'📦',color:'#888780'}
];
const PLACE_TYPES=[
  {name:'Chụp hình',emoji:'📸'},{name:'Cà phê',emoji:'☕'},{name:'Quay phim',emoji:'🎥'},
  {name:'Tham quan',emoji:'🏞️'},{name:'Giải trí',emoji:'🎡'},{name:'Mua sắm',emoji:'🛍️'},{name:'Khác',emoji:'📍'}
];
const BUOIS=['Sáng','Trưa','Chiều','Tối'];
const BUOI_CLASS={'Sáng':'morning','Trưa':'noon','Chiều':'afternoon','Tối':'evening'};

/* ── SEED (khớp file Plan Đà Lạt.xlsx) ── */
const SEED={
  meta:{tripName:'Plan Đà Lạt',tripStart:'2026-08-15'},
  units:[
    {name:'Vợ chồng Tú',people:2,go:'2026-08-15',back:'2026-08-17',tGo:'07:00',tBack:'18:00',note:'Tự lái ô tô'},
    {name:'Vợ chồng Bình lớn',people:2,go:'2026-08-15',back:'2026-08-17',tGo:'07:00',tBack:'18:00',note:''},
    {name:'Vợ chồng Khoa',people:2,go:'2026-08-15',back:'2026-08-18',tGo:'06:30',tBack:'20:00',note:'Ở thêm 1 ngày'},
    {name:'Bình con',people:1,go:'2026-08-15',back:'2026-08-17',tGo:'07:00',tBack:'18:00',note:''},
    {name:'Linh',people:1,go:'2026-08-16',back:'2026-08-17',tGo:'08:00',tBack:'18:00',note:'Đi xe khách'}
  ],
  expenses:[
    {date:'2026-08-15',item:'Tiền phòng homestay 2 đêm',cat:'Lưu trú',payer:'Vợ chồng Tú',alloc:GROUP,amount:3600000,note:'3 phòng x 600k x 2 đêm'},
    {date:'2026-08-15',item:'Ăn trưa dọc đường',cat:'Ăn uống',payer:'Vợ chồng Bình lớn',alloc:GROUP,amount:800000,note:''},
    {date:'2026-08-15',item:'Xăng xe',cat:'Di chuyển',payer:'Vợ chồng Tú',alloc:GROUP,amount:1200000,note:''},
    {date:'2026-08-16',item:'Vé vườn hoa',cat:'Vé / giải trí',payer:'Linh',alloc:GROUP,amount:640000,note:'80k x 8'},
    {date:'2026-08-16',item:'Thuê xe máy riêng',cat:'Di chuyển',payer:'Linh',alloc:'Linh',amount:150000,note:''}
  ],
  stays:[{name:'Homestay ABC Đà Lạt',addr:'12 Trần Hưng Đạo, P.10',price:600000,ppl:3,nights:2,rooms:3,note:'0900 000 000 · Gần chợ đêm'}],
  itin:[
    {date:'2026-08-15',buoi:'Sáng',time:'07:00',act:'Xuất phát đi Đà Lạt',place:'',cost:0,note:'Tập trung tại nhà Tú'},
    {date:'2026-08-15',buoi:'Chiều',time:'15:00',act:'Nhận phòng, nghỉ ngơi',place:'Homestay ABC',cost:0,note:''},
    {date:'2026-08-15',buoi:'Tối',time:'19:00',act:'Ăn tối + chợ đêm',place:'Chợ Đà Lạt',cost:800000,note:''},
    {date:'2026-08-16',buoi:'Sáng',time:'05:30',act:'Săn mây + cà phê',place:'Cầu Đất',cost:100000,note:''}
  ],
  places:[
    {name:'Quảng trường Lâm Viên',type:'Chụp hình',addr:'P.10, Đà Lạt',cost:0,pri:'Cao',note:'Chụp bình minh'},
    {name:'Cà phê Mê Linh',type:'Cà phê',addr:'Tà Năng, Đức Trọng',cost:100000,pri:'Cao',note:'Săn mây'},
    {name:'Thung lũng Tình Yêu',type:'Tham quan',addr:'Đường Mạc Đĩnh Chi',cost:250000,pri:'Trung bình',note:''},
    {name:'Đồi chè Cầu Đất',type:'Quay phim',addr:'Xã Xuân Trường',cost:0,pri:'Cao',note:'Quay flycam'}
  ],
  foods:[
    {name:'Bánh căn Lê Thị Hồng',dish:'Bánh căn trứng',addr:'27 Yên Thế',price:40000,tried:false,note:''},
    {name:'Lẩu gà lá é',dish:'Lẩu gà',addr:'Trung tâm',price:150000,tried:false,note:'Đặt trước'},
    {name:'Sữa đậu phố Hoàng Diệu',dish:'Sữa đậu nành nóng',addr:'Hoàng Diệu',price:15000,tried:false,note:''}
  ],
  packing:[
    {name:'Flycam + pin',group:'Chụp hình / Quay phim',owner:'Vợ chồng Tú',qty:1,done:false,note:'Sạc đầy'},
    {name:'Loa bluetooth',group:'Điện tử',owner:'Bình con',qty:1,done:false,note:''},
    {name:'Thuốc cảm, say xe',group:'Thuốc / Y tế',owner:'Vợ chồng Khoa',qty:1,done:false,note:''},
    {name:'Giấy tờ tuỳ thân (CCCD)',group:'Giấy tờ',owner:'Mỗi người tự giữ',qty:8,done:false,note:''}
  ],
  checklist:[
    {task:'Đặt homestay 3 phòng',owner:'Vợ chồng Tú',due:'2026-07-20',done:false,note:'Đang làm'},
    {task:'Thuê xe / kiểm tra xe',owner:'Vợ chồng Bình lớn',due:'2026-08-01',done:false,note:''},
    {task:'Lên lịch trình chi tiết',owner:'Linh',due:'2026-08-05',done:false,note:''},
    {task:'Chốt danh sách địa điểm',owner:'Vợ chồng Khoa',due:'2026-08-10',done:false,note:''}
  ]
};

/* ── STATE ── */
const $=id=>document.getElementById(id);
let uidc=Date.now();
const uid=()=>'i'+(uidc++).toString(36)+Math.floor(Math.random()*1e4).toString(36);
function withIds(arr){return arr.map(o=>({id:uid(),...JSON.parse(JSON.stringify(o))}));}
function load(key,fb){try{const v=localStorage.getItem(key);return v?JSON.parse(v):fb;}catch(e){return fb;}}

let units    = load('dl_units',   withIds(SEED.units));
let expenses = load('dl_expenses',withIds(SEED.expenses));
let stays    = load('dl_stays',   withIds(SEED.stays));
let itin     = load('dl_itin',    withIds(SEED.itin));
let places   = load('dl_places',  withIds(SEED.places));
let foods    = load('dl_foods',   withIds(SEED.foods));
let packing  = load('dl_packing', withIds(SEED.packing));
let checklist= load('dl_checklist',withIds(SEED.checklist));
let meta     = load('dl_meta',    {...SEED.meta});
let theme    = localStorage.getItem('dl_theme')||'dark';
let soundOn  = localStorage.getItem('dl_sound')!=='false';
let curBuoi  = 'Sáng';

/* ── SAVE ── */
const S={units:'dl_units',expenses:'dl_expenses',stays:'dl_stays',itin:'dl_itin',places:'dl_places',foods:'dl_foods',packing:'dl_packing',checklist:'dl_checklist',meta:'dl_meta'};
function persistLocal(){
  localStorage.setItem(S.units,JSON.stringify(units));
  localStorage.setItem(S.expenses,JSON.stringify(expenses));
  localStorage.setItem(S.stays,JSON.stringify(stays));
  localStorage.setItem(S.itin,JSON.stringify(itin));
  localStorage.setItem(S.places,JSON.stringify(places));
  localStorage.setItem(S.foods,JSON.stringify(foods));
  localStorage.setItem(S.packing,JSON.stringify(packing));
  localStorage.setItem(S.checklist,JSON.stringify(checklist));
  localStorage.setItem(S.meta,JSON.stringify(meta));
}
function persist(){persistLocal();if(window.__fbPush)window.__fbPush();}

/* ── FORMAT ── */
const fmt=n=>'₫'+Math.round(Math.abs(+n||0)).toLocaleString('vi-VN');
const fmtSigned=n=>(n<-0.5?'−':'')+'₫'+Math.round(Math.abs(+n||0)).toLocaleString('vi-VN');
const fmtShort=n=>{const a=Math.abs(n);if(a>=1e9)return(n/1e9).toFixed(1).replace('.0','')+' tỷ';if(a>=1e6)return(n/1e6).toFixed(1).replace('.0','')+' tr';if(a>=1e3)return Math.round(n/1e3)+'k';return String(Math.round(n));};
function parseMoney(raw){
  if(raw==null)return 0;
  let s=String(raw).toLowerCase().replace(/[,\s₫đvnd]/g,'').trim();
  if(!s)return 0;
  let mult=1;
  if(/(tr|triệu|trieu|m)$/.test(s)){mult=1e6;s=s.replace(/(triệu|trieu|tr|m)$/,'');}
  else if(/(k|ngàn|ngan|nghìn|nghin)$/.test(s)){mult=1e3;s=s.replace(/(ngàn|ngan|nghìn|nghin|k)$/,'');}
  const n=parseFloat(s);
  return isNaN(n)?0:Math.round(n*mult);
}
function moneyPreview(input,previewId){
  const el=$(previewId);if(!el)return;
  const n=parseMoney(input.value);
  el.textContent=n?'= '+fmt(n):'';
}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function hashIdx(str,mod){let h=0;str=String(str);for(let i=0;i<str.length;i++)h=(h*31+str.charCodeAt(i))>>>0;return h%mod;}
function unitColor(name){return PALETTE[hashIdx(name,PALETTE.length)];}
function initials(name){name=String(name||'?').trim();const w=name.replace(/^Vợ chồng\s*/i,'').split(/\s+/);return (w[w.length-1]||name)[0].toUpperCase();}

/* ── DATE ── */
function parseD(s){if(!s)return null;const p=String(s).split('-');return new Date(+p[0],+p[1]-1,+p[2]);}
function daysInclusive(go,back){const a=parseD(go),b=parseD(back);if(!a||!b)return'';return Math.round((b-a)/864e5)+1;}
const WD=['CN','T2','T3','T4','T5','T6','T7'];
const MO=['Th1','Th2','Th3','Th4','Th5','Th6','Th7','Th8','Th9','Th10','Th11','Th12'];
function fmtDate(s){const d=parseD(s);if(!d)return'—';return d.getDate().toString().padStart(2,'0')+'/'+(d.getMonth()+1).toString().padStart(2,'0')+'/'+d.getFullYear();}
function fmtDayShort(s){const d=parseD(s);if(!d)return'—';return WD[d.getDay()]+', '+d.getDate()+'/'+(d.getMonth()+1);}

/* ── SOUND + HAPTIC ── */
let audioCtx;try{audioCtx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}
function playClick(){if(!soundOn||!audioCtx)return;try{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.frequency.value=800;g.gain.value=.06;o.start();g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.08);o.stop(audioCtx.currentTime+.08);}catch(e){}}
function playOk(){if(!soundOn||!audioCtx)return;try{[720,1080].forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.frequency.value=f;g.gain.value=.05;o.start(audioCtx.currentTime+i*.08);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+i*.08+.1);o.stop(audioCtx.currentTime+i*.08+.1);});}catch(e){}}
let _hl=0;function hapticTap(){const now=performance.now?performance.now():Date.now();if(now-_hl<40)return;_hl=now;try{if(navigator.vibrate)navigator.vibrate(8);}catch(e){}}
document.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse')return;const t=e.target.closest('button,.btn,.btn-full,.nav-item,.fab,.chi-type-btn,.gn-item,.check-toggle,.mc-btn,.exp-actions *,.lc-actions *,[onclick],select');if(t)hapticTap();},{passive:true,capture:true});

/* ── TOAST ── */
function showToast(msg,ok=true){const t=$('toast');if(!t)return;t.textContent=(ok?'✓ ':'✗ ')+msg;t.style.borderColor=ok?'rgba(29,158,117,.4)':'rgba(216,90,48,.4)';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200);}

/* ── THEME ── */
function setTheme(t){theme=t;document.body.setAttribute('data-theme',t);localStorage.setItem('dl_theme',t);renderThemeRow();}
function renderThemeRow(){const r=$('themeRow');if(!r)return;r.innerHTML=THEMES.map(t=>`<button class="theme-btn${t.id===theme?' active':''}" onclick="setTheme('${t.id}')"><span class="theme-dot" style="background:${t.ac}"></span>${t.name}</button>`).join('');}
function toggleSound(){soundOn=!soundOn;localStorage.setItem('dl_sound',soundOn);$('soundToggle').className='toggle'+(soundOn?' on':'');if(soundOn)playClick();}

/* ── PRIVACY ── */
function togglePrivacy(){const on=document.body.classList.toggle('privacy');$('privacyFab').textContent=on?'🙈':'👁';$('privacyFab').classList.toggle('fab-on',on);}

/* ── NAV ── */
const RENDER={overview:renderOverview,members:renderMembers,expenses:renderExpenses,settle:renderSettle,stays:renderStays,itinerary:renderItin,places:renderPlaces,food:renderFood,packing:renderPacking,checklist:renderChecklist,settings:renderSettings};
let curPage='overview';
function showPage(p){
  playClick();curPage=p;
  document.querySelectorAll('.page').forEach(el=>el.classList.remove('active'));
  const pg=$('page-'+p);if(pg)pg.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.toggle('active',el.dataset.page===p));
  document.querySelectorAll('.gn-item').forEach(el=>el.classList.toggle('active',el.dataset.page===p));
  gnSync();
  if(RENDER[p])RENDER[p]();
  runCountingAnimations();
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ════════ MONEY LOGIC (đúng như sheet) ════════ */
function totalPeople(){return units.reduce((s,u)=>s+(+u.people||0),0);}
function totals(){
  const total=expenses.reduce((s,e)=>s+(+e.amount||0),0);
  const common=expenses.filter(e=>e.alloc===GROUP).reduce((s,e)=>s+(+e.amount||0),0);
  const tp=totalPeople();
  return {total,common,tp,avg:tp>0?total/tp:0,privTotal:total-common};
}
function unitStats(){
  const {common,tp}=totals();
  return units.map(u=>{
    const priv=expenses.filter(e=>e.alloc===u.name).reduce((s,e)=>s+(+e.amount||0),0);
    const share=tp>0?common*(+u.people||0)/tp:0;
    const mustPay=priv+share;
    const paid=expenses.filter(e=>e.payer===u.name).reduce((s,e)=>s+(+e.amount||0),0);
    return {...u,priv,share,mustPay,paid,balance:paid-mustPay};
  });
}
function settleTransfers(){
  const debt=[],cred=[];
  unitStats().forEach(u=>{const b=Math.round(u.balance);if(b<-0.5)debt.push({name:u.name,amt:-b});else if(b>0.5)cred.push({name:u.name,amt:b});});
  debt.sort((a,b)=>b.amt-a.amt);cred.sort((a,b)=>b.amt-a.amt);
  const res=[];let i=0,j=0;
  while(i<debt.length&&j<cred.length){
    const pay=Math.min(debt[i].amt,cred[j].amt);
    if(pay>0.5)res.push({from:debt[i].name,to:cred[j].name,amt:pay});
    debt[i].amt-=pay;cred[j].amt-=pay;
    if(debt[i].amt<=0.5)i++;if(cred[j].amt<=0.5)j++;
  }
  return res;
}

/* ════════ SHARED UI HELPERS ════════ */
function metric(label,val,cls,sub){return `<div class="metric"><div class="label">${label}</div><div class="val ${cls||'val-white'}">${val}</div>${sub?`<div class="sub-val">${sub}</div>`:''}</div>`;}
function catOf(name){return EXP_CATS.find(c=>c.name===name)||EXP_CATS[EXP_CATS.length-1];}
function placeTypeOf(name){return PLACE_TYPES.find(c=>c.name===name)||PLACE_TYPES[PLACE_TYPES.length-1];}
function unitTag(name){return `<span class="unit-tag"><span class="u-ava" style="background:${unitColor(name)}">${initials(name)}</span>${esc(name)}</span>`;}
function emptyState(emoji,txt){return `<div class="empty-nice"><span class="en-emoji">${emoji}</span>${txt}</div>`;}
function actBtn(fn,icon,cls){return `<button class="mc-btn ${cls||''}" onclick="${fn}">${icon}</button>`;}

function fillUnitSelects(){
  const opts=units.map(u=>`<option value="${esc(u.name)}">${esc(u.name)}</option>`).join('');
  ['ePayer','kOwner','cOwner'].forEach(id=>{const el=$(id);if(el){const cur=el.value;el.innerHTML=opts;if([...el.options].some(o=>o.value===cur))el.value=cur;}});
  const al=$('eAlloc');if(al){const cur=al.value;al.innerHTML=`<option value="${GROUP}">👥 ${GROUP} (chia đều)</option>`+opts;if([...al.options].some(o=>o.value===cur))al.value=cur;}
  const ec=$('eCat');if(ec&&!ec.innerHTML)ec.innerHTML=EXP_CATS.map(c=>`<option value="${c.name}">${c.emoji} ${c.name}</option>`).join('');
  const pt=$('pType');if(pt&&!pt.innerHTML)pt.innerHTML=PLACE_TYPES.map(c=>`<option value="${c.name}">${c.emoji} ${c.name}</option>`).join('');
}

/* ════════ OVERVIEW ════════ */
function renderOverview(){
  const t=totals();
  // hero + countdown
  const start=parseD(meta.tripStart);
  let cd='';
  if(start){const today=new Date();today.setHours(0,0,0,0);const d=Math.round((start-today)/864e5);cd=d>0?`Còn <b>${d}</b> ngày`:(d===0?'<b>Hôm nay khởi hành!</b>':`Đã đi ${-d} ngày trước`);}
  const dur=(()=>{const gs=units.map(u=>parseD(u.go)).filter(Boolean),bs=units.map(u=>parseD(u.back)).filter(Boolean);if(!gs.length)return'';const mn=new Date(Math.min(...gs)),mx=new Date(Math.max(...bs));return Math.round((mx-mn)/864e5)+1+' ngày';})();
  $('heroWrap').innerHTML=`<div class="hero">
    <div class="hero-title">🏔️ ${esc(meta.tripName||'Chuyến đi')}</div>
    <div class="hero-sub">${start?fmtDate(meta.tripStart):''} · ${dur} · ${units.length} nhóm / ${t.tp} người. Toàn bộ chi phí tự chia đều theo đầu người + khoản riêng.</div>
    <div class="hero-chips">
      <span class="hero-chip">🗓️ ${cd||'—'}</span>
      <span class="hero-chip">💰 Tổng <b>${fmt(t.total)}</b></span>
      <span class="hero-chip">👤 BQ <b>${fmt(t.avg)}</b>/người</span>
    </div></div>`;

  $('ovMetrics').innerHTML=
    metric('Tổng chi phí nhóm',fmt(t.total),'val-white',expenses.length+' khoản')+
    metric('Chi phí chung',fmt(t.common),'val-blue','chia đều đầu người')+
    metric('Chi phí riêng',fmt(t.privTotal),'val-amber','tính cho từng người')+
    metric('Bình quân / người',fmt(t.avg),'val-green',t.tp+' người');

  const st=unitStats();
  $('ovTable').innerHTML=`<thead><tr><th>Đơn vị</th><th class="num">Người</th><th class="num">Chi riêng</th><th class="num">Chia chung</th><th class="num">Tổng phải trả</th><th class="num">BQ/người</th></tr></thead><tbody>`+
    st.map(u=>`<tr><td>${unitTag(u.name)}</td><td class="num">${u.people}</td><td class="num">${fmt(u.priv)}</td><td class="num">${fmt(u.share)}</td><td class="num"><b>${fmt(u.mustPay)}</b></td><td class="num">${u.people?fmt(u.mustPay/u.people):'—'}</td></tr>`).join('')+
    `<tr class="total-row"><td>TỔNG</td><td class="num">${t.tp}</td><td class="num">${fmt(t.privTotal)}</td><td class="num">${fmt(t.common)}</td><td class="num">${fmt(t.total)}</td><td class="num"></td></tr></tbody>`;

  // by category
  const byCat={};expenses.forEach(e=>{byCat[e.cat]=(byCat[e.cat]||0)+(+e.amount||0);});
  const max=Math.max(1,...Object.values(byCat));
  const rows=Object.entries(byCat).sort((a,b)=>b[1]-a[1]).map(([c,v])=>{const cc=catOf(c);return `<div class="stats-cat-row"><span style="display:flex;align-items:center;gap:7px;min-width:120px">${cc.emoji} ${esc(c)}</span><span class="cat-bar-wrap"><span class="cat-bar" style="width:${v/max*100}%;background:${cc.color}"></span></span><span style="font-family:'JetBrains Mono',monospace;font-weight:600">${fmt(v)}</span></div>`;}).join('');
  $('ovByCat').innerHTML=rows||emptyState('💸','Chưa có chi phí');
}

/* ════════ MEMBERS ════════ */
function renderMembers(){
  fillUnitSelects();
  const t=totals();
  $('memMetrics').innerHTML=
    metric('Số nhóm/cặp',units.length,'val-white')+
    metric('Tổng số người',t.tp,'val-green')+
    metric('Bình quân / người',fmt(t.avg),'val-amber');
  $('memGrid').innerHTML=units.map(u=>{
    const nd=daysInclusive(u.go,u.back);
    return `<div class="member-card">
      <div class="mc-actions">${actBtn(`openEdit('unit','${u.id}')`,'✏️')}${actBtn(`removeItem('unit','${u.id}')`,'✕','del')}</div>
      <div class="mc-top"><div class="mc-ava" style="background:${unitColor(u.name)}">${initials(u.name)}</div>
        <div><div class="mc-name">${esc(u.name)}</div><div class="mc-people">${u.people} người${nd?` · ${nd} ngày`:''}</div></div></div>
      <div class="mc-row"><span>🚗 Đi</span><b>${fmtDate(u.go)} · ${esc(u.tGo||'')}</b></div>
      <div class="mc-row"><span>🏁 Về</span><b>${fmtDate(u.back)} · ${esc(u.tBack||'')}</b></div>
      ${u.note?`<div class="mc-note">📝 ${esc(u.note)}</div>`:''}
    </div>`;
  }).join('')||emptyState('👥','Chưa có thành viên');
}
function addMember(){
  const name=$('mName').value.trim();if(!name){showToast('Nhập tên',false);return;}
  units.push({id:uid(),name,people:+$('mPeople').value||1,go:$('mGo').value,back:$('mBack').value,tGo:$('mTimeGo').value,tBack:$('mTimeBack').value,note:$('mNote').value.trim()});
  persist();['mName','mNote'].forEach(i=>$(i).value='');renderMembers();playOk();showToast('Đã thêm: '+name);
}

/* ════════ EXPENSES ════════ */
function renderExpenses(){
  fillUnitSelects();
  const t=totals();
  $('expMetrics').innerHTML=
    metric('Tổng chi phí',fmt(t.total),'val-white',expenses.length+' khoản')+
    metric('Chi chung',fmt(t.common),'val-blue')+
    metric('Chi riêng',fmt(t.privTotal),'val-amber');
  $('expCount').textContent=expenses.length+' khoản';
  const sorted=[...expenses].sort((a,b)=>(a.date||'').localeCompare(b.date||''));
  $('expList').innerHTML=sorted.map(e=>{
    const c=catOf(e.cat);
    return `<div class="exp-item">
      <div class="exp-ico" style="background:${c.color}22;color:${c.color}">${c.emoji}</div>
      <div class="exp-mid"><div class="exp-title">${esc(e.item)}</div>
        <div class="exp-meta"><span>${fmtDayShort(e.date)}</span><span class="chip-mini">💳 ${esc(e.payer)}</span><span class="chip-mini">${e.alloc===GROUP?'👥 Cả nhóm':'👤 '+esc(e.alloc)}</span>${e.note?`<span>· ${esc(e.note)}</span>`:''}</div></div>
      <div class="exp-right"><div class="exp-amt">${fmt(e.amount)}</div>
        <div class="exp-actions">${actBtn(`openEdit('expense','${e.id}')`,'✏️')}${actBtn(`removeItem('expense','${e.id}')`,'✕','del')}</div></div>
    </div>`;
  }).join('')||emptyState('💰','Chưa có khoản chi nào');
}
function addExpense(){
  const item=$('eItem').value.trim();if(!item){showToast('Nhập khoản mục',false);return;}
  const amount=parseMoney($('eAmt').value);if(!amount){showToast('Nhập số tiền',false);return;}
  expenses.push({id:uid(),date:$('eDate').value||meta.tripStart,item,cat:$('eCat').value,payer:$('ePayer').value,alloc:$('eAlloc').value,amount,note:$('eNote').value.trim()});
  persist();['eItem','eAmt','eNote'].forEach(i=>$(i).value='');$('eAmtP').textContent='';
  renderExpenses();playOk();showToast('Đã thêm: '+item);
}

/* ════════ SETTLE ════════ */
function renderSettle(){
  const st=unitStats();
  const owe=st.filter(u=>u.balance<-0.5).length;
  const totPay=st.reduce((s,u)=>s+u.mustPay,0);
  $('settleMetrics').innerHTML=
    metric('Tổng phải trả',fmt(totPay),'val-white')+
    metric('Số nhóm còn thiếu',owe,owe?'val-red':'val-green',owe?'cần đóng thêm':'đã đủ')+
    metric('Số lượt chuyển',settleTransfers().length,'val-blue','để cân bằng');
  $('settleTable').innerHTML=`<thead><tr><th>Đơn vị</th><th class="num">Phải trả</th><th class="num">Đã ứng</th><th class="num">Số dư</th><th>Trạng thái</th></tr></thead><tbody>`+
    st.map(u=>{
      const b=u.balance;const pill=b>0.5?'<span class="pill pill-get">Được nhận lại</span>':(b<-0.5?'<span class="pill pill-owe">Phải đóng thêm</span>':'<span class="pill pill-even">Đủ</span>');
      const bc=b>0.5?'val-green':(b<-0.5?'val-red':'');
      return `<tr><td>${unitTag(u.name)}</td><td class="num">${fmt(u.mustPay)}</td><td class="num">${fmt(u.paid)}</td><td class="num ${bc}" style="font-weight:700">${fmtSigned(b)}</td><td>${pill}</td></tr>`;
    }).join('')+
    `<tr class="total-row"><td>TỔNG</td><td class="num">${fmt(totPay)}</td><td class="num">${fmt(st.reduce((s,u)=>s+u.paid,0))}</td><td class="num">${fmtSigned(st.reduce((s,u)=>s+u.balance,0))}</td><td></td></tr></tbody>`;
  const tr=settleTransfers();
  $('transferList').innerHTML=tr.length?tr.map(x=>`<div class="transfer">
      <span class="u-ava" style="background:${unitColor(x.from)};width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:11px">${initials(x.from)}</span>
      <span class="tr-from">${esc(x.from)}</span><span class="tr-arrow">→</span><span class="tr-to">${esc(x.to)}</span>
      <span class="tr-amt">${fmt(x.amt)}</span></div>`).join(''):
    `<div class="empty-nice"><span class="en-emoji">🎉</span>Mọi người đã cân bằng — không cần chuyển khoản!</div>`;
}

/* ════════ STAYS ════════ */
function stayTotal(s){return (+s.price||0)*(+s.nights||0)*(+s.rooms||0);}
function renderStays(){
  const tot=stays.reduce((s,x)=>s+stayTotal(x),0);
  const rooms=stays.reduce((s,x)=>s+(+x.rooms||0),0);
  $('stayMetrics').innerHTML=metric('Tổng tiền lưu trú',fmt(tot),'val-white',stays.length+' nơi ở')+metric('Tổng số phòng',rooms,'val-blue');
  $('stayList').innerHTML=stays.map(s=>`<div class="list-card">
    <div class="lc-ico">🏨</div>
    <div class="lc-body"><div class="lc-title">${esc(s.name)}</div>
      <div class="lc-sub">📍 ${esc(s.addr||'—')}<br>${fmt(s.price)}/phòng/đêm<span class="sep">·</span>${s.rooms} phòng<span class="sep">·</span>${s.nights} đêm<span class="sep">·</span>${s.ppl} người/phòng${s.note?`<span class="sep">·</span>${esc(s.note)}`:''}</div></div>
    <div class="lc-right"><div class="lc-price">${fmt(stayTotal(s))}</div>
      <div class="lc-actions">${actBtn(`openEdit('stay','${s.id}')`,'✏️')}${actBtn(`removeItem('stay','${s.id}')`,'✕','del')}</div></div>
  </div>`).join('')||emptyState('🏨','Chưa có nơi ở');
}
function addStay(){
  const name=$('sName').value.trim();if(!name){showToast('Nhập tên nơi ở',false);return;}
  stays.push({id:uid(),name,addr:$('sAddr').value.trim(),price:parseMoney($('sPrice').value),ppl:+$('sPpl').value||1,nights:+$('sNights').value||1,rooms:+$('sRooms').value||1,note:$('sNote').value.trim()});
  persist();['sName','sAddr','sPrice','sPpl','sNights','sRooms','sNote'].forEach(i=>$(i).value='');$('sPriceP').textContent='';
  renderStays();playOk();showToast('Đã thêm: '+name);
}

/* ════════ ITINERARY ════════ */
function setBuoi(b){curBuoi=b;document.querySelectorAll('#buoiSeg .chi-type-btn').forEach(x=>x.classList.toggle('active',x.dataset.buoi===b));}
// Giờ kiểu VN: "06:30" → "6h30"
function fmtTime(t){if(!t)return'';const p=String(t).split(':');return parseInt(p[0],10)+'h'+(p[1]||'00');}
// Mức ưu tiên: badge to, đập vào mắt ngay
const PRI_META={
  high:{cls:'pri-high',badge:'<span class="tl-pri hi">⭐ ƯU TIÊN</span>'},
  low:{cls:'pri-low',badge:'<span class="tl-pri lo">💤 Bỏ được</span>'},
  normal:{cls:'',badge:''}
};
function priOf(x){return PRI_META[x.pri]||PRI_META.normal;}
function fillTimeSelects(hSel,mSel,val){
  const h=$(hSel),m=$(mSel);if(!h||!m)return;
  if(!h.options.length)h.innerHTML=Array.from({length:24},(_,i)=>`<option value="${String(i).padStart(2,'0')}">${i}h</option>`).join('');
  if(!m.options.length)m.innerHTML=Array.from({length:12},(_,i)=>{const v=String(i*5).padStart(2,'0');return `<option value="${v}">${v} phút</option>`;}).join('');
  if(val){const p=String(val).split(':');h.value=String(parseInt(p[0],10)||0).padStart(2,'0');const mv=String(Math.round((parseInt(p[1],10)||0)/5)*5%60).padStart(2,'0');m.value=mv;}
}
function renderItin(){
  const totCost=itin.reduce((s,x)=>s+(+x.cost||0),0);
  const days=[...new Set(itin.map(x=>x.date))].filter(Boolean).length;
  $('itinMetrics').innerHTML=metric('Số hoạt động',itin.length,'val-white')+metric('Số ngày',days,'val-amber')+metric('Chi phí dự kiến',fmt(totCost),'val-green');
  const byDate={};itin.forEach(x=>{(byDate[x.date]=byDate[x.date]||[]).push(x);});
  const order=b=>BUOIS.indexOf(b);
  const dates=Object.keys(byDate).sort((a,b)=>(a||'').localeCompare(b||''));
  $('itinList').innerHTML=dates.map((dt,di)=>{
    const items=byDate[dt].sort((a,b)=>(order(a.buoi)-order(b.buoi))||(a.time||'').localeCompare(b.time||''));
    const d=parseD(dt);
    const dayCost=items.reduce((s,x)=>s+(+x.cost||0),0);
    return `<div class="day-group"><div class="day-head">
        <div class="day-badge"><div class="db-d">${d?d.getDate():'?'}</div><div class="db-m">${d?MO[d.getMonth()]:''}</div></div>
        <div><div class="dh-title">Ngày ${di+1} · ${fmtDayShort(dt)}</div><div class="dh-sub">${items.length} hoạt động · dự kiến ${fmt(dayCost)}</div></div></div>
      <div class="timeline">${items.map(x=>{
        const pm=priOf(x);
        const placeLine=[x.place?esc(x.place):'',x.addr?esc(x.addr):''].filter(Boolean).join(' — ');
        return `<div class="tl-item buoi-${BUOI_CLASS[x.buoi]||''} ${pm.cls}">
          <div class="tl-top"><span class="tl-time">${fmtTime(x.time)}</span><span class="tl-buoi">${esc(x.buoi)}</span><span class="tl-act">${esc(x.act)}</span>${pm.badge}
            <span class="tl-del">${actBtn(`openEdit('itin','${x.id}')`,'✏️')}${actBtn(`removeItem('itin','${x.id}')`,'✕','del')}</span></div>
          ${placeLine?`<div class="tl-line addr">📍 <span>${placeLine}</span></div>`:''}
          ${x.note?`<div class="tl-line note">📝 <span>${esc(x.note)}</span></div>`:''}
          ${(+x.cost)?`<div class="tl-line cost">💵 <span>${fmt(x.cost)}</span></div>`:''}
        </div>`;}).join('')}</div></div>`;
  }).join('')||emptyState('🗓️','Chưa có lịch trình');
}
function addItin(){
  const act=$('iAct').value.trim();if(!act){showToast('Nhập hoạt động',false);return;}
  const time=($('iHour').value||'07')+':'+($('iMin').value||'00');
  itin.push({id:uid(),date:$('iDate').value||meta.tripStart,buoi:curBuoi,time,act,place:$('iPlace').value.trim(),addr:$('iAddr').value.trim(),pri:$('iPri').value||'normal',cost:parseMoney($('iCost').value),note:$('iNote').value.trim()});
  persist();['iAct','iPlace','iAddr','iCost','iNote'].forEach(i=>$(i).value='');$('iCostP').textContent='';$('iPri').value='normal';
  renderItin();playOk();showToast('Đã thêm hoạt động');
}

/* ════════ PLACES ════════ */
function renderPlaces(){
  const tot=places.reduce((s,x)=>s+(+x.cost||0),0);
  $('placeMetrics').innerHTML=metric('Số địa điểm',places.length,'val-white')+metric('Chi phí/người (tổng)',fmt(tot),'val-green');
  const priRank={'Cao':0,'Trung bình':1,'Thấp':2};
  $('placeList').innerHTML=[...places].sort((a,b)=>(priRank[a.pri]??3)-(priRank[b.pri]??3)).map(p=>{
    const ty=placeTypeOf(p.type);
    const pc=p.pri==='Cao'?'pill-hi':(p.pri==='Trung bình'?'pill-mid':'pill-lo');
    return `<div class="list-card"><div class="lc-ico">${ty.emoji}</div>
      <div class="lc-body"><div class="lc-title">${esc(p.name)}<span class="pill ${pc}">${esc(p.pri)}</span></div>
        <div class="lc-sub">${esc(p.type)}<span class="sep">·</span>📍 ${esc(p.addr||'—')}${p.note?`<span class="sep">·</span>${esc(p.note)}`:''}</div></div>
      <div class="lc-right"><div class="lc-price">${(+p.cost)?fmt(p.cost):'Miễn phí'}</div>
        <div class="lc-actions">${actBtn(`openEdit('place','${p.id}')`,'✏️')}${actBtn(`removeItem('place','${p.id}')`,'✕','del')}</div></div></div>`;
  }).join('')||emptyState('📍','Chưa có địa điểm');
}
function addPlace(){
  const name=$('pName').value.trim();if(!name){showToast('Nhập tên địa điểm',false);return;}
  places.push({id:uid(),name,type:$('pType').value,addr:$('pAddr').value.trim(),cost:parseMoney($('pCost').value),pri:$('pPri').value,note:$('pNote').value.trim()});
  persist();['pName','pAddr','pCost','pNote'].forEach(i=>$(i).value='');$('pCostP').textContent='';
  renderPlaces();playOk();showToast('Đã thêm: '+name);
}

/* ════════ FOOD ════════ */
function renderFood(){
  const tried=foods.filter(f=>f.tried).length;
  $('foodMetrics').innerHTML=metric('Số quán',foods.length,'val-white')+metric('Đã thử',tried+'/'+foods.length,'val-green');
  $('foodList').innerHTML=foods.map(f=>`<div class="list-card${f.tried?' done':''}">
    <div class="check-toggle${f.tried?' on':''}" onclick="toggleFlag('food','${f.id}','tried')"></div>
    <div class="lc-ico">🍜</div>
    <div class="lc-body"><div class="lc-title">${esc(f.name)}</div>
      <div class="lc-sub">${esc(f.dish||'')}<span class="sep">·</span>📍 ${esc(f.addr||'—')}${f.note?`<span class="sep">·</span>${esc(f.note)}`:''}</div></div>
    <div class="lc-right"><div class="lc-price">${(+f.price)?fmt(f.price):'—'}</div>
      <div class="lc-actions">${actBtn(`openEdit('food','${f.id}')`,'✏️')}${actBtn(`removeItem('food','${f.id}')`,'✕','del')}</div></div></div>`).join('')||emptyState('🍜','Chưa có quán nào');
}
function addFood(){
  const name=$('fName').value.trim();if(!name){showToast('Nhập tên quán',false);return;}
  foods.push({id:uid(),name,dish:$('fDish').value.trim(),addr:$('fAddr').value.trim(),price:parseMoney($('fPrice').value),tried:false,note:$('fNote').value.trim()});
  persist();['fName','fDish','fAddr','fPrice','fNote'].forEach(i=>$(i).value='');$('fPriceP').textContent='';
  renderFood();playOk();showToast('Đã thêm: '+name);
}

/* ════════ PACKING ════════ */
function renderPacking(){
  fillUnitSelects();
  const done=packing.filter(p=>p.done).length,pct=packing.length?Math.round(done/packing.length*100):0;
  $('packPct').textContent=pct+'%';$('packBar').style.width=pct+'%';
  $('packList').innerHTML=packing.map(p=>`<div class="list-card${p.done?' done':''}">
    <div class="check-toggle${p.done?' on':''}" onclick="toggleFlag('packing','${p.id}','done')"></div>
    <div class="lc-ico">🎒</div>
    <div class="lc-body"><div class="lc-title">${esc(p.name)}${(+p.qty>1)?`<span class="pill pill-lo">x${p.qty}</span>`:''}</div>
      <div class="lc-sub">${esc(p.group||'')}<span class="sep">·</span>👤 ${esc(p.owner||'—')}${p.note?`<span class="sep">·</span>${esc(p.note)}`:''}</div></div>
    <div class="lc-right"><div class="lc-actions">${actBtn(`openEdit('packing','${p.id}')`,'✏️')}${actBtn(`removeItem('packing','${p.id}')`,'✕','del')}</div></div></div>`).join('')||emptyState('🎒','Chưa có đồ nào');
}
function addPacking(){
  const name=$('kName').value.trim();if(!name){showToast('Nhập tên đồ',false);return;}
  packing.push({id:uid(),name,group:$('kGroup').value.trim(),owner:$('kOwner').value,qty:+$('kQty').value||1,done:false,note:$('kNote').value.trim()});
  persist();['kName','kGroup','kNote'].forEach(i=>$(i).value='');$('kQty').value='1';
  renderPacking();playOk();showToast('Đã thêm: '+name);
}

/* ════════ CHECKLIST ════════ */
function renderChecklist(){
  fillUnitSelects();
  const done=checklist.filter(c=>c.done).length,pct=checklist.length?Math.round(done/checklist.length*100):0;
  $('chkPct').textContent=pct+'%';$('chkBar').style.width=pct+'%';
  const today=new Date();today.setHours(0,0,0,0);
  $('chkList').innerHTML=[...checklist].sort((a,b)=>(a.done-b.done)||((a.due||'').localeCompare(b.due||''))).map(c=>{
    const due=parseD(c.due);let dueTag='';
    if(due&&!c.done){const dd=Math.round((due-today)/864e5);dueTag=dd<0?`<span class="pill pill-owe">Trễ ${-dd}n</span>`:(dd<=3?`<span class="pill pill-mid">Còn ${dd}n</span>`:`<span class="pill pill-lo">${fmtDate(c.due)}</span>`);}
    return `<div class="list-card${c.done?' done':''}">
      <div class="check-toggle${c.done?' on':''}" onclick="toggleFlag('checklist','${c.id}','done')"></div>
      <div class="lc-ico">${c.done?'✅':'📌'}</div>
      <div class="lc-body"><div class="lc-title">${esc(c.task)}</div>
        <div class="lc-sub">👤 ${esc(c.owner||'—')}${c.note?`<span class="sep">·</span>${esc(c.note)}`:''}</div></div>
      <div class="lc-right">${dueTag}<div class="lc-actions">${actBtn(`openEdit('checklist','${c.id}')`,'✏️')}${actBtn(`removeItem('checklist','${c.id}')`,'✕','del')}</div></div></div>`;
  }).join('')||emptyState('✅','Chưa có việc nào');
}
function addCheck(){
  const task=$('cTask').value.trim();if(!task){showToast('Nhập việc cần làm',false);return;}
  checklist.push({id:uid(),task,owner:$('cOwner').value,due:$('cDue').value,done:false,note:$('cNote').value.trim()});
  persist();['cTask','cDue','cNote'].forEach(i=>$(i).value='');
  renderChecklist();playOk();showToast('Đã thêm việc');
}

/* ════════ GENERIC CRUD ════════ */
const COLL={unit:()=>units,expense:()=>expenses,stay:()=>stays,itin:()=>itin,place:()=>places,food:()=>foods,packing:()=>packing,checklist:()=>checklist};
const RERENDER={unit:renderMembers,expense:renderExpenses,stay:renderStays,itin:renderItin,place:renderPlaces,food:renderFood,packing:renderPacking,checklist:renderChecklist};
function setColl(type,arr){({unit:v=>units=v,expense:v=>expenses=v,stay:v=>stays=v,itin:v=>itin=v,place:v=>places=v,food:v=>foods=v,packing:v=>packing=v,checklist:v=>checklist=v})[type](arr);}
function removeItem(type,id){
  if(!confirm('Xoá mục này?'))return;
  setColl(type,COLL[type]().filter(x=>x.id!==id));
  persist();RERENDER[type]();
  if(type==='unit'||type==='expense'){renderOverview();} // keep overview fresh conceptually
  playClick();showToast('Đã xoá');
}
function toggleFlag(type,id,key){
  const it=COLL[type]().find(x=>x.id===id);if(!it)return;it[key]=!it[key];persist();RERENDER[type]();if(it[key])playOk();
}

/* ── EDIT MODAL (schema-driven) ── */
const SCHEMAS={
  unit:{title:'✏️ Sửa thành viên',fields:[
    {k:'name',l:'Tên (cặp / người)',t:'text'},{k:'people',l:'Số người',t:'number'},
    {k:'go',l:'Ngày đi',t:'date'},{k:'back',l:'Ngày về',t:'date'},
    {k:'tGo',l:'Giờ đi',t:'time'},{k:'tBack',l:'Giờ về',t:'time'},{k:'note',l:'Ghi chú',t:'text'}]},
  expense:{title:'✏️ Sửa chi phí',fields:[
    {k:'date',l:'Ngày',t:'date'},{k:'item',l:'Khoản mục',t:'text'},{k:'cat',l:'Loại',t:'cat'},
    {k:'payer',l:'Người chi',t:'unit'},{k:'alloc',l:'Phân bổ cho',t:'alloc'},
    {k:'amount',l:'Số tiền (₫)',t:'money'},{k:'note',l:'Ghi chú',t:'text'}]},
  stay:{title:'✏️ Sửa nơi ở',fields:[
    {k:'name',l:'Tên',t:'text'},{k:'addr',l:'Địa chỉ',t:'text'},{k:'price',l:'Giá/phòng/đêm',t:'money'},
    {k:'ppl',l:'Người/phòng',t:'number'},{k:'nights',l:'Số đêm',t:'number'},{k:'rooms',l:'Số phòng',t:'number'},{k:'note',l:'Ghi chú',t:'text'}]},
  itin:{title:'✏️ Sửa hoạt động',fields:[
    {k:'date',l:'Ngày',t:'date'},{k:'buoi',l:'Buổi',t:'select',opt:BUOIS},{k:'time',l:'Giờ (0h → 23h)',t:'time24'},
    {k:'act',l:'Hoạt động',t:'text'},{k:'place',l:'Địa điểm (tên nơi)',t:'text'},{k:'addr',l:'Địa chỉ cụ thể',t:'text'},
    {k:'pri',l:'Mức độ ưu tiên',t:'pri'},{k:'cost',l:'Chi phí dự kiến',t:'money'},{k:'note',l:'Ghi chú',t:'text'}]},
  place:{title:'✏️ Sửa địa điểm',fields:[
    {k:'name',l:'Tên',t:'text'},{k:'type',l:'Loại',t:'placetype'},{k:'addr',l:'Địa chỉ',t:'text'},
    {k:'cost',l:'Chi phí/người',t:'money'},{k:'pri',l:'Ưu tiên',t:'select',opt:['Cao','Trung bình','Thấp']},{k:'note',l:'Ghi chú',t:'text'}]},
  food:{title:'✏️ Sửa quán ăn',fields:[
    {k:'name',l:'Tên quán',t:'text'},{k:'dish',l:'Món / đặc sản',t:'text'},{k:'addr',l:'Địa chỉ',t:'text'},
    {k:'price',l:'Giá tham khảo',t:'money'},{k:'note',l:'Ghi chú',t:'text'}]},
  packing:{title:'✏️ Sửa đồ mang theo',fields:[
    {k:'name',l:'Món đồ',t:'text'},{k:'group',l:'Nhóm đồ',t:'text'},{k:'owner',l:'Người mang',t:'unit'},
    {k:'qty',l:'Số lượng',t:'number'},{k:'note',l:'Ghi chú',t:'text'}]},
  checklist:{title:'✏️ Sửa việc',fields:[
    {k:'task',l:'Việc cần làm',t:'text'},{k:'owner',l:'Phụ trách',t:'unit'},{k:'due',l:'Hạn chót',t:'date'},{k:'note',l:'Ghi chú',t:'text'}]}
};
let editing=null;
function openEdit(type,id){
  const it=COLL[type]().find(x=>x.id===id);if(!it)return;
  editing={type,id,oldName:type==='unit'?it.name:null};
  const sc=SCHEMAS[type];$('editTitle').textContent=sc.title;
  $('editBody').innerHTML=sc.fields.map(f=>{
    const v=it[f.k];let ctrl='';
    if(f.t==='text')ctrl=`<input type="text" id="ed_${f.k}" value="${esc(v)}"/>`;
    else if(f.t==='number')ctrl=`<input type="number" id="ed_${f.k}" value="${esc(v)}"/>`;
    else if(f.t==='date')ctrl=`<input type="date" id="ed_${f.k}" value="${esc(v)}"/>`;
    else if(f.t==='time')ctrl=`<input type="time" id="ed_${f.k}" value="${esc(v)}"/>`;
    else if(f.t==='time24'){
      const p=String(v||'07:00').split(':');const hv=String(parseInt(p[0],10)||0).padStart(2,'0');const mv=String(Math.round((parseInt(p[1],10)||0)/5)*5%60).padStart(2,'0');
      const hOpts=Array.from({length:24},(_,i)=>{const iv=String(i).padStart(2,'0');return `<option value="${iv}"${iv===hv?' selected':''}>${i}h</option>`;}).join('');
      const mOpts=Array.from({length:12},(_,i)=>{const iv=String(i*5).padStart(2,'0');return `<option value="${iv}"${iv===mv?' selected':''}>${iv} phút</option>`;}).join('');
      ctrl=`<div style="display:flex;gap:6px;align-items:center;"><select id="ed_${f.k}_h" style="flex:1;">${hOpts}</select><span style="color:var(--text3);font-weight:700;">:</span><select id="ed_${f.k}_m" style="flex:1;">${mOpts}</select></div>`;
    }
    else if(f.t==='pri')ctrl=`<select id="ed_${f.k}"><option value="normal"${(!v||v==='normal')?' selected':''}>🔘 Bình thường</option><option value="high"${v==='high'?' selected':''}>⭐ ƯU TIÊN — nhất định phải đi</option><option value="low"${v==='low'?' selected':''}>💤 Không ưu tiên — bỏ được</option></select>`;
    else if(f.t==='money')ctrl=`<input type="text" inputmode="decimal" id="ed_${f.k}" value="${v||''}"/>`;
    else if(f.t==='select')ctrl=`<select id="ed_${f.k}">${f.opt.map(o=>`<option${o===v?' selected':''}>${esc(o)}</option>`).join('')}</select>`;
    else if(f.t==='cat')ctrl=`<select id="ed_${f.k}">${EXP_CATS.map(c=>`<option value="${c.name}"${c.name===v?' selected':''}>${c.emoji} ${c.name}</option>`).join('')}</select>`;
    else if(f.t==='placetype')ctrl=`<select id="ed_${f.k}">${PLACE_TYPES.map(c=>`<option value="${c.name}"${c.name===v?' selected':''}>${c.emoji} ${c.name}</option>`).join('')}</select>`;
    else if(f.t==='unit')ctrl=`<select id="ed_${f.k}">${units.map(u=>`<option${u.name===v?' selected':''}>${esc(u.name)}</option>`).join('')}</select>`;
    else if(f.t==='alloc')ctrl=`<select id="ed_${f.k}"><option${v===GROUP?' selected':''}>${GROUP}</option>${units.map(u=>`<option${u.name===v?' selected':''}>${esc(u.name)}</option>`).join('')}</select>`;
    return `<div class="edit-field"><label>${f.l}</label>${ctrl}</div>`;
  }).join('');
  $('editOverlay').classList.add('show');
}
function closeEdit(){$('editOverlay').classList.remove('show');editing=null;}
function saveEdit(){
  if(!editing)return;const {type,id,oldName}=editing;const sc=SCHEMAS[type];
  const it=COLL[type]().find(x=>x.id===id);if(!it){closeEdit();return;}
  sc.fields.forEach(f=>{
    if(f.t==='time24'){
      const h=$('ed_'+f.k+'_h'),m=$('ed_'+f.k+'_m');
      if(h&&m)it[f.k]=h.value+':'+m.value;
      return;
    }
    const el=$('ed_'+f.k);if(!el)return;let val=el.value;
    if(f.t==='number')val=+val||0;else if(f.t==='money')val=parseMoney(val);else val=String(val).trim();
    it[f.k]=val;
  });
  // cascade rename references if a unit was renamed
  if(type==='unit'&&oldName&&it.name!==oldName){
    expenses.forEach(e=>{if(e.payer===oldName)e.payer=it.name;if(e.alloc===oldName)e.alloc=it.name;});
    packing.forEach(p=>{if(p.owner===oldName)p.owner=it.name;});
    checklist.forEach(c=>{if(c.owner===oldName)c.owner=it.name;});
  }
  persist();RERENDER[type]();closeEdit();playOk();showToast('Đã lưu');
}
function deleteEditing(){if(!editing)return;const {type,id}=editing;closeEdit();removeItem(type,id);}

/* ── SETTINGS / META ── */
function renderSettings(){
  renderThemeRow();
  $('soundToggle').className='toggle'+(soundOn?' on':'');
  $('tripName').value=meta.tripName||'';
  $('tripStart').value=meta.tripStart||'';
  if(window.fbRenderSync)window.fbRenderSync();
}
function saveMeta(){meta.tripName=$('tripName').value;meta.tripStart=$('tripStart').value;persist();$('sidebarDate')&&(($('sidebarDate').textContent=meta.tripStart?fmtDate(meta.tripStart):''));}

/* ── EXPORT / IMPORT ── */
function exportCSV(){
  const rows=[['Ngày','Khoản mục','Loại','Người chi','Phân bổ','Số tiền','Ghi chú']];
  [...expenses].sort((a,b)=>(a.date||'').localeCompare(b.date||'')).forEach(e=>rows.push([e.date,e.item,e.cat,e.payer,e.alloc,e.amount,e.note]));
  const csv='﻿'+rows.map(r=>r.map(c=>`"${String(c==null?'':c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const b=new Blob([csv],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='chiphi-dalat.csv';a.click();showToast('Đã xuất CSV');
}
function exportJSON(){
  const data={units,expenses,stays,itin,places,foods,packing,checklist,meta};
  const b=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='backup-plan-dalat.json';a.click();showToast('Đã xuất backup');
}
function importJSON(ev){
  const f=ev.target.files[0];if(!f)return;const r=new FileReader();
  r.onload=e=>{try{const d=JSON.parse(e.target.result);
    if(d.units)units=d.units;if(d.expenses)expenses=d.expenses;if(d.stays)stays=d.stays;if(d.itin)itin=d.itin;if(d.places)places=d.places;if(d.foods)foods=d.foods;if(d.packing)packing=d.packing;if(d.checklist)checklist=d.checklist;if(d.meta)meta=d.meta;
    persist();showPage('overview');showToast('Đã nhập dữ liệu');
  }catch(err){showToast('File không hợp lệ',false);}};
  r.readAsText(f);ev.target.value='';
}
function resetAll(){if(!confirm('Xoá TOÀN BỘ dữ liệu chuyến đi?'))return;Object.values(S).forEach(k=>localStorage.removeItem(k));location.reload();}
function loadSeed(){if(!confirm('Nạp lại dữ liệu mẫu Đà Lạt? Dữ liệu hiện tại sẽ bị thay thế.'))return;
  units=withIds(SEED.units);expenses=withIds(SEED.expenses);stays=withIds(SEED.stays);itin=withIds(SEED.itin);places=withIds(SEED.places);foods=withIds(SEED.foods);packing=withIds(SEED.packing);checklist=withIds(SEED.checklist);meta={...SEED.meta};persist();showPage('overview');showToast('Đã nạp dữ liệu mẫu');}

/* ════════ COUNT-UP ANIMATION (reuse từ finance app) ════════ */
function animateCount(el,duration=900){
  if(!el||el._acRaf)return;const text=el.textContent;
  const m=text.match(/[\d.]*\d/);if(!m)return;
  const numStr=m[0];const num=parseInt(numStr.replace(/\./g,''),10)||0;if(num===0)return;
  const pre=text.slice(0,m.index),post=text.slice(m.index+numStr.length);
  const start=performance.now();
  const ease=t=>t===1?1:1-Math.pow(2,-10*t);
  function tick(now){const p=Math.min((now-start)/duration,1);const cur=Math.round(num*ease(p));el.textContent=pre+cur.toLocaleString('vi-VN')+post;if(p<1)el._acRaf=requestAnimationFrame(tick);else{el._acRaf=null;el.textContent=text;}}
  el._acRaf=requestAnimationFrame(tick);
}
function runCountingAnimations(){document.querySelectorAll('.page.active .metric .val').forEach((el,i)=>setTimeout(()=>animateCount(el,800+i*80),80+i*70));}

/* ── RIPPLE ── */
document.addEventListener('pointerdown',function(e){const b=e.target.closest('.btn,.btn-full');if(!b)return;const r=b.getBoundingClientRect(),c=document.createElement('span');c.className='ripple';const sz=Math.max(r.width,r.height);c.style.width=c.style.height=sz+'px';c.style.left=(e.clientX-r.left-sz/2)+'px';c.style.top=(e.clientY-r.top-sz/2)+'px';b.appendChild(c);setTimeout(()=>c.remove(),600);},{passive:true});

/* ════════ GLASS NAV PILL (reuse) ════════ */
function gnItems(){const n=$('glassNav');return n?[].slice.call(n.querySelectorAll('.gn-item')):[];}
function gnPlacePill(item,instant){const nav=$('glassNav'),pill=$('gnPill');if(!nav||!pill||!item)return;const nr=nav.getBoundingClientRect(),ir=item.getBoundingClientRect();if(!ir.width)return;if(instant)pill.classList.add('dragging');pill.style.width=ir.width+'px';pill.style.transform='translateX('+(ir.left-nr.left)+'px)';if(instant){void pill.offsetWidth;pill.classList.remove('dragging');}}
function gnSync(instant){const items=gnItems();if(!items.length)return;const active=$('glassNav').querySelector('.gn-item.active')||items[0];requestAnimationFrame(()=>gnPlacePill(active,instant));}
(function(){const nav=$('glassNav');if(!nav)return;let dragging=false,startX=0,curIdx=-1;
  function nearestIdx(x){const items=gnItems();let best=0,bd=1e9;items.forEach((it,i)=>{const r=it.getBoundingClientRect();const c=r.left+r.width/2;const d=Math.abs(x-c);if(d<bd){bd=d;best=i;}});return best;}
  function highlight(i){gnItems().forEach((it,k)=>it.classList.toggle('active',k===i));}
  function follow(x){const items=gnItems();if(!items.length)return;const nr=nav.getBoundingClientRect(),pill=$('gnPill');const w=items[0].getBoundingClientRect().width;let px=x-nr.left-w/2;const pad=6,mx=nr.width-pad-w;px=Math.max(pad,Math.min(mx,px));pill.style.width=w+'px';pill.style.transform='translateX('+px+'px)';}
  nav.addEventListener('pointerdown',e=>{dragging=true;startX=e.clientX;$('gnPill').classList.add('dragging');curIdx=nearestIdx(e.clientX);highlight(curIdx);try{nav.setPointerCapture(e.pointerId);}catch(_){}});
  nav.addEventListener('pointermove',e=>{if(!dragging)return;const i=nearestIdx(e.clientX);if(i!==curIdx){curIdx=i;highlight(i);hapticTap();}follow(e.clientX);});
  nav.addEventListener('pointerup',e=>{if(!dragging)return;dragging=false;$('gnPill').classList.remove('dragging');const items=gnItems();const i=nearestIdx(e.clientX!=null?e.clientX:startX);gnPlacePill(items[i]);const page=items[i]&&items[i].dataset.page;if(page)showPage(page);});
  nav.addEventListener('pointercancel',()=>{dragging=false;$('gnPill').classList.remove('dragging');gnSync();});
})();
window.addEventListener('resize',()=>gnSync(true));
window.addEventListener('orientationchange',()=>setTimeout(()=>gnSync(true),250));
setTimeout(()=>gnSync(true),300);

/* ════════ SCI-FI ENERGY BACKGROUND (reuse) ════════ */
(function(){
  const canvas=$('scifiBg');if(!canvas)return;const ctx=canvas.getContext('2d');
  let w,h,t=0,raf=null,last=0;const MOBILE=innerWidth<768;const FRAME=1000/30;
  const N_ORBS=MOBILE?4:6,N_PARTS=MOBILE?16:38,N_STREAKS=MOBILE?3:5;
  function resize(){w=canvas.width=innerWidth;h=canvas.height=innerHeight;}resize();addEventListener('resize',resize);
  const orbs=[];for(let i=0;i<N_ORBS;i++)orbs.push({x:Math.random(),y:Math.random(),r:Math.random()*180+120,vx:(Math.random()-.5)*.0004,vy:(Math.random()-.5)*.0003,hue:[160,190,150,200,175,140][i],phase:Math.random()*Math.PI*2});
  const parts=[];for(let i=0;i<N_PARTS;i++)parts.push({x:Math.random(),y:Math.random(),size:Math.random()*1.8+.4,speed:Math.random()*.0006+.0002,hue:Math.random()>.5?160:190,phase:Math.random()*Math.PI*2,drift:(Math.random()-.5)*.0003});
  const streaks=[];for(let i=0;i<N_STREAKS;i++)streaks.push({y:Math.random(),speed:Math.random()*.002+.001,len:Math.random()*.25+.15,hue:Math.random()>.5?160:190,progress:Math.random()});
  function sprite(d,stops){const c=document.createElement('canvas');c.width=c.height=d;const g=c.getContext('2d'),r=d/2,gr=g.createRadialGradient(r,r,0,r,r,r);stops.forEach(s=>gr.addColorStop(s[0],s[1]));g.fillStyle=gr;g.fillRect(0,0,d,d);return c;}
  const glow={};[160,190].forEach(hue=>glow[hue]=sprite(64,[[0,'hsla('+hue+',90%,60%,1)'],[1,'hsla('+hue+',90%,60%,0)']]));
  const orbS={};[160,190,150,200,175,140].forEach(hue=>orbS[hue]=sprite(256,[[0,'hsla('+hue+',80%,55%,.10)'],[.5,'hsla('+hue+',75%,45%,.04)'],[1,'hsla('+hue+',70%,40%,0)']]));
  function draw(){t+=.008;ctx.clearRect(0,0,w,h);
    orbs.forEach(o=>{o.x+=o.vx;o.y+=o.vy;o.phase+=.005;if(o.x<-.2)o.x=1.2;if(o.x>1.2)o.x=-.2;if(o.y<-.2)o.y=1.2;if(o.y>1.2)o.y=-.2;const R=o.r*(Math.sin(o.phase)*.25+.75),sp=orbS[o.hue]||orbS[160];ctx.drawImage(sp,Math.floor(o.x*w-R),Math.floor(o.y*h-R),R*2,R*2);});
    ctx.strokeStyle='hsla(165,70%,55%,.03)';ctx.lineWidth=.5;const hz=h*.5,shift=(t*18)%40;for(let y=hz;y<h+40;y+=40){const yy=y+shift;if(yy>h)continue;ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(w,yy);ctx.stroke();}for(let x=0;x<=w;x+=60){ctx.beginPath();ctx.moveTo(x,hz);ctx.lineTo(x,h);ctx.stroke();}
    parts.forEach(p=>{p.y-=p.speed;p.x+=Math.sin(t*2+p.phase)*p.drift;if(p.y<-.02){p.y=1.02;p.x=Math.random();}const a=.25+Math.sin(t*3+p.phase)*.15;ctx.beginPath();ctx.arc(p.x*w,p.y*h,p.size,0,Math.PI*2);ctx.fillStyle='hsla('+p.hue+',90%,65%,'+a+')';ctx.fill();const gr=p.size*5,sp=glow[p.hue]||glow[160];ctx.globalAlpha=a*.3;ctx.drawImage(sp,Math.floor(p.x*w-gr),Math.floor(p.y*h-gr),gr*2,gr*2);ctx.globalAlpha=1;});
    streaks.forEach(s=>{s.progress+=s.speed;if(s.progress>1.3){s.progress=-.3;s.y=Math.random();}const x1=s.progress*w,x2=x1-s.len*w,gr=ctx.createLinearGradient(x2,0,x1,0);gr.addColorStop(0,'hsla('+s.hue+',90%,60%,0)');gr.addColorStop(.8,'hsla('+s.hue+',90%,65%,.22)');gr.addColorStop(1,'hsla('+s.hue+',95%,75%,.45)');ctx.strokeStyle=gr;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x2,s.y*h);ctx.lineTo(x1,s.y*h);ctx.stroke();ctx.beginPath();ctx.arc(x1,s.y*h,2,0,Math.PI*2);ctx.fillStyle='hsla('+s.hue+',95%,80%,.55)';ctx.fill();});
  }
  function frame(now){raf=requestAnimationFrame(frame);if((now||0)-last<FRAME)return;last=now||0;draw();}
  function start(){if(!raf)raf=requestAnimationFrame(frame);}function stop(){if(raf){cancelAnimationFrame(raf);raf=null;}}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else{last=0;start();}});start();
})();

/* ════════ SYNC BRIDGE (dùng bởi sync.js — Firebase) ════════ */
function rerenderActive(){fillUnitSelects();if(RENDER[curPage])RENDER[curPage]();runCountingAnimations();}
window.DL={
  // đọc toàn bộ dữ liệu chuyến đi để đẩy lên Firebase
  get(){return {units,expenses,stays,itin,places,foods,packing,checklist,meta};},
  // áp dữ liệu từ Firebase vào local (KHÔNG đẩy ngược lên để tránh vòng lặp)
  set(d){
    if(!d||typeof d!=='object')return;
    // Firebase KHÔNG lưu mảng rỗng → key biến mất khỏi snapshot. Vì pushNow luôn
    // gửi đủ 8 mảng, một key vắng mặt nghĩa là "mảng đó đã bị xoá sạch" ⇒ áp thành []
    // (nếu chỉ dùng `if(Array.isArray)` thì thao tác xoá hết sẽ KHÔNG đồng bộ sang máy khác).
    const pick=(k,cur)=>Array.isArray(d[k])?d[k]:(k in d?cur:[]);
    units    = pick('units',units);
    expenses = pick('expenses',expenses);
    stays    = pick('stays',stays);
    itin     = pick('itin',itin);
    places   = pick('places',places);
    foods    = pick('foods',foods);
    packing  = pick('packing',packing);
    checklist= pick('checklist',checklist);
    if(d.meta&&typeof d.meta==='object')meta=d.meta;
    persistLocal();
    if($('sidebarDate'))$('sidebarDate').textContent=meta.tripStart?fmtDate(meta.tripStart):'';
    rerenderActive();
  },
  toast:showToast
};

/* ════════ SPLASH ════════ */
function hideSplash(){const s=$('appSplash');if(!s)return;s.style.opacity='0';setTimeout(()=>{if(s&&s.parentNode)s.parentNode.removeChild(s);},400);}

/* ════════ INIT ════════ */
function init(){
  document.body.setAttribute('data-theme',theme);
  $('privacyFab').textContent='👁';
  if($('sidebarDate'))$('sidebarDate').textContent=meta.tripStart?fmtDate(meta.tripStart):'';
  // default dates on add-forms
  const today=new Date().toISOString().slice(0,10);
  ['eDate','iDate','cDue'].forEach(id=>{if($(id)&&!$(id).value)$(id).value=meta.tripStart||today;});
  ['mGo','mBack'].forEach(id=>{if($(id))$(id).value=meta.tripStart||today;});
  fillTimeSelects('iHour','iMin','07:00');
  fillUnitSelects();
  renderOverview();
  runCountingAnimations();
  // Chưa từng đăng nhập & không chọn offline → hiện màn đăng nhập NGAY (dưới splash),
  // splash mờ đi là thấy luôn. (sync.js sẽ gắn nút khi Firebase sẵn sàng.)
  if(!localStorage.getItem('dl_authed')&&!localStorage.getItem('dl_offline')){
    const fb=$('fbLogin');if(fb)fb.style.display='flex';
  }
  // Ẩn splash nhanh (~0.35s) — dữ liệu local có sẵn, không cần chờ.
  setTimeout(hideSplash,350);
}
init();
