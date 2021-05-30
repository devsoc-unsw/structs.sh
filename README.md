# Structs.sh 💻

An interactive data structure and algorithm visualiser.

---

## Table of contents

-   [Setup Instructions](#setup-instructions)
    -   [Development](#development)
    -   [Production](#production)
-   [Guidelines](#guidelines)
-   [Git Contribution Guidelines](#git-contribution-guidelines)
-   [Style Guidelines and Practices](#style-guidelines-and-practices)
-   [Documentation](#documentation)
-   [Project Directory Structure](#project-directory-structure)

---

## Setup Instructions

### Development

#### Pre-requisites:

-   Install the latest version of `npm` and `node`

#### Steps:

1. `git clone https://github.com/csesoc/Structs.sh.git && cd Structs.sh`
2. `npm install`
3. `npm start`

### Production

We'll figure it out later.

---

## Guidelines:

### Git Contribution Guidelines

-   1 branch per feature
-   Commit frequently with short and meaningful messages
-   When ready to merge into master, first merge master into your branch and deal with conflicts on YOUR branch
-   Open a pull request merging your branch into master
    1. Click `Pull requests` on the top toolbar of this page
    2. Set the base repo to be `csesoc/Structs.sh`
    3. Set the branch you want to merge into master
    4. Click `Create pull request`. You'll be prompted to add a description afterwards
    5. Once the pull request is opened, someone else must approve it (GitHub doesn't even let you approve it yourself)
    6. Once approved, it'll be merged into master and then you'll see your updates on https://structs.netlify.app/

### Style Guidelines and Practices

Based on <a href="https://github.com/airbnb/javascript/tree/master/react">Airbnb's official React style guide</a>.

<details>
<summary>Files and naming</summary>
<p>

-   One component per file

-   Prefer functional components over class components

    -   They're easier to test
    -   Less code, hence easier to read and maintain
    -   Possible performance boost in future versions of React
    -   Only use class components when there's complex internal state

-   Use `.jsx` extension for React components and `.js` for every other file

    -   If using TypeScript, then use `.tsx` and `.ts`

-   Naming
    -   `PascalCase` for React components
        -   Give it the same name as the filename. Eg. for `LinkedList.jsx`, name the React component inside to be `LinkedList`
    -   `camelCase` for everything else

</p>
</details>

<details>
<summary>Indentation</summary>
<p>

-   Splitting up long prop lines:

    ```javascript
    <Foo superLongParam="bar" anotherSuperLongParam="baz" />
    ```

-   Conditional rendering:

    ```javascript
    // && operator
    {
        showButton && <Button />;
    }

    // Ternary operator ()
    {
        someConditional ? <Foo /> : <Foo superLongParam="bar" anotherSuperLongParam="baz" />;
    }
    ```

</p>
</details>

<details>
<summary>JSX</summary>
<p>

-   Spacing

    ```javascript
    // Very bad
    <Foo      bar={ baz }    />

    // Good
    <Foo bar={baz} />
    ```

-   Wrap JSX in parentheses
    ```javascript
    return <MyComponent variant="long body" foo="bar" />;
    ```

</p>
</details>

<details>
<summary>Components</summary>
<p>

-   Use 'object destructuring' to get prop arguments

    ```js
    // Don't repeat props everywhere :(
    const Input = (props) => {
        return <input value={props.value} onChange={props.onChange} />;
    };

    // Destructure and use the straight values :)
    const Input = ({ value, onChange }) => <input value={value} onChange={onChange} />;
    ```

-   Always set default props so that the component never crashes when you don't pass in a specific prop
    ```js
    const Component = ({
        title: 'Default Title',
        subtitle: 'Generic Subtitle'
    }) => {
        return (
            <div>
                ...
            </div>
        );
    }
    ```

</p>
</details>

<details>
<summary>Styling with SCSS modules</summary>
<p>

Using global CSS/SCSS is an absolute nightmare in a large project because you have name collisions and specificity issues.
With SCSS modules, every classname you define is 'mangled' so that it is always unique and is guaranteed to never
conflict with any other classname in the project.

How this works:

1. Suppose you're working on `LinkedList.jsx`. Add a new file called `LinkedList.module.scss`
2. Write your SCSS code in that file. Remember SCSS is a superset of CSS so you can just write regular CSS.
    ```scss
    .container {
        margin: 10px;
    }
    ```
3. Import the scss module in `LinkedList.jsx` and apply the style like this:

    ```js
    import styles from './LinkedList.module.scss';

    const LinkedList = () => {
        return <div className={styles.container}>...</div>;
    };
    ```

</p>
</details>

<details>
<summary>Quotes</summary>
<p>

-   Use double quotes `"..."` for prop passing and `'...'` for everything else

</p>
</details>

<details>
<summary>General tips</summary>
<p>

-   DRY - 'don't repeat yourself', (ie. don't do what Tim does)

</p>
</details>

---

## Documentation

-   <a href="https://demos.creative-tim.com/blk-design-system-react/#/documentation/overview">Documentation</a> for UI components from the base template
-   <a href="https://compclub.atlassian.net/wiki/spaces/Projects/pages/1645936641/Structs.sh">Confluence</a> team wiki - this is where we pool all our knowledge about technologies (React, TypeScript, etc.) as well as project organisation stuff
-   <a href="https://reactstrap.github.io/">Reactstrap</a> - bootstrap components for React. Look up basic UI components like `Button`, `Grid` from here rather than reinvent the wheel
-   D3
    -   <a href="https://github.com/d3/d3/wiki">D3</a> official docs (D3 for vanilla JS)
    -   <a href="https://github.com/react-d3-library/react-d3-library/wiki">React-D3</a> docs (D3 for React)

---

## Project Directory Structure

```bash
.
├── README.md
├── public
└── src
    ├── index.js         # → Where the frontend routing is handled
    ├── assets           # → Contains public assets such as images and CSS/SCSS.
    │                    #   Changing fundamental styles would be done here (most likely)
    ├── components       # → Where all our components are stored. Make new directories for your components here
    │   ├── Footer
    │   ├── Navbars          # → Top navigation bar
    │   ├── PageHeader       # → The animated background you see that takes up 100% of the viewport
    |   └── Visualisation    # → Where all our visualiser graphics components are
    |       └── LinkedList       # → Linked list graphic elements
    |           └── ...
    |   # ...more of our components here
    |
    └── views                      # → Where our page components are stored.
        ├── HomePage.js            # → Structs.sh homepage
        ├── Visualiser.js          # → The visualiser page. This is where the action happens for ds/algo visualisation
        # ...more pages would go here
```
