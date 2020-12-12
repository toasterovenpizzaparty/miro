// https://caniuse.com/?search=keyboardevent. event.key has best coverage for our supported browsers.
export const isKeyPressed = (event: KeyboardEvent, keys: Array<string>) =>
  keys.indexOf(event.key.toLowerCase()) > -1;

export const getPasteData = (event: ClipboardEvent, window: Window) =>
  (event.clipboardData || window.clipboardData).getData("text");
