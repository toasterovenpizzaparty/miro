// https://caniuse.com/?search=keyboardevent. event.key has best coverage for our supported browsers.
// Verify if, in a set of keys one of the keys was pressed.
export const isKeyPressed = (event: KeyboardEvent, keys: Array<string>) =>
  keys.indexOf(event.key.toLowerCase()) > -1;

// Get the paste data from our clipboard event
export const getPasteData = (event: ClipboardEvent, window: Window) =>
  (event.clipboardData || window.clipboardData).getData("text");
