/* ============================================================
   Travel Diary — frontend app (Google Maps)
   Boot order: fetch /api/config -> load Google Maps with key -> run().
   ============================================================ */

/* ---------- icons ---------- */
var IC={
  walk:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4" r="1.6"/><path d="M11 21l1.5-6 3 2v4M8 12l3-4 2 3 3 1M9 21l1-4"/></svg>',
  bike:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17" r="3.5"/><circle cx="18.5" cy="17" r="3.5"/><path d="M12 17l-2.5-6 4-0.5M9.5 11l2 0M15 6.5h2"/></svg>',
  car:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13l1.5-4.5A2 2 0 017.4 7h9.2a2 2 0 011.9 1.5L20 13M4 13h16v4a1 1 0 01-1 1h-1.5a1 1 0 01-1-1M4 13v4a1 1 0 001 1h1.5a1 1 0 001-1"/><circle cx="7.5" cy="15.5" r=".6" fill="currentColor"/><circle cx="16.5" cy="15.5" r=".6" fill="currentColor"/></svg>',
  transit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M8 17l-2 3M16 17l2 3"/><circle cx="9" cy="14" r=".7" fill="currentColor"/><circle cx="15" cy="14" r=".7" fill="currentColor"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>'
};
var homeIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-6 8 6M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/></svg>';
var personIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0114 0"/></svg>';
var dotsIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/></svg>';
var badgeIcon={
  work:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',
  study:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-4 9 4-9 4-9-4z"/><path d="M7 11v4c0 1 2 2 5 2s5-1 5-2v-4"/></svg>',
  leisure:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 4v4M12 16v4M4 12h4M16 12h4"/></svg>',
  map:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="2.4"/><circle cx="17" cy="17" r="2.4"/><path d="M7 9.5v3a4 4 0 004 4h1"/></svg>'
};

/* ---------- occupations (MiD) -> which trips each routes to ---------- */
var OCC=[
  {id:'employed',label:'Employed',note:'I work (full or part time)',ic:badgeIcon.work,purposes:['work','leisure']},
  {id:'student',label:'Student, apprentice',note:'I study or train',ic:badgeIcon.study,purposes:['study','leisure']},
  {id:'homemaker',label:'Homemaker',note:'',ic:homeIcon,purposes:['leisure']},
  {id:'retiree',label:'Retiree (incl. early retirees)',note:'',ic:personIcon,purposes:['leisure']},
  {id:'other',label:'Other',note:'',ic:dotsIcon,purposes:['leisure']}
];
var PURPOSE={
  work:{label:'Work',short:'W',icon:badgeIcon.work,color:'#D23F31',verb:'work',reach:'How did you reach work?'},
  study:{label:'University',short:'U',icon:badgeIcon.study,color:'#2F5AD0',verb:'university',reach:'How did you reach university?'},
  leisure:{label:'Leisure',short:'L',icon:badgeIcon.leisure,color:'#7E4FC0',verb:'leisure',reach:'How did you get there?'}
};

/* ---------- the four modes, with colours + icons ---------- */
var MODES=[
  {id:'car',name:'Car'},
  {id:'pt',name:'Public transport'},
  {id:'bike',name:'Bike'},
  {id:'walk',name:'Walk'}
];
var MC={car:'#DB4437',pt:'#3A63D8',bike:'#12A0A6',walk:'#3E9B54'};
var MI={car:IC.car,pt:IC.transit,bike:IC.bike,walk:IC.walk};
var mName=function(id){var m=MODES.find(function(x){return x.id===id;});return m?m.name:id;};
/* main mode via modal hierarchy: car > public transport > bike > walk */
var MRANK={car:4,pt:3,bike:2,walk:1};
function mainMode(seq){if(!seq||!seq.length)return null;return seq.slice().sort(function(a,b){return MRANK[b]-MRANK[a];})[0];}

var FREQ=['Rarely','About 1×/week','2 to 3×/week','4 to 5×/week','Almost daily'];

var MUNICH={lat:48.137,lng:11.575};
var MUNICH_BOUNDS={north:48.248,south:48.061,east:11.722,west:11.360};
var MIN_TRIP_METERS=100;   /* if destination is nearer than this to home, route from a point this far out */
var HOME_DECIMALS=3;       /* ~100 m rounding of the stored home coordinate (privacy) */

/* ---------- state ---------- */
var S={occ:null,order:[],idx:0,trips:{},home:null,step:'occ',_done:false};
function blankTrip(){return {modes:[],freq:null,dest:null,travel_times:null,too_close:false,routing_point:null};}
var stageBox,trackEl,badgeEl;

/* ---------- boot ---------- */
fetch('/api/config').then(function(r){return r.json();}).then(function(cfg){
  stageBox=document.getElementById('stagebox');trackEl=document.getElementById('track');badgeEl=document.getElementById('badge');
  if(!cfg.mapsKey){ showNoKey(); return; }
  window.__startDiary=function(){ renderOccupation(); };
  var s=document.createElement('script');
  s.src='https://maps.googleapis.com/maps/api/js?key='+encodeURIComponent(cfg.mapsKey)+'&libraries=places&loading=async&callback=__startDiary';
  s.async=true;s.onerror=function(){showNoKey('The Google Maps script failed to load. Check the key and that Maps JavaScript API and Places API are enabled.');};
  document.head.appendChild(s);
}).catch(function(){ showNoKey('Could not reach the server.'); });

function showNoKey(msg){
  document.getElementById('title').textContent='Almost there';
  document.getElementById('lede').textContent='';
  stageBox.innerHTML='<div class="card"><div class="banner">'+(msg||'No Google Maps key found yet.')+'</div></div>';
}

/* ---------- map helpers ---------- */
function pinIcon(color){
  return {path:'M12 0C5.4 0 0 5.4 0 12c0 8.5 12 24 12 24s12-15.5 12-24C24 5.4 18.6 0 12 0z',
    fillColor:color,fillOpacity:1,strokeColor:'#ffffff',strokeWeight:2,scale:1.25,
    anchor:new google.maps.Point(12,34),labelOrigin:new google.maps.Point(12,12)};
}
function makeMarker(map,pos,color,glyph){
  return new google.maps.Marker({position:pos,map:map,icon:pinIcon(color),label:{text:glyph,color:'#fff',fontSize:'12px',fontWeight:'700',fontFamily:'Archivo'}});
}
function newMap(id,center,zoom){
  return new google.maps.Map(document.getElementById(id),{center:center,zoom:zoom,mapTypeControl:false,streetViewControl:false,fullscreenControl:false,clickableIcons:true,
    restriction:{latLngBounds:MUNICH_BOUNDS,strictBounds:false}});
}
function attachAutocomplete(inputId,onPick){
  var ac=new google.maps.places.Autocomplete(document.getElementById(inputId),{fields:['geometry','name','formatted_address'],bounds:MUNICH_BOUNDS,strictBounds:true,componentRestrictions:{country:'de'}});
  ac.addListener('place_changed',function(){
    var p=ac.getPlace();if(!p.geometry)return;var loc=p.geometry.location;
    onPick({lat:loc.lat(),lng:loc.lng(),label:p.name||p.formatted_address||''});
  });
}
var geocoder=null;
function labelFor(latLng,cb){
  if(!geocoder)geocoder=new google.maps.Geocoder();
  geocoder.geocode({location:latLng},function(res,status){
    if(status==='OK'&&res[0])cb(res[0].formatted_address.split(',').slice(0,3).join(','));
    else cb(latLng.lat().toFixed(4)+', '+latLng.lng().toFixed(4));
  });
}

/* ---------- progress ---------- */
function drawTrack(){
  var total=2+(S.order.length||1)+1;var cur=0;
  if(S.step==='occ')cur=0;else if(S.step==='home')cur=1;else if(S.step==='trip')cur=2+S.idx;else cur=total-1;
  trackEl.innerHTML='';
  for(var i=0;i<total;i++){var d=document.createElement('div');d.className='seg';
    var col=(i>=2&&i<=S.order.length+1)?PURPOSE[S.order[i-2]].color:'#161A24';
    if(i<=cur)d.style.background=col;trackEl.appendChild(d);}
}

/* ---------- step 1: occupation ---------- */
function renderOccupation(){
  S.step='occ';
  document.getElementById('eyebrow').textContent='Travel Diary · about you';
  document.getElementById('title').textContent='Map how you travel';
  badgeEl.style.background='';badgeEl.innerHTML=badgeIcon.map;
  document.getElementById('lede').textContent='Which best describes you right now?';
  stageBox.innerHTML='<div class="card"><h2>Your situation</h2><p class="hint">Pick the one closest to your everyday life.</p><div class="occ-grid" id="occgrid"></div></div>';
  var g=document.getElementById('occgrid');
  OCC.forEach(function(o){var b=document.createElement('button');b.className='occ'+(S.occ===o.id?' sel':'');
    b.innerHTML='<span class="ic">'+o.ic+'</span><span><b>'+o.label+'</b>'+(o.note?'<span class="t">'+o.note+'</span>':'')+'</span>';
    b.onclick=function(){S.occ=o.id;S.order=o.purposes.slice();S.idx=0;S._done=false;S.trips={};S.order.forEach(function(p){S.trips[p]=blankTrip();});renderHome();};
    g.appendChild(b);});
  drawTrack();
}

/* ---------- step 2: home (rough area, privacy-framed) ---------- */
function round(x){var f=Math.pow(10,HOME_DECIMALS);return Math.round(x*f)/f;}
function renderHome(){
  S.step='home';
  document.getElementById('eyebrow').textContent='Travel Diary · home base';
  document.getElementById('title').textContent='Roughly, where do you set out from?';
  badgeEl.style.background='var(--home)';badgeEl.innerHTML=homeIcon;
  document.getElementById('lede').textContent='Just the general area your trips start from, your neighbourhood rather than your exact address. Search, or tap the map.';
  stageBox.innerHTML=
    '<div class="card">'
    +'<div class="searchbar"><span class="mi">'+IC.search+'</span><input id="hsearch" placeholder="Search your neighbourhood or a nearby landmark…" autocomplete="off"></div>'
    +'<div class="mapbox" id="hmap"></div>'
    +'<div class="pinned" id="hpinned" style="display:none"><span class="dot" style="background:var(--home)"></span><span>Starting area: <b id="hlabel"></b></span></div>'
    +'<div class="maptip">We only keep the approximate area, never a precise address. Tap the map to move the pin.</div>'
    +'<div class="nav"><button class="btn ghost" id="back">← Back</button><button class="btn primary" id="next" '+(S.home?'':'disabled')+'>Next →</button></div>'
    +'</div>';
  var map=newMap('hmap',S.home?{lat:S.home.lat,lng:S.home.lng}:MUNICH,S.home?14:11);
  var marker=null;
  function setHome(lat,lng,label){
    S.home={lat:round(lat),lng:round(lng),label:label||''};
    var pos={lat:S.home.lat,lng:S.home.lng};
    if(marker)marker.setPosition(pos);else marker=makeMarker(map,pos,getCSS('--home'),'⌂');
    document.getElementById('hpinned').style.display='flex';
    document.getElementById('hlabel').textContent=label||'pinned area';
    document.getElementById('next').disabled=false;
  }
  if(S.home)setHome(S.home.lat,S.home.lng,S.home.label);
  map.addListener('click',function(e){
    setHome(e.latLng.lat(),e.latLng.lng(),'locating…');
    labelFor(e.latLng,function(l){if(S.home){S.home.label=l;document.getElementById('hlabel').textContent=l;}});
  });
  attachAutocomplete('hsearch',function(r){map.setCenter({lat:r.lat,lng:r.lng});map.setZoom(15);setHome(r.lat,r.lng,r.label);});
  document.getElementById('back').onclick=renderOccupation;
  document.getElementById('next').onclick=function(){renderTrip();};
  drawTrack();
}

/* ---------- step 3: one screen per trip ---------- */
function renderTrip(){
  S.step='trip';
  var pk=S.order[S.idx],P=PURPOSE[pk],t=S.trips[pk];
  document.getElementById('eyebrow').textContent='Trip '+(S.idx+1)+' of '+S.order.length+' · '+P.label;
  document.getElementById('title').textContent='Your last '+P.verb+' trip';
  badgeEl.style.background=P.color;badgeEl.innerHTML=P.icon;
  document.getElementById('lede').textContent=(pk==='leisure')
    ? 'Think of the last leisure trip you remember. Pin where you went and how you got there.'
    : 'Think of the last time you travelled to '+P.verb+'. Pin where you went and how you got there.';

  var destName=t.dest?t.dest.label:P.label;
  stageBox.innerHTML=
    '<div class="card">'
    +'<div class="searchbar"><span class="mi">'+IC.search+'</span><input id="dsearch" placeholder="Search your '+P.verb+' place…" autocomplete="off"></div>'
    +'<div class="mapbox" id="dmap"></div>'
    +'<div class="pinned" id="dpinned" style="'+(t.dest?'':'display:none')+'"><span class="dot" style="background:'+P.color+'"></span><span>'+P.label+': <b id="dlabel">'+(t.dest?t.dest.label:'')+'</b></span></div>'
    +'<div class="tt" id="tt" style="display:none"><p class="tth">estimated travel times · start to '+P.verb+'</p><div class="row" id="ttrow"></div></div>'
    +'<div class="maptip">Your starting area is shown for reference. Tap the map to place your '+P.verb+' pin.</div>'
    +'<div class="plabel">'+P.reach+'</div>'
    +'<div class="stage"><div class="termini">'
      +'<div class="terminus"><div class="station" style="border-color:var(--home);color:var(--home)">'+homeIcon+'</div><div class="nm">Start<small>your area</small></div></div>'
      +'<div class="rail'+(t.modes.length?'':' empty')+'" id="rail" style="--rc:'+P.color+'"></div>'
      +'<div class="terminus dest"><div class="station" style="border-color:'+P.color+';color:'+P.color+'">'+P.icon+'</div><div class="nm" id="destnm" title="'+destName+'">'+destName+'<small>where you went</small></div></div>'
    +'</div></div>'
    +'<div class="plabel">tap to add a mode, in order</div><div class="palette" id="palette"></div>'
    +'<div class="subhead">How often do you make this trip?</div><div class="segbtns" id="freq"></div>'
    +'<div class="needhint" id="needhint"></div>'
    +'<div class="nav"><button class="btn ghost" id="back">'+(S.idx===0?'← Back':'← Previous')+'</button><button class="btn primary" id="next">'+(S.idx===S.order.length-1?'Finish ✓':'Next trip →')+'</button></div>'
    +'</div>';

  var center=t.dest?{lat:t.dest.lat,lng:t.dest.lng}:(S.home?{lat:S.home.lat,lng:S.home.lng}:MUNICH);
  var map=newMap('dmap',center,t.dest?14:12);
  if(S.home)makeMarker(map,{lat:S.home.lat,lng:S.home.lng},getCSS('--home'),'⌂');
  var dmarker=null,dline=null;
  function setDest(lat,lng,label){
    t.dest={lat:lat,lng:lng,label:label||''};var pos={lat:lat,lng:lng};
    if(dmarker)dmarker.setPosition(pos);else dmarker=makeMarker(map,pos,P.color,P.short);
    if(S.home){var path=[{lat:S.home.lat,lng:S.home.lng},pos];
      if(dline)dline.setPath(path);else dline=new google.maps.Polyline({path:path,map:map,strokeColor:P.color,strokeOpacity:.7,strokeWeight:4});}
    document.getElementById('dpinned').style.display='flex';
    document.getElementById('dlabel').textContent=label||'pinned location';
    var dn=document.getElementById('destnm');if(dn){dn.firstChild.textContent=(label||P.label);dn.title=label||P.label;}
    fetchTravelTimes(t);updateNext();
  }
  if(t.dest){setDest(t.dest.lat,t.dest.lng,t.dest.label);if(t.travel_times)renderTT(t.travel_times);}
  map.addListener('click',function(e){
    setDest(e.latLng.lat(),e.latLng.lng(),'locating…');
    labelFor(e.latLng,function(l){if(t.dest){t.dest.label=l;document.getElementById('dlabel').textContent=l;}});
  });
  attachAutocomplete('dsearch',function(r){map.setCenter({lat:r.lat,lng:r.lng});map.setZoom(15);setDest(r.lat,r.lng,r.label);});

  function updateNext(){
    var miss=[];
    if(!t.dest)miss.push('pin where you went');
    if(!t.modes.length)miss.push('add how you travelled');
    if(!t.freq)miss.push('pick how often');
    var nx=document.getElementById('next'),hint=document.getElementById('needhint');
    if(nx)nx.disabled=miss.length>0;
    if(hint)hint.textContent=miss.length?('Still needed: '+miss.join(' · ')):'';
  }
  paintRail();paintPalette();paintFreq();updateNext();
  document.getElementById('back').onclick=function(){if(S.idx===0)renderHome();else{S.idx--;renderTrip();}};
  document.getElementById('next').onclick=function(){if(S.idx===S.order.length-1)renderDone();else{S.idx++;renderTrip();}};
  drawTrack();

  function paintRail(){
    var rail=document.getElementById('rail');rail.className='rail'+(t.modes.length?'':' empty');rail.style.setProperty('--rc',P.color);
    if(!t.modes.length){rail.innerHTML='<span class="prompt">tap a mode ↓</span>';updateNext();return;}
    var beads=document.createElement('div');beads.className='beads';
    t.modes.forEach(function(m,i){
      if(i>0){var c=document.createElement('div');c.className='connector';beads.appendChild(c);}
      var b=document.createElement('button');b.className='bead';b.title='Remove';
      b.innerHTML='<span class="disc" style="border-color:'+MC[m]+';color:'+MC[m]+'">'+MI[m]+'<span class="x">✕</span></span><span class="nm2">'+mName(m)+'</span>';
      b.onclick=function(){t.modes.splice(i,1);paintRail();};beads.appendChild(b);});
    rail.innerHTML='';rail.appendChild(beads);updateNext();
  }
  function paintPalette(){var p=document.getElementById('palette');p.innerHTML='';
    MODES.forEach(function(m){var c=document.createElement('button');c.className='chip';c.style.setProperty('--mc',MC[m.id]);
      c.innerHTML=MI[m.id]+'<span>'+m.name+'</span>';c.onclick=function(){t.modes.push(m.id);paintRail();};p.appendChild(c);});}
  function paintFreq(){var f=document.getElementById('freq');f.innerHTML='';
    FREQ.forEach(function(x){var b=document.createElement('button');b.className='seg-opt'+(t.freq===x?' sel':'');b.textContent=x;b.onclick=function(){t.freq=x;paintFreq();updateNext();};f.appendChild(b);});}
}

/* ---------- travel times + car km (via backend -> Google Routes) ---------- */
function metersBetween(a,b){
  var la=a.lat*Math.PI/180;
  var dx=(b.lng-a.lng)*Math.PI/180*Math.cos(la)*6371000;
  var dy=(b.lat-a.lat)*Math.PI/180*6371000;
  return Math.sqrt(dx*dx+dy*dy);
}
function bearing(a,b){return Math.atan2((b.lng-a.lng)*Math.cos(a.lat*Math.PI/180),(b.lat-a.lat));}
function offsetPoint(o,brad,m){
  var dLat=m*Math.cos(brad)/111320;
  var dLng=m*Math.sin(brad)/(111320*Math.cos(o.lat*Math.PI/180));
  return {lat:o.lat+dLat,lng:o.lng+dLng};
}
function fetchTravelTimes(t){
  if(!S.home||!t.dest)return;
  var box=document.getElementById('tt'),row=document.getElementById('ttrow');
  if(!box)return;box.style.display='block';row.innerHTML='<span class="loading">Estimating…</span>';
  var origin={lat:S.home.lat,lng:S.home.lng};
  var target={lat:t.dest.lat,lng:t.dest.lng};
  t.too_close=false;t.routing_point=null;
  if(metersBetween(origin,target)<MIN_TRIP_METERS){
    var br=metersBetween(origin,target)>1?bearing(origin,target):Math.random()*2*Math.PI;
    target=offsetPoint(origin,br,MIN_TRIP_METERS);
    t.too_close=true;t.routing_point=target;
  }
  fetch('/api/routes',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({origin:origin,destination:target})})
    .then(function(r){return r.json();}).then(function(tt){t.travel_times=tt;renderTT(tt);})
    .catch(function(){row.innerHTML='<span class="loading">Could not fetch times.</span>';});
}
function renderTT(tt){
  var row=document.getElementById('ttrow');if(!row)return;
  function cell(icon,color,mins,extra){return '<span class="cellk" style="color:'+color+'">'+icon+'<span class="mins">'+(mins==null?'—':mins+"'")+'</span>'+(extra||'')+'</span>';}
  var km=tt.drive_km!=null?'<span class="km">'+tt.drive_km+' km</span>':'';
  row.innerHTML=cell(IC.walk,MC.walk,tt.walk)+cell(IC.bike,MC.bike,tt.bicycle)+cell(IC.car,MC.car,tt.drive,km)+cell(IC.transit,MC.pt,tt.transit);
}

/* ---------- done + submit ---------- */
function renderDone(){
  S.step='done';S._done=true;
  document.getElementById('eyebrow').textContent='Travel Diary · review';
  document.getElementById('title').textContent='Your trips';
  badgeEl.style.background='';badgeEl.innerHTML=badgeIcon.map;
  document.getElementById('lede').textContent='A quick look at what you mapped. Review, then submit.';
  var rows='';
  S.order.forEach(function(pk){var t=S.trips[pk],P=PURPOSE[pk];
    var mini=t.modes.length?t.modes.map(function(m,i){return (i?'<span class="arw">›</span>':'')+'<span style="color:'+MC[m]+'">'+MI[m]+'</span>';}).join(''):'<span style="color:var(--ink-soft);font-style:italic">no mode</span>';
    rows+='<div class="recap-row"><span class="tag"><span class="roundel" style="background:'+P.color+'">'+P.short+'</span>'+P.label+'</span><span class="mini">'+mini+'</span><span class="tm">'+(t.freq||'')+'</span></div>';});
  stageBox.innerHTML='<div class="card"><div class="mapbox" id="allmap" style="height:300px;margin-bottom:6px"></div><div class="recap">'+rows+'</div>'
    +'<div class="nav"><button class="btn ghost" id="edit">← Edit trips</button><button class="btn primary" id="submit">Submit</button></div></div>';
  var map=newMap('allmap',S.home?{lat:S.home.lat,lng:S.home.lng}:MUNICH,12);
  var bounds=new google.maps.LatLngBounds();
  if(S.home){makeMarker(map,{lat:S.home.lat,lng:S.home.lng},getCSS('--home'),'⌂');bounds.extend({lat:S.home.lat,lng:S.home.lng});}
  S.order.forEach(function(pk){var t=S.trips[pk],P=PURPOSE[pk];if(t.dest){var pos={lat:t.dest.lat,lng:t.dest.lng};
    makeMarker(map,pos,P.color,P.short);bounds.extend(pos);
    if(S.home)new google.maps.Polyline({path:[{lat:S.home.lat,lng:S.home.lng},pos],map:map,strokeColor:P.color,strokeOpacity:.7,strokeWeight:4});}});
  google.maps.event.addListenerOnce(map,'idle',function(){if(!bounds.isEmpty())map.fitBounds(bounds,60);});
  document.getElementById('edit').onclick=function(){S.idx=0;renderTrip();};
  document.getElementById('submit').onclick=submitDiary;
  drawTrack();
}
function submitDiary(){
  var payload=buildPayload();
  var btn=document.getElementById('submit');btn.disabled=true;btn.textContent='Saving…';
  var embedded=(window.self!==window.top);
  if(embedded){
    try{ window.parent.postMessage({type:'travel-diary',payload:payload},'*'); }catch(e){}
    thankYou(true); return;
  }
  fetch('/api/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    .then(function(r){return r.json();}).then(function(){thankYou(false);})
    .catch(function(){btn.disabled=false;btn.textContent='Submit';alert('Could not save, is the server running?');});
}
function thankYou(embedded){
  stageBox.innerHTML='<div class="card" style="text-align:center;padding:44px 22px"><div class="done-hero"><div class="big" style="color:var(--signal)">✦</div></div><h2 style="margin:10px 0 4px">Thank you!</h2><p class="hint" style="margin:0">'+(embedded?'Your travel diary has been recorded. Please click <b>Next</b> below to continue the survey.':'Your travel diary has been saved.')+'</p></div>';
  document.getElementById('eyebrow').textContent='Travel Diary · submitted';
}
function buildPayload(){
  var out={occupation:S.occ,home:S.home,trips:{}};
  S.order.forEach(function(pk){var t=S.trips[pk];
    out.trips[pk]={mode_sequence:t.modes,main_mode:mainMode(t.modes),is_multimodal:t.modes.length>1,
      frequency:t.freq,destination:t.dest,travel_times:t.travel_times,
      too_close:t.too_close,routing_point:t.routing_point};});
  return out;
}

/* ---------- utils ---------- */
function getCSS(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim()||'#2D3748';}
