
const host = new URL(document.location.href).hostname;
const environment = host === 'localhost' ? 'development' : 'production';

export default environment;
 