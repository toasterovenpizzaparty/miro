import { BLOCK_TYPE } from "./blocks";
/*
 * Element creation toolset
 */

export const createNode = (text: string, className: string, isHTML = false) => {
  const node = document.createElement("div");
  isHTML ? (node.innerHTML = text) : (node.innerText = text);
  node.className = className;

  return node;
};

export const createInput = (className: string, placeholder: string) => {
  const inputField = document.createElement("input");
  inputField.className = className;
  inputField.placeholder = placeholder;

  return inputField;
};

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

const createCloseButtonNode = () => createNode("", "block__close");

export const createEmailBlockNode = (email: string) => {
  const emailNode = createNode(email, "block block__tag block__tag--email");
  emailNode.dataset.type = BLOCK_TYPE.EMAIL.toString();
  const closeButtonNode = createCloseButtonNode();
  appendChildren(emailNode, [closeButtonNode]);
  return emailNode;
};

export const createWordBlockNode = (word: string) => {
  const wordNode = createNode(word, "block block__tag block__tag--word");
  wordNode.dataset.type = BLOCK_TYPE.WORD.toString();
  const closeButtonNode = createCloseButtonNode();
  appendChildren(wordNode, [closeButtonNode]);
  return wordNode;
};

export const appendChildren = (
  node: Element,
  elements: Array<HTMLDivElement>
) => {
  for (let i = 0; i < elements.length; i++) {
    node.appendChild(elements[i]);
  }
};

export const insertBefore = (
  parentNode: Element,
  elements: Array<HTMLDivElement>,
  before: Element
) => {
  for (let i = 0; i < elements.length; i++) {
    parentNode.insertBefore(elements[i], before);
  }
};

export const createEmailBlockNodes = (emails: Array<string>) =>
  emails.map(createEmailBlockNode);

export const createWordBlockNodes = (words: Array<string>) =>
  words.map(createWordBlockNode);

export const scrollToEnd = (targetElement: Element) =>
  (targetElement.scrollTop = targetElement.scrollHeight);

export const setClassName = (element: Element, className: string): Element => {
  element.className = className;
  return element;
};

export const appendClassName = (
  element: Element,
  className: string
): Element => {
  element.className = element.className + className;
  return element;
};

export const hasChildren = (element: Element) => element.children.length > 0;
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
