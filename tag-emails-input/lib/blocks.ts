import { createEmailBlockNode, createWordBlockNode } from "./elements";
import { extractEmails, extractWords } from "./strings";

/*
 * These functions relate to the creation and classification of the blocks.
 */

// setup an enum to know what blocktype we are dealing with
export enum BLOCK_TYPE {
  EMAIL,
  WORD,
}
// Setup an interface so Typescript understands what we are returning.
interface BlockInterface {
  type: BLOCK_TYPE;
  values: Array<string>;
}

// Check if we are dealing with a word or an emailadress.
// Return an object classifying the object and returning any emailaddresses or words associated.
const classifyBlockType = (word: string): BlockInterface => {
  const emails = extractEmails(word);
  return {
    type: emails.length ? BLOCK_TYPE.EMAIL : BLOCK_TYPE.WORD,
    values: emails.length ? emails : [word],
  };
};

// Grab all the words from the text.
// Classify those words into either email or word.
// Create a corresponding node with class for the type of block.
// Finally return our array of nodes and the count for created email blocks.
export const convertTextToWordsAndEmailBlockNodes = (text: string) => {
  const classifiedNodes = extractWords(text).map(classifyBlockType);
  const blockNodes = classifiedNodes.map(({ type, values }) =>
    type === BLOCK_TYPE.EMAIL
      ? values.map(createEmailBlockNode)
      : values.map(createWordBlockNode)
  );

  return {
    nodes: blockNodes.length ? blockNodes.reduce((a, b) => a.concat(b)) : [],
    emailCount: classifiedNodes.filter(({ type }) => type === BLOCK_TYPE.EMAIL)
      .length,
  };
};
