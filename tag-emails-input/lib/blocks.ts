import { createEmailBlockNode, createWordBlockNode } from "./elements";
import { extractEmails, extractWords } from "./strings";

export enum BLOCK_TYPE {
  EMAIL,
  WORD,
}

interface BlockInterface {
  type: BLOCK_TYPE;
  values: Array<string>;
}

const classifyBlockType = (word: string): BlockInterface => {
  const emails = extractEmails(word);
  return {
    type: emails.length ? BLOCK_TYPE.EMAIL : BLOCK_TYPE.WORD,
    values: emails.length ? emails : [word],
  };
};

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
