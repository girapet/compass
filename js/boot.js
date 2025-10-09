  import environment from './environment.js';
  import dom from './dom.js';
  
  const script = dom.create('script');
  script.src = environment === 'production' ? 'js/dist/index.js' : 'js/index.js';
  script.type = 'module';
  dom.add(document.body, script);