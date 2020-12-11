import {
  createEmailBlockNode,
  createWordBlockNode,
  insertBefore,
  createNode,
} from "./elements";
import { extractEmails, extractWords } from "./strings";
import styles from "../css/main.css";

declare global {
  interface Window {
    clipboardData: DataTransfer;
  }
}

enum BLOCK_TYPE {
  EMAIL,
  WORD,
}

interface BlockInterface {
  type: BLOCK_TYPE;
  values: Array<string>;
}

const STYLE_ID = "TAGIFY_STYLE";

const classifyBlockType = (word: string): BlockInterface => {
  console.log("word", word);
  const emails = extractEmails(word);
  console.log("emails", emails);
  return {
    type: emails.length ? BLOCK_TYPE.EMAIL : BLOCK_TYPE.WORD,
    values: emails.length ? emails : [word],
  };
};

const scrollToEnd = (targetElement: Element) =>
  (targetElement.scrollTop = targetElement.scrollHeight);

const enhanceBlockWithCloseButton = (
  parentNode: Element,
  onClick: (event: MouseEvent) => void
) => {
  const closeNode = createNode("", "block__close");
  parentNode.appendChild(closeNode);
  closeNode.addEventListener("mousedown", onClick);
};

/* Since IE11 is to be supported, i will not use arrow functions as these are part */
const Tagify = (DOMElement: HTMLDivElement) => {
  DOMElement.className = DOMElement.className + "tagify form";

  const blocks = createNode("", "blocks");
  DOMElement.appendChild(blocks);

  const inputField = document.createElement("input");
  inputField.className = "blocks__input";
  inputField.placeholder = "add more people";
  blocks.appendChild(inputField);

  const headNode = document.querySelector("head");
  const isStyleApplied = !!document.querySelector("#" + STYLE_ID);
  if (headNode && !isStyleApplied) {
    const styleNode = document.createElement("style");
    styleNode.innerHTML = styles.toString();
    styleNode.id = STYLE_ID;
    headNode.appendChild(styleNode);
  }

  const onPressDelete = (event: MouseEvent) => {
    if (event.target) {
      blocks.removeChild(<HTMLElement>(<HTMLElement>event.target).parentNode);
    }
  };

  const captureWordsAndEmails = (
    text: string,
    node: Element,
    insertBeforeNode: Element,
    scrollAreaElement: Element
  ) => {
    const words = extractWords(text);

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const { type, values } = classifyBlockType(word);
      let blockNodes = [];
      for (let j = 0; j < values.length; j++) {
        const blockNode =
          type === BLOCK_TYPE.EMAIL
            ? createEmailBlockNode(values[j])
            : createWordBlockNode(values[j]);
        enhanceBlockWithCloseButton(blockNode, onPressDelete);
        blockNodes.push(blockNode);
      }
      insertBefore(node, blockNodes, insertBeforeNode);
    }

    scrollToEnd(scrollAreaElement);
  };

  const onKeyPressed = (event: KeyboardEvent) => {
    // https://caniuse.com/?search=keyboardevent. event.key has best coverage for our supported browsers.
    const key = event.key.toLowerCase();
    const isInputEmpty = inputField.value.trim() === "";
    const hasBlocks = blocks.children.length > 1;
    const isEmailsReadyForCapture = [",", "enter"].indexOf(key) > -1;
    const isBlockReadyForDelete =
      ["del", "backspace"].indexOf(key) > -1 && isInputEmpty && hasBlocks;
    if (isEmailsReadyForCapture) {
      captureWordsAndEmails(inputField.value, blocks, inputField, DOMElement);
      inputField.value = "";
    } else if (isBlockReadyForDelete) {
      const lastIndex = blocks.children.length - 2; // last index is our input
      const node = blocks.children[lastIndex];
      blocks.removeChild(node);
    }
    scrollToEnd(DOMElement);
  };

  const onPaste = (event: ClipboardEvent) => {
    event.preventDefault(); // Do not let the paste data into the inputfield.
    const pastedText: string = (
      event.clipboardData || window.clipboardData
    ).getData("text");
    captureWordsAndEmails(pastedText, blocks, inputField, DOMElement);
    scrollToEnd(DOMElement);
  };

  const onInputFieldBlur = () => {
    captureWordsAndEmails(inputField.value, blocks, inputField, DOMElement);
    scrollToEnd(DOMElement);
    inputField.value = "";
  };

  inputField.addEventListener("blur", onInputFieldBlur);
  inputField.addEventListener("keyup", onKeyPressed);
  inputField.addEventListener("paste", onPaste);

  return {
    addEmail: (email: string) =>
      captureWordsAndEmails(email, blocks, inputField, DOMElement),

    getEmailCount: () => {
      const emails = extractEmails(DOMElement.textContent || "");
      return emails.length;
    }, // TODO get real emails length.
    destroy: () => {
      inputField.removeEventListener("blur", onInputFieldBlur);
      inputField.removeEventListener("keyup", onKeyPressed);
      inputField.removeEventListener("paste", onPaste);
    },
  };
};

export default Tagify;
module.exports = Tagify;
