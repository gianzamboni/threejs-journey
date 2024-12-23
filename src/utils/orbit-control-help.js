
export const ORBIT_CONTROL_HELP = [
  "Click and drag to rotate the camera",
  "Scroll to zoom in and out",
  "Right click and drag to pan"
];

export function addOrbitControlHelp(element) {
  ORBIT_CONTROL_HELP.map((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    return li;
  }).forEach((item) => {
    element.appendChild(item);
  });
}
