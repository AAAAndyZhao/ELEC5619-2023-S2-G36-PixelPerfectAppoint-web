# Front-end coding style standard

## 1 Naming conventions

### 1.1 File naming

* All file names should be in lowercase, and use ```-``` to separate words.

* Examples:

    ```index.html```
    ```login.html```
    ```user-profile.html```
    ```user-profile-edit.html```
    ```user-profile-edit-avatar.html```
    ```user-profile-edit-avatar-crop.html```

### 1.2 Folder naming

* All folder names should be in lowercase, and use ```-``` to separate words.
* Examples:

    ```script/style/components/utils/demo-styles```

### 1.3 JS Variable naming

* All variable names should be lowerCamelCase
* Examples:

    ```const userName = 'John';```
    ```const userId = 123;```
    ```const userList = ['John', 'Mary', 'Tom'];```

### 1.4 CSS naming

* All id/class names should be in lowercase, and use ```-``` to separate words
* Custom prefix ```app-``` should be added to avoid conflicts.
* Examples:

    ```class="app-user-name-input"```
    ```class="app-user-id-input"```
    ```id="app-submit-button"```

### 1.5 JS function naming

* All function names should start with a verb, and use camel case to separate words.

* Examples:

    ```function getUserName()```
    ```function getUserId()```
    ```function getUserList()```

### 1.6 Final variable naming

* All final/const variable names should be in uppercase, and use ```_``` to separate words.
* Examples:

    ```USER_NAME```
    ```USER_ID```
    ```USER_LIST```

### 1.7 Name meaning

* All names should be meaningful.

## 2 Code style

### 2.1 Tab size

* Use 4 spaces for indentation.

### 2.2 Line break

* Use LF (Unix) line breaks.

### 2.3 JS variable declaration and initialization

* If a variable will not be reassigned, use ```const``` to declare it. Otherwise, use ```let```.
* Initialize a variable when it is declared.
* Examples:

    ```const name = 'John';```
    ```let age = 18;```

### 2.4 JS quotes

* Use single quotes for JS strings.
* Examples:

    ```const name = 'John';```

### 2.5 use ES6+ syntax

* Arrow functions
* await/async
* let/const
* for...of

### 2.6 bracket

* Bracket should be placed in the same line with the following keywords:

    ```if```
    ```else```
    ```for```
    ```while```
    ```do```
    ```switch```
    ```try```
    ```catch```
    ```finally```

* Examples:

    ```if (condition) {```
    ```    // do something```
    ```} else {```
    ```    // do something```
    ```}```

## 3 Vue conventions

### 3.1 Component naming (not file name)

* All component names should be in CamelCase
* All component names should be contain at least two words.
* Examples:

    ```
    export default {
        name: 'TodoItem'
        // ...
    };
    ```

### 3.2 Component file name

* All component file names should be in lowercase, and use ```-``` to separate words.
* Examples:

    ```todo-item.vue```

### 3.3 Components used in template

* Component names should be in PascalCase
* Examples:

    ```<TodoItem />```

### 3.4 style scope

* Use ```scoped``` to avoid style conflicts.
* Examples:

    ```
    <style scoped>
        .todo-item {
            // ...
        }
    </style>
    ```

### 3.5 line break

* If a component has many props, use line break to separate them.
* Examples:
    ```
    <MyComponent foo="a" bar="b" baz="c"
        foo="a" bar="b" baz="c"
        foo="a" bar="b" baz="c"
    />
    ```
