// Interactive script for Valentine's pages

// Shared utilities
function confettiBurst(x, y, count = 28) {
  const container = document.createElement('div')
  container.className = 'confetti'
  document.body.appendChild(container)
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div')
    p.className = 'p'
    // spread particles more widely around the center
    p.style.left = `${x + (Math.random() - 0.5) * 140}px`
    p.style.top = `${y + (Math.random() - 0.5) * 80}px`
    p.style.background = ['#ffd0e1','#ff94c2','#e11d48','#ff6b9f','#fff2f5'][Math.floor(Math.random()*5)]
    p.style.transform = `translateY(0) rotate(${Math.random()*360}deg)`
    container.appendChild(p)
    p.addEventListener('animationend', ()=>p.remove())
  }
  // keep container a bit longer so we don't remove while children are still animating
  setTimeout(()=>container.remove(), 1400)
}

// sparkles used for subtle celebrations
function sparkleBurst(x, y, count=6){
  for(let i=0;i<count;i++){
    const s = document.createElement('div')
    s.className = 'sparkle s' + (1 + Math.floor(Math.random()*3))
    s.style.left = `${x + (Math.random()-0.5)*60}px`
    s.style.top = `${y + (Math.random()-0.5)*30}px`
    document.body.appendChild(s)
    // start animation
    requestAnimationFrame(()=>s.classList.add('show'))
    s.addEventListener('animationend', ()=>s.remove())
  }
}



// Recipes page logic
const sweetIdeas = [
  {name:'Chocolate Fondue', type:'dessert', steps:['Melt good-quality chocolate with cream','Prepare fruit and dippers','Dip and enjoy together']},
  {name:'Molten Chocolate Cakes', type:'dessert', steps:['Preheat oven and prepare ramekins','Mix batter and pour','Bake 10-12 min until edges set, serve warm']},
  {name:'Strawberry Shortcake', type:'dessert', steps:['Quickly macerate strawberries with a touch of sugar','Layer biscuits with whipped cream and berries','Serve immediately']},
  {name:'Red Velvet Cupcakes', type:'dessert', steps:['Prepare red velvet batter','Bake in muffin tin','Top with cream cheese frosting']},
  {name:'Candlelit Movie Night', type:'cozy', steps:['Dim the lights and light scented candles','Choose a romantic movie','Snuggle up with blankets and popcorn']},
  {name:'Hot Chocolate by the Fire', type:'cozy', steps:['Build a cozy fire or use a fireplace','Prepare rich hot chocolate with marshmallows','Share stories while sipping']},
  {name:'Stargazing Picnic', type:'cozy', steps:['Find a clear spot away from city lights','Spread a blanket and bring warm drinks','Lie back and watch the stars']},
  {name:'Homemade Pizza Night', type:'cozy', steps:['Prepare dough or use store-bought','Add favorite toppings','Bake and enjoy together in the living room']}
]

function setupRecipes(){
  const generate = document.getElementById('generate')
  if(!generate) return
  const dishEl = document.getElementById('dish')
  const tipEl = document.getElementById('tip')
  generate.addEventListener('click', ()=>{
    const pick = sweetIdeas[Math.floor(Math.random()*sweetIdeas.length)]
    dishEl.innerHTML = `<h4>${pick.type === 'dessert' ? 'Dessert' : 'Cozy Idea'}: ${pick.name}</h4><ol>${pick.steps.map(s=>`<li>${s}</li>`).join('')}</ol>`
    dishEl.classList.remove('hidden')
    tipEl.textContent = pick.type === 'dessert' ? 'Tip: Prep ingredients ahead to relax with your guests.' : 'Tip: Set the mood with soft lighting and your favorite playlist.'
    const rect = generate.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    confettiBurst(cx, cy, 28)
    sparkleBurst(cx, cy, 8)
    // gentle heart hop if present
    const heart = document.querySelector('.heart-icon')
    if(heart){
      heart.animate([{transform:'translateY(0)'},{transform:'translateY(-18px) scale(1.04)'},{transform:'translateY(0)'}],{duration:600,easing:'ease-out'})
    }
  })
}


function setupGratitude(){
  const form = document.getElementById('gratitude-form')
  const wall = document.getElementById('wall')
  if(!form || !wall) return
  form.addEventListener('submit', e=>{
    e.preventDefault()
    const input = document.getElementById('note')
    const text = input.value.trim()
    if(!text) return
    const note = document.createElement('div')
    note.className = 'note'
    note.textContent = text
    wall.prepend(note)
    // tiny pop animation so the new note feels alive
    note.classList.add('pop')
    note.addEventListener('animationend', ()=> note.classList.remove('pop'), {once:true})

    input.value = ''
    const rect = note.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    // a larger, centered confetti burst and slightly more sparkles for emphasis
    confettiBurst(cx, cy, 36)
    sparkleBurst(cx, cy, 10)
    playChime()
    updateLoveMeter(1)
  })
}

// Quiz logic
function setupQuiz(){
  const quiz = document.getElementById('quiz')
  if(!quiz) return
  quiz.addEventListener('click', (e)=>{
    const btn = e.target.closest('.quiz-btn')
    if(!btn) return
    const result = document.getElementById('quizResult')
    if(btn.dataset.answer === 'rose'){
      result.textContent = 'Correct! Rose is commonly associated with love.'
    } else {
      result.textContent = 'Nice try — the classic answer is Rose.'
    }
    result.classList.remove('hidden')
    const brect = btn.getBoundingClientRect()
    confettiBurst(brect.left + brect.width/2, brect.top + brect.height/2, 20)
  })
}

// utility: simple chime using WebAudio
let audioEnabled = true
function playChime(){
  if(!audioEnabled) return
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const now = ctx.currentTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(880, now)
    g.gain.setValueAtTime(0, now)
    g.gain.linearRampToValueAtTime(0.12, now + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.6)
    o.connect(g); g.connect(ctx.destination)
    o.start(now); o.stop(now + 0.7)
  }catch(e){/* ignore */}
}

// Love meter (persistent)
let loveCount = Number(localStorage.getItem('loveCount') || 0)
function updateLoveMeter(incr=0){
  loveCount = Math.max(0, loveCount + incr)
  document.querySelectorAll('#love-count').forEach(el=>el.textContent = loveCount)
  localStorage.setItem('loveCount', loveCount)
}
updateLoveMeter(0)

// pop hearts at location (small burst)
function popHearts(x,y,count=8){
  // If canvas mode is active, spawn on canvas for performance
  if(heartsMode === 'canvas'){
    canvasHearts.spawnFromPoint(x, y, count)
  } else {
    const frag = document.createDocumentFragment()
    for(let i=0;i<count;i++){
      const ph = document.createElement('div')
      ph.className = 'pop-heart pop'
      ph.style.left = (x + (Math.random()-0.5)*60) + 'px'
      ph.style.top = (y + (Math.random()-0.5)*40) + 'px'
      ph.style.opacity = 0.9 + Math.random()*0.1
      ph.style.transform = `rotate(${(-45 + Math.random()*90)}deg)`
      document.body.appendChild(ph)
      ph.addEventListener('animationend', ()=>ph.remove())
    }
  }
  // sparkles and confetti
  sparkleBurst(x - 10, y - 10, 6)
  confettiBurst(x - 20, y - 10)
  if(audioEnabled) playChime()
  updateLoveMeter(1)
}

// Canvas-based heart engine (better performance for many hearts)
class CanvasHearts{
  constructor(){
    this.canvas = document.createElement('canvas')
    this.canvas.id = 'heart-canvas'
    this.ctx = this.canvas.getContext('2d')
    this.dpr = Math.max(1, window.devicePixelRatio || 1)
    this.hearts = []
    this.running = false
    this._raf = null
    this._last = 0
    this.palette = ['#ffd0e1','#ff94c2','#e11d48','#ff6b9f','#fff2f5']
    this.max = 90
    this.spawnRate = 1
    this.spawnIntervalMs = 240
    this._spawnInterval = null
    window.addEventListener('resize', ()=>this._resize())
    document.addEventListener('visibilitychange', ()=>{ if(document.hidden) this.pause(); else this.resume() })
  }
  _resize(){
    const w = window.innerWidth, h = window.innerHeight
    this.canvas.width = Math.round(w * this.dpr)
    this.canvas.height = Math.round(h * this.dpr)
    this.canvas.style.width = w + 'px'
    this.canvas.style.height = h + 'px'
    this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0)
  }
  start(){
    if(this.running) return
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    this._resize()
    document.body.appendChild(this.canvas)
    this.running = true
    this._last = performance.now()
    this._loop(this._last)
    // spawn interval to ensure continuous flow
    if(this._spawnInterval) clearInterval(this._spawnInterval)
    this._spawnInterval = setInterval(()=>{
      // keep a gentle continuous spawn
      if(this.hearts.length < this.max) this.spawn(Math.max(1, Math.round(this.spawnRate)))
    }, this.spawnIntervalMs)
  }
  stop(){
    this.running = false
    if(this._raf) cancelAnimationFrame(this._raf)
    this._raf = null
    if(this._spawnInterval){ clearInterval(this._spawnInterval); this._spawnInterval = null }
    this._clear()
    try{ this.canvas.remove() }catch(e){}
  }
  pause(){ if(this.running){ if(this._raf) cancelAnimationFrame(this._raf); this._raf = null }}
  resume(){ if(this.running && !this._raf){ this._last = performance.now(); this._loop(this._last)} }
  _clear(){ this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height) }
  _loop(now){
    const dt = Math.min(50, now - this._last)
    this._last = now
    this._update(dt/1000)
    this._draw()
    if(this.running) this._raf = requestAnimationFrame(t=>this._loop(t))
  }
  _update(dt){
    // spawn gently
    if(this.hearts.length < this.max){
      for(let i=0;i<this.spawnRate;i++) this._spawnRandom()
    }
    for(let i=this.hearts.length-1;i>=0;i--){
      const h = this.hearts[i]
      h.x += h.vx * dt
      h.y += h.vy * dt
      h.vy += 40 * dt
      h.life -= dt
      h.alpha -= dt * 0.9
      h.rotation += h.spin * dt
      if(h.y - h.size > window.innerHeight || h.alpha <= 0 || h.life <= 0) this.hearts.splice(i,1)
    }
  }
  _draw(){
    const ctx = this.ctx
    ctx.clearRect(0,0,window.innerWidth, window.innerHeight)
    this.hearts.forEach(h=>{
      ctx.save()
      ctx.globalAlpha = Math.max(0, h.alpha)
      ctx.translate(h.x, h.y)
      ctx.rotate(h.rotation)
      ctx.scale(h.size/20, h.size/20)
      // draw heart shape path
      ctx.beginPath()
      ctx.moveTo(0, -8)
      ctx.bezierCurveTo(6, -18, 22, -14, 10, 4)
      ctx.bezierCurveTo(-2, 20, -18, 8, 0, -2)
      ctx.closePath()
      ctx.fillStyle = h.color
      ctx.fill()
      ctx.restore()
    })
  }
  _spawnRandom(){
    const size = 8 + Math.random()*36
    const x = Math.random()*window.innerWidth
    const y = -20 - Math.random()*40
    const h = {
      x, y, size,
      vx: (Math.random()-0.5) * 40,
      vy: 20 + Math.random()*40,
      life: 4 + Math.random()*3,
      rotation: (Math.random()-0.5) * 0.6,
      spin: (Math.random()-0.5) * 4,
      alpha: 0.9 + Math.random()*0.1,
      color: this.palette[Math.floor(Math.random()*this.palette.length)]
    }
    this.hearts.push(h)
  }
  spawn(count=6){ for(let i=0;i<count;i++) this._spawnRandom() }
  spawnFromPoint(x,y,count=10){ for(let i=0;i<count;i++){
    const theta = (Math.random()-0.5) * Math.PI
    const speed = 40 + Math.random()*160
    const size = 8 + Math.random()*32
    this.hearts.push({
      x, y, size,
      vx: Math.cos(theta)*speed/10,
      vy: Math.sin(theta)*speed/10 - 40,
      life: 1.0 + Math.random()*1.2,
      rotation: (Math.random()-0.5)*2,
      spin: (Math.random()-0.5)*6,
      alpha:1,
      color: this.palette[Math.floor(Math.random()*this.palette.length)]
    }) }
  }
}

// toggle heart rain control (updated to support DOM or canvas engines)
let heartIntervalId = null
let heartsRunning = true
let heartsMode = localStorage.getItem('heartsMode') || 'canvas' // 'dom' or 'canvas'
const canvasHearts = new CanvasHearts()

function setHeartsRunning(enable){
  heartsRunning = !!enable
  document.querySelectorAll('#toggle-hearts').forEach(b=>b.setAttribute('aria-pressed', enable ? 'true':'false'))
  if(!enable){
    if(heartIntervalId){clearInterval(heartIntervalId); heartIntervalId = null}
    canvasHearts.stop()
  } else {
    // start based on mode
    if(heartsMode === 'canvas'){
      // ensure no leftover DOM interval
      if(heartIntervalId){clearInterval(heartIntervalId); heartIntervalId = null}
      canvasHearts.start()
      // immediate gentle burst to populate the screen
      try{ canvasHearts.spawn(6) }catch(e){}
    } else {
      // DOM mode: always create a continuous interval (shorter for steady flow)
      if(heartIntervalId) clearInterval(heartIntervalId)
      heartIntervalId = startHeartRain({interval:450})
      // create an initial burst of DOM hearts
      try{
        const container = document.getElementById('heart-container') || document.body
        for(let i=0;i<6;i++){
          const h = document.createElement('div')
          h.className = 'heart'
          const size = 12 + Math.random()*28
          h.style.width = h.style.height = size + 'px'
          h.style.left = (Math.random()*100) + '%'
          h.style.opacity = 0.85 + Math.random()*0.15
          const dur = 3000 + Math.random()*4000
          h.style.animationDuration = dur + 'ms'
          container.appendChild(h)
          h.addEventListener('animationend', ()=>h.remove())
        }
      }catch(e){}
    }
  }
}

// updated startHeartRain returns interval id and uses DOM-only spawning
function startHeartRain(opts={interval:450}){
  const container = document.getElementById('heart-container') || document.body
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  const id = setInterval(()=>{
    // create one DOM heart
    if(document.hidden) return
    const h = document.createElement('div')
    h.className = 'heart'
    const size = 12 + Math.random()*28
    h.style.width = h.style.height = size + 'px'
    h.style.left = (Math.random()*100) + '%'
    h.style.opacity = 0.85 + Math.random()*0.15
    const dur = 3000 + Math.random()*4000
    h.style.animationDuration = dur + 'ms'
    container.appendChild(h)
    h.addEventListener('animationend', ()=>h.remove())
  }, opts.interval)
  return id
}

// helper: force-create visible DOM hearts (bypasses prefers-reduced-motion for testing)
function showTestHearts(count=12){
  try{
    const container = document.getElementById('heart-container') || document.body
    for(let i=0;i<count;i++){
      const h = document.createElement('div')
      h.className = 'heart'
      const size = 18 + Math.random()*36
      h.style.width = h.style.height = size + 'px'
      h.style.left = (Math.random()*100) + '%'
      h.style.opacity = 0.95
      // longer animation so they fall slowly and are more visible
      const dur = 5000 + Math.random()*4000
      h.style.animationDuration = dur + 'ms'
      container.appendChild(h)
      // remove after animation finish
      h.addEventListener('animationend', ()=>h.remove())
    }
  }catch(e){/* ignore */}
}

// toggle sound control
function setSound(enable){
  audioEnabled = !!enable
  document.querySelectorAll('#toggle-sound').forEach(b=>b.setAttribute('aria-pressed', enable ? 'true':'false'))
}

// parallax light follow
function setupParallax(){
  const items = Array.from(document.querySelectorAll('[data-parallax]'))
  if(!items.length) return
  let light = document.getElementById('parallax-light')
  if(!light){light = document.createElement('div'); light.id = 'parallax-light'; document.body.appendChild(light)}
  window.addEventListener('mousemove', (e)=>{
    const cx = window.innerWidth/2, cy = window.innerHeight/2
    const dx = (e.clientX - cx)/cx, dy = (e.clientY - cy)/cy
    items.forEach(el=>{
      const speed = parseFloat(el.dataset.parallax) || 0.02
      el.style.transform = `translate3d(${dx*speed*40}px, ${dy*speed*30}px, 0) rotate(${dx*speed*8}deg)`
    })
    light.style.transform = `translate3d(${dx*8}px, ${dy*8}px, 0)`
  })
}

// click to pop anywhere useful
window.addEventListener('click', (e)=>{
  const target = e.target
  // if clicking controls or inputs, ignore
  if(e.target.closest('.site-controls') || e.target.closest('button') || e.target.closest('input')) return
  const rect = {left: e.clientX, top: e.clientY}
  popHearts(rect.left, rect.top, 10)
})



// wire up toggles and initial states
window.addEventListener('DOMContentLoaded', ()=>{
  setupRecipes()
  setupGratitude()
  setupQuiz()
  setupParallax()
  // initialize toggles
  const heartsToggle = document.getElementById('toggle-hearts')
  const soundToggle = document.getElementById('toggle-sound')
  // Force-enable hearts and sound by default so the falling hearts and chime are present
  localStorage.setItem('heartsEnabled', 'true')
  localStorage.setItem('soundEnabled', 'true')
  const heartsEnabled = true
  const soundEnabled = true
  setSound(true)
  // choose engine (use 'canvas' by default for better performance) — there is no UI toggle for it
  // persist default if absent
  if(!localStorage.getItem('heartsMode')) localStorage.setItem('heartsMode', heartsMode)

  setHeartsRunning(heartsEnabled)
  // If no visible engine element appears shortly after load, trigger a fallback pop so the hearts and chime are seen
  setTimeout(()=>{
    if(!document.querySelector('.heart') && !document.getElementById('heart-canvas')){
      try{ showTestHearts(16); playChime() }catch(e){}
    }
  }, 600)
  heartsToggle && heartsToggle.addEventListener('click', ()=>{ setHeartsRunning(!heartsRunning); localStorage.setItem('heartsEnabled', heartsRunning) })
  soundToggle && soundToggle.addEventListener('click', ()=>{ setSound(!audioEnabled); localStorage.setItem('soundEnabled', audioEnabled) })

  // keyboard shortcuts: h = hearts, s = sound
  window.addEventListener('keydown', (e)=>{
    if(e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return
    const key = e.key.toLowerCase()
    if(key === 'h'){ const b = document.getElementById('toggle-hearts'); b && b.click() }
    if(key === 's'){ const b = document.getElementById('toggle-sound'); b && b.click() }
  })
