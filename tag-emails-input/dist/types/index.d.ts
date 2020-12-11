declare global {
    interface Window {
        clipboardData: DataTransfer;
    }
}
declare const Tagify: (DOMElement: HTMLDivElement) => {
    addEmail: (email: string) => void;
    getEmailCount: () => number;
    destroy: () => void;
};
export default Tagify;
