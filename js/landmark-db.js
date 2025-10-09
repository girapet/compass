
const NAME = 'landmarks';
let database;

const getDatabase = () => new Promise((resolve, reject) => {
  if (database) {
    resolve(database);
  }

  const request = window.indexedDB.open(NAME, 1);
  request.onsuccess = () => {
    database = request.result;
    resolve(database);
  }
  request.onupgradeneeded = () => request.result.createObjectStore(NAME, { 
    keyPath: 'key',
    autoIncrement: true
  });
  request.onerror = reject;
});

const getObjectStore = (mode = 'readonly') => new Promise((resolve, reject) => {
  getDatabase().then((db) => {
    const transaction = db.transaction([NAME], mode);
    const objectStore = transaction.objectStore(NAME);
    resolve(objectStore);  
  })
  .catch(reject);
});

const getAll = () => new Promise((resolve, reject) => {
  getObjectStore().then((objectStore) => {
    const request = objectStore.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = reject;
  })
  .catch(reject);
});

const put = (landmark) => new Promise((resolve, reject) => {
  getObjectStore('readwrite').then((objectStore) => {
    const request = objectStore.put(landmark);
    request.onsuccess = () => {
      objectStore.transaction.commit();
      resolve(request.result);
    }
    request.onerror = reject;
  })
  .catch(reject);
});

const remove = (key) => new Promise((resolve, reject) => {
  getObjectStore('readwrite').then((objectStore) => {
    const request = objectStore.delete(key);
    request.onsuccess = () => {
      objectStore.transaction.commit();
      resolve();
    }
    request.onerror = reject;
  })
  .catch(reject);
});

export default { getAll, put, remove }