/* ============================================================
   Travel Diary — frontend app (Google Maps)
   Boot order: fetch /api/config -> load Google Maps with key -> run().
   ============================================================ */

/* ---------- icons / data ---------- */
var IC={
  walk:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4" r="1.6"/><path d="M11 21l1.5-6 3 2v4M8 12l3-4 2 3 3 1M9 21l1-4"/></svg>',
  bike:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17" r="3.5"/><circle cx="18.5" cy="17" r="3.5"/><path d="M12 17l-2.5-6 4-0.5M9.5 11l2 0M15 6.5h2"/></svg>',
  escooter:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="18" r="2.6"/><circle cx="18" cy="18" r="2.6"/><path d="M17 6.5h2M17 6.5l-6 11M7.5 18h7"/></svg>',
  cardriver:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13l1.5-4.5A2 2 0 017.4 7h9.2a2 2 0 011.9 1.5L20 13M4 13h16v4a1 1 0 01-1 1h-1.5a1 1 0 01-1-1M4 13v4a1 1 0 001 1h1.5a1 1 0 001-1"/><circle cx="7.5" cy="15.5" r=".6" fill="currentColor"/><circle cx="16.5" cy="15.5" r=".6" fill="currentColor"/></svg>',
  carpass:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13l1.5-4.5A2 2 0 017.4 7h9.2a2 2 0 011.9 1.5L20 13M4 13h16v4M4 13v4"/><circle cx="14" cy="10.5" r="1.4"/></svg>',
  bus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="13" rx="2"/><path d="M4 11h16M8 17v2M16 17v2"/><circle cx="8" cy="14" r=".7" fill="currentColor"/><circle cx="16" cy="14" r=".7" fill="currentColor"/></svg>',
  tram:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="13" rx="2"/><path d="M5 11h14M9 2l3 2 3-2M8 17l-2 3M16 17l2 3"/><circle cx="9" cy="14" r=".7" fill="currentColor"/><circle cx="15" cy="14" r=".7" fill="currentColor"/></svg>',
  metro:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M8 17l-2 3M16 17l2 3"/><circle cx="9" cy="14" r=".7" fill="currentColor"/><circle cx="15" cy="14" r=".7" fill="currentColor"/></svg>',
  train:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="13" rx="2"/><path d="M5 10h14M9 16l-2 4M15 16l2 4M9 6h6"/><circle cx="8.5" cy="13" r=".7" fill="currentColor"/><circle cx="15.5" cy="13" r=".7" fill="currentColor"/></svg>',
  taxi:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13l1.5-4.5A2 2 0 017.4 7h9.2a2 2 0 011.9 1.5L20 13M4 13h16v4M4 13v4M9 7V4.5h6V7"/><circle cx="7.5" cy="15.5" r=".6" fill="currentColor"/><circle cx="16.5" cy="15.5" r=".6" fill="currentColor"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>',
  car:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13l1.5-4.5A2 2 0 017.4 7h9.2a2 2 0 011.9 1.5L20 13M4 13h16v4M4 13v4"/></svg>',
  transit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M8 17l-2 3M16 17l2 3"/></svg>'
};
var MODES=[{id:'walk',name:'Walk'},{id:'bike',name:'Bike'},{id:'escooter',name:'E-scooter'},{id:'cardriver',name:'Car (driver)'},{id:'carpass',name:'Car (passenger)'},{id:'bus',name:'Bus'},{id:'tram',name:'Tram'},{id:'metro',name:'U-Bahn'},{id:'train',name:'S-Bahn / train'},{id:'taxi',name:'Taxi / ride-hail'}];
var MC={walk:'#3E9B54',bike:'#12A0A6',escooter:'#8659C4',cardriver:'#DB4437',carpass:'#E8781E',bus:'#C4930A',tram:'#CC4F8E',metro:'#3A63D8',train:'#7A5C3E',taxi:'#2E8B8B'};
var mName=function(id){var m=MODES.find(function(x){return x.id===id;});return m?m.name:id;};
var homeIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-6 8 6M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/></svg>';
var badgeIcon={
  work:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',
  study:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-4 9 4-9 4-9-4z"/><path d="M7 11v4c0 1 2 2 5 2s5-1 5-2v-4"/></svg>',
  shopping:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l-1 12H7L6 7zM9 7a3 3 0 016 0"/></svg>',
  leisure:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 4v4M12 16v4M4 12h4M16 12h4"/></svg>',
  other:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-5.2-7-11a7 7 0 0114 0c0 5.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.4"/></svg>',
  map:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="2.4"/><circle cx="17" cy="17" r="2.4"/><path d="M7 9.5v3a4 4 0 004 4h1"/></svg>'
};
var OCC=[
  {id:'work',label:'Employed',note:'I work (full or part time)',ic:badgeIcon.work},
  {id:'study',label:'Student',note:'I study at a university/college',ic:badgeIcon.study},
  {id:'both',label:'Working & studying',note:'I do both',ic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l7-3 7 3-7 3-7-3z"/><rect x="13" y="12" width="8" height="7" rx="1.5"/></svg>'},
  {id:'other',label:'Not currently working',note:'Retired, homemaker, between jobs…',ic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0114 0"/></svg>'}
];
var PURPOSE={
  work:{label:'Work',short:'W',icon:badgeIcon.work,color:'#D23F31'},
  study:{label:'University',short:'U',icon:badgeIcon.study,color:'#2F5AD0'},
  shopping:{label:'Shopping',short:'S',icon:badgeIcon.shopping,color:'#E07B18'},
  leisure:{label:'Leisure',short:'L',icon:badgeIcon.leisure,color:'#7E4FC0'},
  other:{label:'Other trip',short:'O',icon:badgeIcon.other,color:'#2E9152'}
};
function purposesFor(o){
  if(o==='work')return['work','shopping','leisure'];
  if(o==='study')return['study','shopping','leisure'];
  if(o==='both')return['work','study','shopping','leisure'];
  return['shopping','leisure','other'];
}
var FREQ=['Rarely','~1×/week','2–3×/week','4–5×/week','~Daily'];
var STOP_PURPOSES=['Shopping','Errand / personal business','Drop-off / pick-up someone','Eat / drink','Leisure / social','Education','Medical / appointment','Other'];
var MUNICH={lat:48.137,lng:11.575};
/* Rough Munich bounding box — replace with your shapefile boundary for exact checks */
var MUNICH_BOUNDS={north:48.248,south:48.061,east:11.722,west:11.360};
function inMunich(lat,lng){return lat>=MUNICH_BOUNDS.south&&lat<=MUNICH_BOUNDS.north&&lng>=MUNICH_BOUNDS.west&&lng<=MUNICH_BOUNDS.east;}

/* ---------- state ---------- */
var S={occ:null,order:[],idx:0,trips:{},home:null,step:'occ',_done:false};
function blankTrip(){return {modes:[],depart:'',arrive:'',freq:null,dest:null,stops:[],travel_times:null};}
var stageBox,trackEl,badgeEl;

/* ---------- boot: get key, load Google Maps, run ---------- */
fetch('/api/config').then(function(r){return r.json();}).then(function(cfg){
  stageBox=document.getElementById('stagebox');trackEl=document.getElementById('track');badgeEl=document.getElementById('badge');
  if(!cfg.mapsKey){ showNoKey(); return; }
  window.__startDiary=function(){ renderOccupation(); };
  var s=document.createElement('script');
  s.src='https://maps.googleapis.com/maps/api/js?key='+encodeURIComponent(cfg.mapsKey)+'&libraries=places&loading=async&callback=__startDiary';
  s.async=true;s.onerror=function(){showNoKey('The Google Maps script failed to load. Check that the key is valid and that Maps JavaScript API + Places API are enabled.');};
  document.head.appendChild(s);
}).catch(function(){ showNoKey('Could not reach the server. Is it running (npm start)?'); });

function showNoKey(msg){
  document.getElementById('title').textContent='Almost there';
  document.getElementById('lede').textContent='';
  stageBox.innerHTML='<div class="card"><div class="banner">'+(msg||'No Google Maps key found yet. Copy <b>.env.example</b> to <b>.env</b>, paste your key into <b>GOOGLE_MAPS_BROWSER_KEY</b>, and restart with <b>npm start</b>.')+'</div></div>';
}

/* ---------- shared map helpers ---------- */
function pinIcon(color,glyph){
  return {
    path:'M12 0C5.4 0 0 5.4 0 12c0 8.5 12 24 12 24s12-15.5 12-24C24 5.4 18.6 0 12 0z',
    fillColor:color,fillOpacity:1,strokeColor:'#ffffff',strokeWeight:2,scale:1.25,
    anchor:new google.maps.Point(12,34),labelOrigin:new google.maps.Point(12,12)
  };
}
function makeMarker(map,pos,color,glyph){
  return new google.maps.Marker({position:pos,map:map,icon:pinIcon(color,glyph),label:{text:glyph,color:'#fff',fontSize:'12px',fontWeight:'700',fontFamily:'Archivo'}});
}
function newMap(id,center,zoom){
  return new google.maps.Map(document.getElementById(id),{center:center,zoom:zoom,mapTypeControl:false,streetViewControl:false,fullscreenControl:false,clickableIcons:true,
    restriction:{latLngBounds:MUNICH_BOUNDS,strictBounds:false}});
}
/* Search box using Places Autocomplete (returns {lat,lng,label}) */
function attachAutocomplete(inputId,onPick){
  var ac=new google.maps.places.Autocomplete(document.getElementById(inputId),{fields:['geometry','name','formatted_address'],bounds:MUNICH_BOUNDS,strictBounds:true,componentRestrictions:{country:'de'}});
  ac.addListener('place_changed',function(){
    var p=ac.getPlace();if(!p.geometry)return;
    var loc=p.geometry.location;
    onPick({lat:loc.lat(),lng:loc.lng(),label:p.name||p.formatted_address||''});
  });
}
/* Reverse-geocode a clicked point to a friendly label */
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

/* ---------- steps ---------- */
function renderOccupation(){
  S.step='occ';
  document.getElementById('eyebrow').textContent='Travel Diary · about you';
  document.getElementById('title').textContent='Map how you travel';
  badgeEl.style.background='';badgeEl.innerHTML=badgeIcon.map;
  document.getElementById('lede').textContent="First — which fits you best right now? It sets which trips we'll map together.";
  stageBox.innerHTML='<div class="card"><h2>Your situation</h2><p class="hint">Pick the one closest to your everyday life.</p><div class="occ-grid" id="occgrid"></div></div>';
  var g=document.getElementById('occgrid');
  OCC.forEach(function(o){var b=document.createElement('button');b.className='occ'+(S.occ===o.id?' sel':'');
    b.innerHTML='<span class="ic">'+o.ic+'</span><span><b>'+o.label+'</b><span class="t">'+o.note+'</span></span>';
    b.onclick=function(){S.occ=o.id;S.order=purposesFor(o.id);S.idx=0;S._done=false;S.order.forEach(function(p){if(!S.trips[p])S.trips[p]=blankTrip();});renderHome();};
    g.appendChild(b);});
  drawTrack();
}

function renderHome(){
  S.step='home';
  document.getElementById('eyebrow').textContent='Travel Diary · home base';
  document.getElementById('title').textContent='Where is home?';
  badgeEl.style.background='var(--home)';badgeEl.innerHTML=homeIcon;
  document.getElementById('lede').textContent='Search for your neighbourhood, or tap the map.';
  stageBox.innerHTML=
    '<div class="card">'
    +'<div class="searchbar"><span class="mi">'+IC.search+'</span><input id="hsearch" placeholder="Search address, area, or landmark…" autocomplete="off"></div>'
    +'<div class="mapbox" id="hmap"></div>'
    +'<div class="pinned" id="hpinned" style="display:none"><span class="dot" style="background:var(--home)"></span><span>Home: <b id="hlabel"></b></span></div>'
    +'<div class="maptip">Tip: tap anywhere on the map to move the pin.</div>'
    +'<div class="nav"><button class="btn ghost" id="back">← Occupation</button><button class="btn primary" id="next" '+(S.home?'':'disabled')+'>Next →</button></div>'
    +'</div>';
  var map=newMap('hmap',S.home?{lat:S.home.lat,lng:S.home.lng}:MUNICH,S.home?14:11);
  var marker=null;
  function setHome(lat,lng,label){
    S.home={lat:lat,lng:lng,label:label||''};
    var pos={lat:lat,lng:lng};
    if(marker)marker.setPosition(pos);else marker=makeMarker(map,pos,getCSS('--home'),'⌂');
    document.getElementById('hpinned').style.display='flex';
    document.getElementById('hlabel').textContent=label||'pinned location';
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

function renderTrip(){
  S.step='trip';
  var pk=S.order[S.idx],P=PURPOSE[pk],t=S.trips[pk];
  document.getElementById('eyebrow').textContent='Trip '+(S.idx+1)+' of '+S.order.length+' · '+P.label;
  document.getElementById('title').textContent='Your regular '+P.label.toLowerCase()+' trip';
  badgeEl.style.background=P.color;badgeEl.innerHTML=P.icon;
  document.getElementById('lede').textContent='Pin where you usually go, then build how you get there and back.';
  var destName=t.dest?t.dest.label:P.label;
  stageBox.innerHTML=
    '<div class="card">'
    +'<div class="searchbar"><span class="mi">'+IC.search+'</span><input id="dsearch" placeholder="Search your '+P.label.toLowerCase()+' place…" autocomplete="off"></div>'
    +'<div class="mapbox" id="dmap"></div>'
    +'<div class="pinned" id="dpinned" style="'+(t.dest?'':'display:none')+'"><span class="dot" style="background:'+P.color+'"></span><span>'+P.label+': <b id="dlabel">'+(t.dest?t.dest.label:'')+'</b></span></div>'
    +'<div class="tt" id="tt" style="display:none"><p class="tth">estimated travel time · home ⇄ '+P.label.toLowerCase()+'</p><div class="row" id="ttrow"></div></div>'
    +'<div class="maptip">Home is shown for reference. Tap the map to place your '+P.label.toLowerCase()+' pin.</div>'
    +'<div class="plabel">how do you travel there &amp; back</div>'
    +'<div class="stage"><div class="termini">'
      +'<div class="terminus"><div class="station" style="border-color:var(--home);color:var(--home)">'+homeIcon+'</div><div class="nm">Home<small>you leave</small></div><div class="tile"><span class="cap">leave home</span>'+timePicker('depart',t.depart)+'</div></div>'
      +'<div class="rail'+(t.modes.length?'':' empty')+'" id="rail" style="--rc:'+P.color+'"></div>'
      +'<div class="terminus dest"><div class="station" style="border-color:'+P.color+';color:'+P.color+'">'+P.icon+'</div><div class="nm" id="destnm" title="'+destName+'">'+destName+'<small>there &amp; back</small></div><div class="tile"><span class="cap">back home</span>'+timePicker('arrive',t.arrive)+'</div></div>'
    +'</div></div>'
    +'<div class="plabel">tap to add a mode</div><div class="palette" id="palette"></div>'
    +'<div class="subhead">How often is this trip?</div><div class="segbtns" id="freq"></div>'
    +'<div class="subhead">Do you stop anywhere on the way?</div><div id="stoplist"></div><button class="addstop" id="addstop">+ Add a stop</button>'
    +'<div class="needhint" id="needhint"></div>'
    +'<div class="nav"><button class="btn ghost" id="back">'+(S.idx===0?'← Home':'← Previous')+'</button><button class="btn primary" id="next">'+(S.idx===S.order.length-1?'Finish ✓':'Next trip →')+'</button></div>'
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
    var dn=document.getElementById('destnm');dn.firstChild.textContent=(label||P.label);dn.title=label||P.label;
    fetchTravelTimes(t);
    updateNext();
  }
  if(t.dest){setDest(t.dest.lat,t.dest.lng,t.dest.label);if(t.travel_times)renderTT(t.travel_times);}
  map.addListener('click',function(e){
    setDest(e.latLng.lat(),e.latLng.lng(),'locating…');
    labelFor(e.latLng,function(l){if(t.dest){t.dest.label=l;document.getElementById('dlabel').textContent=l;var dn=document.getElementById('destnm');dn.firstChild.textContent=l;dn.title=l;}});
  });
  attachAutocomplete('dsearch',function(r){map.setCenter({lat:r.lat,lng:r.lng});map.setZoom(15);setDest(r.lat,r.lng,r.label);});

  function updateNext(){
    var miss=[];
    if(!t.dest)miss.push('pin a destination');
    if(!t.modes.length)miss.push('add a travel mode');
    if(!t.freq)miss.push('pick how often');
    if(!t.depart||!t.arrive)miss.push('set both times');
    var nx=document.getElementById('next'),hint=document.getElementById('needhint');
    if(nx)nx.disabled=miss.length>0;
    if(hint)hint.textContent=miss.length?('Still needed: '+miss.join(' · ')):'';
  }
  paintRail();paintPalette();paintFreq();paintStops();
  wireTime('depart',function(v){t.depart=v;updateNext();});
  wireTime('arrive',function(v){t.arrive=v;updateNext();});
  updateNext();
  document.getElementById('addstop').onclick=function(){t.stops.push({purpose:'',other:''});paintStops();};
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
      b.innerHTML='<span class="disc" style="border-color:'+MC[m]+';color:'+MC[m]+'">'+IC[m]+'<span class="x">✕</span></span><span class="nm2">'+mName(m)+'</span>';
      b.onclick=function(){t.modes.splice(i,1);paintRail();};beads.appendChild(b);});
    rail.innerHTML='';rail.appendChild(beads);updateNext();
  }
  function paintPalette(){var p=document.getElementById('palette');p.innerHTML='';
    MODES.forEach(function(m){var c=document.createElement('button');c.className='chip';c.style.setProperty('--mc',MC[m.id]);
      c.innerHTML=IC[m.id]+'<span>'+m.name+'</span>';c.onclick=function(){t.modes.push(m.id);paintRail();};p.appendChild(c);});}
  function paintFreq(){var f=document.getElementById('freq');f.innerHTML='';
    FREQ.forEach(function(x){var b=document.createElement('button');b.className='seg-opt'+(t.freq===x?' sel':'');b.textContent=x;b.onclick=function(){t.freq=x;paintFreq();updateNext();};f.appendChild(b);});}
  function paintStops(){var l=document.getElementById('stoplist');l.innerHTML='';
    t.stops.forEach(function(s,i){var row=document.createElement('div');row.className='stop-row';
      var sw=document.createElement('div');sw.className='selwrap';var sel=document.createElement('select');
      sel.innerHTML='<option value="">What did you do there?</option>'+STOP_PURPOSES.map(function(p){return '<option'+(s.purpose===p?' selected':'')+'>'+p+'</option>';}).join('');
      sel.onchange=function(e){s.purpose=e.target.value;if(s.purpose!=='Other')s.other='';paintStops();};
      sw.appendChild(sel);row.appendChild(sw);
      if(s.purpose==='Other'){var o=document.createElement('input');o.className='txt other';o.placeholder='Please specify';o.value=s.other||'';o.oninput=function(e){s.other=e.target.value;};row.appendChild(o);}
      var del=document.createElement('button');del.className='del';del.innerHTML='✕';del.onclick=function(){t.stops.splice(i,1);paintStops();};
      row.appendChild(del);l.appendChild(row);});}
}

/* ---------- travel times (calls the backend, which calls Google Routes) ---------- */
function fetchTravelTimes(t){
  if(!S.home||!t.dest)return;
  var box=document.getElementById('tt'),row=document.getElementById('ttrow');
  if(!box)return;box.style.display='block';row.innerHTML='<span class="loading">Estimating…</span>';
  fetch('/api/routes',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({origin:{lat:S.home.lat,lng:S.home.lng},destination:{lat:t.dest.lat,lng:t.dest.lng}})})
    .then(function(r){return r.json();}).then(function(tt){t.travel_times=tt;renderTT(tt);})
    .catch(function(){row.innerHTML='<span class="loading">Couldn\'t fetch times.</span>';});
}
function renderTT(tt){
  var row=document.getElementById('ttrow');if(!row)return;
  function cell(icon,color,mins){return '<span class="cellk" style="color:'+color+'">'+icon+'<span class="mins">'+(mins==null?'—':mins+"'")+'</span></span>';}
  row.innerHTML=cell(IC.walk,MC.walk,tt.walk)+cell(IC.bike,MC.bike,tt.bicycle)+cell(IC.car,MC.cardriver,tt.drive)+cell(IC.transit,MC.metro,tt.transit);
}

/* ---------- done + submit ---------- */
function renderDone(){
  S.step='done';S._done=true;
  document.getElementById('eyebrow').textContent='Travel Diary · your network';
  document.getElementById('title').textContent='Your travel network';
  badgeEl.style.background='';badgeEl.innerHTML=badgeIcon.map;
  document.getElementById('lede').textContent='Every trip you mapped, from home. Review, then submit.';
  var rows='';
  S.order.forEach(function(pk){var t=S.trips[pk],P=PURPOSE[pk];
    var mini=t.modes.length?t.modes.map(function(m,i){return (i?'<span class="arw">›</span>':'')+'<span style="color:'+MC[m]+'">'+IC[m]+'</span>';}).join(''):'<span style="color:var(--ink-soft);font-style:italic">no modes</span>';
    rows+='<div class="recap-row"><span class="tag"><span class="roundel" style="background:'+P.color+'">'+P.short+'</span>'+P.label+'</span><span class="mini">'+mini+'</span><span class="tm">'+t.depart+'–'+t.arrive+' · away '+fmtDur(t.depart,t.arrive)+'</span></div>';});
  stageBox.innerHTML='<div class="card"><div class="mapbox" id="allmap" style="height:320px;margin-bottom:6px"></div><div class="recap">'+rows+'</div>'
    +'<div class="nav"><button class="btn ghost" id="edit">← Edit trips</button><button class="btn primary" id="submit">Submit diary</button></div></div>';
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
  var btn=document.getElementById('submit');btn.disabled=true;btn.textContent='Submitting…';
  fetch('/api/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    .then(function(r){return r.json();}).then(function(res){
      stageBox.innerHTML='<div class="card" style="text-align:center;padding:44px 22px"><div class="done-hero"><div class="big" style="color:var(--signal)">✦</div></div><h2 style="margin:10px 0 4px">Thank you!</h2><p class="hint" style="margin:0">Your travel diary has been saved.</p></div>';
      document.getElementById('eyebrow').textContent='Travel Diary · submitted';
    }).catch(function(){btn.disabled=false;btn.textContent='Submit diary';alert('Could not save — is the server running?');});
}
function buildPayload(){
  var out={occupation:S.occ,home:S.home,trips:{}};
  S.order.forEach(function(pk){var t=S.trips[pk];
    out.trips[pk]={mode_sequence:t.modes,main_mode:t.modes[t.modes.length-1]||null,is_multimodal:t.modes.length>1,
      leave_home:t.depart,back_home:t.arrive,time_away_min:durMin(t.depart,t.arrive),frequency:t.freq,
      destination:t.dest,travel_times:t.travel_times,
      intermediate_stops:t.stops.filter(function(s){return s.purpose;}).map(function(s){return s.purpose==='Other'?('Other: '+s.other):s.purpose;})};});
  return out;
}

/* ---------- utils ---------- */
/* 24-hour scrolling time picker — starts empty (must be set), always 00–23, never AM/PM */
function timePicker(id,value){
  var hh=null,mm=null;
  if(value){var p=value.split(':');hh=parseInt(p[0],10);mm=Math.round(parseInt(p[1],10)/5)*5;if(mm>=60)mm=55;}
  var ho='<option value=""'+(hh===null?' selected':'')+'>–</option>',mo='<option value=""'+(mm===null?' selected':'')+'>–</option>',h,m,s;
  for(h=0;h<24;h++){s=(h<10?'0':'')+h;ho+='<option value="'+s+'"'+(h===hh?' selected':'')+'>'+s+'</option>';}
  for(m=0;m<60;m+=5){s=(m<10?'0':'')+m;mo+='<option value="'+s+'"'+(m===mm?' selected':'')+'>'+s+'</option>';}
  return '<span class="tp"><select id="'+id+'-h" class="tpsel" aria-label="hour">'+ho+'</select><span class="tpsep">:</span><select id="'+id+'-m" class="tpsel" aria-label="minute">'+mo+'</select></span>';
}
function wireTime(id,apply){
  var h=document.getElementById(id+'-h'),m=document.getElementById(id+'-m');
  function upd(){apply((h.value&&m.value)?(h.value+':'+m.value):'');}
  if(h)h.onchange=upd;if(m)m.onchange=upd;
}
function getCSS(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim()||'#2D3748';}
function durMin(a,b){if(!a||!b)return null;var p=a.split(':'),q=b.split(':');var d=(+q[0]*60+ +q[1])-(+p[0]*60+ +p[1]);if(d<0)d+=1440;return d;}
function fmtDur(a,b){var d=durMin(a,b);if(d===null)return'';if(d<60)return d+' min';var h=Math.floor(d/60),m=d%60;return m?h+' h '+m+' min':h+' h';}
