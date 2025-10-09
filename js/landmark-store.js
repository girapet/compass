import landmarkDb from './landmark-db.js';

const landmarks = await landmarkDb.getAll();

const get = (key) => landmarks.find((lm) => lm.key === key);

const getAll = () => landmarks.toSorted((a, b) => a.name > b.name ? 1 : (a.name < b.name ? -1 : 0));

const getVisible = () => landmarks.filter((lm) => lm.visible);

const put = async (landmark) => {
  const key = await landmarkDb.put(landmark);
  const i = landmarks.findIndex((lm) => lm.key === key);

  if (i === -1) {
    landmark.key = key;
    landmarks.push(landmark);
  }
  else {
    landmarks[i] = landmark;
  }
};

const remove = async (key) => {
  const i = landmarks.findIndex((lm) => lm.key === key);

  if (i >= 0) {
    landmarks.splice(i, 1);
    await landmarkDb.remove(key);
  }
};

export default { get, getAll, getVisible, put, remove };