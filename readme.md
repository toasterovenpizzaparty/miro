# Tagify
Tagify is used to easily transform any element into an input to capture email blocks.
See it in action [here](https://toasterovenpizzaparty.github.io/miro/)

## Installation
The folders contains the following structure:
- /examples - A set of examples to follow to implement the library
- /tag-emails-input - The library
-- /dist - The compiled version of the library
-- /lib - The source files for the library
-- /tests - Contains any unit/integration tests

NPM:
Simply install the package from NPM.
```bash
yarn add 'tag-emails-input' --save
```
Manually:
```
Copy the dist/index.min.js to your-project/lib.
```
## Usage and examples
Currently the library does not have a lot of options, simply run the following to set up a simple editor that transforms emails and words into blocks.
```javascript
import Tagify from 'my-project/lib'
...
const myDivElement = document.querySelector('#tagify-me')
const tagifyInstance = Tagify(myDivElement)
// Optionally
tagifyInstance.countEmail(); // Returns the number of email blocks created
tagifyInstance.addEmail("email@address.com"); // Adds the text as blocks
```

Multiple instances are possible:
```javascript
import Tagify from 'my-project/lib'
...
const myDivElement = document.querySelector('#tagify-me')
const tagifyInstance = Tagify(myDivElement)

const mySecondDivElement = document.querySelector('#tagify-me-too')
const secondTagifyInstance = Tagify(mySecondDivElement)

```

See the [some examples](/examples)

## Development
Make sure all the packages are installed for the library.
Then run yarn build or start to test any changes.

```bash
cd ./tags-emails-input
yarn install
yarn build or yarn start (to watch for changes)
```

## Tests
Currently the library consists of a small set of integration and unit tests.
These can be run by navigation to ./tags-emails-input and running;
```bash
yarn test
```




