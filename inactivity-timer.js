class inactivityTimer {
  #interval;
  #config = {//time is in seconds
    interval: 5,
    events: [],
    fns: [],
    logout: '/logout',
  };
  constructor(config = {}){
    const self = this;
    this.#config.interval = config.interval || this.#config.interval;
    this.#config.logout = config.logout || this.#config.logout;
    config.fns?.forEach(f=>this.addFn(f));
    this.setTimer();
  }
  setTimer(){
    if (this.#interval) window.clearInterval(this.#interval);
    this.#interval = setInterval(()=>this.checkFns(), this.#config.interval * 100 * 60);
  }
  checkFns(){
    const fns = this.#config.fns;
    const local = this.localActivity;
    const global = this.globalActivity;
    if (!fns.length) return;
    this.#config.fns.forEach(fn=>{
      if (!fn.active) return;
      const activity = fn.global === false ? local : global;
      const last = Math.max(...fn.events.map(e=>activity[e] || 0));
      const dt = +new Date();
      alive:{
        if (!fn.alive || (fn.lastPass + fn.alive * 60 * 100 > last)) break alive;
        fn.lastPass = dt;
        fn.fn?.();
      }
      dead:{
        if (!fn.dead || (last + fn.dead * 60 * 100) > dt) {
          fn.isDead = false;
          break dead;
        }
        if (fn.isDead) break dead;
        fn.fn?.();
        fn.isDead = true;
        fn.logout && (typeof this.#config.logout === 'string' ? (location.href = this.#config.logout) : this.#config.logout?.());
      }
    });
  }
  set lastActivity(e){
    const local = this.localActivity;
    const global = this.globalActivity;
    const dt = +new Date();
    local[e] = dt;
    global[e] = dt;
    localStorage.setItem('inactivityTimer', JSON.stringify(global));
    sessionStorage.setItem('inactivityTimer', JSON.stringify(local));
  }
  get localActivity(){
    try{
      const obj = sessionStorage.getItem('inactivityTimer');
      if (!obj) throw '';
      return JSON.parse(obj);
    }catch(e){
      return {};
    }
  }
  get globalActivity(){
    try{
      const obj = localStorage.getItem('inactivityTimer');
      if (!obj) throw '';
      return JSON.parse(obj);
    }catch(e){
      return {};
    }
  }
  addFn(f){
    if (!f) return;
    (f.events && f.events.length) || (f.events = ['mousemove', 'click']);
    this.#config.fns.push(f);
    f.events.forEach(e=>this.addListener(e));
  }
  addListener(e){
    if(this.#config.events.includes(e)) return;
    this.#config.events.push(e);
    document.addEventListener(e, ()=>this.lastActivity = e);
  }
}

export {inactivityTimer};