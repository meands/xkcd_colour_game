import { colours } from "./colours.ts";

export function getRandomColour() {
  const randIdx = Math.floor(Math.random() * (colours.length - 1));
  return colours[randIdx];
}

export function increaseCounter(el: HTMLDivElement) {
  el.innerText = `Tries: ${(
    parseInt(el.innerText.match(/Tries: (\d*)$/)?.[1]!) + 1
  ).toString()}`;
}

export function getColourTheme(colour: string) {
  var colour = colour.substring(1); // strip #
  var rgb = parseInt(colour, 16); // convert rrggbb to decimal
  var r = (rgb >> 16) & 0xff; // extract red
  var g = (rgb >> 8) & 0xff; // extract green
  var b = (rgb >> 0) & 0xff; // extract blue

  var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
  if (luma < 40) {
    return "dark";
  } else return "light";
}
