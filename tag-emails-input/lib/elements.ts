import { BLOCK_TYPE } from "./blocks";
/*
 * A simple toolkit to work with elements/nodes.
 */

// Create a DIVElement Node, a className and text or HTML.
export const createNode = (text: string, className: string, isHTML = false) => {
  const node = document.createElement("div");
  isHTML ? (node.innerHTML = text) : (node.innerText = text);
  node.className = className;

  return node;
};

// Create an input field with classname and placeholder text.
export const createInput = (className: string, placeholder: string) => {
  const inputField = document.createElement("input");
  inputField.className = className;
  inputField.placeholder = placeholder;

  return inputField;
};

// Append a string of styles to the <HEAD> element
// Optionally adding an ID.
export const appendStyles = (
  styles: string,
  node: Element,
  id: string | null = null
) => {
  const styleNode = document.createElement("style");
  styleNode.innerHTML = styles;
  if (id) {
    styleNode.id = id;
  }
  node.appendChild(styleNode);
};

// Creates a close button element.
const createCloseButtonNode = () => createNode("", "block__close");

// Creates an email block node with a type identifier attached and close button.
export const createEmailBlockNode = (email: string) => {
  const emailNode = createNode(email, "block block__tag block__tag--email");
  emailNode.dataset.type = BLOCK_TYPE.EMAIL.toString();
  const closeButtonNode = createCloseButtonNode();
  appendChildren(emailNode, [closeButtonNode]);
  return emailNode;
};

// Creates an word block node with a type identifier attached and close button.
export const createWordBlockNode = (word: string) => {
  const wordNode = createNode(word, "block block__tag block__tag--word");
  wordNode.dataset.type = BLOCK_TYPE.WORD.toString();
  const closeButtonNode = createCloseButtonNode();
  appendChildren(wordNode, [closeButtonNode]);
  return wordNode;
};

// Appends an array of <div> elements to a node.
export const appendChildren = (
  node: Element,
  elements: Array<HTMLDivElement>
) => {
  for (let i = 0; i < elements.length; i++) {
    node.appendChild(elements[i]);
  }
};

// Inserts an array of <div> elements as children of parentNode.
// Making sure they are inserted before the "before" element.
export const insertBefore = (
  parentNode: Element,
  elements: Array<HTMLDivElement>,
  before: Element
) => {
  for (let i = 0; i < elements.length; i++) {
    parentNode.insertBefore(elements[i], before);
  }
};

// Create a set of email blocks of an array of string.
export const createEmailBlockNodes = (emails: Array<string>) =>
  emails.map(createEmailBlockNode);

// Create a set of word blocks of an array of string.
export const createWordBlockNodes = (words: Array<string>) =>
  words.map(createWordBlockNode);

// Scroll to the end of the given element.
export const scrollToEnd = (targetElement: Element) =>
  (targetElement.scrollTop = targetElement.scrollHeight);

// Set a classname for element
export const setClassName = (element: Element, className: string): Element => {
  element.className = className;
  return element;
};

// Append a classname to element
export const appendClassName = (
  element: Element,
  className: string
): Element => {
  element.className = element.className + className;
  return element;
};

// Verify if an element has children
export const hasChildren = (element: Element) => element.children.length > 0;

// Get the last child by a certain offset.
export const getLastChild = (element: Element, offset: number = 1) => {
  if (element.children.length) {
    const lastIndex = element.children.length - offset;
    const child = element.children[lastIndex];
    if (child) {
      return child;
    }
  }
  return null;
};
