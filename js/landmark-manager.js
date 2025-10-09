import landmarkStore from './landmark-store.js';
import dom from './dom.js';

let state;

const $create = dom.get('lm-create');
const $show = dom.get('lm-show-list');

const $listModal = dom.get('lm-list-modal');
const $listContainer = dom.get('lm-list-container');
const $listClose = dom.get('lm-list-close');

const $editModal = dom.get('lm-edit-modal');
const $editForm = dom.get('lm-edit-form');
const $editKey = dom.get('lm-edit-key');
const $editName = dom.get('lm-edit-name');
const $editLat = dom.get('lm-edit-lat');
const $editLon = dom.get('lm-edit-lon');
const $editElev = dom.get('lm-edit-elev');
const $editVis = dom.get('lm-edit-vis');
const $editConfirm = dom.get('lm-edit-confirm');
const $editCancel = dom.get('lm-edit-cancel');

const $removeModal = dom.get('lm-remove-modal');
const $removeKey = dom.get('lm-remove-key');
const $removeName = dom.get('lm-remove-name');
const $removeConfirm = dom.get('lm-remove-confirm');
const $removeCancel = dom.get('lm-remove-cancel');

const startCreate = () => {
  const { latitude, longitude, altitude } = state.location.coords;

  $editKey.value = '';
  $editName.value = '';
  $editLat.value = latitude.toFixed(6);
  $editLon.value = longitude.toFixed(6);
  $editElev.value = altitude.toFixed(0);
  $editVis.value = true;

  $editModal.showModal();
};

dom.on($create, 'click', startCreate);

const changeVisibility = async (key, $listVis) => {
  const landmark = landmarkStore.get(key);
  landmark.visible = !landmark.visible;
  await landmarkStore.put(landmark);
  $listVis.className = 'visibility ' + (landmark.visible ? 'visible' : 'hidden');
};

const startEdit = (key) => {
  const { name, latitude, longitude, elevation, visible } = landmarkStore.get(key);

  $editKey.value = key;
  $editName.value = name;
  $editLat.value = latitude.toFixed(6);
  $editLon.value = longitude.toFixed(6);
  $editElev.value = elevation?.toFixed(0);
  $editVis.value = visible;

  $editModal.showModal();
};

const startRemove = (key) => {
  const { name } = landmarkStore.get(key);
  $removeKey.value = key;
  $removeName.innerHTML = `Delete ${name}?`;
  $removeModal.showModal();
};

const fillList = () => {
  $listContainer.innerHTML = '';
  const landmarks = landmarkStore.getAll();

  landmarks.forEach((lm) => {
    const className = 'visibility ' + (lm.visible ? 'visible' : 'hidden');
    const $listVis = dom.create('button', { className });
    dom.on($listVis, 'click', () => changeVisibility(lm.key, $listVis));

    const $listName = dom.create('span', lm.name);

    const $listEdit = dom.create('button', { className: 'edit' });
    dom.on($listEdit, 'click', () => startEdit(lm.key));

    const $listRemove = dom.create('button', { className: 'remove' });
    dom.on($listRemove, 'click', () => startRemove(lm.key));

    dom.add($listContainer, dom.create('div', [$listVis, $listName, $listEdit, $listRemove]));
  });
};

const showList = () => {
  fillList();
  $listModal.showModal();
};

dom.on($show, 'click', showList);

const saveEdits = async () => {
  if (!$editForm.checkValidity()) {
    return;
  }

  const wasEdited = !!$editKey.value;

  const name = $editName.value;
  const latitude = parseFloat($editLat.value);
  const longitude = parseFloat($editLon.value);
  const elevation = $editElev.value ? parseFloat($editElev.value) : undefined;
  const visible = $editVis.value === 'true';

  const landmark = { name, latitude, longitude, elevation, visible };

  if (wasEdited) {
    landmark.key = parseInt($editKey.value, 10);
  }

  await landmarkStore.put(landmark);

  if (wasEdited) {
    fillList();
  }

  $editModal.close();
};

dom.on($editConfirm, 'click', saveEdits);

const remove = async () => {
  const key = parseInt($removeKey.value, 10);
  await landmarkStore.remove(key);
  fillList();
  $removeModal.close();
};

dom.on($removeConfirm, 'click', remove);

// cancel/close dialogs

dom.on([$listClose, $editCancel, $removeCancel], 'click', (event) => event.target.closest('dialog').close());

dom.on([$listModal, $editModal, $removeModal], 'click', (event) => {
  if (event.target instanceof HTMLDialogElement) {
    event.target.close();
  }
});

// initialize

const initialize = async (inState) => {
  state = inState;
};

export default { initialize };