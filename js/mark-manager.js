import dom from './dom.js';

let state;

const $mark = dom.get('mark');
const $dialog = dom.get('mark-modal');
const $form = dom.get('mark-form');
const $name = dom.get('mark-name');
const $lat = dom.get('mark-lat');
const $lon = dom.get('mark-lon');
const $elev = dom.get('mark-elev');
const $ok = dom.get('mark-ok');
const $cancel = dom.get('mark-cancel');

dom.on($mark, 'click', () => {
  const { coords } = state.location;
  $name.value = '';
  $lat.value = coords.latitude.toFixed(6);
  $lon.value = coords.longitude.toFixed(6);
  $elev.value = coords.altitude.toFixed(0);
  $dialog.showModal();
});

dom.on($ok, 'click', () => {
  if (!$form.checkValidity()) {
    return;
  }

  const name = $name.value;
  const latitude = parseFloat($lat.value);
  const longitude = parseFloat($lon.value);
  const elevation = $elev.value ? parseFloat($elev.value) : undefined;

  const { marks } = state;
  let mark = marks.find((m) => m.name.toLowerCase() === name.toLowerCase());

  if (!mark) {
    mark = {};
    marks.push(mark);
  }

  Object.assign(mark, { name, latitude, longitude, elevation, visible: true });
  $dialog.close();
});

dom.on($cancel, 'click', () => $dialog.close());

dom.on($dialog, 'click', (event) => {
  if (event.target === $dialog) {
    $dialog.close();
  }
});

const initialize = (inState) => {
  state = inState;
};

export default { initialize };