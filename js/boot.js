  const host = new URL(document.location.href).hostname;
  const isProduction = host === 'localhost';
  
  const script = document.createElement('script');
  script.src = isProduction ? '/js/dist/index.js' : '/js/index.js';
  script.type = 'module';
  document.body.appendChild(script);