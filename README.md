
# Structs.sh 💻
<img src="./images/logo.png" style="width: 100px; display: block; margin: 0 auto;" />

Structs.sh is an interactive data structure and algorithm visualiser and educational platform for computer science students.

<strong><a href="https://structs.netlify.app/">Visit Structs.sh</a></strong>.

---

# Table of contents

-   [Setup Instructions](#setup-instructions)
    -   [Development](#development)
    -   [Production](#production)
-   [Project Directory Structure](#project-directory-structure)
-   [Documentation](#documentation)
-   [Guidelines](#guidelines)
-   [Git Contribution Guidelines](#git-contribution-guidelines)
-   [Style Guidelines and Practices](#style-guidelines-and-practices)

---

## Setup Instructions (Development)
Note: this is using **node.js v14.17.0**.

```bash
# Clone the repo
git clone https://github.com/csesoc/Structs.sh.git
```

### Automatic Setup [Experimental]
This may only work on Linux environments.
```bash
# After cloning the repo, run the following in the root directory
sh structs.sh --setup
```
Follow the prompts and everything should be ready to go.

### Manual Setup

```bash
# After cloning the repo, run the following in the root directory
npm --prefix ./install ./client install
npm --prefix ./install ./server install
```

## Running Structs.sh
From the root directory, you can use the Structs.sh CLI tool:
```bash
sh structs.sh --frontend     # Starts the frontend development server on port 3000
sh structs.sh --backend      # Starts the backend development server on port 8080
```

Alternatively, you may run the npm start script from the `client` and `server` directories.
```bash
# In the `client/` directory:
npm start

# In the `server/` directory:
npm start
```

---

# Documentation

## Client & Server Directory Structure
Below is a view of the project's directory hierarchy with succinct annotations. 
```bash
.
│
├── structs.sh     # → Shell script for setting up and starting up the Structs.sh
│
├── client/
│       │
│       └── src
│           ├── index.tsx
│           ├── assets           # → Contains public assets such as images and CSS/SCSS. Most global style rules exist here
│           ├── components       # → Where all our components are stored. Make new directories for your components here
│           ├── content          # → Contains helpers for fetching lesson content
│           ├── layout           # → Components defining page structure
│           └── views                      # → Where our page components are stored.
│               ├── HomePage.js            # → Structs.sh homepage
│               ├── Dashboard.js           # → The visualisation and main content page
│               # ... more pages would go here
│
└── server/
    │
    ├── src
    │   ├── database-helpers     # → The files in here contain helper functions for reading/writing to the database 
    │   │   └── user.ts
    │   ├── routes               # → Where all our API endpoints and handlers live
    │   │   ├── auth.ts
    │   │   # ... more routes
    │   ├── schemas              # → Contains all the files that define what our MongoDB collections look like
    │   │   ├── user
    │   │   │   └── user.ts      # → Eg. this file makes the 'users' collection and defines what fields a user document should have 
    │   │   # ... more schema definitions
    │   ├── server.ts            # → This is the entry point. Config and server startup happesn here
    │   ├── typedefs             # Backend type definitions are kept here
    │   │   ├── user
    │   │   │   └── User.ts
    │   │   # ... more type definitions
    │   └── utils                # → Global helper functions
    │       └── index.ts
    └── tests                    # → Our unit tests
        └── sample.test.js
```

## Visualiser Project Directory
```bash
    TODO
```

## Structs.sh API Documentation

### Authentication

<table>
    <tbody>
        <tr>
            <th>Endpoint</th>
            <th>Parameters</th>
            <th>Response</th>
            <th>Description</th>
            <th>Exceptions</th>
        </tr>
        <tr>
            <td>
                <pre>POST /api/auth/register</pre>
            </td>
            <td>
                <ul>
                    <li>
                        username
                    </li>
                    <li>
                        email
                    </li>
                    <li>
                        password
                    </li>
                </ul>
            </td>
            <td>
                <pre>TODO: Nothing for now?</pre>
            </td>
            <td>
                Registers a new user for Structs.sh.
            </td>
            <td>
                TODO: think of some. Eg. emails must be of valid format
            </td>
        </tr>
    </tbody>
</table>


### Lessons


### Quizzes


# Guidelines

## Getting Started With Backend Development
TODO

## Getting Started with the Visualiser 
TODO

---

## Good Collaborative Coding Practices

### Git Guideline

<details>
    <summary>Git contribution guidelines</summary>

-   Have one branch per feature. Name the branch according to the name convention `<initials>/<feature-name>`, for example, `JS/dashboard` for John Smith
-   Commit frequently with short and meaningful messages
-   When ready to merge into master, first merge master into your branch and deal with conflicts on YOUR branch
-   Open a pull request merging your branch into master
    1. Click `Pull requests` on the top toolbar of this page
    2. Set the base repo to be `csesoc/Structs.sh`
    3. Set the branch you want to merge into master
    4. Click `Create pull request`. You'll be prompted to add a description afterwards
    5. Once the pull request is opened, someone else must approve it
    6. Once approved, it'll be merged into master!
</details>

### Style Guidelines 

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
