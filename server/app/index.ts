import Tagify from "@miro/tag-emails-input";

const Bootstrap = () => {
  console.log("Hi world.", Tagify);

  const targetElement = document.querySelector<HTMLDivElement>("#tagify-me");
  if (targetElement) {
    Tagify(targetElement);
  }
};

const onDocumentReady = (fn) => {
  if (document.readyState != "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
};

onDocumentReady(Bootstrap);
