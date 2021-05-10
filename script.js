import {inactivityTimer} from './inactivity-timer.js';

const config = {
  interval: 1,
  logout: '/logout', // || logoutFn
  fns: [
    {
      active: true, //default. If false, skip during check phase.
      alive: 5, //after x time, check if user is active. If true, execute fn.
      fn: ()=>console.log('alive'),
      name: 'logActive',
      global: true, //default true. If false, only reference sessionStorage.
      events: ['mousemove', 'click'], //override default events to check. If event does not exist, add to listeners.
      lastPass: 0, //Set to 0 or exclude if it needs to run after first check for alive checks. Otherwise, can set it to +new Date();
    },
    {
      dead: 10, //after x time, check if user is inactive. If true, execute fn.
      fn: ()=>console.log('dead'),
      name: 'showWarning',
    },
    {
      dead: 60*60,
      //fn: fn3,
      name: 'logout',
      logout: true //false is default. If true, execute logout method AFTER fn if defined and only runs with "dead".
    },
  ]
}

globalThis.test = new inactivityTimer(config);