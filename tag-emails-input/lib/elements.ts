/*
 * Element creation toolset
 */

export const createNode = (text: string, className: string, isHTML = false) => {
  const node = document.createElement("div");
  isHTML ? (node.innerHTML = text) : (node.innerText = text);
  node.className = className;

  return node;
};

export const createEmailBlockNode = (email: string) =>
  createNode(email, "block block__tag block__tag--email");

export const createWordBlockNode = (word: string) =>
  createNode(word, "block block__tag block__tag--word");

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
