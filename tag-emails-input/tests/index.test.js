import { hasUncaughtExceptionCaptureCallback } from "process";
import Tagify from "../lib";

const createTagifyInstance = () => {
  const target = document.querySelector("#tagify-this");
  const instance = Tagify(target);
  const inputField = target.querySelector("input");

  return {
    instance,
    inputField,
  };
};

const sendKeyboardEvent = (keyName, keyCode, target) => {
  target.dispatchEvent(new KeyboardEvent(keyName, { key: keyCode }));
};

const countClassNames = (document, className) =>
  document.querySelectorAll(className).length;

beforeEach(() => {
  document.body.innerHTML = "<div><div id='tagify-this'></div>";
});

describe("component Tagify", () => {
  describe("Integration/unit test", () => {
    it("should create blocks from input upon pressing [Comma] ", () => {
      const { instance, inputField } = createTagifyInstance();

      inputField.value =
        "patrick@miro.com, blabla, john@email.com, notanemail, vla";
      sendKeyboardEvent("keyup", ",", inputField);

      expect(inputField.value).toBe("");
      expect(instance.countEmail()).toBe(2);
      expect(countClassNames(document, ".block__tag--email")).toBe(2);
      expect(countClassNames(document, ".block__tag--word")).toBe(3);
    });

    it("should create blocks from input upon pressing [Enter] ", () => {
      const { instance, inputField } = createTagifyInstance();

      inputField.value =
        "patrick@miro.com, blabla, john@email.com, notanemail, vla";
      sendKeyboardEvent("keyup", "enter", inputField);

      expect(inputField.value).toBe("");
      expect(countClassNames(document, ".block__tag--email")).toBe(2);
      expect(countClassNames(document, ".block__tag--word")).toBe(3);
    });

    it("should create blocks from input upon [Blur] ", () => {
      const { instance, inputField } = createTagifyInstance();

      inputField.value =
        "patrick@miro.com, blabla, john@email.com, notanemail, vla";
      inputField.dispatchEvent(new Event("blur"));

      expect(inputField.value).toBe("");
      expect(countClassNames(document, ".block__tag--email")).toBe(2);
      expect(countClassNames(document, ".block__tag--word")).toBe(3);
    });

    it("should delete a block upon pressing [Backspace] with an empty inputfield", () => {
      const { instance, inputField } = createTagifyInstance();
      expect(inputField.value).toBe("");

      instance.addEmail("patrick@miro.com, invalid.email");
      expect(inputField.value).toBe("");

      expect(countClassNames(document, ".block__tag--email")).toBe(1);
      expect(countClassNames(document, ".block__tag--word")).toBe(1);

      sendKeyboardEvent("keydown", "backspace", inputField);

      expect(countClassNames(document, ".block__tag--email")).toBe(1);
      expect(countClassNames(document, ".block__tag--word")).toBe(0);
    });

    it("should delete a block upon pressing [Delete] with an empty inputfield", () => {
      const { instance, inputField } = createTagifyInstance();
      expect(inputField.value).toBe("");

      instance.addEmail("patrick@miro.com, invalid.email");
      expect(inputField.value).toBe("");

      expect(countClassNames(document, ".block__tag--email")).toBe(1);
      expect(countClassNames(document, ".block__tag--word")).toBe(1);

      sendKeyboardEvent("keydown", "del", inputField);

      expect(countClassNames(document, ".block__tag--email")).toBe(1);
      expect(countClassNames(document, ".block__tag--word")).toBe(0);
    });

    it("should NOT delete a block upon pressing [Delete] with text in inputfield", () => {
      const { instance, inputField } = createTagifyInstance();
      expect(inputField.value).toBe("");

      instance.addEmail("patrick@miro.com, invalid.email");
      expect(inputField.value).toBe("");

      expect(countClassNames(document, ".block__tag--email")).toBe(1);
      expect(countClassNames(document, ".block__tag--word")).toBe(1);

      inputField.value = "writing a text...";

      sendKeyboardEvent("keydown", "del", inputField);

      expect(countClassNames(document, ".block__tag--email")).toBe(1);
      expect(countClassNames(document, ".block__tag--word")).toBe(1);
    });

    it("should NOT delete a block upon pressing [Backspace] with text in inputfield", () => {
      const { instance, inputField } = createTagifyInstance();
      expect(inputField.value).toBe("");

      instance.addEmail("patrick@miro.com, invalid.email");
      expect(inputField.value).toBe("");

      expect(countClassNames(document, ".block__tag--email")).toBe(1);
      expect(countClassNames(document, ".block__tag--word")).toBe(1);

      inputField.value = "writing a text...";

      sendKeyboardEvent("keydown", "backspace", inputField);

      expect(countClassNames(document, ".block__tag--email")).toBe(1);
      expect(countClassNames(document, ".block__tag--word")).toBe(1);
    });

    it("should add emails", () => {
      const { instance, inputField } = createTagifyInstance();
      instance.addEmail("patrick@miro.com, test@henk.nl, email@gmail.com");
      expect(countClassNames(document, ".block__tag--email")).toBe(3);
    });

    it("should create the correct ammount of email and word nodes based on input", () => {
      const { instance, inputField } = createTagifyInstance();
      instance.addEmail(
        "patrick@miro.com, test@henk.nl, email@gmail.com, invalid.email, bla, moreweirdemail@text.com, notemail"
      );
      expect(countClassNames(document, ".block__tag--email")).toBe(4);
      expect(countClassNames(document, ".block__tag--word")).toBe(3);
    });

    it("should count emails", () => {
      const { instance, inputField } = createTagifyInstance();
      instance.addEmail(
        "patrick@miro.com, test@henk.nl, email@gmail.com, invalid.email, bla, moreweirdemail@text.com, notemail"
      );
      expect(instance.countEmail()).toBe(4);
    });

    it("should delete emails or words upon pressing close button", () => {
      const { instance, inputField } = createTagifyInstance();
      instance.addEmail("patrick@miro.com, invalid.email");

      expect(countClassNames(document, ".block__tag--email")).toBe(1);
      expect(countClassNames(document, ".block__tag--word")).toBe(1);

      document
        .querySelector(".block__tag--email .block__close")
        .dispatchEvent(new MouseEvent("mousedown"));

      expect(countClassNames(document, ".block__tag--email")).toBe(0);
      expect(countClassNames(document, ".block__tag--word")).toBe(1);

      document
        .querySelector(".block__tag--word .block__close")
        .dispatchEvent(new MouseEvent("mousedown"));

      expect(countClassNames(document, ".block__tag--email")).toBe(0);
      expect(countClassNames(document, ".block__tag--word")).toBe(0);
    });
  });
});
