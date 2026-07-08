/* ═══════════════════════════════════════════════════════════════
   🔥 FIREBASE REALTIME SYNC — Plan Đà Lạt
   Dùng chung project finance-fb03b. Dữ liệu chuyến đi nằm dưới
   node  trips/{mã_chuyến}  — tách biệt hoàn toàn với users/ & makeupUsers/.
   Nhiều người nhập cùng "mã chuyến đi" → cùng xem/sửa realtime.
═══════════════════════════════════════════════════════════════ */
(function(){
  const FIREBASE_CONFIG={apiKey:"AIzaSyDTGFDXo390dH3sIZMBmw4J6E6XtBYuTY8",authDomain:"finance-fb03b.firebaseapp.com",databaseURL:"https://finance-fb03b-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"finance-fb03b",storageBucket:"finance-fb03b.firebasestorage.app",messagingSenderId:"724966318747",appId:"1:724966318747:web:4426dc76d0ec7780a21c3e"};

  const $=id=>document.getElementById(id);
  const CLIENT='c'+Math.random().toString(36).slice(2)+Date.now().toString(36);
  const FB={ready:false,auth:null,db:null,user:null,tripId:localStorage.getItem('dl_tripId')||'',ref:null,pushTimer:null,applying:false,mode:'login',status:''};
  const urlTrip=(new URLSearchParams(location.search).get('trip')||'').trim();

  function toast(m,ok){if(window.DL&&window.DL.toast)window.DL.toast(m,ok!==false);}
  function nowTime(){return new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit',second:'2-digit'});}
  function setStatus(s){FB.status=s;renderBox();}

  /* ── Chờ Firebase SDK sẵn sàng (nạp defer) ── */
  function boot(){
    if(typeof firebase==='undefined'||!firebase.initializeApp){return setTimeout(boot,100);}
    try{firebase.initializeApp(FIREBASE_CONFIG);}catch(e){/* đã init */}
    FB.auth=firebase.auth();FB.db=firebase.database();FB.ready=true;
    FB.auth.onAuthStateChanged(function(u){
      FB.user=u||null;
      if(u){
        localStorage.setItem('dl_authed','1');
        closeLogin();
        if(!FB.tripId&&urlTrip){FB.tripId=urlTrip;localStorage.setItem('dl_tripId',urlTrip);}
        if(FB.tripId)subscribe();
        else openTrip();                 // đã đăng nhập nhưng chưa có mã → hiện màn nhập mã ngay
      }else{
        if(FB.ref){FB.ref.off();FB.ref=null;}
        if(!localStorage.getItem('dl_offline'))openLogin();  // chưa đăng nhập → hiện màn đăng nhập
      }
      renderBox();
    });
    renderBox();
  }
  boot();

  /* ── AUTH ── */
  window.fbSetMode=function(m){FB.mode=m;
    document.querySelectorAll('#fbSeg button').forEach(b=>b.classList.toggle('on',b.dataset.mode===m));
    $('fbGoBtn').textContent=m==='signup'?'Tạo tài khoản':'Đăng nhập';
    $('fbSub').textContent=m==='signup'?'Tạo tài khoản để cả nhóm cùng đồng bộ':'Đăng nhập để cả nhóm cùng chỉnh sửa realtime';
    $('fbPass').setAttribute('autocomplete',m==='signup'?'new-password':'current-password');
  };
  window.fbOpenLogin=openLogin;
  function openLogin(){localStorage.removeItem('dl_offline');$('fbErr').textContent='';$('fbLogin').style.display='flex';}
  function closeLogin(){$('fbLogin').style.display='none';}
  window.fbCloseLogin=function(){localStorage.setItem('dl_offline','1');closeLogin();};
  window.fbSubmitAuth=function(e){
    e.preventDefault();
    const email=$('fbEmail').value.trim(),pass=$('fbPass').value;
    if(!email||!pass){$('fbErr').textContent='Nhập email & mật khẩu';return;}
    $('fbGoBtn').textContent='Đang xử lý…';
    const p=FB.mode==='signup'?FB.auth.createUserWithEmailAndPassword(email,pass):FB.auth.signInWithEmailAndPassword(email,pass);
    p.then(function(cred){
      FB.user=(cred&&cred.user)||FB.user;
      localStorage.setItem('dl_authed','1');localStorage.removeItem('dl_offline');
      closeLogin();$('fbPass').value='';
      toast('Đã đăng nhập');
      if(urlTrip&&!FB.tripId){FB.tripId=urlTrip;localStorage.setItem('dl_tripId',urlTrip);subscribe();}
      else if(FB.tripId)subscribe();
      else openTrip();                    // đăng nhập xong → hiện màn nhập mã ngay
    }).catch(function(err){
      $('fbErr').textContent=friendlyErr(err.code||err.message);
      $('fbGoBtn').textContent=FB.mode==='signup'?'Tạo tài khoản':'Đăng nhập';
    });
  };
  window.fbLogout=function(){
    if(!confirm('Đăng xuất? App vẫn dùng được offline.'))return;
    FB.auth.signOut();FB.tripId='';
    localStorage.removeItem('dl_tripId');localStorage.removeItem('dl_authed');localStorage.setItem('dl_offline','1');
    if(FB.ref){FB.ref.off();FB.ref=null;}
    setStatus('');toast('Đã đăng xuất');
  };
  function friendlyErr(c){c=String(c);
    if(/user-not-found|invalid-credential|wrong-password/.test(c))return'Sai email hoặc mật khẩu';
    if(/email-already-in-use/.test(c))return'Email đã được đăng ký — hãy đăng nhập';
    if(/weak-password/.test(c))return'Mật khẩu quá ngắn (tối thiểu 6 ký tự)';
    if(/invalid-email/.test(c))return'Email không hợp lệ';
    if(/network/.test(c))return'Lỗi mạng — kiểm tra internet';
    return'Lỗi: '+c;
  }

  /* ── TRIP CODE ── */
  window.fbOpenTrip=openTrip;
  function openTrip(){if(!FB.user&&!localStorage.getItem('dl_authed')){openLogin();return;}$('tripCodeInput').value=FB.tripId||'';$('tripModal').classList.add('show');}
  window.fbCloseTrip=function(){$('tripModal').classList.remove('show');};
  window.fbJoinTrip=function(){
    let code=($('tripCodeInput').value||'').trim().toLowerCase().replace(/\s+/g,'-');
    if(!code){toast('Nhập mã chuyến đi',false);return;}
    FB.tripId=code;localStorage.setItem('dl_tripId',code);
    $('tripModal').classList.remove('show');
    subscribe();toast('Đã vào chuyến: '+code);
  };
  window.fbCreateTrip=function(){
    const code='dalat-'+Math.random().toString(36).slice(2,8);
    $('tripCodeInput').value=code;
    FB.tripId=code;localStorage.setItem('dl_tripId',code);
    $('tripModal').classList.remove('show');
    subscribe(true);toast('Đã tạo mã: '+code);
  };
  window.fbCopyTrip=function(){
    const link=location.origin+location.pathname+'?trip='+encodeURIComponent(FB.tripId);
    (navigator.clipboard?navigator.clipboard.writeText(link):Promise.reject()).then(()=>toast('Đã copy link mời')).catch(()=>{prompt('Copy link mời:',link);});
  };

  /* ── SYNC ── */
  function subscribe(seed){
    if(!FB.ready||!FB.user||!FB.tripId)return;
    if(FB.ref)FB.ref.off();
    FB.ref=FB.db.ref('trips/'+FB.tripId);
    setStatus('Đang kết nối…');
    FB.ref.on('value',function(snap){
      const val=snap.val();
      if(!val){pushNow();return;}          // chuyến trống → đẩy dữ liệu local làm gốc
      if(val._writer===CLIENT)return;       // bỏ qua thay đổi do chính mình gây ra
      const data={};Object.keys(val).forEach(k=>{if(k[0]!=='_')data[k]=val[k];});
      FB.applying=true;
      try{window.DL.set(data);}finally{FB.applying=false;}
      setStatus('✓ Đã đồng bộ · '+nowTime());
    },function(err){setStatus('✗ '+friendlyErr(err.code||err.message));});
    if(seed)setTimeout(pushNow,300);
  }
  function pushNow(){
    if(!FB.ref||!FB.user||FB.applying)return;
    const d=window.DL.get();
    FB.ref.set(Object.assign({},d,{_writer:CLIENT,_ts:Date.now()}))
      .then(()=>setStatus('✓ Đã lưu đám mây · '+nowTime()))
      .catch(err=>setStatus('✗ '+friendlyErr(err.code||err.message)));
  }
  // Gọi bởi app.js mỗi khi dữ liệu đổi (debounce để gộp nhiều thao tác)
  window.__fbPush=function(){
    if(!FB.ready||!FB.user||!FB.tripId||FB.applying)return;
    clearTimeout(FB.pushTimer);FB.pushTimer=setTimeout(pushNow,450);
  };

  /* ── SETTINGS BOX ── */
  window.fbRenderSync=renderBox;
  function renderBox(){
    const box=$('syncBox');if(!box)return;
    let html='';
    if(!FB.ready){html=`<div style="font-size:11px;color:var(--text3)">Đang khởi tạo Firebase…</div>`;}
    else if(!FB.user){
      html=`<div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:10px">Chưa đăng nhập — dữ liệu chỉ lưu trên máy này. Đăng nhập để cả nhóm cùng chỉnh sửa <b>realtime</b>.</div>
        <button class="btn-full btn-full-green" onclick="fbOpenLogin()">🔗 Kết nối để đồng bộ</button>`;
    }else{
      const email=FB.user.email||'(đã đăng nhập)';
      const st=FB.status?`<div style="font-size:10.5px;color:var(--text3);margin-top:8px">${st_esc(FB.status)}</div>`:'';
      if(!FB.tripId){
        html=`<div style="font-size:12px;color:var(--text2);margin-bottom:10px">👤 <b>${st_esc(email)}</b><br>Chưa chọn chuyến đi. Tạo mã mới rồi chia sẻ, hoặc nhập mã được cho.</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-accent" onclick="fbOpenTrip()">🧭 Chọn / tạo mã chuyến</button><button class="btn" onclick="fbLogout()">Đăng xuất</button></div>${st}`;
      }else{
        html=`<div style="font-size:12px;color:var(--text2);margin-bottom:6px">👤 <b>${st_esc(email)}</b></div>
          <div style="display:flex;align-items:center;gap:8px;background:var(--bg3);border:.5px solid var(--border2);border-radius:9px;padding:8px 11px;margin-bottom:10px">
            <span style="font-size:10px;color:var(--text3)">MÃ CHUYẾN</span>
            <b style="font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--accent);letter-spacing:.5px">${st_esc(FB.tripId)}</b>
            <button class="btn" style="margin-left:auto" onclick="fbCopyTrip()">🔗 Copy link mời</button>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-accent" onclick="fbOpenTrip()">Đổi mã</button><button class="btn" onclick="fbLogout()">Đăng xuất</button></div>${st}`;
      }
    }
    box.innerHTML=html;
  }
  function st_esc(s){return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
})();
