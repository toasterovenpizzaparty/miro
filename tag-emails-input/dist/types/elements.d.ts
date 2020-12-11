export declare const createNode: (text: string, className: string) => HTMLDivElement;
export declare const createNodeWithCloseButton: (text: string, className: string) => HTMLDivElement;
export declare const createEmailBlockNode: (email: string) => HTMLDivElement;
export declare const createWordBlockNode: (word: string) => HTMLDivElement;
export declare const appendChildren: (node: Element, elements: Array<HTMLDivElement>) => void;
export declare const insertBefore: (parentNode: Element, elements: Array<HTMLDivElement>, before: Element) => void;
export declare const createEmailBlockNodes: (emails: Array<string>) => HTMLDivElement[];
export declare const createWordBlockNodes: (words: Array<string>) => HTMLDivElement[];
