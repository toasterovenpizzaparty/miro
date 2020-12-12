import {
  insertBefore,
  createNode,
  createInput,
  appendStyles,
  appendClassName,
  scrollToEnd,
  getLastChild,
  hasChildren,
} from "./elements";
import { convertTextToWordsAndEmailBlockNodes, BLOCK_TYPE } from "./blocks";
import { isKeyPressed, getPasteData } from "./utils";
// import { extractEmails } from "./strings";
import { STYLE_ID } from "./config";
import styles from "../css/main.css";

declare global {
  interface Window {
    clipboardData: DataTransfer;
  }
}

/*
 * Main entry point
 */
const Tagify = (DOMElement: HTMLDivElement) => {
  // -- Setup our basic elements, input, containers.
  appendClassName(DOMElement, "tagify form");

  // Create a container to keep the inputfield and blocks in.
  const blocks = createNode("", "blocks");
  const inputField = createInput("blocks__input", "add more people");

  blocks.appendChild(inputField);
  DOMElement.appendChild(blocks);

  // Inject css styling into the <HEAD>
  const headNode = document.querySelector("head");
  // Make sure no style is applied yet.
  const isStyleApplied = !!document.querySelector("#" + STYLE_ID);
  if (headNode && !isStyleApplied) {
    // Add our styling to the <HEAD>
    appendStyles(styles.toString(), headNode, STYLE_ID);
  }
  // -- Finished setting up basic elements.

  // -- Main capture functions for emails or words
  // Keep track of the number of emails created.
  let totalEmailCount = 0;
  // Simple count function to expose the current count
  const countEmails = (): number => totalEmailCount;

  // A little bit convoluted;
  // On press delete find the parent node and remove it from the blocks div.
  // If there is a datatype set with the BLOCK_TYPE.EMAIL, we subtract 1 from our list
  const onPressDelete = (event: MouseEvent) => {
    if (event.target) {
      // Make sure typescript understands what type we are expecting.
      const parent = <HTMLDivElement>(<HTMLElement>event.target).parentNode;
      if (parent.dataset.type === BLOCK_TYPE.EMAIL.toString()) {
        totalEmailCount--;
      }
      blocks.removeChild(<HTMLElement>(<HTMLElement>event.target).parentNode);
    }
  };

  // Here is our main function to convert text into blocks.
  // The text is converted into nodes and returned along with the number of email blocks created.
  // The onPressDelete function is hoisted to ensure we can easily remove it.
  // We append our blocks before the inputfield
  // Finally we scroll to the bottom.
  const convertTextToBlocks = (text: string) => {
    // Convert our text into block nodes.
    const { nodes, emailCount } = convertTextToWordsAndEmailBlockNodes(text);
    // Tally up our email count.
    totalEmailCount += emailCount;
    // Add eventlisteners to our close buttons.
    nodes.forEach(
      (node) =>
        hasChildren(node) &&
        (<HTMLElement>node.children[0]).addEventListener(
          "mousedown",
          onPressDelete
        )
    );
    // Insert our nodes within blocks, but before the inputfield.
    insertBefore(blocks, nodes, inputField);
    // Scroll to the end of the content.
    scrollToEnd(DOMElement);
  };
  // -- End of main capture

  // -- Initialize our listeners
  // Upon pressing certain keys within the inputfield we either delete blocks or add new blocks.
  // Comma and enter add blocks.
  // We do this on key up to ensure text is filled in.
  const onKeyUpPressed = (event: KeyboardEvent) => {
    if (isKeyPressed(event, [",", "enter"])) {
      convertTextToBlocks(inputField.value);
      inputField.value = "";
    }
    scrollToEnd(DOMElement);
  };

  // Delete or backspace removes blocks.
  const onKeyDownPressed = (event: KeyboardEvent) => {
    if (
      isKeyPressed(event, ["del", "backspace"]) &&
      hasChildren(blocks) && // Ensure we have blocks
      inputField.value.length === 0 // Don't delete if we are just modifying input.
    ) {
      const child = getLastChild(blocks, 2); // offset is 2, inputfield is the last child.
      if (child) {
        blocks.removeChild(child);
      }
    }
    scrollToEnd(DOMElement);
  };

  // Handle paste event, supressing the data from being pasted
  // immediatly converting it into blocks.
  const onPaste = (event: ClipboardEvent) => {
    event.preventDefault(); // Do not let the paste data into the inputfield.
    const pastedText = getPasteData(event, window);
    convertTextToBlocks(pastedText);
    scrollToEnd(DOMElement);
  };

  // If the inputfield loses focus convert the input to blocks.
  const onInputFieldBlur = () => {
    convertTextToBlocks(inputField.value);
    scrollToEnd(DOMElement);
    inputField.value = "";
  };

  inputField.addEventListener("blur", onInputFieldBlur);
  inputField.addEventListener("keyup", onKeyUpPressed);
  inputField.addEventListener("keydown", onKeyDownPressed);
  inputField.addEventListener("paste", onPaste);
  // -- Finished setting up listeners

  return {
    addEmail: (text: string) => convertTextToBlocks(text),
    countEmail: () => countEmails(),
    // Housekeeping
    destroy: () => {
      inputField.removeEventListener("blur", onInputFieldBlur);
      inputField.removeEventListener("keyup", onKeyUpPressed);
      inputField.removeEventListener("keydown", onKeyDownPressed);
      inputField.removeEventListener("paste", onPaste);
    },
  };
};

export default Tagify;
module.exports = Tagify;
