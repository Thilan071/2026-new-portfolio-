/* Rocket layer — drop-in for the portfolio hero.
   Add one script tag with src="rocket-layer.js" and defer, just before the closing body tag.
   It makes its own canvas behind your content and above your git-graph background (#bg),
   so nothing in your existing code needs to change. */
(function(){
  if(window.__rocketLayer)return;window.__rocketLayer=true;
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches,rnd=Math.random;
  const cv=document.createElement("canvas");
  cv.setAttribute("aria-hidden","true");
  cv.style.cssText="position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none";
  const bgc=document.getElementById("bg");
  if(bgc&&bgc.parentNode)bgc.after(cv);else document.body.prepend(cv);
  const ctx=cv.getContext("2d"),dpr=Math.min(devicePixelRatio||1,2);
  let W=0,H=0,wide=false,P={},chips=[],tick=0,mx=0,my=0,tmx=0,tmy=0;
  const WORDS=["Flutter","React","Java","Spring Boot","</>","{ }","=>","git push","feat: ship it","fix: squash bug","build ✓","commit"];
  const css=(v,d)=>getComputedStyle(document.documentElement).getPropertyValue(v).trim()||d;
  const al=(c,a)=>/^#[0-9a-f]{6}$/i.test(c)?c+Math.round(a*255).toString(16).padStart(2,"0"):c;
  const lum=c=>{const m=/^#([0-9a-f]{6})$/i.exec(c);if(!m)return 0;const n=parseInt(m[1],16);return(.299*(n>>16)+.587*(n>>8&255)+.114*(n&255))/255};
  const pal=()=>P.dark?["#ffffff","#d0d0d0","#a8a8a8","#787878"]:["#000000","#333333","#666666","#999999"];
  addEventListener("pointermove",e=>{tmx=e.clientX/W-.5;tmy=e.clientY/H-.5});

  function size(){
    W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    const hero=document.querySelector(".hero"),m=Math.max(0,hero?hero.getBoundingClientRect().left:(W-1100)/2);
    wide=m>=140;
    const place=()=>wide?(rnd()<.5?10+rnd()*Math.max(10,m-140):W-m+20+rnd()*Math.max(10,m-140)):rnd()*W*.9;
    const n=Math.max(8,Math.min(18,Math.round(W/110)));
    chips=Array.from({length:n},(_,i)=>({t:WORDS[i%WORDS.length],x:place(),y:rnd()*H,d:.45+rnd()*.55,v:.12+rnd()*.22,ph:rnd()*6.28,c:i%4,al:wide?1:.3,place,dead:0,sx:0,sy:0,w:0,h:0,fade:0}));
    Object.assign(RK,{x:W*.15,y:H*.7,a:-.8,tg:null,pick:0,cd:90,miss:[],parts:[],rings:[]});
  }

  function drawChips(f){
    const colors=pal();ctx.textBaseline="middle";
    chips.forEach(ch=>{
      if(ch.dead){if(!reduce&&(ch.dead-=f)<=0){ch.dead=0;ch.y=H+40;ch.x=ch.place()}return}
      if(!reduce){ch.y-=ch.v*ch.d*f;if(ch.y<-40){ch.y=H+40;ch.x=ch.place()}}
      const fs=11+ch.d*5,h=fs*2;ctx.font=`500 ${fs}px "JetBrains Mono",ui-monospace,monospace`;
      const w=ctx.measureText(ch.t).width+fs*2.3;
      const x=ch.x+mx*40*ch.d+Math.sin(tick*.012+ch.ph)*14,y=ch.y+my*24*ch.d;
      const fade=Math.max(0,Math.min(1,Math.min(y,H-y)/90));
      ch.sx=x;ch.sy=y;ch.w=w;ch.h=h;ch.fade=fade;
      ctx.globalAlpha=fade*ch.al*(.4+ch.d*.6);
      ctx.shadowColor=al(colors[ch.c],.55);ctx.shadowBlur=18*ch.d;
      ctx.fillStyle=al(P.card,.88);ctx.strokeStyle=al(colors[ch.c],.75);ctx.lineWidth=1.2;
      ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,w,h,h/2):ctx.rect(x,y,w,h);ctx.fill();ctx.shadowBlur=0;ctx.stroke();
      ctx.fillStyle=colors[ch.c];ctx.beginPath();ctx.arc(x+fs*.85,y+h/2,fs*.26,0,6.283);ctx.fill();
      ctx.fillStyle=P.txt;ctx.fillText(ch.t,x+fs*1.45,y+h/2+1);
    });
    ctx.globalAlpha=1;
  }

  // Rocket that hunts the floating chips and blows them up
  const RK={x:0,y:0,a:-.8,tg:null,tx:0,ty:0,pick:0,cd:60,miss:[],parts:[],rings:[]};
  const turn=(a,b,m)=>a+Math.max(-m,Math.min(m,Math.atan2(Math.sin(b-a),Math.cos(b-a))));
  function boom(ch){
    const colors=pal();
    const cx=ch.sx+ch.w/2,cy=ch.sy+ch.h/2,col=colors[ch.c];
    RK.rings.push({x:cx,y:cy,r:6,l:1,c:col});
    for(let i=0;i<34;i++){const an=rnd()*6.283,sp=1+rnd()*4.5;RK.parts.push({x:cx+(rnd()-.5)*ch.w*.6,y:cy,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp,l:1,dec:.014+rnd()*.018,r:1.5+rnd()*2.5,c:i%3?col:(i%2?"#cfcfcf":"#fff")})}
    ch.dead=260+rnd()*200;
  }
  function drawRocket(f){
    const sc=wide?1.3:1,ga=wide?1:.55;
    const body=P.dark?"#ffffff":"#000000";
    const mid=P.dark?"#d0d0d0":"#444444";
    const tip=P.dark?"#f5f5f5":"#111111";
    if(!reduce){
      RK.pick-=f;
      if(RK.pick<=0||(RK.tg&&RK.tg.dead)){
        const c=chips.filter(h=>!h.dead&&h.fade>.5);
        RK.tg=c.length?c[Math.floor(rnd()*c.length)]:null;RK.pick=c.length?420:30;
        if(!RK.tg){RK.tx=W*(.1+rnd()*.8);RK.ty=H*(.15+rnd()*.6)}
      }
      if(RK.tg){RK.tx=RK.tg.sx+RK.tg.w/2;RK.ty=RK.tg.sy+RK.tg.h/2}
      const out=RK.x<-40||RK.x>W+40||RK.y<-40||RK.y>H+40;
      const want=out?Math.atan2(H/2-RK.y,W/2-RK.x):Math.atan2(RK.ty-RK.y,RK.tx-RK.x);
      RK.a=turn(RK.a,want,.05*f);
      RK.x+=Math.cos(RK.a)*2.7*f;RK.y+=Math.sin(RK.a)*2.7*f;
      RK.cd-=f;
      if(RK.tg&&RK.cd<=0){
        const d=Math.hypot(RK.tx-RK.x,RK.ty-RK.y),df=Math.abs(Math.atan2(Math.sin(want-RK.a),Math.cos(want-RK.a)));
        if(d>110&&d<360&&df<.4){RK.miss.push({x:RK.x+Math.cos(RK.a)*20,y:RK.y+Math.sin(RK.a)*20,a:RK.a,tg:RK.tg,l:160});RK.cd=70}
      }
      for(let i=0;i<2;i++)RK.parts.push({x:RK.x-Math.cos(RK.a)*14*sc,y:RK.y-Math.sin(RK.a)*14*sc,vx:-Math.cos(RK.a)*1.2+(rnd()-.5)*.8,vy:-Math.sin(RK.a)*1.2+(rnd()-.5)*.8,l:1,dec:.04+rnd()*.03,r:2+rnd()*2.5,c:i?mid:body});
      RK.miss=RK.miss.filter(m=>{
        m.l-=f;const tg=m.tg,cx=tg.sx+tg.w/2,cy=tg.sy+tg.h/2;
        if(!tg.dead)m.a=turn(m.a,Math.atan2(cy-m.y,cx-m.x),.09*f);
        m.x+=Math.cos(m.a)*5.2*f;m.y+=Math.sin(m.a)*5.2*f;
        if(!tg.dead&&Math.hypot(cx-m.x,cy-m.y)<tg.h*.8){boom(tg);return false}
        RK.parts.push({x:m.x,y:m.y,vx:(rnd()-.5)*.4,vy:(rnd()-.5)*.4,l:.8,dec:.06,r:1.8,c:"#fff"});
        return m.l>0;
      });
      RK.parts.forEach(p=>{p.x+=p.vx*f;p.y+=p.vy*f;p.l-=p.dec*f});RK.parts=RK.parts.filter(p=>p.l>0);
      RK.rings.forEach(r=>{r.r+=3.2*f;r.l-=.03*f});RK.rings=RK.rings.filter(r=>r.l>0);
    }
    ctx.globalCompositeOperation=P.dark?"lighter":"source-over";
    RK.parts.forEach(p=>{ctx.globalAlpha=Math.max(0,p.l)*ga;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,p.r*Math.max(.3,p.l),0,6.283);ctx.fill()});
    RK.rings.forEach(r=>{ctx.globalAlpha=Math.max(0,r.l)*ga;ctx.strokeStyle=r.c;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(r.x,r.y,r.r,0,6.283);ctx.stroke()});
    ctx.globalCompositeOperation="source-over";ctx.globalAlpha=ga;
    RK.miss.forEach(m=>{ctx.save();ctx.translate(m.x,m.y);ctx.rotate(m.a);ctx.fillStyle=mid;ctx.fillRect(-6,-1.5,10,3);ctx.fillStyle=body;ctx.fillRect(4,-1.5,3,3);ctx.restore()});
    ctx.save();ctx.translate(RK.x,RK.y);ctx.rotate(RK.a);ctx.scale(sc,sc);
    ctx.shadowColor=P.a;ctx.shadowBlur=14;ctx.fillStyle=mid;
    ctx.beginPath();ctx.moveTo(-5,-5);ctx.lineTo(-14,-12);ctx.lineTo(-11,-2);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(-5,5);ctx.lineTo(-14,12);ctx.lineTo(-11,2);ctx.closePath();ctx.fill();
    ctx.fillStyle=tip;ctx.strokeStyle=P.a;ctx.lineWidth=1.3;
    ctx.beginPath();ctx.moveTo(19,0);ctx.quadraticCurveTo(8,-8,-11,-6);ctx.lineTo(-11,6);ctx.quadraticCurveTo(8,8,19,0);ctx.closePath();ctx.fill();ctx.shadowBlur=0;ctx.stroke();
    ctx.fillStyle=mid;ctx.beginPath();ctx.arc(3,0,3.3,0,6.283);ctx.fill();ctx.stroke();
    ctx.fillStyle=body;ctx.fillRect(-11,-6,4,12);
    const fl=7+rnd()*7;ctx.fillStyle=mid;ctx.beginPath();ctx.moveTo(-11,-3.5);ctx.lineTo(-11-fl,0);ctx.lineTo(-11,3.5);ctx.closePath();ctx.fill();
    ctx.restore();ctx.globalAlpha=1;
  }

  function render(f){
    ctx.clearRect(0,0,W,H);
    P={a:css("--accent","#ffffff"),card:css("--ed-bg","#111111"),txt:css("--ed-text","#f2f2f2")};
    P.dark=lum(css("--bg","#000000"))<.5;
    if(!reduce){tick+=f;mx+=(tmx-mx)*.05;my+=(tmy-my)*.05}
    drawChips(f);drawRocket(f);
  }
  size();
  addEventListener("resize",()=>{size();if(reduce)render(1)});
  if(reduce)render(1);
  else{let last=performance.now();(function frame(now){const f=Math.min((now-last)/16.67,3);last=now;render(f);requestAnimationFrame(frame)})(last)}
})();
