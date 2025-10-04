  import dom from './dom.js';

  const host = new URL(document.location.href).hostname;
  const isProduction = host !== 'localhost';
  
  const script = dom.create('script');
  script.src = isProduction ? 'js/dist/index.js' : 'js/index.js';
  script.type = 'module';
  dom.add(document.body, script);