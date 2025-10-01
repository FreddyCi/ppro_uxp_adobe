========================
CODE SNIPPETS
========================
TITLE: UXP Plugin Setup Example
DESCRIPTION: Demonstrates the structure for setting up UXP plugins, including lifecycle methods for the plugin and panels, menu item definitions, and command handling.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/EntryPoints.md#_snippet_2

LANGUAGE: js
CODE:
```
const { entrypoints } = require("uxp");
 entrypoints.setup({
     plugin: {
         create() {..},
         destroy() {..}
     },
     panels: {
         "panel1": {
             create() {..},
             show() {..},
             hide() {..},
             destroy() {..},
             invokeMenu() {..},
             update() {..}, // customEntrypoint example
             validatNode() {..} // customEntrypoint example
              menuItems: [
                  {
                      id: "signIn",
                      label: "Sign In...",
                      enabled: false,
                      checked: false,
                      submenu: [
                          { id: "submenu1", label: "submenu1", enabled: false, checked: false},
                          { "submenu2" }
                      ]
                  },
                  "-",  // separator.
                  "Sign out",  // by default enabled, and the id will be same with the label.
              ]
          },
          "panel2": {..}
      },
      commands: {
          "command1": {
              run() {..},
              cancel() {..}
          },
          "command2": function(){..}
      }
  });
```

----------------------------------------

TITLE: UXP Plugin Manager Usage Example (Photoshop)
DESCRIPTION: An example demonstrating how to use the UXP Plugin Manager to query plugin information, specifically for Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Plugin Manager/PluginManager.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Plugin Manager Usage Example (Photoshop)
DESCRIPTION: An example demonstrating how to use the UXP Plugin Manager to query plugin information, specifically for Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Plugin Manager/PluginManager.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Plugin Setup API Documentation
DESCRIPTION: Provides details on the `setup` function for UXP plugins, including parameters for defining plugin, panels, and commands, along with their associated lifecycle methods.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/EntryPoints.md#_snippet_1

LANGUAGE: APIDOC
CODE:
```
setup(entrypoints)
  API for plugin to add handlers and menu items for entrypoints defined in manifest.
  This API can only be called once and there after other apis can be used to modify menu items.
  The function throws in case of any error in entrypoints data or if its called more than once.

  Parameters:
    entrypoints (Object): it consists of mainly three objects - 'plugin', 'panels' and 'commands'.
      plugin (Object): This can be an object or a function. If this is a function, it is assumed as the 'create' handler.
        create (function): This is called after plugin is loaded. 'this' can be used to access UxpPluginInfo object. If 'plugin' object is defined, 'create' must be defined. To signal failure, throw an exception.
        destroy (function): This is called before plugin is unloaded. 'this' can be used to access UxpPluginInfo object.
      panels (Array<object>): This contains a list of key-value pairs where each key is a panel id (string) and value is the data for the panel whose type can be object/function. If a function, it is assumed to be the 'show' method. If an object, it can contain following properties but it is must to define either of 'create' or 'show'.
        create (function): This is called when a panel is created. 'this' can be used to access UxpPanelInfo object. This function can return a promise. To signal failure, throw an exception or return a rejected promise. This has a default Timeout of 300 MSec from manifest v5 onwards.
          Parameters:
            create(event) {}, till Manifest Version V4
            create(rootNode) {}, from v5 onwards
        show (function): This is called when a panel is shown. 'this' can be used to access UxpPanelInfo object. This function can return a promise. To signal failure, throw an exception or return a rejected promise. This has a default Timeout of 300 MSec from manifest v5 onwards.
          Parameters:
            show(event) {}, till Manifest Version V4
            show(rootNode, data) {}, from v5 onwards
        hide (function): This is called when a panel is hidden. 'this' can be used to access UxpPanelInfo object. This function can return a promise. To signal failure, throw an exception or return a rejected promise. This has a default Timeout of 300 MSec from manifest v5 onwards.
          Parameters:
            hide(event) {}, till Manifest Version V4
            hide(rootNode, data) {}, from v5 onwards
        destroy (function): This is called when a panel is going to be destroyed. 'this' can be used to access UxpPanelInfo object. To signal failure, throw an exception.
          Parameters:
            destroy(event) {}, till Manifest Version V4
            destroy(rootNode) {}, from v5 onwards
        invokeMenu (function): This is called when a panel menu item is invoked. Menu id is passed as the first argument to this function. 'this' can be used to access UxpPanelInfo object. This function can return a promise. To signal failure, throw an exception or return a rejected promise.
```

----------------------------------------

TITLE: WebSocket Data Transfer Example
DESCRIPTION: Demonstrates how to use the WebSocket API for data transfer within UXP, with an example querying product information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Data Transfers/WebSocket.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Data Transfers/WebSocket";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Content Query Example
DESCRIPTION: Example of querying content within UXP, likely for Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Events/GestureEvent.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Accessing Host Information in UXP
DESCRIPTION: Demonstrates how to import and use the Host Information module to get details about the Adobe product hosting the UXP plugin. This example specifically queries for product information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Host Information/Host.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Host Information/Host";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP Content Rendering Example
DESCRIPTION: An example of rendering UXP content, likely a component or page, with a specific query parameter. The 'product=xd' query suggests it's configured for Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/font-weight.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Install and Import SWC Button Component
DESCRIPTION: This example demonstrates how to install a Spectrum Web Component (SWC) using npm and then import it into your JavaScript code. It specifically shows the installation of the SWC button component and its subsequent import for use in an HTML structure.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-spectrum/swc/index.md#_snippet_1

LANGUAGE: javascript
CODE:
```
npm install @swc-uxp-wrappers/button
```

LANGUAGE: javascript
CODE:
```
import '@swc-uxp-wrappers/button/sp-button.js';
```

LANGUAGE: html
CODE:
```
<sp-button variant="primary">I'm a button</sp-button>
```

----------------------------------------

TITLE: Copy Entry Example
DESCRIPTION: Provides examples of copying a UXP Entry to another folder, including options for overwriting and copying folders.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_4

LANGUAGE: javascript
CODE:
```
await someFile.copyTo(someFolder);
await someFile.copyTo(someFolder, {overwrite: true});
await someFolder.copyTo(anotherFolder, {overwrite: true, allowFolderCopy: true});
```

----------------------------------------

TITLE: UXP Content Component Example
DESCRIPTION: Demonstrates the usage of the UXP Content component to query product information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/Hierarchy/h6.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/Hierarchy/h6";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Fetch Data Transfer Example
DESCRIPTION: Demonstrates how to fetch data using the UXP API, specifically for product information. This example utilizes a Content component to query product data.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Data Transfers/fetch.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Data Transfers/fetch";
```

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP XMP Module Example
DESCRIPTION: Demonstrates how to use the XMP module within UXP, specifically querying for Photoshop products.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/XMP/getting-started/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/XMP/getting-started/xmp.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Spectrum UXP Widget Typography Example
DESCRIPTION: Demonstrates how to import and use a Spectrum UXP Widget component for typography, with an example of querying product information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/Typography/sp-detail.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/Typography/sp-detail";
```

LANGUAGE: jsx
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: CSS Padding Example
DESCRIPTION: Demonstrates how to apply padding to an element using CSS. This example shows setting different padding values for top/bottom and left/right.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/padding.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    padding: 3px 1em;
}
```

----------------------------------------

TITLE: Content Query Example
DESCRIPTION: Demonstrates how to query content, specifically for Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Streams/WritableStreamDefaultWriter.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: WebSocket Constructor and Usage Example
DESCRIPTION: Demonstrates how to create a new WebSocket connection with a specified URL and protocols, and includes an example of sending data as a typed array.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/Data Transfers/WebSocket.md#_snippet_0

LANGUAGE: javascript
CODE:
```
var ws = new WebSocket("wss://demos.kaazing.com/echo","wss");
ws.send(new Float32Array([ 5, 2, 1, 3, 6, -1 ]));
ws.send(new Int32Array([5,-1]).buffer)
```

----------------------------------------

TITLE: CSS Background Example
DESCRIPTION: Demonstrates how to set a background using a URL to a plugin asset and a color.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/background.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    background: url('plugin://assets/star.png') red;
}
```

----------------------------------------

TITLE: UXP OS Module Example
DESCRIPTION: Demonstrates how to import and use the 'os' module from the UXP JavaScript API to query product information. This snippet shows a typical import and a query for product details.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/os/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/os/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP prefers-color-scheme Media Query Example
DESCRIPTION: Demonstrates how to use the prefers-color-scheme media query in UXP to apply different styles based on the user's system color preference. This example shows how to import and use a UXP component that likely handles these media queries.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Media Queries/prefers-color-scheme.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Media Queries/prefers-color-scheme";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP CustomElementRegistry Example
DESCRIPTION: Demonstrates how to use the CustomElementRegistry in UXP to define and manage custom HTML elements. This example specifically queries for product=xd.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML DOM/CustomElementRegistry.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML DOM/CustomElementRegistry";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP setup() Function Delay Issue
DESCRIPTION: Addresses an uncatchable error that may occur when `require("uxp").entrypoints.setup()` is called with a delay. The issue is related to the timing of the `setup` function call relative to display frame rendering. A short delay (less than ~20ms) is less likely to cause errors, while longer delays increase the probability of an error. This will be fixed in a future release.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/known-issues.md#_snippet_0

LANGUAGE: javascript
CODE:
```
require("uxp").entrypoints.setup()
```

----------------------------------------

TITLE: Coexisting Spectrum UXP Widgets and SWC Example
DESCRIPTION: Demonstrates how to use both Spectrum Web Components (SWC) and Spectrum UXP Widgets within the same UXP environment. It shows a `<sp-banner>` (SWC) and a `<sp-dropdown>` (Spectrum UXP Widget) side-by-side.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-spectrum/faqs/index.md#_snippet_0

LANGUAGE: html
CODE:
```
<sp-banner> <!-- Spectrum Web Components -->
   <div slot="header">Header text</div>
   <div slot="content">Content of the banner</div>
</sp-banner>
<sp-dropdown placeholder="Select an option" style="width: 320px"> <!-- Spectrum UXP Widget -->
   <sp-menu slot="options">       
      <sp-menu-item> Option 1 </sp-menu-item>
      <sp-menu-item> Option 2 </sp-menu-item>
   </sp-menu>
</sp-dropdown>
```

----------------------------------------

TITLE: Get List of Plugins
DESCRIPTION: Retrieves the current list of installed plugins from the Plugin Manager. The `plugins` property returns a Set containing Plugin objects.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Plugin Manager/PluginManager.md#_snippet_1

LANGUAGE: javascript
CODE:
```
const plugins = require("uxp").pluginManager.plugins;
// plugins is a Set of Plugin objects
```

----------------------------------------

TITLE: Example Usage: Filtering Entry Points by Product
DESCRIPTION: Demonstrates how to use the Content component to display entry point documentation specific to Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Entry Points/index.md#_snippet_1

LANGUAGE: markup
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Pointer Interaction Example
DESCRIPTION: Demonstrates how to use `setPointerCapture` and `releasePointerCapture` to implement a sliding element functionality. This example includes event listeners for pointer down, move, and up events.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLScriptElement.md#_snippet_25

LANGUAGE: javascript
CODE:
```
// HTML
// <style>
//     div {
//         width: 140px;
//         height: 50px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: #fbe;
//         position: absolute;
//     }
// </style>
// <div id="slider">SLIDE ME</div>

// JS
function beginSliding(e) {
     slider.setPointerCapture(e.pointerId);
     slider.addEventListener("pointermove", slide);
 }

 function stopSliding(e) {
     slider.releasePointerCapture(e.pointerId);
     slider.removeEventListener("pointermove", slide);
 }

 function slide(e) {
     slider.style.left = e.clientX;
 }

 const slider = document.getElementById("slider");

 slider.addEventListener("pointerdown", beginSliding);
 slider.addEventListener("pointerup", stopSliding);
```

----------------------------------------

TITLE: XMLHttpRequest timeout
DESCRIPTION: Sets or gets the timeout in milliseconds for an XMLHttpRequest. A value of 0 means no timeout. The example demonstrates setting a 2-second timeout and logging if it occurs.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/Data Transfers/XMLHttpRequest.md#_snippet_8

LANGUAGE: javascript
CODE:
```
const xhr = new XMLHttpRequest();
xhr.open("GET", "https://www.adobe.com");
xhr.ontimeout = (e) => {
    console.log("xhr timed out");
};
xhr.timeout = 2000;  // 2,000 milliseconds
xhr.send();
```

----------------------------------------

TITLE: Get UXP Entrypoints Instance
DESCRIPTION: This snippet shows how to obtain an instance of the UXP entrypoints module. It is a fundamental step for interacting with UXP functionalities.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/EntryPoints.md#_snippet_0

LANGUAGE: javascript
CODE:
```
require("uxp").entrypoints
```

----------------------------------------

TITLE: CSS padding-top Example
DESCRIPTION: Demonstrates how to apply the 'padding-top' CSS property to an element.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/padding-top.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    padding-top: 10px;
}
```

----------------------------------------

TITLE: Installing and Importing Spectrum Web Component Button
DESCRIPTION: Shows the process of installing an individual Spectrum Web Component (SWC) using npm and then importing it for use in UXP. This is required for using SWC components.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-spectrum/index.md#_snippet_1

LANGUAGE: bash
CODE:
```
npm i @swc-uxp-wrappers/button
```

LANGUAGE: javascript
CODE:
```
import '@swc-uxp-wrappers/button/sp-button.js';
```

----------------------------------------

TITLE: UXP HTML DOM Interaction Example
DESCRIPTION: An example of using the imported Content component to query for product-specific information, in this case, 'photoshop'. This demonstrates how to interact with the UXP environment to retrieve data related to a specific Adobe product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML DOM/Document.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Example Usage of SecureStorage
DESCRIPTION: Demonstrates how to use the SecureStorage API to set, retrieve, and delete data within a UXP plugin.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Key-Value Storage/SecureStorage.md#_snippet_1

LANGUAGE: javascript
CODE:
```
import { SecureStorage } from "uxp";

async function manageSecureData() {
  const myKey = "userToken";
  const myValue = "aBcDeFg12345";

  // Store data
  await SecureStorage.set(myKey, myValue);
  console.log(`Data stored for key: ${myKey}`);

  // Retrieve data
  const retrievedValue = await SecureStorage.get(myKey);
  if (retrievedValue) {
    console.log(`Retrieved value for ${myKey}: ${retrievedValue}`);
  } else {
    console.log(`No data found for key: ${myKey}`);
  }

  // Delete data
  await SecureStorage.delete(myKey);
  console.log(`Data deleted for key: ${myKey}`);

  // Verify deletion
  const deletedValue = await SecureStorage.get(myKey);
  if (!deletedValue) {
    console.log(`Successfully verified deletion for key: ${myKey}`);
  }
}

manageSecureData();
```

----------------------------------------

TITLE: Element Attribute Management: get, set, remove, has
DESCRIPTION: Methods for interacting with element attributes, including getting, setting, removing, and checking for their existence.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLDialogElement.md#_snippet_6

LANGUAGE: APIDOC
CODE:
```
## getAttribute(name)
Retrieves the value of a specified attribute.

Returns: string

Parameters:
- name: string - Name of the attribute whose value you want to get.

See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute

## setAttribute(name, value)
Sets the value of a specified attribute.

Parameters:
- name: string - Name of the attribute whose value is to be set.
- value: string - Value to assign to the attribute.

See: https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute

## removeAttribute(name)
Removes a specified attribute from the element.

Parameters:
- name: string - The name of the attribute to remove.

See: https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute

## hasAttribute(name)
Checks if the element has a specified attribute.

Returns: boolean

Parameters:
- name: string - The name of the attribute to check for.

See: https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute

## hasAttributes()
Returns a boolean value indicating whether the current element has any attributes or not.

Returns: boolean

See: https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttributes

## getAttributeNames()
Returns the attribute names of the element as an Array of strings.

Returns: Array

See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNames

## getAttributeNode(name)
Retrieves the attribute node with the specified name.

Returns: *

Parameters:
- name: string

See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNode

## setAttributeNode(newAttr)
Adds or replaces an attribute node.

Parameters:
- newAttr: *

See: https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttributeNode

## removeAttributeNode(oldAttr)
Removes the specified attribute node.

Parameters:
- oldAttr: *

See: https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttributeNode
```

----------------------------------------

TITLE: Unsupported Elements Example
DESCRIPTION: Demonstrates how to query unsupported elements within UXP, likely for reporting or debugging purposes.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/General/Unsupported Elements.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/General/Unsupported Elements";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Prepare UXP Documentation
DESCRIPTION: This snippet outlines the steps to prepare the UXP documentation locally. It involves ensuring the torq-native markdown files are available, creating an environment file with the correct path, and running an npm script to copy the files.

SOURCE: https://github.com/adobedocs/uxp/blob/main/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
UXP_REPO_SOURCE_DOCS="<path-to-torq-native>/docs/dist"
```

LANGUAGE: bash
CODE:
```
npm run prepare-docs
```

----------------------------------------

TITLE: Content Component Usage
DESCRIPTION: Example of using the Content component, likely for displaying documentation or related information, with a query parameter for 'product=photoshop'.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Elements/HTMLLinkElement.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: CSS :enabled Pseudo-class Example
DESCRIPTION: Demonstrates how to use the :enabled pseudo-class in CSS to style elements that have no children. This example applies a blue border to empty div elements.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Pseudo-classes/empty.md#_snippet_0

LANGUAGE: css
CODE:
```
div:empty {
    border: 1px solid blue;
}
```

----------------------------------------

TITLE: Get Command API
DESCRIPTION: Provides access to command-related functionalities within UXP.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/EntryPoints.md#_snippet_7

LANGUAGE: APIDOC
CODE:
```
getCommand()
```

----------------------------------------

TITLE: Pointer Interaction Example
DESCRIPTION: Demonstrates how to use `setPointerCapture` and `releasePointerCapture` to implement a sliding element functionality. This example includes event listeners for pointer down, move, and up events.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLElement.md#_snippet_12

LANGUAGE: javascript
CODE:
```
// HTML
// <style>
//     div {
//         width: 140px;
//         height: 50px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: #fbe;
//         position: absolute;
//     }
// </style>
// <div id="slider">SLIDE ME</div>

// JS
function beginSliding(e) {
     slider.setPointerCapture(e.pointerId);
     slider.addEventListener("pointermove", slide);
 }

 function stopSliding(e) {
     slider.releasePointerCapture(e.pointerId);
     slider.removeEventListener("pointermove", slide);
 }

 function slide(e) {
     slider.style.left = e.clientX;
 }

 const slider = document.getElementById("slider");

 slider.addEventListener("pointerdown", beginSliding);
 slider.addEventListener("pointerup", stopSliding);
```

----------------------------------------

TITLE: UXP Global Members - Product Query Example
DESCRIPTION: Demonstrates how to import and use the Content component to query for product-specific configurations within the UXP API. This example specifically shows how to set the query parameter to 'product=xd' to retrieve information related to Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js//Global Members/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: sp-progressbar Examples
DESCRIPTION: Demonstrates various ways to use the sp-progressbar component, including basic usage, with labels, custom values, hidden values, different sizes, and variants for backgrounds.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-progressbar.md#_snippet_0

LANGUAGE: html
CODE:
```
<sp-detail>PROGRESS BAR</sp-detail>
<sp-progressbar max=100 value=50></sp-progressbar>
<br/><sp-detail>PROGRESS BAR W/ LABEL</sp-detail>
<sp-progressbar max=100 value=50>
    <sp-label slot="label">Uploading...</sp-label>
</sp-progressbar>
<br/><sp-detail>PROGRESS BAR W/ CUSTOM VALUE</sp-detail>
<sp-progressbar max=100 value=50 value-label="593KB">
    <sp-label slot="label">Uploading...</sp-label>
</sp-progressbar>
<br/><sp-detail>PROGRESS BAR W/O VALUE</sp-detail>
<sp-progressbar max=100 value=50 show-value="false">
    <sp-label slot="label">Uploading...</sp-label>
</sp-progressbar>
<br/><sp-detail>SMALL PROGRESS BAR</sp-detail>
<sp-progressbar max=100 value=50 size="small">
    <sp-label slot="label">Uploading...</sp-label>
</sp-progressbar>
<br/><sp-detail>OVER BACKGROUND</sp-detail>
<div style="background-color:#C08040; padding: 16px">
    <sp-progressbar variant="overBackground" max=100 value=50>
        <sp-label slot="label">Uploading...</sp-label>
    </sp-progressbar>
</div>
```

----------------------------------------

TITLE: Pointer Interaction Example
DESCRIPTION: Demonstrates how to use `setPointerCapture` and `releasePointerCapture` to implement a sliding element functionality. This example includes event listeners for pointer down, move, and up events.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLStyleElement.md#_snippet_39

LANGUAGE: javascript
CODE:
```
// HTML
// <style>
//     div {
//         width: 140px;
//         height: 50px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: #fbe;
//         position: absolute;
//     }
// </style>
// <div id="slider">SLIDE ME</div>

// JS
function beginSliding(e) {
     slider.setPointerCapture(e.pointerId);
     slider.addEventListener("pointermove", slide);
 }

 function stopSliding(e) {
     slider.releasePointerCapture(e.pointerId);
     slider.removeEventListener("pointermove", slide);
 }

 function slide(e) {
     slider.style.left = e.clientX;
 }

 const slider = document.getElementById("slider");

 slider.addEventListener("pointerdown", beginSliding);
 slider.addEventListener("pointerup", stopSliding);
```

----------------------------------------

TITLE: Pointer Interaction Example
DESCRIPTION: Demonstrates how to use `setPointerCapture` and `releasePointerCapture` to implement a sliding element functionality. This example includes event listeners for pointer down, move, and up events.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLProgressElement.md#_snippet_9

LANGUAGE: javascript
CODE:
```
// HTML
// <style>
//     div {
//         width: 140px;
//         height: 50px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: #fbe;
//         position: absolute;
//     }
// </style>
// <div id="slider">SLIDE ME</div>

// JS
function beginSliding(e) {
     slider.setPointerCapture(e.pointerId);
     slider.addEventListener("pointermove", slide);
 }

 function stopSliding(e) {
     slider.releasePointerCapture(e.pointerId);
     slider.removeEventListener("pointermove", slide);
 }

 function slide(e) {
     slider.style.left = e.clientX;
 }

 const slider = document.getElementById("slider");

 slider.addEventListener("pointerdown", beginSliding);
 slider.addEventListener("pointerup", stopSliding);
```

----------------------------------------

TITLE: Importing and Using the OS Module
DESCRIPTION: Demonstrates how to import the OS module and use its components, specifically rendering content related to Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/os/OS.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/os/OS";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Pointer Interaction Example
DESCRIPTION: Demonstrates how to use `setPointerCapture` and `releasePointerCapture` to implement a sliding element functionality. This example includes event listeners for pointer down, move, and up events.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLLinkElement.md#_snippet_11

LANGUAGE: javascript
CODE:
```
// HTML
// <style>
//     div {
//         width: 140px;
//         height: 50px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: #fbe;
//         position: absolute;
//     }
// </style>
// <div id="slider">SLIDE ME</div>

// JS
function beginSliding(e) {
     slider.setPointerCapture(e.pointerId);
     slider.addEventListener("pointermove", slide);
 }

 function stopSliding(e) {
     slider.releasePointerCapture(e.pointerId);
     slider.removeEventListener("pointermove", slide);
 }

 function slide(e) {
     slider.style.left = e.clientX;
 }

 const slider = document.getElementById("slider");

 slider.addEventListener("pointerdown", beginSliding);
 slider.addEventListener("pointerup", stopSliding);
```

----------------------------------------

TITLE: UXP Documentation - Photoshop Module
DESCRIPTION: Imports and renders the UXP documentation content specifically for Photoshop. This component likely displays API details, examples, and usage instructions for Photoshop plugins.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Using UXP Widgets with React
DESCRIPTION: Demonstrates how to import and use UXP components within a React application. The example shows how to query for specific product integrations, such as Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/Using with React.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/Using with React";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Entry Points Module
DESCRIPTION: Imports the Content component from the uxp-documentation library to display UXP API reference information. The query parameter specifies the product for which to fetch documentation.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Entry Points/EntryPoints.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/EntryPoints";
```

----------------------------------------

TITLE: Pointer Interaction Example
DESCRIPTION: Demonstrates how to use `setPointerCapture` and `releasePointerCapture` to implement a sliding element functionality. This example includes event listeners for pointer down, move, and up events.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLOptionElement.md#_snippet_21

LANGUAGE: javascript
CODE:
```
// HTML
// <style>
//     div {
//         width: 140px;
//         height: 50px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: #fbe;
//         position: absolute;
//     }
// </style>
// <div id="slider">SLIDE ME</div>

// JS
function beginSliding(e) {
     slider.setPointerCapture(e.pointerId);
     slider.addEventListener("pointermove", slide);
 }

 function stopSliding(e) {
     slider.releasePointerCapture(e.pointerId);
     slider.removeEventListener("pointermove", slide);
 }

 function slide(e) {
     slider.style.left = e.clientX;
 }

 const slider = document.getElementById("slider");

 slider.addEventListener("pointerdown", beginSliding);
 slider.addEventListener("pointerup", stopSliding);
```

----------------------------------------

TITLE: CSS border-style Example
DESCRIPTION: Demonstrates how to apply a solid border style to an element using CSS in UXP.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/border-style.md#_snippet_0

LANGUAGE: css
CODE:
```
.button {
    border-width: 2px;
    border-style: solid;
    border-color: white;
}
```

----------------------------------------

TITLE: CSS min-width Example
DESCRIPTION: Demonstrates how to apply the min-width property to an HTML element using CSS.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/min-width.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    min-width: 300px;
}
```

----------------------------------------

TITLE: UXP Content Component Usage
DESCRIPTION: Demonstrates how to import and use the Content component from 'uxp-documentation/src/pages/uxp-api/reference-css/Styles/bottom'. The example shows passing a 'product' query parameter to the component.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/bottom.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/bottom";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: window.fetch API Documentation
DESCRIPTION: Documentation for the `window.fetch` method, including its parameters, return values, and potential errors. It also covers the required network permissions in `manifest.json` and limitations on wildcard usage.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/Data Transfers/fetch.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
window.fetch(input, [init])
Fetches a resource from the network.

Returns: Promise<Response> Promise that resolves to a Response object.

Throws:
- TypeError: If init.body is set and init.method is either "GET" or "HEAD".
- TypeError: If either network error or network time-out occurs after a http request is made.
- TypeError: If there is a failure in reading files in FormData during posting FormData.

Parameters:
- input: Either the URL string to connect with or a Request object having the URL and the init option.
- [init]: (Optional) Custom settings for a HTTP request.
  - [init.method]: HTTP request method. The default value is "GET".
  - [init.headers]: HTTP request headers to add.
  - [init.body]: Body to add to HTTP request. Can be string, ArrayBuffer, TypedArray, Blob, FormData, or URLSearchParams.
  - [init.credentials]: Indicates whether to send cookies. The default value is "include". Possible values: "omit" (cookies are NOT sent), "include" (cookies are sent).

See: Headers, Request and Response
```

LANGUAGE: json
CODE:
```
{
  "permissions": {
      "network": {
          "domains": [
              "https://www.adobe.com",
              "https://*.adobeprerelease.com",
              "wss://*.myplugin.com"
          ]
      }
  }
}
```

----------------------------------------

TITLE: UXP GUID Generation
DESCRIPTION: A new GUID feature is available for uniquely identifying Creative Cloud Users, currently supported only in Photoshop. This is accessed via the uxp.User Information module.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/changelog3P.md#_snippet_6

LANGUAGE: javascript
CODE:
```
// Accessing GUID (example)
const userId = uxp.UserInformation.GUID;
```

----------------------------------------

TITLE: Pointer Interaction Example
DESCRIPTION: Demonstrates how to use `setPointerCapture` and `releasePointerCapture` to implement a sliding element functionality. This example includes event listeners for pointer down, move, and up events.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLMenuElement.md#_snippet_17

LANGUAGE: javascript
CODE:
```
// HTML
// <style>
//     div {
//         width: 140px;
//         height: 50px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: #fbe;
//         position: absolute;
//     }
// </style>
// <div id="slider">SLIDE ME</div>

// JS
function beginSliding(e) {
     slider.setPointerCapture(e.pointerId);
     slider.addEventListener("pointermove", slide);
 }

 function stopSliding(e) {
     slider.releasePointerCapture(e.pointerId);
     slider.removeEventListener("pointermove", slide);
 }

 function slide(e) {
     slider.style.left = e.clientX;
 }

 const slider = document.getElementById("slider");

 slider.addEventListener("pointerdown", beginSliding);
 slider.addEventListener("pointerup", stopSliding);
```

----------------------------------------

TITLE: Pointer Interaction Example
DESCRIPTION: Demonstrates how to use `setPointerCapture` and `releasePointerCapture` to implement a sliding element functionality. This example includes event listeners for pointer down, move, and up events.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLHeadElement.md#_snippet_8

LANGUAGE: javascript
CODE:
```
// HTML
// <style>
//     div {
//         width: 140px;
//         height: 50px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: #fbe;
//         position: absolute;
//     }
// </style>
// <div id="slider">SLIDE ME</div>

// JS
function beginSliding(e) {
     slider.setPointerCapture(e.pointerId);
     slider.addEventListener("pointermove", slide);
 }

 function stopSliding(e) {
     slider.releasePointerCapture(e.pointerId);
     slider.removeEventListener("pointermove", slide);
 }

 function slide(e) {
     slider.style.left = e.clientX;
 }

 const slider = document.getElementById("slider");

 slider.addEventListener("pointerdown", beginSliding);
 slider.addEventListener("pointerup", stopSliding);
```

----------------------------------------

TITLE: Pointer Interaction Example
DESCRIPTION: Demonstrates how to use `setPointerCapture` and `releasePointerCapture` to implement a sliding element functionality. This example includes event listeners for pointer down, move, and up events.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLButtonElement.md#_snippet_29

LANGUAGE: javascript
CODE:
```
// HTML
// <style>
//     div {
//         width: 140px;
//         height: 50px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: #fbe;
//         position: absolute;
//     }
// </style>
// <div id="slider">SLIDE ME</div>

// JS
function beginSliding(e) {
     slider.setPointerCapture(e.pointerId);
     slider.addEventListener("pointermove", slide);
 }

 function stopSliding(e) {
     slider.releasePointerCapture(e.pointerId);
     slider.removeEventListener("pointermove", slide);
 }

 function slide(e) {
     slider.style.left = e.clientX;
 }

 const slider = document.getElementById("slider");

 slider.addEventListener("pointerdown", beginSliding);
 slider.addEventListener("pointerup", stopSliding);
```

----------------------------------------

TITLE: File Write Examples
DESCRIPTION: Illustrates writing data to a file using the `write()` method, including appending content and specifying binary format.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_11

LANGUAGE: javascript
CODE:
```
await myNovel.write("It was a dark and stormy night.\n");
await myNovel.write("Cliches and tropes aside, it really was.", {append: true});
const data = new ArrayBuffer();
await aDataFile.write(data, {format: formats.binary});
```

----------------------------------------

TITLE: Pointer Interaction Example
DESCRIPTION: Demonstrates how to use `setPointerCapture` and `releasePointerCapture` to implement a sliding element functionality. This example includes event listeners for pointer down, move, and up events.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLLabelElement.md#_snippet_9

LANGUAGE: javascript
CODE:
```
// HTML
// <style>
//     div {
//         width: 140px;
//         height: 50px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: #fbe;
//         position: absolute;
//     }
// </style>
// <div id="slider">SLIDE ME</div>

// JS
function beginSliding(e) {
     slider.setPointerCapture(e.pointerId);
     slider.addEventListener("pointermove", slide);
 }

 function stopSliding(e) {
     slider.releasePointerCapture(e.pointerId);
     slider.removeEventListener("pointermove", slide);
 }

 function slide(e) {
     slider.style.left = e.clientX;
 }

 const slider = document.getElementById("slider");

 slider.addEventListener("pointerdown", beginSliding);
 slider.addEventListener("pointerup", stopSliding);
```

----------------------------------------

TITLE: Pointer Interaction Example
DESCRIPTION: Demonstrates how to use `setPointerCapture` and `releasePointerCapture` to implement a sliding element functionality. This example includes event listeners for pointer down, move, and up events.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLImageElement.md#_snippet_10

LANGUAGE: javascript
CODE:
```
// HTML
// <style>
//     div {
//         width: 140px;
//         height: 50px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: #fbe;
//         position: absolute;
//     }
// </style>
// <div id="slider">SLIDE ME</div>

// JS
function beginSliding(e) {
     slider.setPointerCapture(e.pointerId);
     slider.addEventListener("pointermove", slide);
 }

 function stopSliding(e) {
     slider.releasePointerCapture(e.pointerId);
     slider.removeEventListener("pointermove", slide);
 }

 function slide(e) {
     slider.style.left = e.clientX;
 }

 const slider = document.getElementById("slider");

 slider.addEventListener("pointerdown", beginSliding);
 slider.addEventListener("pointerup", stopSliding);
```

----------------------------------------

TITLE: Pointer Interaction Example
DESCRIPTION: Demonstrates how to use `setPointerCapture` and `releasePointerCapture` to implement a sliding element functionality. This example includes event listeners for pointer down, move, and up events.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLAnchorElement.md#_snippet_9

LANGUAGE: javascript
CODE:
```
// HTML
// <style>
//     div {
//         width: 140px;
//         height: 50px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: #fbe;
//         position: absolute;
//     }
// </style>
// <div id="slider">SLIDE ME</div>

// JS
function beginSliding(e) {
     slider.setPointerCapture(e.pointerId);
     slider.addEventListener("pointermove", slide);
 }

 function stopSliding(e) {
     slider.releasePointerCapture(e.pointerId);
     slider.removeEventListener("pointermove", slide);
 }

 function slide(e) {
     slider.style.left = e.clientX;
 }

 const slider = document.getElementById("slider");

 slider.addEventListener("pointerdown", beginSliding);
 slider.addEventListener("pointerup", stopSliding);
```

----------------------------------------

TITLE: File Read Examples
DESCRIPTION: Demonstrates how to read file content using the `read()` method, both as text (default) and as binary data.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_10

LANGUAGE: javascript
CODE:
```
const text = await myNovel.read();
const data = await myNovel.read({format: formats.binary});
```

----------------------------------------

TITLE: CSS padding-bottom Example
DESCRIPTION: Demonstrates how to apply bottom padding to an element using CSS in UXP.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/padding-bottom.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    padding-bottom: 10px;
}
```

----------------------------------------

TITLE: UXP Data Transfer Request Example
DESCRIPTION: Demonstrates how to initiate a data transfer request within UXP, specifically for Photoshop, by passing a query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Data Transfers/Request.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Data Transfers/Request";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Pointer Interaction Example
DESCRIPTION: Demonstrates how to use `setPointerCapture` and `releasePointerCapture` to implement a sliding element functionality. This example includes event listeners for pointer down, move, and up events.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLHtmlElement.md#_snippet_13

LANGUAGE: javascript
CODE:
```
// HTML
// <style>
//     div {
//         width: 140px;
//         height: 50px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: #fbe;
//         position: absolute;
//     }
// </style>
// <div id="slider">SLIDE ME</div>

// JS
function beginSliding(e) {
     slider.setPointerCapture(e.pointerId);
     slider.addEventListener("pointermove", slide);
 }

 function stopSliding(e) {
     slider.releasePointerCapture(e.pointerId);
     slider.removeEventListener("pointermove", slide);
 }

 function slide(e) {
     slider.style.left = e.clientX;
 }

 const slider = document.getElementById("slider");

 slider.addEventListener("pointerdown", beginSliding);
 slider.addEventListener("pointerup", stopSliding);
```

----------------------------------------

TITLE: Move Entry Example
DESCRIPTION: Demonstrates moving a UXP Entry to a different folder, with options to overwrite and rename.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_5

LANGUAGE: javascript
CODE:
```
await someFile.moveTo(someFolder);
await someFile.moveTo(someFolder, {overwrite: true});
await someFolder.moveTo(anotherFolder, {overwrite: true});
await someFile.moveTo(someFolder, {newName: 'masterpiece.txt'})
await someFile.moveTo(someFolder, {newName: 'novel.txt', {overwrite: true})
```

----------------------------------------

TITLE: UXP Entry Points for Photoshop
DESCRIPTION: Demonstrates how to import and use the UXP EntryPoints module to interact with Photoshop. This snippet shows a typical import statement and a component usage with a query parameter specifying the product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Entry Points/EntryPoints.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/EntryPoints";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Query UXP Content
DESCRIPTION: Example of querying UXP content, specifically for Adobe XD. This demonstrates how to pass query parameters to the imported Content module.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/index.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Pointer Interaction Example
DESCRIPTION: Demonstrates how to use `setPointerCapture` and `releasePointerCapture` to implement a sliding element functionality. This example includes event listeners for pointer down, move, and up events.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLVideoElement.md#_snippet_15

LANGUAGE: javascript
CODE:
```
// HTML
// <style>
//     div {
//         width: 140px;
//         height: 50px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: #fbe;
//         position: absolute;
//     }
// </style>
// <div id="slider">SLIDE ME</div>

// JS
function beginSliding(e) {
     slider.setPointerCapture(e.pointerId);
     slider.addEventListener("pointermove", slide);
 }

 function stopSliding(e) {
     slider.releasePointerCapture(e.pointerId);
     slider.removeEventListener("pointermove", slide);
 }

 function slide(e) {
     slider.style.left = e.clientX;
 }

 const slider = document.getElementById("slider");

 slider.addEventListener("pointerdown", beginSliding);
 slider.addEventListener("pointerup", stopSliding);
```

----------------------------------------

TITLE: Load UXP FAQs for Photoshop
DESCRIPTION: Imports and renders the UXP FAQs component, specifically querying for Photoshop-related content. This is useful for developers looking for answers to common questions about using UXP with Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/faqs/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/faqs/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Entry Name and Provider Access Example
DESCRIPTION: Shows how to access the name and provider properties of a UXP Entry object.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_2

LANGUAGE: javascript
CODE:
```
console.log(anEntry.name);

if (entryOne.provider !== entryTwo.provider) {
    throw new Error("Providers are not the same");
}
```

----------------------------------------

TITLE: UXP Photoshop Entry Points
DESCRIPTION: This snippet demonstrates how to access UXP entry points for Photoshop. It utilizes a query parameter to specify the product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Entry Points/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Pointer Interaction Example
DESCRIPTION: Demonstrates how to use `setPointerCapture` and `releasePointerCapture` to implement a sliding element functionality. This example includes event listeners for pointer down, move, and up events.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLSelectElement.md#_snippet_18

LANGUAGE: javascript
CODE:
```
// HTML
// <style>
//     div {
//         width: 140px;
//         height: 50px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: #fbe;
//         position: absolute;
//     }
// </style>
// <div id="slider">SLIDE ME</div>

// JS
function beginSliding(e) {
     slider.setPointerCapture(e.pointerId);
     slider.addEventListener("pointermove", slide);
 }

 function stopSliding(e) {
     slider.releasePointerCapture(e.pointerId);
     slider.removeEventListener("pointermove", slide);
 }

 function slide(e) {
     slider.style.left = e.clientX;
 }

 const slider = document.getElementById("slider");

 slider.addEventListener("pointerdown", beginSliding);
 slider.addEventListener("pointerup", stopSliding);
```

----------------------------------------

TITLE: Display UXP Product Documentation
DESCRIPTION: Renders the Content component to display documentation for a specific product within UXP. The 'product=xd' query parameter indicates that documentation for Adobe XD should be loaded.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Entry Points/EntryPoints.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Entry URL and Native Path Access Example
DESCRIPTION: Illustrates how to retrieve the URL and native file system path of a UXP Entry.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_3

LANGUAGE: javascript
CODE:
```
console.log(anEntry.url);
console.log(anEntry.nativePath);
```

----------------------------------------

TITLE: Pointer Interaction Example
DESCRIPTION: Demonstrates how to use `setPointerCapture` and `releasePointerCapture` to implement a sliding element functionality. This example includes event listeners for pointer down, move, and up events.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLTextAreaElement.md#_snippet_15

LANGUAGE: javascript
CODE:
```
// HTML
// <style>
//     div {
//         width: 140px;
//         height: 50px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: #fbe;
//         position: absolute;
//     }
// </style>
// <div id="slider">SLIDE ME</div>

// JS
function beginSliding(e) {
     slider.setPointerCapture(e.pointerId);
     slider.addEventListener("pointermove", slide);
 }

 function stopSliding(e) {
     slider.releasePointerCapture(e.pointerId);
     slider.removeEventListener("pointermove", slide);
 }

 function slide(e) {
     slider.style.left = e.clientX;
 }

 const slider = document.getElementById("slider");

 slider.addEventListener("pointerdown", beginSliding);
 slider.addEventListener("pointerup", stopSliding);
```

----------------------------------------

TITLE: Importing and Using UXP Content Component
DESCRIPTION: Demonstrates how to import and use the `Content` component from the UXP documentation library, specifically for applying styles or queries to a product like Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/min-height.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/min-height";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Pointer Interaction Example
DESCRIPTION: Demonstrates how to use `setPointerCapture` and `releasePointerCapture` to implement a sliding element functionality. This example includes event listeners for pointer down, move, and up events.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLBodyElement.md#_snippet_8

LANGUAGE: javascript
CODE:
```
// HTML
// <style>
//     div {
//         width: 140px;
//         height: 50px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: #fbe;
//         position: absolute;
//     }
// </style>
// <div id="slider">SLIDE ME</div>

// JS
function beginSliding(e) {
     slider.setPointerCapture(e.pointerId);
     slider.addEventListener("pointermove", slide);
 }

 function stopSliding(e) {
     slider.releasePointerCapture(e.pointerId);
     slider.removeEventListener("pointermove", slide);
 }

 function slide(e) {
     slider.style.left = e.clientX;
 }

 const slider = document.getElementById("slider");

 slider.addEventListener("pointerdown", beginSliding);
 slider.addEventListener("pointerup", stopSliding);
```

----------------------------------------

TITLE: CSS Height Example
DESCRIPTION: Demonstrates how to set the height of an element using CSS in UXP.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/height.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    height: 100vh;
}
```

----------------------------------------

TITLE: CSS padding-left Example
DESCRIPTION: Demonstrates how to apply left padding to an HTML element using CSS.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/padding-left.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    padding-left: 10px;
}
```

----------------------------------------

TITLE: Using Content Component with Query
DESCRIPTION: Shows an example of using a 'Content' component with a query parameter, likely to fetch or display specific content related to a product like Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/flex-wrap.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Content Component Usage for Photoshop
DESCRIPTION: Demonstrates the usage of the Content component, querying for product information specific to Adobe Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Streams/ReadableStreamDefaultController.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Basic sp-radio-group Example
DESCRIPTION: Demonstrates how to render a group of radio buttons with a label using the sp-radio-group component.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-radio-group.md#_snippet_0

LANGUAGE: html
CODE:
```
<sp-radio-group>
    <sp-label slot="label">Select a product:</sp-label>
    <sp-radio value="ps">Adobe Photoshop</sp-radio>
    <sp-radio value="xd">Adobe XD</sp-radio>
</sp-radio-group>
```

----------------------------------------

TITLE: Content Component Usage
DESCRIPTION: Shows an example of using the Content component with a specific query parameter for product filtering.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Streams/WritableStream.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Content Component Usage
DESCRIPTION: Example of using a 'Content' component, likely for displaying or managing content within the UXP environment. It takes a 'query' parameter to specify the product context.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Elements/HTMLSlotElement.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Create and Serialize XMP Metadata
DESCRIPTION: Demonstrates creating a new XMPMeta object, setting a 'CreatorTool' property, and serializing the XMP packet to an XML string. It also shows how to retrieve a property and log its details.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/XMP/getting-started/xmp.md#_snippet_1

LANGUAGE: javascript
CODE:
```
const {XMPMeta, XMPConst} = require("uxp").xmp;
let xmp = new XMPMeta();
xmp.setProperty( XMPConst.NS_XMP, "CreatorTool", "My Script" );
let xmpStr = xmp.serialize(); // Serialize the XMP packet to XML

// Retrieve property
let prop = xmp.getProperty(XMPConst.NS_XMP, "CreatorTool");
console.log( `namespace: ${prop.namespace}, property path + name: ${prop.path}, value: ${prop.value}`);
```

----------------------------------------

TITLE: CSS background-color Example
DESCRIPTION: Demonstrates how to set the background color of an element using CSS in UXP. Supports various color formats.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/background-color.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    backgorund-color: blue;
}
```

----------------------------------------

TITLE: Sp-Heading Component Usage
DESCRIPTION: Demonstrates how to import and use the Sp-Heading component from the uxp-documentation library. The example shows passing a 'product' query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/Typography/sp-heading.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/Typography/sp-heading";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Content Query for Photoshop
DESCRIPTION: Example of querying content specifically for Adobe Photoshop using the imported Content module.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Plugin Manager/Plugin.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Content Query for Photoshop
DESCRIPTION: Demonstrates how to use the Content component with a query parameter to specify integration with Adobe Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Entry Points/UxpMenuItem.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: CSS Class Selector Example
DESCRIPTION: Demonstrates how to apply styles to elements with specific classes using CSS in UXP. This example targets a `sp-action-button` with the class `icon-only`.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Selectors/Class selector.md#_snippet_0

LANGUAGE: css
CODE:
```
sp-action-button.icon-only {
    padding: 0;
}
```

----------------------------------------

TITLE: UXP CSS Reference - General
DESCRIPTION: Imports and renders the general CSS reference documentation for UXP, allowing queries for specific product contexts.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/General/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css//General/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: CSS font-weight Example
DESCRIPTION: Demonstrates how to set the font-weight property in CSS for an element.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/font-weight.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    font-weight: bold;
}
```

----------------------------------------

TITLE: Content Component Usage
DESCRIPTION: Demonstrates the usage of a 'Content' component, likely for displaying or querying information related to Adobe products. This example queries for Photoshop-specific content.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Streams/ReadableStreamDefaultReader.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Using Persistent File Storage with Photoshop in UXP
DESCRIPTION: Demonstrates how to utilize the Persistent File Storage module, specifically querying for Photoshop product integration. This example shows a common pattern for initializing or configuring storage access based on a specific Adobe product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Persistent File Storage/fileTypes.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP API Reference - Content Module
DESCRIPTION: Imports and renders the UXP API reference documentation for the Content module, specifically querying for product=xd.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: CSS align-items Property Example
DESCRIPTION: Demonstrates the usage of the CSS 'align-items' property with the 'flex-start' value.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/align-items.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    align-items: flex-start;
}
```

----------------------------------------

TITLE: CSS align-content Property Example
DESCRIPTION: Demonstrates the usage of the CSS align-content property with a supported value.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/align-content.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    align-content: flex-start;
}
```

----------------------------------------

TITLE: HTML Head Element Example
DESCRIPTION: Demonstrates the usage of the HTML head element in UXP, including embedding CSS styles. This is relevant for UXP v2.0 and later.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-html/General/head.md#_snippet_0

LANGUAGE: html
CODE:
```
<html>
    <head>
        <style>
            .highlight {
                color: red;
            }
        </style>
    </head>
    <body>
        <div class="highlight">Hello, world</div>
    </body>
</html>
```

----------------------------------------

TITLE: Sp-Heading Component Usage
DESCRIPTION: Demonstrates how to import and use the Sp-Heading component from the UXP documentation library. The example shows passing a 'product' query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/Typography/sp-heading.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/Typography/sp-heading";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: CSS border-top-style Example
DESCRIPTION: Demonstrates how to apply the 'border-top-style' property along with 'border-top-width' and 'border-top-color' to an element.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/border-top-style.md#_snippet_0

LANGUAGE: css
CODE:
```
.button {
    border-top-width: 2px;
    border-top-style: solid;
    border-top-color: white;
}
```

----------------------------------------

TITLE: Content Query for Photoshop
DESCRIPTION: Example of querying content specifically for Adobe Photoshop using the imported Content module.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Plugin Manager/Plugin.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Query Product Information
DESCRIPTION: An example of how to query product information using a component, likely for filtering or displaying specific product-related data within the UXP environment.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Events/DragEvent.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: CSS Descendant Combinator Example
DESCRIPTION: Demonstrates the usage of the CSS descendant combinator to style specific elements within a UXP component. This example targets 'sp-button' elements that are descendants of a 'footer' element.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Selectors/Descendant combinator.md#_snippet_0

LANGUAGE: css
CODE:
```
footer sp-button {
    margin: 12px;
}
```

----------------------------------------

TITLE: Fetch Data Transfer Example
DESCRIPTION: Demonstrates how to use the 'fetch' global member to retrieve data, specifically querying product information for Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Data Transfers/fetch.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Data Transfers/fetch";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Importing and Using Content Component
DESCRIPTION: Demonstrates how to import and use the Content component from the uxp-documentation library, specifically for applying styles or querying product-specific information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/padding-top.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/padding-top";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: CSS flex-basis Example
DESCRIPTION: Demonstrates the usage of the flex-basis CSS property to set the initial size of a flex item.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/flex-basis.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    flex-basis: auto;
}
```

----------------------------------------

TITLE: CSS :focus Pseudo-class Example
DESCRIPTION: Demonstrates how to apply styles to an element when it receives keyboard focus using the :focus pseudo-class in CSS.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Pseudo-classes/focus.md#_snippet_0

LANGUAGE: css
CODE:
```
input:focus {
    border: 1px solid red;
}
```

----------------------------------------

TITLE: UXP body Element Example
DESCRIPTION: Demonstrates the basic structure of the body element within an Adobe UXP plugin, containing simple text content.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-html/General/body.md#_snippet_0

LANGUAGE: html
CODE:
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>My UXP Plugin</title>
</head>
<body>
    Hello, world
</body>
</html>
```

----------------------------------------

TITLE: UXP JavaScript API Reference
DESCRIPTION: Provides access to UXP modules and their functionalities, allowing developers to extend Adobe applications. This example shows how to query for Photoshop-specific product information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js//Modules/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Content Query for UXP
DESCRIPTION: Demonstrates how to query content within the UXP environment, specifically for the 'xd' product. This is likely used to retrieve or display product-specific information or assets.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Entry Points/UxpMenuItems.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: SecureStorage API Reference
DESCRIPTION: Provides the core methods for interacting with the SecureStorage API, including setting, getting, and removing items.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Key-Value Storage/SecureStorage.md#_snippet_1

LANGUAGE: APIDOC
CODE:
```
SecureStorage:
  setItem(key: string, value: string): Promise<void>
    - Stores a key-value pair securely.
    - Parameters:
      - key: The identifier for the data.
      - value: The sensitive data to store.
    - Returns: A Promise that resolves when the data is stored.
    - Throws: An error if storage fails.

  getItem(key: string): Promise<string | null>
    - Retrieves the value associated with a given key.
    - Parameters:
      - key: The identifier for the data to retrieve.
    - Returns: A Promise that resolves with the stored string value, or null if the key is not found.
    - Throws: An error if retrieval fails.

  removeItem(key: string): Promise<void>
    - Removes the key-value pair associated with the given key.
    - Parameters:
      - key: The identifier for the data to remove.
    - Returns: A Promise that resolves when the data is removed.
    - Throws: An error if removal fails.

  clear(): Promise<void>
    - Removes all stored key-value pairs.
    - Returns: A Promise that resolves when all data is cleared.
    - Throws: An error if clearing fails.

  keys(): Promise<string[]>
    - Retrieves all stored keys.
    - Returns: A Promise that resolves with an array of all stored keys.
    - Throws: An error if key retrieval fails.

Example Usage:
```javascript
async function manageCredentials() {
  const username = "myUser";
  const apiKey = "superSecretApiKey123";

  // Store credentials
  await SecureStorage.setItem("username", username);
  await SecureStorage.setItem("apiKey", apiKey);

  // Retrieve credentials
  const storedUsername = await SecureStorage.getItem("username");
  const storedApiKey = await SecureStorage.getItem("apiKey");

  console.log("Username:", storedUsername);
  console.log("API Key:", storedApiKey);

  // Remove credentials
  await SecureStorage.removeItem("apiKey");

  // Get all keys
  const allKeys = await SecureStorage.keys();
  console.log("Remaining keys:", allKeys);
}

manageCredentials();
```
```

----------------------------------------

TITLE: Querying Persistent File Storage for Adobe XD
DESCRIPTION: Example of using the Content module to query persistent file storage specifically for Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Persistent File Storage/domains.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Import UXP XMP Module
DESCRIPTION: Imports the XMP module from the UXP library, enabling access to XMP functionalities.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/XMP/getting-started/xmp.md#_snippet_0

LANGUAGE: javascript
CODE:
```
const xmp = require("uxp").xmp;
```

----------------------------------------

TITLE: Example Usage of Persistent File Storage
DESCRIPTION: Demonstrates a basic usage pattern for the Persistent File Storage module, potentially querying or interacting with file content filtered by a specific product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Persistent File Storage/types.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Adjacent Sibling Combinator Example
DESCRIPTION: Demonstrates the use of the CSS adjacent sibling combinator (+) to style elements that immediately follow another element. This example targets `sp-action-button` elements that are adjacent siblings of other `sp-action-button` elements.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Selectors/Adjacent Sibling combinator.md#_snippet_0

LANGUAGE: css
CODE:
```
sp-action-button + sp-action-button {
    margin-right: 0;
}
```

----------------------------------------

TITLE: UXP Persistent File Storage Modes Example
DESCRIPTION: Demonstrates how to use the Persistent File Storage module in UXP, specifically querying for Photoshop product data.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Persistent File Storage/modes.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/modes";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Entry Class Overview and Usage
DESCRIPTION: Demonstrates how to obtain an Entry instance (File or Folder) using localFileSystem and interact with its base properties and methods.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/Entry.md#_snippet_0

LANGUAGE: javascript
CODE:
```
const fs =  require('uxp').storage.localFileSystem;
const folder = await fs.getPluginFolder(); // returns a Folder instance
const folderEntry = await folder.getEntry("entryName.txt");

// Now we can use folderEntry to invoke the APIs provided by Entry
console.log(folderEntry.isEntry); // isEntry is an API of Entry, in this example it will return true
```

----------------------------------------

TITLE: CSS font-size Example
DESCRIPTION: Demonstrates how to set the font size using CSS in UXP. This property specifies the size of the font.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/font-size.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    font-size: 24pt;
}
```

----------------------------------------

TITLE: display CSS Property Example
DESCRIPTION: Demonstrates the usage of the 'display' CSS property with the 'flex' value in UXP.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/display.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    display: flex;
}
```

----------------------------------------

TITLE: UXP Shell Module Usage
DESCRIPTION: Demonstrates how to import and use the UXP Shell module to execute commands with specific product queries.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/shell/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/shell/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Content Component Usage
DESCRIPTION: Demonstrates how to use the Content component with a product query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/Hierarchy/h4.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Query Product Information in UXP
DESCRIPTION: Demonstrates how to query product information using a component or function within the UXP framework. The example shows a query for 'product=xd', likely to retrieve data or configurations related to Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Events/MessageEvent.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: CSS font-style Example
DESCRIPTION: Demonstrates how to apply the `font-style` property in CSS to set text to italic.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/font-style.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    font-style: italic;
}
```

----------------------------------------

TITLE: UXP Content Integration Example for Photoshop
DESCRIPTION: This HTML snippet demonstrates how to integrate UXP content, likely for UI elements or functionality, within a Photoshop context. It uses a query parameter to specify the product as 'photoshop'.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML DOM/ClassList.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Element Attribute Methods
DESCRIPTION: Methods for getting and setting attributes on an Element.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML DOM/Element.md#_snippet_4

LANGUAGE: APIDOC
CODE:
```
getAttribute(name)
  Returns: string
  Parameters:
    name : string
      Name of the attribute whose value you want to get.

setAttribute(name, value)
  Parameters:
    name : string
      Name of the attribute whose value is to be set
    value : string
      Value to assign to the attribute

removeAttribute()
  No parameters
```

----------------------------------------

TITLE: Instantiate EntryMetadata
DESCRIPTION: Demonstrates how to get an EntryMetadata object by first obtaining a plugin folder and then calling the getMetadata() method on it.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/EntryMetadata.md#_snippet_1

LANGUAGE: javascript
CODE:
```
const fs = require('uxp').storage.localFileSystem;
const folder = await fs.getPluginFolder(); // Gets an instance of Folder (or Entry)
const entryMetaData = await folder.getMetadata();
console.log(entryMetaData.name);
```

----------------------------------------

TITLE: Element ClassName Property
DESCRIPTION: Gets or sets the class attribute of an element.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLButtonElement.md#_snippet_13

LANGUAGE: APIDOC
CODE:
```
Element.className : string
```

----------------------------------------

TITLE: Entry Type Checking Example
DESCRIPTION: Demonstrates how to use the isEntry, isFile, and isFolder properties for type checking within UXP.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_1

LANGUAGE: javascript
CODE:
```
if (something.isEntry) {
    return something.getMetadata();
}

if (!anEntry.isFile) {
    return "This entry is not a file.";
}

if (!anEntry.isFolder) {
    return "This entry is not a folder.";
}
```

----------------------------------------

TITLE: UXP :root Element Example
DESCRIPTION: Demonstrates the usage of the :root pseudo-class in CSS to define custom properties, such as theme colors, within a UXP plugin.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Pseudo-classes/root.md#_snippet_0

LANGUAGE: css
CODE:
```
:root {
    --theme-primary-color: red;
}
```

----------------------------------------

TITLE: CSS text-align Example
DESCRIPTION: Demonstrates how to apply the text-align CSS property to align text within an element.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/text-align.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    font-style: left;
}
```

----------------------------------------

TITLE: Element TabIndex Property
DESCRIPTION: Gets or sets the tab order of an element.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLButtonElement.md#_snippet_12

LANGUAGE: APIDOC
CODE:
```
Element.tabIndex : number
```

----------------------------------------

TITLE: UXP Shell Module Usage
DESCRIPTION: Demonstrates how to import and use the UXP Shell module to execute commands with specific product queries.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/shell/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/shell/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Host Information Module
DESCRIPTION: Imports and renders UXP host information, allowing queries for specific product details like Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Host Information/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Host Information/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Content Querying in UXP
DESCRIPTION: Demonstrates how to query content within UXP, specifying the product as Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/visibility.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Querying Persistent File Storage Content
DESCRIPTION: An example of querying persistent file storage content using the Content component. This snippet demonstrates how to specify a product query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Persistent File Storage/types.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: General UXP Content Scripting (Photoshop)
DESCRIPTION: This snippet demonstrates how to use the Content component for UXP scripting, specifically querying product information for Photoshop. It imports a script from 'uxp-documentation/src/pages/uxp-api/reference-html/General/script' and renders it with a query parameter for 'product=photoshop'.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/General/script.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/General/script";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Pseudo-elements Reference
DESCRIPTION: This snippet references the main documentation for UXP CSS pseudo-elements, likely containing a comprehensive list and examples.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Pseudo-elements/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css//Pseudo-elements/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: CSS :defined Selector Example
DESCRIPTION: Demonstrates styling with the :defined pseudo-class for both custom and standard HTML elements.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Pseudo-classes/defined.md#_snippet_0

LANGUAGE: html
CODE:
```
<simple-custom text="Custom element example text"></simple-custom>

<p>Standard paragraph example text</p>
```

LANGUAGE: css
CODE:
```
/* Give the `p` elements distinctive background */
p {
  background: yellow;
}

/* Both the custom and the built-in element are given italic text */
:defined {
  font-style: italic;
}

/* Only simple-custom element is applied with green background*/
simple-custom:defined {
  display: block;
  background: green;
}
```

----------------------------------------

TITLE: CSS letter-spacing Example
DESCRIPTION: Demonstrates how to apply the letter-spacing CSS property to an element to adjust the space between characters.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/letter-spacing.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    letter-spacing: 3px;
}
```

----------------------------------------

TITLE: HTMLVideoElement API Documentation
DESCRIPTION: Provides a comprehensive reference for the HTMLVideoElement API, detailing its properties, their types, default values, descriptions, and associated examples.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLVideoElement.md#_snippet_1

LANGUAGE: APIDOC
CODE:
```
window.HTMLVideoElement:
  Properties:
    preload: string
      Determines how much the media data be loaded when the plugin loads. Default is "metadata".
      Possible values: 'none', 'metadata', 'auto', '' (empty string).
      Example: `<video src="..." preload="metadata"></video>`
    autoplay: boolean
      Video automatically begins to play back as soon as loading the data. Default is `false`.
      Example: `<video src="..." autoplay></video>`
    src: string
      URL of a media resource.
    currentTime: number
      Current playback time in seconds. The seeked event is fired since v7.3.0.
      Emits: `event:seeked`
    duration: number
      Length of the media in seconds.
    muted: boolean
      Whether the media element is muted.
    volume: number
      The volume at which the media will be played. Values must fall between 0 and 1.
      Emits: `event:volumechange`
      Parameters:
        newValue: number - new volume
    played: TimeRanges
      Range of the media source. See: https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges
    paused: boolean
      Whether the media element is paused.
    ended: boolean
      Whether the media element has ended playback.
    error: MediaError
      MediaError for the most recent error, or null if there has not been an error. See: https://developer.mozilla.org/en-US/docs/Web/API/MediaError
    loop: boolean
      Whether the media element should start over when it reaches the end.
    audioTracks: AudioTrackList
      AudioTrackList object listing all of the AudioTrack objects representing the media's audio tracks. See: https://developer.mozilla.org/en-US/docs/Web/API/AudioTrackList
    videoTracks: VideoTrackList
      VideoTrackList object listing all of the VideoTrack objects representing the media's video tracks. See: https://developer.mozilla.org/en-US/docs/Web/API/VideoTrackList
    textTracks: TextTrackList
      TextTrackList object listing all of the TextTrack objects representing the media's text tracks. See: https://developer.mozilla.org/en-US/docs/Web/API/TextTrackList
    videoWidth: number (Read only)
      Width of the video in pixels. Since v7.4.0
    videoHeight: number (Read only)
      Height of the video in pixels.
```

----------------------------------------

TITLE: CSS border-right-style Example
DESCRIPTION: Demonstrates how to apply the 'border-right-style' property along with width and color for the right border of an element.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/border-right-style.md#_snippet_0

LANGUAGE: css
CODE:
```
.button {
    border-right-width: 2px;
    border-right-style: solid;
    border-right-color: white;
}
```

----------------------------------------

TITLE: CSS :active Pseudo-class Example
DESCRIPTION: Demonstrates how to apply styles to an element when it is in the active state, typically during a click event.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Pseudo-classes/active.md#_snippet_0

LANGUAGE: css
CODE:
```
p:active {
    background-color: yellow;
}
```

----------------------------------------

TITLE: Using Content Component with Query
DESCRIPTION: Renders the Content component with a specific query parameter for 'product=photoshop'. This is likely used to display Photoshop-specific UXP documentation or examples.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/text-overflow.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP CSS Padding Bottom Example
DESCRIPTION: Demonstrates how to use the padding-bottom style within UXP, likely for Photoshop integration. It imports a Content component and applies a query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/padding-bottom.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/padding-bottom";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: CSS margin-left Example
DESCRIPTION: Demonstrates how to apply the 'margin-left' CSS property to an element in UXP to set its left margin.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/margin-left.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    margin-left: 1em;
}
```

----------------------------------------

TITLE: Query UXP Content for Product
DESCRIPTION: Renders UXP content, specifically querying for information related to a given product. This is typically used within a web component or application context.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Versions/Versions.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: CSS Margin Example
DESCRIPTION: Demonstrates how to apply margin to an element using CSS in UXP. Note that margins do not collapse in UXP.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/margin.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    margin: 0 auto;
}
```

----------------------------------------

TITLE: Crypto API Documentation
DESCRIPTION: Detailed API documentation for the Crypto module in Adobe UXP. This section outlines available methods, their parameters, return values, and usage examples for cryptographic tasks.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Crypto.md#_snippet_1

LANGUAGE: apidoc
CODE:
```
Crypto:
  // Provides access to cryptographic functions.

  // Example methods (actual methods may vary based on the imported Content):
  hash(data: string | ArrayBuffer, algorithm: string = 'SHA-256'): Promise<string>
    // Hashes the provided data using the specified algorithm.
    // Parameters:
    //   data: The data to hash (string or ArrayBuffer).
    //   algorithm: The hashing algorithm to use (e.g., 'SHA-256', 'MD5'). Defaults to 'SHA-256'.
    // Returns: A Promise that resolves with the hexadecimal hash string.

  // Other potential methods could include:
  // encrypt(data: string | ArrayBuffer, algorithm: string, key: CryptoKey): Promise<ArrayBuffer>
  // decrypt(data: ArrayBuffer, algorithm: string, key: CryptoKey): Promise<ArrayBuffer>
  // generateKey(algorithm: string, extractable: boolean, keyUsages: string[]): Promise<CryptoKey>
  // exportKey(format: string, key: CryptoKey): Promise<string | ArrayBuffer>
  // importKey(format: string, keyData: string | ArrayBuffer, algorithm: string, extractable: boolean, keyUsages: string[]): Promise<CryptoKey>

  // Note: The specific methods and their signatures are determined by the imported 'Content' component and the underlying UXP Crypto API implementation.
```

----------------------------------------

TITLE: Checking if an Entry is a File
DESCRIPTION: Shows how to use the isFile property to determine if an entry is a file, with a usage example for reading.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/File.md#_snippet_1

LANGUAGE: js
CODE:
```
if (anEntry.isFile) {
    await anEntry.read();
}
```

----------------------------------------

TITLE: flex-direction CSS Example
DESCRIPTION: Demonstrates the usage of the `flex-direction` CSS property to stack items in a column within a flexible container.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/flex-direction.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    flex-basis: column;
}
```

----------------------------------------

TITLE: Query Content for Photoshop
DESCRIPTION: Demonstrates how to query content specifically for the Photoshop product using a custom Content component.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Streams/WritableStreamDefaultController.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: CSS background-image Example
DESCRIPTION: Demonstrates how to specify a background image using the CSS 'background-image' property in UXP, referencing a plugin asset.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/background-image.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    background-image: url('plugin://assets/star.png');
}
```

----------------------------------------

TITLE: CSS padding-right Example
DESCRIPTION: Demonstrates how to apply right padding to an element using the CSS 'padding-right' property. This is a standard CSS declaration.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/padding-right.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    padding-right: 10px;
}
```

----------------------------------------

TITLE: Get Folder Entry
DESCRIPTION: Retrieves an entry (file or folder) from within the current folder.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_29

LANGUAGE: APIDOC
CODE:
```
getEntry(filePath)
  Gets an entry from within this folder and returns the appropriate instance.
  Parameters:
    filePath (String): the name/path of the entry to fetch.
  Returns: Promise<File | Folder> - the fetched entry.
  Example:
    const myNovel = await aFolder.getEntry("mynovel.txt");
```

----------------------------------------

TITLE: NodeList Constructor and Methods
DESCRIPTION: Provides documentation for creating a NodeList instance and its associated methods. This includes the constructor, item(), keys(), values(), entries(), and forEach().

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML DOM/NodeList.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
NodeList:
  __init__(staticList, updater)
    Creates an instance of NodeList.
    Parameters:
      staticList: *
      updater: *

  length : number (read-only)
    The number of nodes in the NodeList.

  item(index)
    Returns: Node
    Parameters:
      index: number
    Retrieves a node at a specific index.

  keys()
    Returns an iterator for the keys (indices) of the NodeList.

  values()
    Returns an iterator for the values (nodes) of the NodeList.

  entries()
    Returns an iterator for the entries (index-node pairs) of the NodeList.

  forEach(callback)
    Parameters:
      callback: *
    Executes a provided function once for each node in the NodeList.
```

----------------------------------------

TITLE: Get UXP Version
DESCRIPTION: Retrieves the version of the UXP (Unified Extensibility Platform) as a string. This version indicates the UXP runtime version.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Versions/Versions.md#_snippet_0

LANGUAGE: javascript
CODE:
```
const uxpVersion = require('uxp').versions.uxp;
console.log(uxpVersion);
```

----------------------------------------

TITLE: CSS Visibility Example
DESCRIPTION: Demonstrates how to set an element to be hidden using the CSS visibility property. This is a standard CSS feature supported in UXP.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/visibility.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    visibility: hidden;
}
```

----------------------------------------

TITLE: Content Component Usage for XD
DESCRIPTION: Demonstrates the usage of a 'Content' component, likely for displaying or interacting with content related to Adobe XD. The 'query' parameter specifies the product context.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Streams/ReadableStreamDefaultController.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: CSS :disabled Pseudo-class Example
DESCRIPTION: Demonstrates how to apply styles to disabled input elements using the :disabled pseudo-class in CSS.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Pseudo-classes/disabled.md#_snippet_0

LANGUAGE: css
CODE:
```
input:disabled {
    border: 1px solid blue;
}
```

----------------------------------------

TITLE: CSS flex-shrink Example
DESCRIPTION: Demonstrates how to use the flex-shrink CSS property to prevent an item from shrinking within a flexible container.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/flex-shrink.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    flex-shrink: 0; /* item cannot shrink */
}
```

----------------------------------------

TITLE: Query Product Information with OS Module
DESCRIPTION: This snippet shows how to import and use the OS module from the UXP API to query information about a specific product, in this case, Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/os/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/os/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: ProgressEvent in UXP
DESCRIPTION: Demonstrates the usage of the ProgressEvent in UXP, likely for tracking asynchronous operations. This example specifically targets Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Events/ProgressEvent.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Events/ProgressEvent";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Render UXP Content for Adobe XD
DESCRIPTION: Imports and renders UXP content, specifically querying for Adobe XD product information. This snippet demonstrates how to use the `uxp-documentation` library to display content related to a specific product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/General/head.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/General/head";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Render UXP Command Information
DESCRIPTION: Renders UXP command information, likely for Photoshop, by querying the UXP API reference.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Entry Points/UxpCommandInfo.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Content Component Usage for Photoshop
DESCRIPTION: Demonstrates the usage of the Content component, querying for Photoshop product information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Streams/WritableStream.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Content Component with Query Parameter
DESCRIPTION: Example of using the Content component within UXP, demonstrating how to pass a query parameter to filter or configure the content displayed. This is useful for dynamic content loading.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Events/CloseEvent.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Element Pointer Capture Example
DESCRIPTION: Demonstrates how to use `setPointerCapture` and `releasePointerCapture` to manage pointer interactions with an HTML element.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLMenuItemElement.md#_snippet_37

LANGUAGE: javascript
CODE:
```
// HTML
// <style>
//     div {
//         width: 140px;
//         height: 50px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: #fbe;
//         position: absolute;
//     }
// </style>
// <div id="slider">SLIDE ME</div>

// JS
function beginSliding(e) {
     slider.setPointerCapture(e.pointerId);
     slider.addEventListener("pointermove", slide);
 }

 function stopSliding(e) {
     slider.releasePointerCapture(e.pointerId);
     slider.removeEventListener("pointermove", slide);
 }

 function slide(e) {
     slider.style.left = e.clientX;
 }

 const slider = document.getElementById("slider");

 slider.addEventListener("pointerdown", beginSliding);
 slider.addEventListener("pointerup", stopSliding);
```

----------------------------------------

TITLE: Get Entry for Session Token
DESCRIPTION: Retrieves the file system Entry corresponding to a given session token.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_21

LANGUAGE: APIDOC
CODE:
```
getEntryForSessionToken(token: String): Entry

Returns the file system Entry that corresponds to the session token obtained from `createSessionToken`. If an entry cannot be found that matches the token, then a `Reference Error: token is not defined` error is thrown.

Parameters:
- token: String

Returns: Entry - the corresponding entry for the session token
```

----------------------------------------

TITLE: Querying Product Information in UXP
DESCRIPTION: Shows how to query product information, specifically for Adobe XD, using a component within the UXP documentation framework.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/align-self.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Content Query for Photoshop
DESCRIPTION: An example of querying content specifically for Adobe Photoshop within the UXP environment, likely to retrieve or display Photoshop-related information or assets.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Events/MessageEvent.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Importing and Using UXP Content Component
DESCRIPTION: Demonstrates how to import the Content component from the uxp-documentation library and use it with a specific product query.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/border-bottom.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/border-bottom";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Get Storage Entry Metadata
DESCRIPTION: Retrieves the metadata associated with a storage entry. This includes information about the entry itself.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/Entry.md#_snippet_7

LANGUAGE: javascript
CODE:
```
const metadata = aFile.getMetadata();
```

----------------------------------------

TITLE: CSS margin-top Example
DESCRIPTION: Demonstrates how to apply the 'margin-top' property to an element using CSS. This property specifies the top margin for an element.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/margin-top.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    margin-top: 1em;
}
```

----------------------------------------

TITLE: Query Spectrum UXP Widget Content
DESCRIPTION: Demonstrates how to query for specific content related to Spectrum UXP Widgets, filtering by product. This example shows how to retrieve information for Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-icon.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: CSS right property example
DESCRIPTION: Demonstrates how to use the 'right' CSS property to position an element absolutely. This property is supported in UXP v2.0 and later.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/right.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    right: 0;
    position: absolute;
}
```

----------------------------------------

TITLE: CSS width Property Example
DESCRIPTION: Demonstrates how to set the width of an element using CSS within UXP, referencing the standard CSS 'width' property.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/width.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    width: 100vw;
}
```

----------------------------------------

TITLE: Attribute Selector Example
DESCRIPTION: Demonstrates the usage of an attribute selector in CSS to style elements with a specific data attribute.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Selectors/Attribute selector.md#_snippet_0

LANGUAGE: css
CODE:
```
div[data-row] {
    border: 1px solid red;
}
```

----------------------------------------

TITLE: WebSocket API Documentation
DESCRIPTION: Provides comprehensive documentation for the WebSocket API, including its constructor parameters, read-only properties (readyState, url, protocol, bufferedAmount, binaryType), and methods (send, close). It details the states of a WebSocket connection and the parameters for closing a connection.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/Data Transfers/WebSocket.md#_snippet_2

LANGUAGE: APIDOC
CODE:
```
window.WebSocket

WebSocket(url, protocols)
  - url: URL to which to connect; this should be the URL to which the WebSocket server will respond.
  - protocols: Either a single protocol string or an array of protocol strings.
  - Throws: Error If invalid url or protocols is passed

Properties:
  - readyState : number (Read only) - Current state of the WebSocket connection. Values: 0 (CONNECTING), 1 (OPEN), 2 (CLOSING), 3 (CLOSED).
  - url : string (Read only) - URL of the WebSocket as resolved by the constructor.
  - protocol : string - Name of the sub-protocol the server selected. Returns an empty string if no connection is established.
  - bufferedAmount : number (Read only) - Number of bytes of data that have been queued using calls to send() but not yet transmitted to the network.
  - binaryType : string - Type of the binary data being received over WebSocket connection. Available binary types: "blob", "arraybuffer".

Methods:
  - send(data)
    - Enqueues the specified data to be transmitted to the other end over the WebSocket connection.
    - Parameters:
      - data: string | ArrayBuffer | ArrayBufferView - Data to send to the server.
  - close([code], [reason])
    - Closes the websocket connection.
    - Parameters:
      - code: number (Optional, default: 1000) - Integer value as per https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#close().
      - reason: string (Optional) - Human-readable string explaining why the connection is closing. The default value is "".
    - Throws: Error If invalid code or reason is passed
```

----------------------------------------

TITLE: Spectrum UXP Slider Widget
DESCRIPTION: Demonstrates the usage of the sp-slider component from the Spectrum UXP Widgets library. This example shows how to query for Photoshop-specific configurations.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-slider.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-slider";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Importing and Using UXP Documentation Component
DESCRIPTION: Demonstrates how to import and use a documentation component for UXP API reference, specifically for CSS pseudo-classes, and how to query it for a specific product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Pseudo-classes/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css//Pseudo-classes/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: XMPMeta Constructor and Basic Property Manipulation
DESCRIPTION: Demonstrates creating an XMPMeta object and using property-based APIs to set, get, and delete metadata properties. It also shows how to check for property existence.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/XMP/XMP Classes/XMPMeta.md#_snippet_1

LANGUAGE: javascript
CODE:
```
let { XMPMeta, XMPConst } = require("uxp").xmp;
let meta = new XMPMeta();
meta.setProperty(XMPConst.NS_XMP, "Name", "vkumarg");
let prop = meta.getProperty(XMPConst.NS_XMP, "Name");
console.log(prop.namespace);
console.log(prop.options);
console.log(prop.path);
// checking for the property existence and deleting it
if(meta.doesPropertyExist(XMPConst.NS_XMP, "Name")) {
     meta.deleteProperty(XMPConst.NS_XMP, "Name");
}

if(!meta.doesPropertyExist(XMPConst.NS_XMP, "Name")) {
     console.log("Property doesn't exist");
} else {
     console.log("Property exists");
}
```

----------------------------------------

TITLE: Universal Selector Example
DESCRIPTION: Demonstrates how to use the universal selector (*) in CSS to apply styles to all elements within the UXP document. This is useful for applying global styles or debugging.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Selectors/Universal selector.md#_snippet_0

LANGUAGE: css
CODE:
```
* {
    border: 1px solid red;
}
```

----------------------------------------

TITLE: CSS Identifier Selector Example
DESCRIPTION: Demonstrates how to apply styles to an element using its ID, a fundamental CSS concept relevant to UXP development.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Selectors/Identifier selector.md#_snippet_0

LANGUAGE: css
CODE:
```
#danger {
    background-color: red;
}
```

----------------------------------------

TITLE: UXP Entry Point Content Component
DESCRIPTION: Renders UXP documentation content for entry points, allowing filtering by product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Entry Points/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/index.md";
```

----------------------------------------

TITLE: CSS border-color Example
DESCRIPTION: Demonstrates how to set the border color for an element using CSS. The border-style property must also be set for the border-color to be applied.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/border-color.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    border-style: solid;
    border-color: blue;
}
```

----------------------------------------

TITLE: CSS margin-bottom Example
DESCRIPTION: Demonstrates how to set the bottom margin for an element using CSS in UXP. This property specifies the space below an element.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/margin-bottom.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    margin-bottom: 1em;
}
```

----------------------------------------

TITLE: CSS border-right-color Example
DESCRIPTION: Demonstrates how to set the border-right-color property in CSS for an element. The border-style property must also be set for the color to apply.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/border-right-color.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    border-style: solid;
    border-right-color: blue;
}
```

----------------------------------------

TITLE: Get Plugin Version
DESCRIPTION: Retrieves the version of the currently running plugin. This version should correspond to the version specified in the plugin's manifest file.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Versions/Versions.md#_snippet_1

LANGUAGE: javascript
CODE:
```
const pluginVersion = require('uxp').versions.plugin;
console.log(pluginVersion);
```

----------------------------------------

TITLE: Get Panel API
DESCRIPTION: Retrieves a panel object by its ID. Returns the panel object if the ID is valid, otherwise returns null.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/EntryPoints.md#_snippet_6

LANGUAGE: APIDOC
CODE:
```
getPanel(id)
  Get panel with specified id

  Parameters:
    id (String): panel id

  Returns: UxpPanelInfo - panel object for a valid id
                          null for an invalid id
```

----------------------------------------

TITLE: Render Content with Product Query
DESCRIPTION: Renders documentation content for a specific product using the Content component with a query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/Hierarchy/h3.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP LocalStorage Example for Adobe XD
DESCRIPTION: Demonstrates how to use the LocalStorage global member in UXP, specifically querying for product=xd. This is useful for storing and retrieving data within the UXP environment.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Data Storage/LocalStorage.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Data Storage/LocalStorage";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP Shell Module API Reference
DESCRIPTION: Provides a comprehensive API reference for the UXP Shell module, detailing available methods, parameters, and return values for interacting with the system shell.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/shell/index.md#_snippet_1

LANGUAGE: apidoc
CODE:
```
UXPShell:
  executeCommand(command: string, options?: object): Promise<CommandResult>
    Executes a shell command.
    Parameters:
      command: The command string to execute.
      options: Optional configuration for the command execution (e.g., cwd, env).
    Returns: A Promise that resolves with the CommandResult object containing stdout, stderr, and exit code.

  spawnProcess(command: string, args?: string[], options?: object): ChildProcess
    Spawns a new process.
    Parameters:
      command: The command to spawn.
      args: An array of arguments for the command.
      options: Optional configuration for the process (e.g., stdio, cwd).
    Returns: A ChildProcess object for managing the spawned process.

CommandResult:
  stdout: string
    The standard output of the command.
  stderr: string
    The standard error output of the command.
  exitCode: number
    The exit code of the command.

ChildProcess:
  send(message: any): boolean
    Sends a message to the child process.
  kill(signal?: string): void
    Kills the child process.
  on(event: string, listener: Function): void
    Listens for events from the child process (e.g., 'close', 'error').
```

----------------------------------------

TITLE: CSS border-top-color Example
DESCRIPTION: Demonstrates how to set the top border color of an element using CSS. The border-top-color property requires a border-style to be defined.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/border-top-color.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    border-style: solid;
    border-top-color: blue;
}
```

----------------------------------------

TITLE: Element scrollLeft Property
DESCRIPTION: Gets or sets the number of pixels that an element's content has been scrolled from its left edge.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLStyleElement.md#_snippet_25

LANGUAGE: APIDOC
CODE:
```
Element.scrollLeft : number
```

----------------------------------------

TITLE: UXP Blob Data Transfer Example
DESCRIPTION: Demonstrates how to use the Blob data transfer mechanism within UXP, specifically for Photoshop integration. This snippet shows how to query product-specific data.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Data Transfers/Blob.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Data Transfers/Blob";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: border-left-color CSS Example
DESCRIPTION: Demonstrates how to set the left border color of an element using CSS in UXP. Requires a border-style to be set.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/border-left-color.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    border-style: solid;
    border-left-color: blue;
}
```

----------------------------------------

TITLE: UXP prefers-color-scheme Example
DESCRIPTION: Demonstrates how to use the prefers-color-scheme media query in UXP to apply different styles based on the user's system color preference (e.g., light or dark mode).

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Media Queries/prefers-color-scheme.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Media Queries/prefers-color-scheme";

<Content query="product=photoshop"/>
```

LANGUAGE: css
CODE:
```
@media (prefers-color-scheme: light) {
  /* Styles for light mode */
  body {
    background-color: white;
    color: black;
  }
}

@media (prefers-color-scheme: dark) {
  /* Styles for dark mode */
  body {
    background-color: black;
    color: white;
  }
}
```

----------------------------------------

TITLE: Element scrollTop Property
DESCRIPTION: Gets or sets the number of pixels that an element's content has been scrolled from its top edge.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLStyleElement.md#_snippet_26

LANGUAGE: APIDOC
CODE:
```
Element.scrollTop : number
```

----------------------------------------

TITLE: UXP Content Rendering
DESCRIPTION: This snippet demonstrates how to render UXP content, specifically querying for product information related to 'xd'. It's a common pattern for displaying product-specific documentation.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/border-left-width.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP Blob Data Transfer Example
DESCRIPTION: Demonstrates how to use the Blob data transfer mechanism within UXP, specifically for Photoshop integration. This snippet shows how to query product-specific data.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Data Transfers/Blob.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Data Transfers/Blob";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Query Spectrum UXP Widget Content
DESCRIPTION: Demonstrates how to query content for a Spectrum UXP Widget, specifying the product as 'xd'. This is typically used to retrieve specific documentation or examples related to the 'sp-icon' component for Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-icon.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP Key-Value Storage Module
DESCRIPTION: This snippet demonstrates how to use the UXP Key-Value Storage module to interact with persistent storage within Adobe applications. It includes a basic example of querying for product-specific storage.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Key-Value Storage/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Key-Value Storage/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP CSS General Units Example (Photoshop)
DESCRIPTION: Demonstrates the usage of general CSS units within the UXP environment, specifically for Photoshop. This component allows querying product-specific configurations.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/General/units.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/General/units";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Prompt Component
DESCRIPTION: Demonstrates the usage of the UXP prompt component, likely for user input within the UXP environment. It takes a query parameter to specify the product context.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML DOM/prompt.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML DOM/prompt.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: HTMLCanvasElement Usage Example
DESCRIPTION: Demonstrates how to use HTMLCanvasElement properties (height, width) and the getContext method to draw on a canvas using JavaScript.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLCanvasElement.md#_snippet_1

LANGUAGE: html
CODE:
```
<sp-body id="layers">
    <canvas id="canvas" height="230" width="1500"></canvas>
  </sp-body>
  <footer>
  <!-- Button Events to invoke height, width and context of canvas -->
    <sp-button id="btnPopulateLoadScript" onclick="show_height()">Canvas Height</sp-button>
    <sp-button id="btnPopulateLoadScript" onclick="show_width()">Canvas Width</sp-button>
    <sp-button id="btnPopulateLoadScript" onclick="getContext()">Get Context</sp-button>
  </footer>
```

LANGUAGE: javascript
CODE:
```
const canvas = document.getElementById("canvas");

  function show_height() {
    console.log("Canvas Height: "+ canvas.height);
  }

  function show_width() {
    console.log("Canvas Width: "+ canvas.width);
  }

  // Function to get the canvas context and draw a triangle using lines
  function getContext() {
     let context = canvas.getContext("2d"); // get's the canvas context

     // Draw a triangle. For more details on the below apis refer to interfaces such as CanvasRenderingContext2D, CanvasGradient. The details of the interfaces are shared as a link at the top of this documentation
     context.beginPath();
     context.moveTo(50,50);
     context.lineTo(100, 50);
     context.lineTo(100, 100);
     context.lineTo(50,50)
     context.closePath();
     context.stroke();
  }
```

----------------------------------------

TITLE: UXP CSS Media Queries with Product Query
DESCRIPTION: Demonstrates how to use UXP's CSS media queries, specifically applying them based on a product query parameter. This allows for product-specific styling within UXP plugins.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Media Queries/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css//Media Queries/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Get File/Folder Info (Sync)
DESCRIPTION: Synchronously retrieves file status information. Returns a Stats object similar to Node.js.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/fs/fs.md#_snippet_12

LANGUAGE: javascript
CODE:
```
const stats = fs.lstatSync("plugin-data:/textFile.txt");
```

----------------------------------------

TITLE: Entry.toString() Method
DESCRIPTION: Provides a method to get a human-readable string representation of an entry, including its name, type, and native path.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/Entry.md#_snippet_2

LANGUAGE: javascript
CODE:
```
// Returns the details of the given entry like name, type and native path in a readable string format.
```

----------------------------------------

TITLE: Load UXP Spectrum FAQs
DESCRIPTION: Imports the main content for UXP Spectrum API FAQs. This component is designed to display frequently asked questions related to the Spectrum API.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/faqs/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/faqs/index.md";
```

----------------------------------------

TITLE: CSS border-left-style Example
DESCRIPTION: Demonstrates how to set the left border style for an element using CSS. This includes setting the width, style, and color of the left border.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/border-left-style.md#_snippet_0

LANGUAGE: css
CODE:
```
.button {
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: white;
}
```

----------------------------------------

TITLE: Import UxpPanelInfo Module
DESCRIPTION: Imports the UxpPanelInfo module from the uxp-documentation library for use in UXP plugin development.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Entry Points/UxpPanelInfo.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/UxpPanelInfo";
```

----------------------------------------

TITLE: UXP CSS Styles - Margin Left Example
DESCRIPTION: Demonstrates how to apply the margin-left CSS property in UXP for Photoshop using a React-like component structure.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/margin-left.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/margin-left";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP CSS Reference - General
DESCRIPTION: Imports and renders the general CSS reference documentation for UXP, allowing filtering by product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/General/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css//General/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: CSS border-bottom-style Example
DESCRIPTION: Demonstrates how to set the bottom border style for an element using CSS. This includes setting the width, style, and color of the bottom border.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/border-bottom-style.md#_snippet_0

LANGUAGE: css
CODE:
```
.button {
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: white;
}
```

----------------------------------------

TITLE: Applying CSS Styles with Query Parameter
DESCRIPTION: Shows an example of rendering a content component with a specific query parameter, likely to target Photoshop-specific styling or functionality.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/border-right-style.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Retrieving responseText
DESCRIPTION: Demonstrates how to get the response body as plain text from a server using the responseText property after a successful request.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/Data Transfers/XMLHttpRequest.md#_snippet_3

LANGUAGE: javascript
CODE:
```
const xhr = new XMLHttpRequest();
xhr.addEventListener("load", () => {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        console.log(xhr.responseText);
    }
});
xhr.open("GET", "https://www.adobe.com");
xhr.send();
```

----------------------------------------

TITLE: CSS :checked Pseudo-class Example
DESCRIPTION: Demonstrates how to use the :checked pseudo-class in CSS to style an input element when it is checked. This pseudo-class is primarily applicable to checkboxes.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Pseudo-classes/checked.md#_snippet_0

LANGUAGE: css
CODE:
```
input:checked {
    background-color: blue;
}
```

----------------------------------------

TITLE: Import UxpCommandInfo Module
DESCRIPTION: Imports the UxpCommandInfo module from the uxp-documentation library, used for accessing UXP API reference information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Entry Points/UxpCommandInfo.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/UxpCommandInfo";
```

----------------------------------------

TITLE: Padding Left CSS Property in UXP
DESCRIPTION: Demonstrates the usage of the padding-left CSS property for styling elements in Adobe UXP, with a specific example for Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/padding-left.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/padding-left";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Render Content with Query
DESCRIPTION: Renders the Content component with a specific query parameter for product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/Hierarchy/h5.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Import and Query Spectrum Widgets for XD
DESCRIPTION: Demonstrates how to import Spectrum Widget documentation and query it for product-specific information, in this case, for Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Native Path and Session Token Operations
DESCRIPTION: Gets the platform-specific native file system path and creates session tokens for host-specific APIs.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_20

LANGUAGE: APIDOC
CODE:
```
getNativePath(entry: Entry): String

Returns the platform native file system path of given entry.

Parameters:
- entry: Entry

createSessionToken(entry: Entry): String

Returns a token suitable for use with certain host-specific APIs (such as Photoshop). This token is valid only for the current plugin session. As such, it is of no use if you serialize the token to persistent storage, as the token will be invalid in the future.

Note: When using the Photoshop DOM API, pass the instance of the file instead of a session token -- Photoshop will convert the entry into a session token automatically on your behalf.

Parameters:
- entry: Entry

Returns: String - the session token for the given entry

Example:
```js
const fs = require('uxp').storage.localFileSystem;
let entry = await fs.getFileForOpening();
let token = fs.createSessionToken(entry);
let result = await require('photoshop').action.batchPlay([{ _obj: "open", "target": { _path: token, _kind: "local" } }], {});
```
```

----------------------------------------

TITLE: Applying :enabled Pseudo-class with Product Query
DESCRIPTION: An example of applying the :enabled pseudo-class within a UXP component, specifically targeting elements related to a 'product=xd' query.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Pseudo-classes/enabled.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Query Photoshop Product Information using UXP
DESCRIPTION: Demonstrates how to use the Content component to query product-specific information, in this case for Adobe Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/General/style.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Import UxpMenuItem Component
DESCRIPTION: Imports the UxpMenuItem component from the uxp-documentation library for use in UXP applications.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Entry Points/UxpMenuItem.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/UxpMenuItem";
```

----------------------------------------

TITLE: CSS flex-grow Example
DESCRIPTION: Demonstrates how to use the flex-grow CSS property to control the growth of an element within a flexible container. This property accepts a non-negative number.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/flex-grow.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    flex-grow: 2;
}
```

----------------------------------------

TITLE: CSS ::after Pseudo-element Example
DESCRIPTION: Demonstrates the usage of the ::after pseudo-element in CSS to insert content after matched elements. This is a standard CSS feature supported in UXP.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Pseudo-elements/after.md#_snippet_0

LANGUAGE: css
CODE:
```
.withCommas > *::after {
    content: ",";
}
```

----------------------------------------

TITLE: Folder.getEntry() - Get Specific Entry
DESCRIPTION: Retrieves a specific file or folder entry by its name or path within the current folder.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/Folder.md#_snippet_5

LANGUAGE: javascript
CODE:
```
const myNovel = await aFolder.getEntry("mynovel.txt");
```

----------------------------------------

TITLE: UXP Data Storage API Reference (JavaScript)
DESCRIPTION: Provides access to UXP's data storage capabilities, allowing plugins to store and retrieve data. This section details global members related to data storage, with examples for querying data specific to products like Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Data Storage/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Data Storage/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: CSS border-bottom-color Example
DESCRIPTION: Demonstrates how to set the bottom border color of an element using CSS in Adobe UXP. Requires a border style to be set.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/border-bottom-color.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    border-style: solid;
    border-bottom-color: blue;
}
```

----------------------------------------

TITLE: Access Plugin Manager Instance
DESCRIPTION: Demonstrates how to get an instance of the `pluginManager` object in Adobe UXP, which is used for Inter-Plugin Communication (IPC).

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Plugin Manager/PluginManager.md#_snippet_0

LANGUAGE: javascript
CODE:
```
const pluginManager = require("uxp").pluginManager;
```

----------------------------------------

TITLE: UXP Component with :nth-of-type()
DESCRIPTION: An example of a UXP component that utilizes CSS with the :nth-of-type() pseudo-class to style elements. The `Content` component is used here with a query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Pseudo-classes/nth-of-type.md#_snippet_1

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Pseudo-classes/nth-of-type";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: CSS ::before Pseudo-element Example
DESCRIPTION: Demonstrates how to use the ::before pseudo-element in CSS to insert content before an element. This is useful for adding decorative elements like bullets or icons.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Pseudo-elements/before.md#_snippet_0

LANGUAGE: css
CODE:
```
.addBullet > *::before {
    content: "•";
}
```

----------------------------------------

TITLE: UXP CSS Pseudo-class Component
DESCRIPTION: Example of importing and using a UXP component that likely renders documentation for CSS pseudo-classes. It takes a 'query' parameter to specify the product context.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Pseudo-classes/last-child.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Pseudo-classes/last-child";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: CSS text-overflow Example
DESCRIPTION: Demonstrates how to use the text-overflow CSS property to display an ellipsis for clipped text. Requires overflow: hidden and white-space: nowrap.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/text-overflow.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
```

----------------------------------------

TITLE: Render Content Component with Product Query
DESCRIPTION: Renders a Content component, likely a custom UXP component, with a query parameter specifying the product as 'xd'. This is used to display product-specific information or configurations.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Entry Points/EntryPointsError.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Element Scroll Properties
DESCRIPTION: Allows getting and setting the scroll position of an element, and provides read-only properties for the total scrollable dimensions.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLButtonElement.md#_snippet_18

LANGUAGE: APIDOC
CODE:
```
Element.scrollLeft : number
Element.scrollTop : number
Element.scrollWidth : number
  Read only
Element.scrollHeight : number
  Read only
```

----------------------------------------

TITLE: Get File/Folder Info (Async)
DESCRIPTION: Asynchronously retrieves file status information. Returns a Promise resolving to a Stats object similar to Node.js.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/fs/fs.md#_snippet_11

LANGUAGE: javascript
CODE:
```
const stats = await fs.lstat("plugin-data:/textFile.txt");
```

----------------------------------------

TITLE: Accessing Host Information in UXP
DESCRIPTION: This snippet shows how to import and use the `Host` module from the UXP documentation library to retrieve information about the host application. The `Content` component is used with a query parameter to specify the product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Host Information/Host.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Host Information/Host";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: CSS top Property Example
DESCRIPTION: Demonstrates the usage of the 'top' CSS property to set the absolute positioning of an element. This property is available since UXP v2.0.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/top.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    top: 0;
    position: absolute;
}
```

----------------------------------------

TITLE: UXP SecureStorage API Documentation
DESCRIPTION: Provides a comprehensive overview of the SecureStorage API methods for managing secure key-value pairs within UXP plugins. Includes details on setting, getting, removing items, and managing storage.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Key-Value Storage/SecureStorage.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
require('uxp').storage.secureStorage:
  Description: Provides a protected storage which can be used to store sensitive data per plugin. SecureStorage takes a key-value pair and encrypts the value before being stored. After encryption, it stores the key and the encrypted value pair. When the value is requested with an associated key, it's retrieved after being decrypted. The key is not encrypted.
  Caveats:
    1. Not suitable for data that must be secret from the current user, as it's protected under the user's account credentials.
    2. Data can be lost due to uninstallation or cryptographic information damage; treat as a cache, not persistent storage.

  Properties:
    length: number (Read only) - Number of items stored in the secure storage.

  Methods:
    setItem(key, value):
      Description: Stores a key and value pair after encrypting the value.
      Parameters:
        key (string): Key to set value.
        value (string | ArrayBuffer | TypedArray): Value for a key.
      Returns: Promise<void> - Resolves when the value is stored, rejects on empty or failed storage.
      Throws:
        TypeError: If key or value types are unacceptable.

    getItem(key):
      Description: Retrieves a value associated with a key after decryption.
      Parameters:
        key (string): Key to get value.
      Returns: Promise<Uint8Array> - Resolves with an Uint8Array.
      Throws:
        TypeError: If the key type is unacceptable.

    removeItem(key):
      Description: Removes a value associated with a provided key.
      Parameters:
        key (string): Key to remove value.
      Returns: Promise<void> - Resolves when the value is removed, rejects if not removed or found.
      Throws:
        TypeError: If the key type is unacceptable.

    key(index):
      Description: Returns a key stored at the given index.
      Parameters:
        index (number): Integer representing the number of the key.
      Returns: number - The key stored at the given index.

    clear():
      Description: Clears all values in the secure storage.
      Returns: Promise<void> - Resolves when all items are cleared, rejects if no items to clear or clear failed.
```

----------------------------------------

TITLE: UXP Command Definitions
DESCRIPTION: Specifies how commands are defined within UXP, including the 'run' method for command invocation and a 'cancel' method for future use. The 'run' method's signature varies based on Manifest Version.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/EntryPoints.md#_snippet_5

LANGUAGE: APIDOC
CODE:
```
entrypoints.commands: `Array<object>`
  This object contains a list of key-value pairs where each key is the command id and value is command's data whose type can be an object or function. If a function, it is assumed to be 'run' method (described below). If an objet, it can contain following properties but 'run' is must to specify.

entrypoints.commands.run: `function`
  This is called when the command is invoked via menu entry. 'this' can be used to access UxpCommandInfo object. This function can return a promise. To signal failure, throw an exception or return a rejected promise.
  Parameters :
  run(event) {},
  till Manifest Version V4
  run(executionContext, ...arguments) {},
  from v5 onwards

entrypoints.commands.cancel: `function`
  For future use.
```

----------------------------------------

TITLE: Mixing HTML, SWC, and Spectrum UXP Widgets
DESCRIPTION: Provides an example of seamlessly integrating plain HTML elements, Spectrum Web Components (SWC), and Spectrum UXP widgets within a single form structure.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-spectrum/index.md#_snippet_3

LANGUAGE: html
CODE:
```
<form>
  <sp-banner>
    <div slot="header">Header text</div>
    <div slot="content">Content of the banner</div>
  </sp-banner>
  <sp-button variant="primary">I'm a button</sp-button>
</form>
```

----------------------------------------

TITLE: Display Content Component (Photoshop)
DESCRIPTION: Demonstrates how to use the `Content` component to display content within Photoshop using UXP. It takes a query parameter to specify the product context.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/display.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/display";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Component Usage with :nth-last-child
DESCRIPTION: Example of how to use a UXP component with a query parameter to apply CSS styles, potentially utilizing the :nth-last-child pseudo-class.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Pseudo-classes/nth-last-child.md#_snippet_1

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Pseudo-classes/nth-last-child";

<Content query="product=photoshop" />
```

----------------------------------------

TITLE: Render UXP Content Component
DESCRIPTION: Renders the UXP Content component with a specified query parameter. This allows for dynamic content loading based on the provided product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/flex-wrap.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP API Reference - JavaScript
DESCRIPTION: Imports and renders the UXP API reference documentation for a specific product, such as Adobe XD. The 'query' parameter specifies the product context.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: EntryPointsError Exception
DESCRIPTION: The EntryPointsError is thrown when the `entrypoints.setup` function encounters an error or is called multiple times. This error helps developers identify and resolve issues related to plugin initialization.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/EntryPointsError.md#_snippet_0

LANGUAGE: javascript
CODE:
```
class EntryPointsError extends Error {
  constructor(message) {
    super(message);
    this.name = "EntryPointsError";
  }
}
```

----------------------------------------

TITLE: Node.js OS Module API Documentation
DESCRIPTION: Provides an overview of the functions available in the Node.js 'os' module for accessing operating system information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/os/OS.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
os:
  platform():
    Description: Gets the platform we are running on (eg. "win32", "win10", "darwin").
    Returns: string - the string representing the platform.
  release():
    Description: Gets the release number of the os (eg. "10.0.1.1032").
    Returns: string - the string representing the release.
  arch():
    Description: Gets the platform architecture we are running on (eg. "x32, x64, x86_64 etc").
    Returns: string - the string representing the architecture.
  cpus():
    Description: Gets the platform cpu information we are running on (eg. "{'Intel(R) Core(TM) i9-8950HK CPU @ 2.90GHz', 2900}").
    Returns: array - the array of objects containing information about each logical CPU core.
    Notes: Currently only model and speed properties are supported. times property is not supported. Access to CPU information, such as model string and frequency, is limited on UWP. "ARM based architecture" or "X86 based architecture" is returned as a 'model' value on UWP. 0 is returned as a 'speed' value on UWP.
  totalmem():
    Description: Gets the total amount of system memory in bytes.
    Returns: integer - the total amount of system memory in bytes as an integer.
  freemem():
    Description: Gets the total amount of free system memory in bytes.
    Returns: integer - the total amount of free system memory in bytes as an integer.
  homedir():
    Description: Gets the home directory path of the user.
    Returns: string - the home directory path of the user.
```

----------------------------------------

TITLE: UXP Global Members - DragEvent
DESCRIPTION: Provides information about the DragEvent in UXP, used for handling drag-and-drop operations. This example shows how to query for Photoshop-specific product information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Events/DragEvent.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Events/DragEvent";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Temporary and Data Folder Operations
DESCRIPTION: Provides methods to get a temporary folder for transient data and a persistent data folder for extension storage.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_18

LANGUAGE: APIDOC
CODE:
```
getTemporaryFolder(): Promise<Folder>

Returns a temporary folder. The contents of the folder will be removed when the extension is disposed.

Returns: Promise<Folder>

Example:
```js
const temp = await fs.getTemporaryFolder();
```

getDataFolder(): Promise<Folder>

Returns a folder that can be used for extension's data storage without user interaction. It is persistent across host-app version upgrades.

Returns: Promise<Folder>
```

----------------------------------------

TITLE: Get Plugin Folder - JavaScript
DESCRIPTION: Returns a read-only folder containing all packaged plugin assets. Returns a Promise that resolves to a Folder object.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/FileSystemProvider.md#_snippet_4

LANGUAGE: javascript
CODE:
```
const pluginFolder = await fs.getPluginFolder();
```

----------------------------------------

TITLE: Element setPointerCapture Example
DESCRIPTION: Demonstrates how to use the `setPointerCapture` method on an element to manage pointer interactions, including capturing and releasing pointer events during a drag operation.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLInputElement.md#_snippet_10

LANGUAGE: javascript
CODE:
```
const slider = document.getElementById("slider");

function beginSliding(e) {
     slider.setPointerCapture(e.pointerId);
     slider.addEventListener("pointermove", slide);
 }

 function stopSliding(e) {
     slider.releasePointerCapture(e.pointerId);
     slider.removeEventListener("pointermove", slide);
 }

 function slide(e) {
     slider.style.left = e.clientX;
 }

slider.addEventListener("pointerdown", beginSliding);
slider.addEventListener("pointerup", stopSliding);
```

----------------------------------------

TITLE: UXP File System (fs) Module - Photoshop Integration
DESCRIPTION: Demonstrates the usage of the UXP File System module for operations within Photoshop. This snippet shows how to import and utilize the fs module, with a query parameter specifying Photoshop as the target product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/fs/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/fs/fs.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: CSS calc() Usage Example
DESCRIPTION: Demonstrates how to use the CSS calc() function to set the width of an element, subtracting a fixed pixel value from the viewport height.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/General/calc.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    width: calc(100vh - 50px);
}
```

----------------------------------------

TITLE: Get XMP Array Item
DESCRIPTION: Retrieves an item from an array-type metadata property. Returns an XMPProperty object or undefined if the item does not exist.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/XMP/XMP Classes/XMPMeta.md#_snippet_14

LANGUAGE: javascript
CODE:
```
XMPMetaObj.getArrayItem(schemaNS, arrayName, itemIndex)
```

----------------------------------------

TITLE: Applying CSS Styles with Query Parameters
DESCRIPTION: Shows how to apply CSS styles to a UXP component, using a query parameter to specify the product context (e.g., Photoshop).

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/flex.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: CSS prefers-color-scheme Media Query Example
DESCRIPTION: Demonstrates how to use the `prefers-color-scheme` media query in CSS to define different styles for light and dark themes. This allows UXP plugins to adapt their appearance based on the user's system or application theme settings.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Media Queries/prefers-color-scheme.md#_snippet_0

LANGUAGE: css
CODE:
```
:root {
    --primary-color: #E8E8E8; /* default colors are for dark themes */
}
@media (prefers-color-scheme: lightest), (prefers-color-scheme:light) {
    :root {
        --primary-color: #181818; /* override for light themes */
    }
}
```

----------------------------------------

TITLE: HTMLOptionElement Usage in UXP
DESCRIPTION: Demonstrates how to use the HTMLOptionElement, likely for creating or manipulating option elements within a UXP plugin. The example shows a query parameter for product, suggesting context within a specific Adobe product like Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Elements/HTMLOptionElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLOptionElement";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: HTMLWebViewElement Usage Example
DESCRIPTION: Demonstrates how to add a WebView element to a UXP plugin, specifying its ID, width, height, and source URL. The `uxpAllowInspector` attribute is also shown.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLWebViewElement.md#_snippet_0

LANGUAGE: js
CODE:
```
<webview id="webviewsample" width="100%" height="360px" src="https://www.adobe.com" uxpAllowInspector="true" ></webview>
```

----------------------------------------

TITLE: Query UXP Spectrum FAQs for a Specific Product
DESCRIPTION: Renders the UXP Spectrum API FAQs, filtered for a specific product. This allows users to find answers relevant to a particular Adobe product, such as Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/faqs/index.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: CSS border-radius Example
DESCRIPTION: Demonstrates the usage of the border-radius shorthand property in CSS for setting border corner radii. Supports single value and multiple value syntax.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/border-radius.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    border-radius: 4px;
}
.card {
    border-radius: 4px 0;
}
```

----------------------------------------

TITLE: UXP HTML Events - Global Configuration
DESCRIPTION: This snippet demonstrates how to configure UXP HTML Events for a specific product, using Adobe XD as an example. It highlights the use of a query parameter to specify the product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Events/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Events/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Element Attribute Management
DESCRIPTION: Methods for getting, setting, and removing attributes from an element. This includes retrieving attribute names and attribute nodes.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLSelectElement.md#_snippet_10

LANGUAGE: APIDOC
CODE:
```
getAttribute(name: string): string | null
  - Returns the value of a specified attribute.
  - Parameters:
    - name: The name of the attribute to retrieve.
  - Returns: The attribute's value, or null if it doesn't exist.

setAttribute(name: string, value: string): void
  - Sets the value of a specified attribute.
  - Parameters:
    - name: The name of the attribute to set.
    - value: The value to assign to the attribute.

removeAttribute(name: string): void
  - Removes a specified attribute.
  - Parameters:
    - name: The name of the attribute to remove.

hasAttribute(name: string): boolean
  - Checks if an element has a specified attribute.
  - Parameters:
    - name: The name of the attribute to check.
  - Returns: True if the attribute exists, false otherwise.

hasAttributes(): boolean
  - Checks if an element has any attributes.
  - Returns: True if the element has attributes, false otherwise.

getAttributeNames(): string[]
  - Returns an array of all attribute names on the element.
  - Returns: An array of strings representing attribute names.

getAttributeNode(name: string): Attr | null
  - Returns the attribute node with the specified name.
  - Parameters:
    - name: The name of the attribute node to retrieve.
  - Returns: The Attr node, or null if not found.

setAttributeNode(newAttr: Attr): Attr | null
  - Adds or replaces an attribute node.
  - Parameters:
    - newAttr: The Attr node to add or replace.
  - Returns: The old attribute node if replaced, otherwise null.

removeAttributeNode(oldAttr: Attr): Attr | null
  - Removes an attribute node.
  - Parameters:
    - oldAttr: The Attr node to remove.
  - Returns: The removed Attr node, or null if not found.
```

----------------------------------------

TITLE: SecureStorage API Reference
DESCRIPTION: Provides methods for interacting with the Secure Storage API, enabling secure storage of key-value pairs. This includes operations for setting, getting, and deleting data.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Key-Value Storage/SecureStorage.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
SecureStorage:
  set(key: string, value: string): Promise<void>
    Stores a string value associated with a given key.
    Parameters:
      key: The identifier for the data.
      value: The string data to store.
    Returns: A Promise that resolves when the data is successfully stored.

  get(key: string): Promise<string | null>
    Retrieves the string value associated with a given key.
    Parameters:
      key: The identifier for the data.
    Returns: A Promise that resolves with the stored string value, or null if the key is not found.

  delete(key: string): Promise<void>
    Removes the data associated with a given key.
    Parameters:
      key: The identifier for the data.
    Returns: A Promise that resolves when the data is successfully removed.
```

----------------------------------------

TITLE: CSS :hover Pseudo-class Example
DESCRIPTION: Demonstrates how to use the :hover pseudo-class in CSS to apply styles when an element is under the mouse cursor. This is useful for interactive UI elements.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Pseudo-classes/hover.md#_snippet_0

LANGUAGE: css
CODE:
```
.well:hover {
    background-color: red;
}
```

----------------------------------------

TITLE: Retrieving HTTP status code
DESCRIPTION: Shows how to get the HTTP status code of a server response using the status property of an XMLHttpRequest object.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/Data Transfers/XMLHttpRequest.md#_snippet_6

LANGUAGE: javascript
CODE:
```
const xhr = new XMLHttpRequest();
xhr.onload = () => {
    console.log(xhr.status);
};
xhr.open("GET", "https://www.adobe.com");
xhr.send();
```

----------------------------------------

TITLE: Folder Operations
DESCRIPTION: Provides methods for interacting with folders, including getting their entries, creating new entries (files or folders), and checking if an instance is a folder.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_25

LANGUAGE: javascript
CODE:
```
const fs = require('uxp').storage.localFileSystem;

// Get entries within a folder
const entries = await aFolder.getEntries();
const allFiles = entries.filter(entry => entry.isFile);

// Create a new file
const myNovel = await aFolder.createEntry("mynovel.txt");

// Create a new folder
const catImageCollection = await aFolder.createEntry("cats", {type: types.folder});

// Check if an instance is a folder
let isFolderInstance = aFolder.isFolder;
```

----------------------------------------

TITLE: Handling Change Events in sp-radio-group
DESCRIPTION: Provides an example of how to listen for and respond to the 'change' event emitted by the sp-radio-group component to capture the selected value.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-radio-group.md#_snippet_2

LANGUAGE: js
CODE:
```
document.querySelector(".yourRadioGroup").addEventListener("change", evt => {
    console.log(`Selected item: ${evt.target.value}`);
})
```

----------------------------------------

TITLE: Import UxpPanelInfo Module
DESCRIPTION: Imports the UxpPanelInfo module from the uxp-documentation library, typically used for accessing information about UXP panels.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Entry Points/UxpPanelInfo.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/UxpPanelInfo";
```

----------------------------------------

TITLE: min-height CSS Property Example
DESCRIPTION: Demonstrates how to set the minimum height for an element using the CSS 'min-height' property. This property ensures an element does not become shorter than a specified value.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/min-height.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    min-height: 100vh;
}
```

----------------------------------------

TITLE: Spectrum UXP Correlate for h5
DESCRIPTION: Shows how to achieve a similar rendering to h5 using the Spectrum UXP sp-heading component.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-html/Hierarchy/h5.md#_snippet_1

LANGUAGE: html
CODE:
```
<sp-heading size="XXS">Hello, World</sp-heading>
```

----------------------------------------

TITLE: UxpPluginInfo API Reference
DESCRIPTION: Provides access to various properties and methods of the UxpPluginInfo object for UXP plugins.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/UxpPluginInfo.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
UxpPluginInfo:
  id ⇒ String
    Get plugin id
    Returns: String

  version ⇒ String
    Get plugin version
    Returns: String

  name ⇒ String
    Get plugin name
    Returns: String

  manifest ⇒ JSON
    Get plugin manifest
    Returns: JSON

  isFirstParty() ⇒ Boolean
    Check if the plugin is First Party Plugin
    Returns: Boolean
```

----------------------------------------

TITLE: CSS Type Selector Example for sp-action-button
DESCRIPTION: Demonstrates how to apply styles to the 'sp-action-button' component using a CSS type selector. This is useful for customizing the appearance of standard UXP components.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Selectors/Type selector.md#_snippet_0

LANGUAGE: css
CODE:
```
sp-action-button {
    margin-right: 0;
}
```

----------------------------------------

TITLE: Query UXP Content for Photoshop
DESCRIPTION: A content query to retrieve UXP API reference information specifically for Adobe Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Plugin Manager/Script.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: CSS :nth-last-of-type Example
DESCRIPTION: Demonstrates selecting even children of a specific type from the end of their parent's children. This is useful for styling alternating rows or elements.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Pseudo-classes/nth-last-of-type.md#_snippet_0

LANGUAGE: css
CODE:
```
.row:nth-last-of-type(even) {
    background-color: #E8E8E8;
}
```

----------------------------------------

TITLE: Rendering UXP Documentation Content for Photoshop
DESCRIPTION: Renders the imported Content component, specifying 'photoshop' as the product query parameter to load relevant documentation.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Pseudo-classes/first-child.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Import and Use nth-last-child Pseudo-class
DESCRIPTION: Demonstrates how to import and use the :nth-last-child pseudo-class component from the UXP documentation library. The example shows applying it with a specific product query.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Pseudo-classes/nth-last-child.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Pseudo-classes/nth-last-child";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Accessing Shell Module with Product Query
DESCRIPTION: Demonstrates how to import and use the Shell module to query product information. This is useful for understanding the environment in which the UXP plugin is running.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/shell/Shell.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/shell/Shell";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Render UXP Content Component
DESCRIPTION: Renders UXP content with a specified product query. This component is used to display documentation related to specific UXP products.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/Hierarchy/hr.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/Hierarchy/hr";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Query UXP Content for Photoshop
DESCRIPTION: A content query to retrieve UXP API reference information specifically for Adobe Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Plugin Manager/Script.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Importing and Using Overflow-X Component
DESCRIPTION: Demonstrates how to import and use the overflow-x component from the uxp-documentation library, passing a query parameter for product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/overflow-x.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/overflow-x";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP nth-child Pseudo-class Example
DESCRIPTION: Demonstrates how to use the :nth-child pseudo-class in UXP CSS for Photoshop. This pseudo-class selects elements based on their position among siblings.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Pseudo-classes/nth-child.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Pseudo-classes/nth-child";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Query Product Information for Spectrum Widgets
DESCRIPTION: Demonstrates how to query product information, such as 'product=xd', to configure or filter Spectrum UXP Widgets. This allows for targeted integration with specific Adobe products.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-slider.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Get XMPFileInfo Object
DESCRIPTION: Retrieves the XMPFileInfo object, which provides basic information about the file itself, such as its path and format. This method is helpful for verifying file details before or after metadata operations.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/XMP/XMP Classes/XMPFile.md#_snippet_3

LANGUAGE: javascript
CODE:
```
// Import the XMPFile class
const { XMPFile } = require("uxp").xmp;

// Create a new XMPFile object
const xmpFile = new XMPFile("sample.psd", XMPConst.FILE_PHOTOSHOP, XMPConst.OPEN_FOR_UPDATE);

// Get XMPFileInfo object
const xmpFileInfo = xmpFile.getFileInfo();
console.log(xmpFileInfo.filePath);
console.log(xmpFileInfo.format);
```

----------------------------------------

TITLE: DOMTokenList Usage in Photoshop
DESCRIPTION: Demonstrates how to use the DOMTokenList object within the UXP framework for Photoshop. This example shows how to query and interact with DOM elements.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML DOM/DOMTokenList.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML DOM/DOMTokenList";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: CSS left property example
DESCRIPTION: Demonstrates how to set the 'left' CSS property for an absolutely positioned element. This property is used to specify the left edge of an element's box.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/left.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    left: 0;
    position: absolute;
}
```

----------------------------------------

TITLE: UXP Key-Value Storage Component
DESCRIPTION: Imports and renders the Key-Value Storage documentation component for UXP plugins. It allows querying specific product documentation.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Key-Value Storage/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Key-Value Storage/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: CSS margin-right Example
DESCRIPTION: Demonstrates how to set the right margin for an element using the CSS 'margin-right' property. This property specifies the right margin for an element and is based on the CSS specification.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/margin-right.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    margin-right: 1em;
}
```

----------------------------------------

TITLE: Query Content with Product Parameter
DESCRIPTION: Demonstrates how to use the imported Content component to query content, specifically filtering by the 'product' parameter set to 'xd'. This is a common pattern for retrieving product-specific data or configurations.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Streams/CountQueuingStrategy.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Render Content with Query Parameter
DESCRIPTION: Renders the imported Content component with a specific query parameter for 'product=xd'. This is likely used to display documentation related to Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/Hierarchy/footer.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: File Instance Creation and Check
DESCRIPTION: Demonstrates how to obtain a File instance using createEntryWithUrl and check if it's a file.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/File.md#_snippet_0

LANGUAGE: js
CODE:
```
const fs = require('uxp').storage.localFileSystem;
const file = await fs.createEntryWithUrl("file:/Users/user/Documents/tmp"); // Gets a File instance
console.log(file.isFile); // returns true
```

----------------------------------------

TITLE: UXP Clipboard Data Transfer
DESCRIPTION: Demonstrates how to use the UXP clipboard API for data transfer within Adobe applications. This example shows how to interact with the clipboard, potentially for copying or pasting content.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Data Transfers/Clipboard.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Data Transfers/Clipboard";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP CSS :hover Pseudo-class Usage
DESCRIPTION: Demonstrates how to use the :hover pseudo-class in UXP CSS to apply styles when an element is hovered over. This example specifically targets the 'xd' product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Pseudo-classes/hover.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Pseudo-classes/hover";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Get Metadata
DESCRIPTION: Retrieves the metadata for a file system entry. The metadata includes information such as size, creation date, modification date, and name. Returns a Promise<EntryMetadata>.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_7

LANGUAGE: javascript
CODE:
```
const metadata = aFile.getMetadata();
```

----------------------------------------

TITLE: Get Temporary Folder - JavaScript
DESCRIPTION: Returns a temporary folder whose contents are removed when the extension is disposed. Returns a Promise that resolves to a Folder object.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/FileSystemProvider.md#_snippet_2

LANGUAGE: javascript
CODE:
```
const temp = await fs.getTemporaryFolder();
```

----------------------------------------

TITLE: Get XMPMeta Object
DESCRIPTION: Retrieves the XMPMeta object from an opened XMPFile. This object represents the XMP metadata embedded within the file, allowing for further manipulation or inspection of the metadata.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/XMP/XMP Classes/XMPFile.md#_snippet_1

LANGUAGE: javascript
CODE:
```
// Import the XMPFile class
const { XMPFile } = require("uxp").xmp;

// Create a new XMPFile object
const xmpFile = new XMPFile("sample.psd", XMPConst.FILE_PHOTOSHOP, XMPConst.OPEN_FOR_UPDATE);

// Get the XMPMeta object
const xmpMeta = xmpFile.getXMP();
```

----------------------------------------

TITLE: Folder.getEntries() - Get Folder Contents
DESCRIPTION: Retrieves all entries (files and subfolders) contained within a folder. Returns a Promise that resolves to an array of Entry objects.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/Folder.md#_snippet_1

LANGUAGE: javascript
CODE:
```
const entries = await aFolder.getEntries();
const allFiles = entries.filter(entry => entry.isFile);
```

----------------------------------------

TITLE: Get Computed Style of an Element
DESCRIPTION: Retrieves the computed CSS properties for a given element, including pseudo-elements. The returned object is live and updates automatically.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML DOM/getComputedStyle.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
window.getComputedStyle:
  Description: Returns an object containing the values of all CSS properties of an element, after applying active stylesheets and resolving any basic computation those values may contain.
  Returns: CSSStyleDeclaration - A live CSSStyleDeclaration object, which updates automatically when the element's styles are changed.
  Parameters:
    element: Element - The Element for which to get the computed style.
    pseudoState: string - A string specifying the pseudo-element to match. Omitted (or null) for real elements.
  See: https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
```

----------------------------------------

TITLE: UXP General API Reference (XD)
DESCRIPTION: This snippet references the general UXP API documentation, specifically for Adobe XD. It allows querying for product-specific information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/General/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html//General/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Render UXP Content for Photoshop
DESCRIPTION: Renders UXP content specifically for Photoshop, using a query parameter to specify the product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/Hierarchy/h2.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/Hierarchy/h2";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Import and Use Spectrum Progress Bar
DESCRIPTION: Demonstrates how to import the `sp-progressbar` component from the `uxp-documentation` library and use it with a specific product query. This is useful for integrating progress indicators into UXP applications.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-progressbar.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-progressbar";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP CSS White-Space Example
DESCRIPTION: Demonstrates how to apply CSS white-space properties in UXP using a React-like component structure. The 'Content' component likely renders UI elements with specific styling applied.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/white-space.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/white-space";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Content Component with Query Parameter
DESCRIPTION: Renders a Content component with a query parameter specifying the product as Photoshop. This is likely used for displaying product-specific documentation or UI elements.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Streams/TransformStreamDefaultController.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: CSS :enabled Pseudo-class Example
DESCRIPTION: Demonstrates how to use the :enabled pseudo-class in CSS to style enabled input elements. This selector targets elements that are currently active and ready to receive user input.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Pseudo-classes/enabled.md#_snippet_0

LANGUAGE: css
CODE:
```
input:enabled {
    border: 1px solid blue;
}
```

----------------------------------------

TITLE: UXP CSS :nth-of-type() Usage
DESCRIPTION: Demonstrates how to use the :nth-of-type() pseudo-class in UXP CSS to select elements. This example selects the second paragraph element among its siblings.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Pseudo-classes/nth-of-type.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Pseudo-classes/nth-of-type";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Spectrum UXP Widgets - User Interface Components
DESCRIPTION: This snippet demonstrates how to import and use User Interface components from the Spectrum UXP Widgets library. It allows querying for specific product integrations.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Apply Border Width in UXP
DESCRIPTION: Demonstrates how to apply CSS border-width properties to elements in Adobe UXP using the provided Content component. This example targets the 'xd' product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/border-width.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/border-width";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Import UxpPluginInfo Module
DESCRIPTION: Imports the UxpPluginInfo module from the uxp-documentation library, which is used to access plugin information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Entry Points/UxpPluginInfo.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/UxpPluginInfo";
```

----------------------------------------

TITLE: HTMLMediaElement Playback Controls
DESCRIPTION: Controls for media playback including starting, pausing, and seeking. These methods emit various events upon completion or state change.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLVideoElement.md#_snippet_7

LANGUAGE: APIDOC
CODE:
```
play()
  Attempts to begin playback of the media.
  Returns: Promise<void> Resolved when playback has been started, or rejected if playback cannot be started.
  Emits: event:play, event:uxpvideoplay - Deprecated: Use play instead, event:ended, event:uxpvideocomplete - Deprecated: Use ended instead

pause()
  Pause the playback of the media. If the media is already in a paused state, no effect.
  Emits: event:pause, event:uxpvideopause - Deprecated: Use pause instead

fastSeek(time: number)
  Seeks the media to the new time quickly with precision tradeoff.
  See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/fastSeek
  Since: v7.4.0
  Emits: event:seeked

stop()
  Pause the playback of the media and set the current playback time to the beginning.
  Emits: event:uxpvideostop, event:seeked
```

LANGUAGE: js
CODE:
```
let vid = document.getElementById("sampleVideo");
vid.play();
vid.addEventListener("play", (ev) => {
    console.log("Event - play");
});
```

LANGUAGE: js
CODE:
```
let vid = document.getElementById("sampleVideo");
vid.play();
vid.pause();
vid.addEventListener("pause", (ev) => {
    console.log("Event - pause");
});
```

LANGUAGE: js
CODE:
```
let vid = document.getElementById("sampleVideo");
vid.play();
vid.fastSeek(10);
vid.addEventListener("seeked", (ev) => {
    console.log("Event - seeked");
});
```

LANGUAGE: js
CODE:
```
let vid = document.getElementById("sampleVideo");
vid.play();
vid.stop();
vid.addEventListener("uxpvideostop", (ev) => {
    console.log("Event - uxpvideostop");
});
vid.addEventListener("seeked", (ev) => {
    console.log("Event - seeked");
});
```

----------------------------------------

TITLE: CSS Media Height Query Example
DESCRIPTION: Demonstrates how to use the @media height media query to apply CSS styles only when the plugin's dialog or panel height is less than or equal to 700 pixels. This is useful for responsive design within UXP plugins.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Media Queries/height.md#_snippet_0

LANGUAGE: css
CODE:
```
@media (max-height: 700px) {
    .someElement {
        background-color: red;
    }
}
```

----------------------------------------

TITLE: Rendering Content Component
DESCRIPTION: Renders the 'Content' component with a specific query parameter for the product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Pseudo-classes/empty.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Create and Display Image from UXP Data
DESCRIPTION: This snippet demonstrates how to get image data from a UXP object, create an ImageBlob, generate a URL for it, display it in an HTMLImageElement, and revoke the URL when no longer needed.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/ImageBlob/ImageBlob.md#_snippet_2

LANGUAGE: javascript
CODE:
```
let colorArrayView = await photoshopImageObject.getData();

let imageBlob = new ImageBlob(colorArrayView, photoshopImageObject);
// Generate url which can be used as src on HTMLImageElement
const url = URL.createObjectURL(imageBlob);
// ensure that there is a HTMLImageElement in the Document with id `image`.
const imageElement = document.getElementById("image");
imageElement.src = url;

// revoke(destroy image from the memory) when url is no more required.
URL.revokeObjectURL(url);
```

----------------------------------------

TITLE: UXP CSS :focus Pseudo-class Example
DESCRIPTION: Demonstrates the usage of the :focus pseudo-class in UXP CSS to style an element when it gains focus. This is commonly used for accessibility and user feedback during navigation.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Pseudo-classes/focus.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Pseudo-classes/focus";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP CSS Child Combinator Example (Photoshop)
DESCRIPTION: Demonstrates the usage of the CSS child combinator (>) to select direct children of an element within Adobe UXP for Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Selectors/Child combinator.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Selectors/Child combinator";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP CSS :nth-of-type() Usage
DESCRIPTION: Demonstrates how to use the :nth-of-type() pseudo-class in UXP CSS to select elements. This example targets every second `button` element within a container.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Pseudo-classes/nth-of-type.md#_snippet_0

LANGUAGE: css
CODE:
```
/* Selects every second button element */
button:nth-of-type(2n) {
  background-color: lightblue;
}
```

----------------------------------------

TITLE: Accessing Persistent File Storage in UXP
DESCRIPTION: Demonstrates how to import and use the `File` module from the UXP JavaScript API to access persistent file storage. It shows a practical example of querying file content for a specific product, such as Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Persistent File Storage/File.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/File";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Content Component for Photoshop
DESCRIPTION: Demonstrates the usage of the Content component with a query parameter for Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML DOM/ResizeObserver.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Spectrum UXP Radio Group Component
DESCRIPTION: Demonstrates the usage of the 'sp-radio-group' component from the Spectrum UXP Widgets library. This component is used for creating radio button groups in user interfaces. The example shows how to import and use the Content component with a query parameter for product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-radio-group.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-radio-group";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: AbortController Usage in UXP (Photoshop)
DESCRIPTION: Demonstrates how to use the AbortController to manage asynchronous operations within UXP, specifically when interacting with Photoshop. This example shows how to create an AbortController instance and pass its signal to an operation that can be aborted.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML DOM/AbortController.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML DOM/AbortController";

// Example usage within a UXP plugin for Photoshop
const controller = new AbortController();
const signal = controller.signal;

// Assume 'someAsyncOperation' accepts an 'AbortSignal'
someAsyncOperation(signal);

// To abort the operation:
// controller.abort();
```

----------------------------------------

TITLE: Accessing UXP Plugin Versions
DESCRIPTION: Demonstrates how to import and use the Versions module from the uxp-documentation library to query plugin version information, specifically for Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Versions/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Versions/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Clipboard API Reference
DESCRIPTION: Provides a comprehensive reference for the navigator.clipboard API in UXP, including methods for managing clipboard content. This includes setting, getting, writing, reading text and data, and clearing the clipboard. Notes on non-standard methods and version requirements are also included.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/Data Transfers/Clipboard.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
navigator.clipboard:
  Clipboard()
    Creates an instance of Clipboard.
    Note: Clipboard access is not supported for 3P plugins with manifest version upto 4. Valid manifest entry required from manifest version 5.

  setContent(data)
    Set data to clipboard.
    Note: This is a non-standard API.
    Returns: Promise
    Parameters:
      data (object): The data to store in the clipboard. The object keys are the mime types, so for text, use 'text/plain' as a key.
    Example:
      navigator.clipboard.setContent({"text/plain": "Hello!"});

  getContent()
    Get data from clipboard.
    Note: This is a non-standard API.
    Returns: Promise
    Example:
      navigator.clipboard.getContent();

  write(data)
    Write data to clipboard. This can be used to implement cut and copy functionality.
    Returns: Promise
    See: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write
    Since: v6.0
    Parameters:
      data (object): The data to set.
    Example:
      navigator.clipboard.write({"text/plain": "Hello!"});

  writeText(text)
    Write text to clipboard. This can be used to implement cut and copy text functionality.
    Returns: Promise
    See: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
    Since: v6.0
    Parameters:
      text (string | object): text string to set or an object of the form {"text/plain": "text to set"}. Note that the object format will be deprecated and shouldn't be used.
    Example:
      navigator.clipboard.writeText("Hello!");

  read()
    Read data from clipboard.
    Returns: Promise
    See: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/read
    Since: v6.0
    Example:
      navigator.clipboard.read();

  readText()
    Read text from clipboard.
    Returns: Promise
    See: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/readText
    Since: v6.0
    Example:
      navigator.clipboard.readText();

  clearContent()
    Clear clipboard content.
    Note: Nonstandard: This method is non-standard.
    Returns: Promise
    Since: v6.0
    Example:
      navigator.clipboard.clearContent();
```

----------------------------------------

TITLE: Spectrum UXP Textarea Widget
DESCRIPTION: Demonstrates the usage of the sp-textarea component from the Spectrum UXP Widgets library. This component is used for text input fields within UXP plugins. The example shows how to query for product-specific configurations, likely for Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-textarea.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-textarea";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Get Entry with URL - JavaScript
DESCRIPTION: Retrieves a file or folder entry for a given URL. Returns a Promise that resolves to a File or Folder object. Throws errors for invalid URLs or if the entry does not exist.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/FileSystemProvider.md#_snippet_6

LANGUAGE: javascript
CODE:
```
const tmpFolder = await fs.getEntryWithUrl("plugin-temp:/tmp");
const docFolder = await fs.getEntryWithUrl("file:/Users/user/Documents");
```

LANGUAGE: javascript
CODE:
```
const tmpFile = await fs.getEntryWithUrl("plugin-temp:/tmp/test.dat");
const docFile = await fs.getEntryWithUrl("file:/Users/user/Documents/test.txt");
```

----------------------------------------

TITLE: UXP Headers API Documentation
DESCRIPTION: This section provides comprehensive documentation for the UXP Headers class, detailing its constructor and methods for managing HTTP headers. It includes parameter types, descriptions, return values, and links to MDN documentation.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/Data Transfers/Headers.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
Headers:
  Represents HTTP request and response headers.
  Since: v7.3.0

  Constructor([init]):
    Initializes a new Headers object.
    Parameters:
      - init: Headers | Array<{string, string}> | Object - An existing Headers object, an array of name-value pairs, or an object literal with string values.

  append(name, value):
    Appends a new value onto an existing header or adds the header if it does not exist.
    Parameters:
      - name: string - Name of the HTTP header.
      - value: string - Value of the HTTP header.
    See: https://developer.mozilla.org/en-US/docs/Web/API/Headers/append

  delete(name):
    Deletes a header from the Headers object.
    Parameters:
      - name: string - Name of the HTTP header.
    See: https://developer.mozilla.org/en-US/docs/Web/API/Headers/delete

  get(name):
    Returns a byte string of all values of a header with the given name. Returns null if the header does not exist.
    Returns: string - Value of the retrieved header.
    Parameters:
      - name: string - Name of the HTTP header.
    See: https://developer.mozilla.org/en-US/docs/Web/API/Headers/get

  has(name):
    Indicates whether the Headers object contains a header with the given name.
    Returns: boolean - Indicates whether the Headers object contains the input name.
    Parameters:
      - name: string - Name of the HTTP header.
    See: https://developer.mozilla.org/en-US/docs/Web/API/Headers/has

  set(name, value):
    Sets a new value for an existing header or adds the header if it does not exist.
    Parameters:
      - name: string - Name of the HTTP header.
      - value: string - Value of the HTTP header.
    See: https://developer.mozilla.org/en-US/docs/Web/API/Headers/set

  forEach(callbackFn, thisArg):
    Executes a callback function once per each key/value pair in the Headers object.
    Parameters:
      - callbackFn: function - Function to execute for each entry. It takes the following arguments: value, key, this.
      - thisArg: Object - Value to use as this when executing callback.
    See: https://developer.mozilla.org/en-US/docs/Web/API/Headers/forEach

  keys():
    Returns an iterator object allowing to go through all keys contained in the Headers object.
    Returns: iterator - Iterator.
    See: https://developer.mozilla.org/en-US/docs/Web/API/Headers/keys

  values():
    Returns an iterator object allowing to go through all values contained in the Headers object.
    Returns: iterator - Iterator.
    See: https://developer.mozilla.org/en-US/docs/Web/API/Headers/values

  entries():
    Returns an iterator object allowing to go through all key/value pairs contained in the Headers object.
    Returns: iterator - Iterator.
    See: https://developer.mozilla.org/en-US/docs/Web/API/Headers/entries
```

----------------------------------------

TITLE: UXP CSS Border Radius for Photoshop
DESCRIPTION: Demonstrates how to apply border-radius styles to elements in UXP for Photoshop. This example uses a Content component to query for Photoshop-specific styles.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/border-radius.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/border-radius";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Using UXP Content Component
DESCRIPTION: Renders the Content component with a query parameter to specify the product context, in this case, Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/font-weight.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: CSS Child Combinator Example
DESCRIPTION: Demonstrates how to use the CSS child combinator to select direct children of an element. This is useful for applying styles specifically to immediate child elements.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Selectors/Child combinator.md#_snippet_0

LANGUAGE: css
CODE:
```
footer > sp-button {
    margin: 12px;
}
```

----------------------------------------

TITLE: Render UXP Content for Photoshop
DESCRIPTION: Renders UXP content, likely a panel or component, specifically configured for Adobe Photoshop using a query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Entry Points/UxpPanelInfo.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: CSS :nth-child(even) Example
DESCRIPTION: Demonstrates how to use the :nth-child pseudo-class with the 'even' keyword to apply a background color to even-numbered child elements, enhancing readability of tabular data or lists.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Pseudo-classes/nth-child.md#_snippet_0

LANGUAGE: css
CODE:
```
.row:nth-child(even) {
    background-color: #E8E8E8; /* color even rows */
}
```

----------------------------------------

TITLE: Rendering UXP Content with Query
DESCRIPTION: Renders the imported Content component with a specific query parameter for 'product=xd'. This is likely used to fetch or display UXP-related content for Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/padding.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP Spectrum Component Usage (Photoshop)
DESCRIPTION: Demonstrates how to use a UXP Spectrum component with a specific product query, in this case, Photoshop. This snippet highlights the integration of UXP components within a documentation context.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/swc/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/swc/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: sp-tooltip Location Attribute Behavior
DESCRIPTION: The 'location' attribute for sp-tooltip controls the direction of the tooltip's tip, not its position relative to the attachment. For example, 'bottom' points the tip upwards.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/known-issues.md#_snippet_17

LANGUAGE: html
CODE:
```
<sp-tooltip location="bottom">
  Tooltip content
</sp-tooltip>
```

----------------------------------------

TITLE: CSS flex-wrap Example
DESCRIPTION: Demonstrates the usage of the flex-wrap CSS property to enable wrapping within a flexible container. This property controls whether flex items are forced onto one line or can wrap onto multiple lines.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/flex-wrap.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    flex-wrap: wrap;
}
```

----------------------------------------

TITLE: UXP Persistent File Storage Content Module
DESCRIPTION: Imports the Content module for UXP Persistent File Storage, allowing interaction with files based on product queries.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Persistent File Storage/domains.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/domains";
```

----------------------------------------

TITLE: XMPMeta Constructor and Struct-Based API Usage
DESCRIPTION: Illustrates creating an XMPMeta object and using struct-based APIs to set, get, and delete XMP date properties and struct fields. It includes checking for the existence of struct fields.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/XMP/XMP Classes/XMPMeta.md#_snippet_2

LANGUAGE: javascript
CODE:
```
let { XMPDateTime, XMPMeta, XMPConst } = require("uxp").xmp;
let meta = new XMPMeta();

let jsDate = new Date("2007-04-10T17:54:50+01:00");
let xmpDate = new XMPDateTime(jsDate);
meta.setProperty(XMPConst.NS_XMP, "CreateDate", xmpDate, XMPConst.XMPDATE);
meta.doesPropertyExist(XMPConst.NS_XMP, "CreateDate");
let prop = meta.getProperty(XMPConst.NS_XMP, "CreateDate", XMPConst.XMPDATE);
meta.deleteProperty(XMPConst.NS_XMP, "CreateDate");

meta.setStructField(XMPConst.NS_XML, "structNameSample", XMPConst.NS_XMP, "sampleFieldName", "sampleFieldValue");
if (meta.doesStructFieldExist(XMPConst.NS_XML, "structNameSample", XMPConst.NS_XMP, "sampleFieldName")) {
     prop = meta.getStructField(XMPConst.NS_XML, "structNameSample", XMPConst.NS_XMP, "sampleFieldName");
     meta.deleteStructField(XMPConst.NS_XML, "structNameSample", XMPConst.NS_XMP, "sampleFieldName");
     if (meta.doesStructFieldExist(XMPConst.NS_XML, "structNameSample", XMPConst.NS_XMP, "sampleFieldName")) {
        console.log("Struct field exists");
    } else {
       console.log("Struct field doesn't exist");
   }
} else {
 console.log("Struct field doesn't exist");
}
```

----------------------------------------

TITLE: UXP Media Query Usage with Product Query
DESCRIPTION: Demonstrates how to import and use a UXP documentation component for CSS Media Queries, specifically filtering by product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Media Queries/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css//Media Queries/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP CSS :only-child Pseudo-class Usage
DESCRIPTION: Demonstrates how to use the :only-child pseudo-class in UXP CSS to select an element that is the only child of its parent. This example specifically targets Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Pseudo-classes/only-child.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Pseudo-classes/only-child";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Import and Use UXP Spectrum Content
DESCRIPTION: Imports the UXP Spectrum content component and renders it with a specific product query. This is useful for displaying documentation relevant to a particular product like Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/swc/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/swc/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Get Folder via Picker - JavaScript
DESCRIPTION: Retrieves a folder from the file system using a folder picker dialog. Returns a Promise that resolves to a Folder object or null if the user dismisses the picker. Supports specifying an initial domain for the picker.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/FileSystemProvider.md#_snippet_1

LANGUAGE: javascript
CODE:
```
const folder = await fs.getFolder();
const myNovel = (await folder.getEntries()).filter(entry => entry.name.indexOf('novel') > 0);
const text = await myNovel.read();
```

----------------------------------------

TITLE: FileSystemProvider Usage in Photoshop
DESCRIPTION: Demonstrates how to use the FileSystemProvider to interact with persistent file storage, specifically queried for Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Persistent File Storage/FileSystemProvider.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/FileSystemProvider";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Element Attribute Manipulation API
DESCRIPTION: Provides methods for getting, setting, and removing attributes from DOM elements. Includes functions like getAttribute, setAttribute, removeAttribute, hasAttribute, and getAttributeNames.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLScriptElement.md#_snippet_16

LANGUAGE: APIDOC
CODE:
```
Element API - Attribute Manipulation:

getAttribute(name)
  - Returns the value of a specified attribute on an element.
  - Parameters:
    - name (string): The name of the attribute to retrieve.
  - Returns: string
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute

setAttribute(name, value)
  - Sets or changes the value of a specified attribute on an element.
  - Parameters:
    - name (string): The name of the attribute to set.
    - value (string): The value to assign to the attribute.
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute

removeAttribute(name)
  - Removes a specified attribute from an element.
  - Parameters:
    - name (string): The name of the attribute to remove.
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute

hasAttribute(name)
  - Checks if an element has a specified attribute.
  - Parameters:
    - name (string): The name of the attribute to check for.
  - Returns: boolean
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute

getAttributeNames()
  - Returns an array of all attribute names present on the element.
  - Returns: Array
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNames

getAttributeNode(name)
  - Returns the attribute node with the specified name.
  - Parameters:
    - name (string): The name of the attribute node to retrieve.
  - Returns: *
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNode

setAttributeNode(newAttr)
  - Adds or replaces an attribute node in the element.
  - Parameters:
    - newAttr (*): The Attr node to add or replace.
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttributeNode

removeAttributeNode(oldAttr)
  - Removes an attribute node from the element.
  - Parameters:
    - oldAttr (*): The Attr node to remove.
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttributeNode
```

----------------------------------------

TITLE: UXP CSS overflow-y Property
DESCRIPTION: Demonstrates the application of the overflow-y CSS property in UXP, controlling content overflow along the vertical axis. This example specifically targets Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/overflow-y.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/overflow-y";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Element Attribute Manipulation
DESCRIPTION: Methods for managing attributes on an element, including getting, setting, removing, and checking for the existence of attributes. These are fundamental for dynamic HTML manipulation.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLTextAreaElement.md#_snippet_8

LANGUAGE: APIDOC
CODE:
```
getAttribute(name)
  Returns: string
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute
  Parameters:
    name (string): Name of the attribute whose value you want to get.

setAttribute(name, value)
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute
  Parameters:
    name (string): Name of the attribute whose value is to be set
    value (string): Value to assign to the attribute

removeAttribute(name)
  Parameters:
    name (string): 

hasAttribute(name)
  Returns: boolean
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute
  Parameters:
    name (string): 

hasAttributes()
  Returns a boolean value indicating whether the current element has any attributes or not.
  Returns: boolean
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttributes

getAttributeNames()
  Returns the attribute names of the element as an Array of strings
  Returns: Array
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNames

getAttributeNode(name)
  Returns: *
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNode
  Parameters:
    name (string): 

setAttributeNode(newAttr)
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttributeNode
  Parameters:
    newAttr (*): 

removeAttributeNode(oldAttr)
  Parameters:
    oldAttr (*): 

```

----------------------------------------

TITLE: UXP Shell API Documentation
DESCRIPTION: Provides an interface to open files, folders, and URLs using the system's default applications. Requires UXP Manifest v5.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/shell/Shell.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
UXPShell:
  __init__()
    Returns: An instance of the shell module.

  openPath(path: string, developerText: string)
    Opens the given file or folder path in the system default application.
    NOTE: UWP can access only files in the UWP App sandbox.
    Parameters:
      path: String representing the path to open.
      developerText: Information from the plugin developer to be displayed on the user consent dialog. Message should be localized in current host UI locale.
    Returns: Promise<string> - Promise that resolves with "" if succeeded or String containing the error message if failed.
    Example:
      // for MacOS
      shell.openPath("/Users/[username]/Downloads");
      shell.openPath("/Users/[username]/sample.txt");

      // for Windows
      shell.openPath("C:\\Users\\[username]\\Downloads");
      shell.openPath("C:\\Users\\[username]\\AppData\\Local\\...\\sample.txt");

  openExternal(url: string, developerText: string)
    Opens the url in the dedicated system applications for the scheme.
    NOTE: file scheme is not allowed for openExternal. Use openPath for those cases.
    Parameters:
      url: String representing the URL to open.
      developerText: Information from the plugin developer to be displayed on the user consent dialog. Message should be localized in current host UI locale.
    Returns: Promise<string> - Promise that resolves with "" if succeeded or String containing the error message if failed.
    Example:
      shell.openExternal("https://www.adobe.com/");
      shell.openExternal("https://www.adobe.com/", "develop message for the user consent dialog");
    Example:
      shell.openExternal("maps://?address=345+Park+Ave+San+Jose"); // for MacOS
      shell.openExternal("bingmaps://?q=345+Park+Ave+San+Jose, +95110"); // for Windows
```

----------------------------------------

TITLE: Get Folder from File System Picker
DESCRIPTION: Retrieves a folder from the file system using a picker dialog. Returns the selected folder or null if dismissed. Files within are read-write.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_17

LANGUAGE: APIDOC
CODE:
```
getFolder(options: {
  initialDomain?: Symbol
}): Promise<Folder | null>

Gets a folder from the file system via a folder picker dialog. The files and folders within can be accessed via Folder#getEntries(). Any files within are read-write.

If the user dismisses the picker, `null` is returned instead.

Parameters:
- options.initialDomain: The preferred initial location of the file picker. If not defined, the most recently used domain from a file picker is used instead.

Returns: Promise<Folder | null> - the selected folder or `null` if no folder is selected.

Example:
```js
const folder = await fs.getFolder();
const myNovel = (await fs.getEntries()).filter(entry => entry.name.indexOf('novel') > 0);
const text = await myNovel.read();
```
```

----------------------------------------

TITLE: Access UXP Plugin Information in Photoshop
DESCRIPTION: This snippet shows how to import and use the UxpPluginInfo module to get details about the currently running UXP plugin in Photoshop. It demonstrates accessing properties like plugin name, version, and author.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Entry Points/UxpPluginInfo.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/UxpPluginInfo";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Get Data Folder - JavaScript
DESCRIPTION: Returns a persistent folder for extension data storage, which is not affected by host-app version upgrades. Returns a Promise that resolves to a Folder object.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/FileSystemProvider.md#_snippet_3

LANGUAGE: javascript
CODE:
```
const dataFolder = await fs.getDataFolder();
```

----------------------------------------

TITLE: Spectrum UXP Widget Content Display
DESCRIPTION: Demonstrates how to import and render Spectrum UXP Widget content, specifically for a 'sp-link' component, with a query parameter targeting Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-link.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-link";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Responding to Slider Events
DESCRIPTION: Provides an example of how to listen for the 'input' event on a slider to capture changes in real-time. The event target's 'value' property holds the new slider value.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-slider.md#_snippet_5

LANGUAGE: js
CODE:
```
document.querySelector(".yourSlider").addEventListener("input", evt => {
    console.log(`New value: ${evt.target.value}`);
})
```

----------------------------------------

TITLE: UXP File System (fs) Module
DESCRIPTION: Provides access to the file system for UXP plugins. Allows reading, writing, and managing files and directories. Requires appropriate permissions.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/fs/index.md#_snippet_0

LANGUAGE: uxp
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/fs/fs.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP UxpMenuItem Module
DESCRIPTION: Imports the UxpMenuItem module from the uxp-documentation library, used for defining menu items within UXP applications.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Entry Points/UxpMenuItem.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/UxpMenuItem";
```

----------------------------------------

TITLE: Basic sp-slider Example
DESCRIPTION: Renders a basic slider with a label. The 'min', 'max', and 'value' attributes control the slider's range and current position. The 'slot="label"' associates the sp-label with the slider.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-slider.md#_snippet_0

LANGUAGE: html
CODE:
```
<sp-slider min="0" max="100" value="50">
    <sp-label slot="label">Slider Label</sp-label>
</sp-slider>
```

----------------------------------------

TITLE: window.localStorage API Documentation
DESCRIPTION: Provides a local key-value store for setting preferences and other data. This data is persistent but can be cleared, so it should not be used for sensitive information. Includes methods for length, key retrieval, get, set, remove, and clear operations.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/Data Storage/LocalStorage.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
window.localStorage:
  Provides a local key-value store.

  Properties:
    length: number
      Read only. Number of items stored in the local storage.

  Methods:
    key(index: number): string | null
      Returns the name of the nth key in the local storage.
      Parameters:
        index: Integer representing the number of the key
      Returns: Name of the key. If the index does not exist, null is returned.

    getItem(key: string): string | null
      Gets the value for the key from the local storage.
      Parameters:
        key: Key to retrieve the value of.
      Returns: Value corresponding to the key as string. If the key does not exist, null is returned.

    setItem(key: string, value: string): void
      Adds key and value to the local storage. Updates the value if the given key already exists.
      Throws: Error If it fails to store
      Parameters:
        key: Key to set value
        value: Value for the key

    removeItem(key: string): void
      Removes a key/value pair from the local storage if it exists. Nothing happens if there's no item associated with the given key.
      Parameters:
        key: Key to remove

    clear(): void
      Remove all key/value pairs from the local storage.
```

----------------------------------------

TITLE: CSS :nth-last-child Selector Usage
DESCRIPTION: Demonstrates how to use the :nth-last-child pseudo-class in CSS to select elements. This example styles even-numbered child elements when counting from the end of their parent's children.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Pseudo-classes/nth-last-child.md#_snippet_0

LANGUAGE: css
CODE:
```
.row:nth-last-child(even) {
    background-color: #E8E8E8; /* color even rows (from the end) */
}
```

----------------------------------------

TITLE: BaseUIEvent Methods
DESCRIPTION: Details the methods available on the BaseUIEvent object, including initEvent for initializing the event, composedPath to get the event's path, preventDefault to cancel the event's default action, stopImmediatePropagation to prevent further event propagation, and stopPropagation to stop event propagation.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Events/BaseUIEvent.md#_snippet_1

LANGUAGE: APIDOC
CODE:
```
window.BaseUIEvent:
  initEvent(typeArg, bubblesArg, cancelableArg)
    typeArg: string
    bubblesArg: boolean
    cancelableArg: boolean

  composedPath()
    Returns the event's path.
    See: https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath
    See: https://dom.spec.whatwg.org/#dom-event-composedpath

  preventDefault()

  stopImmediatePropagation()

  stopPropagation()
```

----------------------------------------

TITLE: Basic sp-label Usage
DESCRIPTION: Demonstrates the basic rendering of a text label using the sp-label component.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/Typography/sp-label.md#_snippet_0

LANGUAGE: html
CODE:
```
<sp-label>This is a label</sp-label>
```

----------------------------------------

TITLE: Query Content in UXP
DESCRIPTION: Demonstrates how to query content within UXP, likely for a specific product like Photoshop. This is used to retrieve or display relevant information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/width.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP CSS Styles Reference
DESCRIPTION: Imports and renders the CSS styles reference for UXP, allowing queries for specific product styles.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css//Styles/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: General Content Reference (Photoshop)
DESCRIPTION: This snippet demonstrates how to reference general content within UXP, specifically for Photoshop. It utilizes a Content component with a query parameter to specify the product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/General/head.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/General/head";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP FormData API
DESCRIPTION: The FormData API now supports delete(), get(), getAll(), has(), keys(), set(), and values() methods for managing form data. The append() method also supports Blob as an additional parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/changelog3P.md#_snippet_7

LANGUAGE: javascript
CODE:
```
// FormData methods
formData.delete(name);
formData.get(name);
formData.getAll(name);
formData.has(name);
formData.keys();
formData.set(name, value);
formData.values();

// FormData append with Blob
formData.append(name, blob, filename);
```

----------------------------------------

TITLE: UXP Script API
DESCRIPTION: This section details the UXP Script module's API, including properties like `args` and `executionContext`, and the `setResult` method for returning values to the host.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Plugin Manager/Script.md#_snippet_4

LANGUAGE: APIDOC
CODE:
```
Script Module:
  Provides access to script-related information and functionality.

  Properties:
    args: Array (Read only) - Arguments passed by the host app.
    executionContext: ExecutionContext (Read only) - Execution context from the host app.

  Methods:
    setResult(result: HostDefinition): void
      Sends the execution result back to the host.
      Parameters:
        result: HostDefinition - Defines the contract for return values.
```

----------------------------------------

TITLE: CSS max-width Property Example
DESCRIPTION: Demonstrates how to set the maximum width for an element using the CSS 'max-width' property. This is useful for responsive design to prevent elements from becoming too wide on larger screens.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Styles/max-width.md#_snippet_0

LANGUAGE: css
CODE:
```
.someElement {
    max-width: 300px;
}
```

----------------------------------------

TITLE: Query Product-Specific Content
DESCRIPTION: Demonstrates how to query for content specific to a product, such as Photoshop, using the UXP API. This allows developers to tailor their UXP plugins to different Adobe applications.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Events/KeyboardEvent.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Element Attribute Manipulation API
DESCRIPTION: Provides methods for getting, setting, and removing attributes from DOM elements. Includes functions like getAttribute, setAttribute, removeAttribute, hasAttribute, and getAttributeNames.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLElement.md#_snippet_3

LANGUAGE: APIDOC
CODE:
```
Element API - Attribute Manipulation:

getAttribute(name)
  - Returns the value of a specified attribute on an element.
  - Parameters:
    - name (string): The name of the attribute to retrieve.
  - Returns: string
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute

setAttribute(name, value)
  - Sets or changes the value of a specified attribute on an element.
  - Parameters:
    - name (string): The name of the attribute to set.
    - value (string): The value to assign to the attribute.
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute

removeAttribute(name)
  - Removes a specified attribute from an element.
  - Parameters:
    - name (string): The name of the attribute to remove.
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute

hasAttribute(name)
  - Checks if an element has a specified attribute.
  - Parameters:
    - name (string): The name of the attribute to check for.
  - Returns: boolean
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute

getAttributeNames()
  - Returns an array of all attribute names present on the element.
  - Returns: Array
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNames

getAttributeNode(name)
  - Returns the attribute node with the specified name.
  - Parameters:
    - name (string): The name of the attribute node to retrieve.
  - Returns: *
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNode

setAttributeNode(newAttr)
  - Adds or replaces an attribute node in the element.
  - Parameters:
    - newAttr (*): The Attr node to add or replace.
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttributeNode

removeAttributeNode(oldAttr)
  - Removes an attribute node from the element.
  - Parameters:
    - oldAttr (*): The Attr node to remove.
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttributeNode
```

----------------------------------------

TITLE: Spectrum UXP Widgets - User Interface Content
DESCRIPTION: Imports and renders content related to Spectrum UXP Widgets' User Interface components. It utilizes a query parameter to specify the product context.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-menu.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-menu";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP CSS :first-child Selector Example
DESCRIPTION: Demonstrates how to use the :first-child pseudo-class in UXP to apply styles to the first child element. This is useful for controlling layout and appearance, such as removing default margins from the first element in a group.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Pseudo-classes/first-child.md#_snippet_0

LANGUAGE: css
CODE:
```
sp-button:first-child {
    margin-left: 0;
}
```

----------------------------------------

TITLE: XMLHttpRequest upload progress
DESCRIPTION: Provides access to the XMLHttpRequestEventUpload object for monitoring upload progress. Events like 'progress', 'load', and 'error' can be handled. The example shows logging upload percentage.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/Data Transfers/XMLHttpRequest.md#_snippet_11

LANGUAGE: javascript
CODE:
```
const xhr = new XMLHttpRequest();
xhr.open("POST", "https://www.myserver.com");
xhr.upload.onprogress = (e) => {
    console.log(`Uploading ${(e.loaded / e.total) * 100}%`);
};
const arraybuffer = new ArrayBuffer(1024 * 1024);
// fill the arraybuffer with contents.
xhr.send(arraybuffer);
```

----------------------------------------

TITLE: Importing and Using min-width Component
DESCRIPTION: Demonstrates how to import the min-width content component and use it with a specific product query.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/min-width.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/min-width";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Element Attribute Manipulation API
DESCRIPTION: Provides methods for getting, setting, and removing attributes from DOM elements. Includes functions like getAttribute, setAttribute, removeAttribute, hasAttribute, and getAttributeNames.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLMenuElement.md#_snippet_8

LANGUAGE: APIDOC
CODE:
```
Element API - Attribute Manipulation:

getAttribute(name)
  - Returns the value of a specified attribute on an element.
  - Parameters:
    - name (string): The name of the attribute to retrieve.
  - Returns: string
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute

setAttribute(name, value)
  - Sets or changes the value of a specified attribute on an element.
  - Parameters:
    - name (string): The name of the attribute to set.
    - value (string): The value to assign to the attribute.
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute

removeAttribute(name)
  - Removes a specified attribute from an element.
  - Parameters:
    - name (string): The name of the attribute to remove.
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute

hasAttribute(name)
  - Checks if an element has a specified attribute.
  - Parameters:
    - name (string): The name of the attribute to check for.
  - Returns: boolean
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute

getAttributeNames()
  - Returns an array of all attribute names present on the element.
  - Returns: Array
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNames

getAttributeNode(name)
  - Returns the attribute node with the specified name.
  - Parameters:
    - name (string): The name of the attribute node to retrieve.
  - Returns: *
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNode

setAttributeNode(newAttr)
  - Adds or replaces an attribute node in the element.
  - Parameters:
    - newAttr (*): The Attr node to add or replace.
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttributeNode

removeAttributeNode(oldAttr)
  - Removes an attribute node from the element.
  - Parameters:
    - oldAttr (*): The Attr node to remove.
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttributeNode
```

----------------------------------------

TITLE: Query Plugin Information for Adobe XD
DESCRIPTION: Demonstrates how to use the imported Content component to query for plugin information specific to Adobe XD by passing the 'product=xd' query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Entry Points/UxpPluginInfo.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: CSS General Sibling Combinator Example
DESCRIPTION: Demonstrates how to use the general sibling combinator (~) in CSS to apply styles to a `sp-button` element that follows an `sp-action-button` element. This is useful for styling related UI components.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Selectors/General Sibling combinator.md#_snippet_0

LANGUAGE: css
CODE:
```
sp-action-button ~ sp-button {
    margin-right: 0;
}
```

----------------------------------------

TITLE: XMLHttpRequest getAllResponseHeaders() method
DESCRIPTION: Returns all response headers as a single string, with headers sorted and combined. Each header is formatted as 'name: value' followed by a newline. The example retrieves headers when the readyState indicates headers have been received.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/Data Transfers/XMLHttpRequest.md#_snippet_13

LANGUAGE: javascript
CODE:
```
const xhr = new XMLHttpRequest();
xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
        console.log(xhr.getAllResponseHeaders());
    }
};
xhr.open("GET", "https://www.adobe.com");
xhr.send();
```

----------------------------------------

TITLE: Importing UXP Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library, used for displaying UXP API reference styles.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/flex-grow.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/flex-grow";
```

----------------------------------------

TITLE: Apply UXP Content with Query
DESCRIPTION: Renders UXP content with a specific query parameter. The 'query' attribute is used to filter or configure the content being displayed, in this case, setting the product to 'xd'.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/border-bottom-style.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: XMLHttpRequest abort() method
DESCRIPTION: Aborts an XMLHttpRequest that has already been sent. This changes the readyState to UNSENT(0) and the status code to 0. The example shows aborting a request via a button click.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/Data Transfers/XMLHttpRequest.md#_snippet_12

LANGUAGE: javascript
CODE:
```
const xhr = new XMLHttpRequest();
xhr.onabort = () => {
    console.log("aborted");
};
xhr.open("GET", "https://www.adobe.com");
xhr.send();
abortButton.addEventListener("click", () => {
    xhr.abort();
});
```

----------------------------------------

TITLE: Get File for Opening
DESCRIPTION: Retrieves one or more files from the file system for read-only access. Returns a Promise that resolves to a File object or an array of File objects, depending on the allowMultiple option. Returns an empty result if no file was selected.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_15

LANGUAGE: javascript
CODE:
```
getFileForOpening(options)
  options: Object
    initialDomain: Symbol - The preferred initial location for the file picker.
    types: Array<String> - File types to display in the picker (default: ".*").
    initialLocation: File | Folder - The initial location for the file picker, overriding initialDomain.
    allowMultiple: Boolean - If true, allows multiple file selections (default: false).

Returns: Promise<File|Array<File>>

Example:
const folder = await fs.getFolder({initialDomain = domains.userDocuments});
const file = await fs.getFileForOpening({initialLocation = folder});
if (!file) {
    // no file selected
    return;
}
const text = await file.read();

Example:
const files = await fs.getFileForOpening({allowMultiple: true, types: fileTypes.images});
if (files.length === 0) {
    // no files selected
}
```

----------------------------------------

TITLE: Element DOM Traversal and Manipulation
DESCRIPTION: Provides methods for interacting with the DOM, including getting bounding client rectangles, finding closest elements, matching selectors, and inserting content.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLMenuItemElement.md#_snippet_35

LANGUAGE: APIDOC
CODE:
```
getBoundingClientRect()
  Returns: *

closest(selectorString)
  Returns: Element
  Parameters:
    selectorString: string

matches(selectorString)
  Returns: boolean
  Parameters:
    selectorString: string

insertAdjacentHTML(position, value)
  Parameters:
    position: 
    value: string

insertAdjacentsElement(position, node)
  Returns: Node
  Parameters:
    position: *
    node: *

insertAdjacentText(position, text)
  Parameters:
    position: *
    text: *
```

----------------------------------------

TITLE: XMLHttpRequest responseType
DESCRIPTION: Specifies the type of data expected in the response. Available types include 'text', 'arrayBuffer', 'blob', 'document', and 'json'. Setting this property after the request has started or is loading/done will throw a DOMException.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/Data Transfers/XMLHttpRequest.md#_snippet_9

LANGUAGE: javascript
CODE:
```
const xhr = new XMLHttpRequest();
xhr.responseType = "blob";
```

----------------------------------------

TITLE: Get Entry for Persistent Token
DESCRIPTION: Retrieves a file system Entry associated with a given persistent token. It does not guarantee the entry's validity; error handling for invalid entries is recommended.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_23

LANGUAGE: javascript
CODE:
```
const fs = require('uxp').storage.localFileSystem;
let entry, contents, tries = 3, success = false;
while (tries > 0) {
    try {
        entry = await fs.getEntryForPersistentToken(localStorage.getItem("persistent-file"));
        contents = await entry.read();
        tries = 0;
        success = true;
    } catch (err) {
        entry = await fs.getFileForOpening();
        localStorage.setItem("persistent-token", await fs.createPersistentToken(entry));
        tries--;
    }
}
if (!success) {
    // fail gracefully somehow
}
```

----------------------------------------

TITLE: Querying Persistent File Storage for Product Context
DESCRIPTION: Shows how to use the imported Content component to query persistent file storage, specifying a product context like 'xd'. This is a common pattern for initializing or interacting with product-specific storage.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Persistent File Storage/fileTypes.md#_snippet_1

LANGUAGE: jsx
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Get XMPPacketInfo Object
DESCRIPTION: Obtains the XMPPacketInfo object for an XMPFile, which contains details about the XMP packet's location, size, and character encoding within the file. This is useful for understanding the structure of the embedded metadata.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/XMP/XMP Classes/XMPFile.md#_snippet_2

LANGUAGE: javascript
CODE:
```
// Import the XMPFile class
const { XMPFile } = require("uxp").xmp;

// Create a new XMPFile object
const xmpFile = new XMPFile("sample.psd", XMPConst.FILE_PHOTOSHOP, XMPConst.OPEN_FOR_UPDATE);

// Get XMPPacketInfo object
const xmpPacketInfo = xmpFile.getPacketInfo();
console.log(xmpPacketInfo.length);
console.log(xmpPacketInfo.offset);
console.log(xmpPacketInfo.padSize);
console.log(xmpPacketInfo.charForm);
```

----------------------------------------

TITLE: Content Component Usage
DESCRIPTION: Demonstrates the usage of the Content component, likely for rendering or querying product-specific information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML DOM/Node.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Spectrum Divider Widget
DESCRIPTION: Demonstrates the usage of the sp-divider component from the Spectrum UXP Widgets library. This component is used to create visual dividers in the user interface. The example shows how to query for a specific product, Photoshop, to configure the divider's behavior or appearance.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-divider.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-divider";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Web Component Tag Structure in React
DESCRIPTION: Web Components require explicit closing tags and do not support self-closing tags. This example shows the correct HTML structure for a Web Component in React.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/Using with React.md#_snippet_0

LANGUAGE: html
CODE:
```
<sp-icon></sp-icon>
```

----------------------------------------

TITLE: Spectrum UXP Radio Button Component
DESCRIPTION: Demonstrates the usage of the sp-radio component from the Spectrum UXP Widgets library. It shows how to import and render the component, potentially with specific query parameters for customization.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-radio.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-radio";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP Attribute Selector Usage
DESCRIPTION: Demonstrates how to use the Attribute Selector in UXP CSS to target elements based on a specific attribute. This example selects elements with the 'product' attribute set to 'photoshop'.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Selectors/Attribute selector.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Selectors/Attribute selector";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: CSS :nth-of-type Selector Example
DESCRIPTION: Demonstrates how to use the :nth-of-type CSS pseudo-class to select even-numbered child elements of a specific type, applying a background color to them. This is useful for styling elements in a list or grid.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Pseudo-classes/nth-of-type.md#_snippet_0

LANGUAGE: css
CODE:
```
.row:nth-of-type(even) {
    background-color: #E8E8E8;
}
```

----------------------------------------

TITLE: UXP Host Information API
DESCRIPTION: Provides details about the host application environment within Adobe UXP. This API allows developers to query specific information such as the product name, version, and other relevant host details.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Host Information/Host.md#_snippet_1

LANGUAGE: APIDOC
CODE:
```
Module: uxp/Host Information

Component: Content

Purpose: Retrieves information about the host application.

Parameters:
  query (string): A query string to filter the host information. 
    Example: "product=photoshop" to get information specific to Photoshop.

Usage:
  This component is typically used within a UXP plugin to dynamically adapt behavior based on the host application.

Dependencies:
  Requires the UXP environment.

Return Value:
  Returns an object containing host-specific details, which may vary based on the query.

Example:
  <Content query="product=photoshop"/>
  This would fetch details relevant to Adobe Photoshop.
```

----------------------------------------

TITLE: IntersectionObserver Methods
DESCRIPTION: Methods for controlling the observation of target elements. This includes starting observation, stopping observation for specific elements, disconnecting the observer entirely, and retrieving current intersection records.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML DOM/IntersectionObserver.md#_snippet_2

LANGUAGE: APIDOC
CODE:
```
observe(target)
  Starts observing the specified target element for intersection changes.
  Parameters:
    target: Element - The element to be observed.
  Throws:
    TypeError - If the target is not an instance of Element.

unobserve(target)
  Stops observing the specified target element.
  Parameters:
    target: Element - The element to stop observing.
  Throws:
    TypeError - If the target is not an instance of Element.

disconnect()
  Disconnects the IntersectionObserver instance from all observed target elements.

takeRecords()
  Returns a list of IntersectionObserverEntry objects for all observed elements.
  Returns: Array<IntersectionObserverEntry> - An array of IntersectionObserverEntry objects.
```

----------------------------------------

TITLE: Import UXP Content for Photoshop
DESCRIPTION: Imports the UXP content component and queries for Photoshop-specific documentation. This is useful for developers building plugins or extensions for Photoshop using UXP.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/General/html.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/General/html";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Session Storage API Reference
DESCRIPTION: Provides methods for interacting with the browser's session storage. Data stored here is available for the duration of the page session. It includes functions for setting, getting, and removing items.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Data Storage/SessionStorage.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import { session } from "uxp";

// Set an item in session storage
session.storage.setItem("myKey", "myValue");

// Get an item from session storage
const value = session.storage.getItem("myKey");
console.log(value); // Output: "myValue"

// Remove an item from session storage
session.storage.removeItem("myKey");

// Clear all items from session storage
session.storage.clear();
```

LANGUAGE: APIDOC
CODE:
```
session.storage:
  setItem(key: string, value: string): void
    - Stores a key-value pair in session storage.
    - Parameters:
      - key: The key under which to store the value.
      - value: The value to store.
    - Returns: void

  getItem(key: string): string | null
    - Retrieves the value associated with a given key from session storage.
    - Parameters:
      - key: The key of the item to retrieve.
    - Returns: The value associated with the key, or null if the key is not found.

  removeItem(key: string): void
    - Removes an item from session storage by its key.
    - Parameters:
      - key: The key of the item to remove.
    - Returns: void

  clear(): void
    - Removes all key-value pairs from session storage.
    - Returns: void

  key(index: number): string | null
    - Returns the name of the key at the specified index.
    - Parameters:
      - index: The index of the key to retrieve.
    - Returns: The name of the key at the specified index, or null if the index is out of range.

  length: number
    - Returns the number of items currently stored in session storage.
```

----------------------------------------

TITLE: Import UXP Content Component
DESCRIPTION: Imports the general content component from the UXP documentation library.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/General/html.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/General/html";
```

----------------------------------------

TITLE: UXP CSS :last-child Selector Example
DESCRIPTION: Demonstrates how to use the :last-child pseudo-class in CSS for UXP development to apply styles to the last child element, such as removing right margin from the last button in a group.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/Pseudo-classes/last-child.md#_snippet_0

LANGUAGE: css
CODE:
```
sp-button:last-child {
    margin-right: 0;
}
```

----------------------------------------

TITLE: ResizeObserverEntry API Documentation
DESCRIPTION: Provides comprehensive documentation for the ResizeObserverEntry interface, including its constructor and read-only properties. It details the purpose, type, and accessibility of each property, along with links to external resources and version information. It also notes unsupported features.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML DOM/ResizeObserverEntry.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
window.ResizeObserverEntry:
  Represents the object passed to the ResizeObserver() constructor's callback function, which allows access to the new dimensions of the Element.

  Constructor:
    ResizeObserverEntry(target)
      target: Element - The target element being observed.

  Properties:
    target : Element (Read only)
      Gets the target element being observed.
      See: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/target
      Since: v8.1

    contentRect : DOMRectReadOnly (Read only)
      Gets the content rectangle of the target element.
      See: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentRect
      Since: v8.1

    borderBoxSize : Array<ResizeObserverSize> (Read only)
      Gets the border box size of the target element.
      See: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/borderBoxSize
      Since: v8.1

    contentBoxSize : Array<ResizeObserverSize> (Read only)
      Gets the content box size of the target element.
      See: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize
      Since: v8.1

    devicePixelContentBoxSize : Array<ResizeObserverSize> (Read only)
      Throws an error because devicePixelContentBoxSize is not supported in UXP.
      Throws:
        DOMException - Always throws a NotSupportedError.
      See: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/devicePixelContentBoxSize
      Since: v8.1
```

----------------------------------------

TITLE: Import and Use Content Component
DESCRIPTION: Demonstrates importing the Content component from 'uxp-documentation/src/pages/uxp-api/reference-css/Styles/color' and using it with a 'product' query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/color.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/color";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP Component with nth-child Styling
DESCRIPTION: An example of a UXP component that utilizes the :nth-child() pseudo-class for styling. The 'query' prop is used to potentially filter or configure the component's behavior, though the nth-child styling is applied directly via CSS.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Pseudo-classes/nth-child.md#_snippet_1

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Pseudo-classes/nth-child";

// Example usage within a UXP component
<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP CSS justify-content Example (Photoshop)
DESCRIPTION: Demonstrates how to use the justify-content CSS property in UXP for Photoshop to align flex items along the main axis. This property is crucial for controlling the spacing and alignment of elements within a flex container.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/justify-content.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/justify-content";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: XMPDateTime API Documentation
DESCRIPTION: Detailed API reference for the XMPDateTime class, including constructor, methods, and properties for managing XMP date-time data.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/XMP/XMP Classes/XMPDateTime.md#_snippet_1

LANGUAGE: apidoc
CODE:
```
XMPDateTime:
  __init__(year: number, month: number, day: number, hour: number, minute: number, second: number, timezone: string = "Z")
    Initializes a new XMPDateTime object.
    Parameters:
      year: The year (e.g., 2023).
      month: The month (1-12).
      day: The day of the month (1-31).
      hour: The hour (0-23).
      minute: The minute (0-59).
      second: The second (0-59).
      timezone: The timezone offset (e.g., "Z" for UTC, "+05:00"). Defaults to "Z".

  getYear(): number
    Returns the year.

  getMonth(): number
    Returns the month (1-12).

  getDay(): number
    Returns the day of the month (1-31).

  getHour(): number
    Returns the hour (0-23).

  getMinute(): number
    Returns the minute (0-59).

  getSecond(): number
    Returns the second (0-59).

  getTimezone(): string
    Returns the timezone offset.

  toString(): string
    Returns the date-time value as a string in ISO 8601 format.
```

----------------------------------------

TITLE: UXP Media Query: Height for Photoshop
DESCRIPTION: Demonstrates how to use the 'height' media query in UXP to apply styles or logic based on the product, specifically Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Media Queries/height.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Media Queries/height";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Reference UXP Content for Photoshop
DESCRIPTION: Uses the imported Content component to query and display documentation specific to Photoshop products within UXP.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/Hierarchy/hr.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Get File/Folder Info Synchronously - UXP
DESCRIPTION: Synchronously retrieves file or folder information based on the provided path. Returns an object with stats similar to Node.js fs.Stats. Platform limitations may affect some properties.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_42

LANGUAGE: javascript
CODE:
```
lstatSync(path)
```

----------------------------------------

TITLE: Spectrum UXP Textarea Widget
DESCRIPTION: Demonstrates the usage of the sp-textarea component from the Spectrum UXP Widgets library. This snippet shows how to import and use the Textarea component with a specific product query.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-textarea.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-textarea";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Query Content with Product Parameter
DESCRIPTION: Demonstrates how to use the imported Content component to query content, specifically filtering by the 'product' attribute set to 'xd'. This is useful for retrieving product-specific information or configurations.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/left.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: UxpCommandInfo Module
DESCRIPTION: Imports the UxpCommandInfo component from the uxp-documentation library, likely used for displaying command details within the UXP API reference.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Entry Points/UxpCommandInfo.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/UxpCommandInfo";
```

----------------------------------------

TITLE: UXP Child Combinator Usage
DESCRIPTION: Demonstrates how to use the CSS child combinator (>) in Adobe UXP to select direct children of an element. This example targets elements within a product context for Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Selectors/Child combinator.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Selectors/Child combinator";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Render Content with Query
DESCRIPTION: Renders content based on a specified query. This is useful for filtering and displaying specific product information within the UXP framework.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/Hierarchy/h5.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/Hierarchy/h5";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP Persistent File Storage Entry
DESCRIPTION: Demonstrates how to use the 'Entry' module from 'uxp-documentation' to interact with persistent file storage, specifying a product context.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Persistent File Storage/Entry.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/Entry";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Get File/Folder Info Asynchronously - UXP
DESCRIPTION: Asynchronously retrieves file or folder information based on the provided path. Returns a Promise with stats similar to Node.js fs.Stats, or uses a callback. Platform limitations may affect some properties.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_41

LANGUAGE: javascript
CODE:
```
lstat(path, callback)
```

----------------------------------------

TITLE: Import UXP Versions Module
DESCRIPTION: Imports the Versions module from the uxp-documentation library, used for managing UXP versions.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Versions/Versions.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Versions/Versions";
```

----------------------------------------

TITLE: Importing and Using UXP CSS Styles
DESCRIPTION: Demonstrates how to import a Content component from the UXP documentation and use it to query for specific styles, in this case, styles related to Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/right.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/right";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Host API Reference
DESCRIPTION: Provides access to information about the host application environment, including its name, version, and UI locale.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Host Information/Host.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
require('uxp').host

Properties:
  name ⇒ string
    Description: The name of the host application (e.g., "photoshop").
    Returns: string

  version ⇒ string
    Description: The version of the host application (e.g., "20.0.0").
    Returns: string

  uiLocale ⇒ string
    Description: The 5-letter UI locale of the host application (e.g., "en_US").
    Returns: string
```

----------------------------------------

TITLE: HTMLWebViewElement loadstart Event
DESCRIPTION: Fired when the WebView begins loading a URL. It provides the URL that is being loaded.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLWebViewElement.md#_snippet_8

LANGUAGE: APIDOC
CODE:
```
loadstart
  - Description: Event fired when loading has started.
  - Properties:
    - type (string): "loadstart"
    - url (string): url which WebView navigates to
```

LANGUAGE: javascript
CODE:
```
const webview = document.getElementById("webviewSample");
// Print the url when loading has started
webview.addEventListener("loadstart", (e) => {
  console.log(`webview.loadstart ${e.url}`);
});
```

----------------------------------------

TITLE: HTMLHeadElement Usage
DESCRIPTION: Demonstrates the usage of the HTMLHeadElement in UXP, specifically for setting product queries.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Elements/HTMLHeadElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLHeadElement";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Spectrum Dropdown Widget Usage
DESCRIPTION: Demonstrates how to import and use the sp-dropdown component from the uxp-documentation library, with a specific query parameter for product integration.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-dropdown.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-dropdown";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Render UxpMenuItems Content
DESCRIPTION: Renders the UxpMenuItems content with a specific product query parameter, likely to display menu item documentation relevant to Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Entry Points/UxpMenuItems.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Attribute Management: getAttribute, setAttribute, removeAttribute, hasAttribute, hasAttributes, getAttributeNames, getAttributeNode
DESCRIPTION: A comprehensive set of methods for interacting with element attributes. Includes getting, setting, removing, and checking for the existence of attributes, as well as retrieving all attribute names and attribute nodes.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLInputElement.md#_snippet_7

LANGUAGE: APIDOC
CODE:
```
getAttribute(name)
  Returns: string
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute
  Parameters:
    name: string
      Name of the attribute whose value you want to get.

setAttribute(name, value)
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute
  Parameters:
    name: string
      Name of the attribute whose value is to be set
    value: string
      Value to assign to the attribute

removeAttribute(name)
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute
  Parameters:
    name: string

hasAttribute(name)
  Returns: boolean
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute
  Parameters:
    name: string

hasAttributes()
  Returns a boolean value indicating whether the current element has any attributes or not.
  Returns: boolean
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttributes

getAttributeNames()
  Returns the attribute names of the element as an Array of strings
  Returns: Array
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNames

getAttributeNode(name)
  Returns: *
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNode
  Parameters:
    name: string
```

----------------------------------------

TITLE: Rendering Content Component with Query
DESCRIPTION: Renders the imported Content component, specifying 'photoshop' as the product query parameter. This likely filters or configures the displayed content based on the product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/padding.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Get File for Saving
DESCRIPTION: Obtains a file reference for read-write access, displaying a file picker for the user to choose a save location. Prompts for confirmation if the save operation would overwrite an existing file. Returns a Promise that resolves to the selected File object or null if no file was selected.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_16

LANGUAGE: javascript
CODE:
```
getFileForSaving(suggestedName, options)
  suggestedName: String - Required if options.types is not defined.
  options: Object
    initialDomain: Symbol - The preferred initial location for the file picker.
    types: Array<String> - Allowed file extensions without a '.' prefix.

Returns: Promise<File>

Example:
const file = await fs.getFileForSaving("output.txt", { types: [ "txt" ]});
if (!file) {
    // file picker was cancelled
    return;
}
await file.write("It was a dark and stormy night");
```

----------------------------------------

TITLE: UXP File System API (fs) Documentation
DESCRIPTION: Provides an overview of the UXP File System API, its capabilities, supported path schemes, and notes on platform-specific behaviors.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/fs/fs.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
Project: /adobedocs/uxp

# require('fs')
UXP Provides Node.js style file system API, FSAPI.
Unlike [Entry](./uxp/Persistent%20File%20Storage/Entry/) based [File](./uxp/Persistent%20File%20Storage/File/) or [Folder](./uxp/Persistent%20File%20Storage/Folder/) classes, these methods can directly access a local file or folder with path or file descriptor.
The starting point of a path in the native filesystem depends on the scheme. UXP supports plugin-specific storage schemes, such as "plugin:", "plugin-data:", and "plugin-temp:", as well as a native "file:" scheme for the path parameter.

Notes:
1. If there are no schemes defined for the path parameter of FSAPI methods, it considers to have "file:" scheme for the path.
2. [UWP](https://learn.microsoft.com/en-us/windows/uwp/get-started/universal-application-platform-guide) has the strict [File access permissions](https://learn.microsoft.com/en-us/windows/uwp/files/file-access-permissions), and UXP FSAPI may have access issues with anonymous filepaths. So, XD does not support this feature for compatibility across platforms.
3. The native layer of UXP FSAPI is based on [libUV](https://libuv.org/) except UWP powered features, such as FilePicker and Drag&Drop on Win10 XD.
```

----------------------------------------

TITLE: Importing UXP Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library, used for displaying UXP API reference CSS styles.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/opacity.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/opacity";
```

----------------------------------------

TITLE: UXP Pseudo-classes with Photoshop Query
DESCRIPTION: This snippet demonstrates how to import and use the UXP pseudo-classes documentation, specifically querying for Photoshop-related styles.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Pseudo-classes/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css//Pseudo-classes/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Content Component Usage
DESCRIPTION: Demonstrates the usage of a Content component, likely used for rendering or fetching content within the UXP environment. The 'product' query parameter specifies the target product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML DOM/NodeList.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP CharacterData DOM Member
DESCRIPTION: Demonstrates the usage of the CharacterData global member in UXP, which represents text nodes in the HTML DOM. This example shows how to query and potentially interact with CharacterData elements within the UXP environment, likely for Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML DOM/CharacterData.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML DOM/CharacterData";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Get Computed Style (HTML DOM)
DESCRIPTION: Demonstrates how to retrieve the computed style of an HTML element using the `getComputedStyle` function within the UXP JavaScript API. This is useful for inspecting the final, applied CSS properties of an element.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML DOM/getComputedStyle.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp//api/reference-js/Global Members/HTML DOM/getComputedStyle";

// Example usage:
// const element = document.getElementById('myElement');
// const styles = getComputedStyle(element);
// console.log(styles.getPropertyValue('color'));
```

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Adjacent Sibling Combinator Usage
DESCRIPTION: Demonstrates how to use the Adjacent Sibling combinator (`+`) in UXP to select elements. This example shows selecting an element that immediately follows another specific element, often used for styling related UI components.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Selectors/Adjacent Sibling combinator.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Selectors/Adjacent Sibling combinator";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP API Reference Content
DESCRIPTION: Renders the UXP API reference content, allowing filtering by product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Rendering Content Component with Query
DESCRIPTION: Renders the Content component with a specific query parameter, likely used to fetch or display product-related information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/Hierarchy/h4.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: CSS Variables Support in UXP
DESCRIPTION: UXP supports CSS Variables (Custom Properties) starting from version 3.0. This feature facilitates the creation of custom themes that can dynamically adapt to the host application's theme settings, particularly when used with media queries like prefers-color-scheme.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-css/General/variables.md#_snippet_0

LANGUAGE: javascript
CODE:
```
/* Example of using CSS Variables for theming */

:root {
  --primary-color: #3498db;
  --background-color: #f0f0f0;
}

body {
  background-color: var(--background-color);
  color: var(--primary-color);
}

/* Example with prefers-color-scheme */
@media (prefers-color-scheme: dark) {
  :root {
    --primary-color: #2ecc71;
    --background-color: #2c3e50;
  }
}
```

----------------------------------------

TITLE: Spectrum UXP Widgets - User Interface (Photoshop)
DESCRIPTION: This snippet demonstrates how to use Spectrum UXP Widgets for User Interface elements, specifically configured for Photoshop. It imports the necessary Content component and applies a query parameter for product integration.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Content Query for UXP
DESCRIPTION: Demonstrates how to query content within the UXP environment, specifically targeting the 'xd' product. This is useful for filtering or retrieving product-specific information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML DOM/DOMTokenList.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Spectrum Dropdown Widget Usage
DESCRIPTION: Demonstrates how to import and use the sp-dropdown component from the uxp-documentation library, with a specific query parameter for product integration.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-dropdown.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-dropdown";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Spectrum Component Reference
DESCRIPTION: Fetches and displays the Spectrum component reference documentation for UXP. It allows filtering by product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Render UXP Content with Query
DESCRIPTION: Renders the imported Content component with a specific query parameter. The query 'product=xd' suggests filtering or targeting content related to Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/index.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Query UXP Content for Adobe XD
DESCRIPTION: Renders the UXP content component, querying specifically for Adobe XD product information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/General/html.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Spectrum UXP Widget: sp-menu-item
DESCRIPTION: This snippet demonstrates the import and usage of the 'sp-menu-item' component from the 'uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface' module. It shows how to query for specific product integrations, such as Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-menu-item.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-menu-item";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Import Spectrum UXP Widgets with React
DESCRIPTION: Imports the Content component from the uxp-documentation library, which is used for displaying UXP API reference documentation, particularly for Spectrum UXP Widgets when used with React.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/Using with React.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/Using with React";
```

----------------------------------------

TITLE: HTMLProgressElement Usage
DESCRIPTION: Demonstrates the usage of the HTMLProgressElement in UXP, specifically querying for product information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Elements/HTMLProgressElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLProgressElement";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: ImageBlob Constructor and Usage
DESCRIPTION: Demonstrates how to create an ImageBlob from uncompressed image data and use it to update an HTML image element. It covers setting up metadata, generating pixel data, creating the ImageBlob, obtaining a URL, and cleaning up the URL.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/ImageBlob/ImageBlob.md#_snippet_0

LANGUAGE: javascript
CODE:
```
function getPixel() {
 const imageMetaData = {
    width : 8,
    height : 8,
    colorSpace : "RGB",
    colorProfile : "",
    pixelFormat : "RGB",
    components : 3,
    componentSize : 8,
    hasAlpha : false, // Alpha is set to false
    type : "image/uncompressed",
 }

 let buffer = new ArrayBuffer(imageMetaData.width * imageMetaData.height * 3);
 let colorArrayView = new Uint8Array(buffer);
 for(let i = 0; i < colorArrayView.length / 4; i++) {
    // here we are creating a red image, update values to see the variations
    colorArrayView[i * 3] = 255; // Red Component
    colorArrayView[i * 3 + 1] = 0; // Green Component
    colorArrayView[i * 3 + 2] = 0; // Blue Component
 }
 let imageBlob = new ImageBlob(colorArrayView, imageMetaData);
 // Generate url which can be used as src on HTMLImageElement
 const url = URL.createObjectURL(imageBlob);
 // ensure that there is a HTMLImageElement in the Document with id `image`.
 const imageElement = document.getElementById("image");
 imageElement.src = url;

 // revoke(destroy image from the memory) when url is no more required.
 URL.revokeObjectURL(url);
}
document.addEventListener("DOMContentLoaded", () => {
 document.getElementById("pixel-btn").addEventListener("click", getPixel);
});
```

LANGUAGE: html
CODE:
```
<!DOCTYPE html>
<html>

<head>
<script src="index.js"></script>
</head>
<style>
body {
  background-color: whitesmoke;
  padding: 0 16px;
}

#image,

container {
   margin: 8px;
   display: flex;
   flex-direction: row;
   justify-content: flex-start
}
</style>

 <body>
<div class="container">
   <sp-button id="pixel-btn" variant="secondary" quiet>Paint image</sp-button>
   <img id="image">
</div>

</body>
</html>
```

----------------------------------------

TITLE: Spectrum UXP Widget: sp-button
DESCRIPTION: Documentation for the sp-button component in Spectrum UXP Widgets. This snippet shows how to import and use the component with a query parameter to specify the product context.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-button.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-button";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Render UXP Content Component
DESCRIPTION: Renders the imported UXP content component, specifying 'photoshop' as the product query parameter. This likely filters or configures the displayed documentation for Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/text-align.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: h5 Element Usage
DESCRIPTION: Demonstrates the basic usage of the h5 HTML element in Adobe UXP.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-html/Hierarchy/h5.md#_snippet_0

LANGUAGE: html
CODE:
```
<h5>Hello, world!</h5>
```

----------------------------------------

TITLE: Querying UXP Content
DESCRIPTION: Renders the Content component with a specific query parameter for 'product=xd'. This is used to fetch or display content related to Adobe XD within the UXP framework.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/min-height.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Importing and Using Padding-Left Component
DESCRIPTION: Demonstrates how to import and use the Content component for managing padding-left styles, specifically querying for Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/padding-left.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/padding-left";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Query Persistent File Storage by Product
DESCRIPTION: Demonstrates how to query the persistent file storage for entries related to a specific product, using the Entry component.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Persistent File Storage/Entry.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Basic sp-link
DESCRIPTION: Renders a standard link that navigates to a specified URL when clicked.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-link.md#_snippet_0

LANGUAGE: html
CODE:
```
<sp-link href="https://adobe.com">Adobe</sp-link>
```

----------------------------------------

TITLE: window.crypto API Documentation
DESCRIPTION: Provides documentation for the window.crypto API, including methods for generating random values and UUIDs.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/Crypto/Crypto.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
window.crypto:
  Description: Provides access to cryptographic functions, including random number generation and UUID creation.
  See:
    - https://developer.mozilla.org/en-US/docs/Web/API/Crypto
    - https://w3c.github.io/webcrypto/#Crypto-method-getRandomValues
    - https://w3c.github.io/webcrypto/#Crypto-method-randomUUID
  Since: UXP v6.2

  getRandomValues(array):
    Description: Generates cryptographically strong random values.
    Parameters:
      - array (IntegerArray): An integer-based TypedArray (Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, BigInt64Array, BigUint64Array). Cannot be Float32Array or Float64Array.
    Returns: The same array passed as 'array' but with its contents replaced with the newly generated random numbers.
    Throws:
      - TypedError: If the input 'array' is not a TypedArray or is Float32Array or Float64Array.
      - DOMException: If the input 'array' length exceeds 65,536 bytes.

  randomUUID():
    Description: Generates a new version 4 UUID.
    Returns: string - String containing a randomly generated, 36 character long v4 UUID.
```

----------------------------------------

TITLE: Folder Class Overview
DESCRIPTION: Represents a folder on a file system. Instances are obtained via FileSystemProvider methods or Folder.getEntries. Demonstrates basic usage and property access.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/Folder.md#_snippet_0

LANGUAGE: javascript
CODE:
```
const fs = require('uxp').storage.localFileSystem;
const folder = await fs.getTemporaryFolder(); // Gets the Folder instance
console.log(folder.isFolder); // returns true
```

----------------------------------------

TITLE: Spectrum to SWC Mapping for Photoshop
DESCRIPTION: This snippet demonstrates how to use the UXP Content component to map Spectrum components to SWC for Photoshop. It takes a query parameter to specify the product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum to SWC Mapping/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum to SWC Mapping/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Importing UXP Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library, used for displaying UXP API reference CSS styles.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/background.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/background";
```

----------------------------------------

TITLE: UxpCommandInfo API Documentation
DESCRIPTION: Provides details on accessing properties of the UxpCommandInfo object.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/UxpCommandInfo.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
UxpCommandInfo:
  id ⇒ `string`
    Get command id
    Returns: `string`

  label ⇒ `string`
    Get command label, localized string
    Returns: `string`

  description ⇒ `string`
    Get command description, localized string
    Returns: `string`

  shortcut ⇒ `Object`
    Get command shortcut
    Returns: `Object` - which consists of following keys:
      shortcutKey: `string`
      commandKey: `boolean`
      altKey: `boolean`
      shiftKey: `boolean`
      ctrlKey: `boolean`

  isManifestCommand ⇒ `bool`
    Get isManifestCommand
    Returns: `bool`

  commandOptions ⇒ `object`
    Get command options parameter
    Returns: `object`
```

----------------------------------------

TITLE: KeyboardEvent Constructor and Properties
DESCRIPTION: Details the constructor for creating KeyboardEvent instances and lists its read-only properties, which provide information about the keyboard event.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Events/KeyboardEvent.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
KeyboardEvent:
  Constructor: KeyboardEvent(type, eventInit)
    - type: The type of the event.
    - eventInit: An optional object to specify event properties.

  Properties:
    - altKey: boolean (Read only) - Indicates if the Alt key was pressed.
    - ctrlKey: boolean (Read only) - Indicates if the Control key was pressed.
    - metaKey: boolean (Read only) - Indicates if the Meta key (e.g., Command on Mac) was pressed.
    - shiftKey: boolean (Read only) - Indicates if the Shift key was pressed.
    - code: string (Read only) - Represents the physical key on the keyboard.
    - keyCode: number (Read only) - Represents the key code of the pressed key (deprecated).
    - key: string (Read only) - Represents the value of the key pressed.
    - location: number (Read only) - Indicates the location of the key on the keyboard.
    - repeat: boolean (Read only) - Indicates if the key is being held down.
    - type: string (Read only) - The name of the event.
    - isTrusted: boolean (Read only) - Indicates if the event was initiated by the user.
    - target: Node (Read only) - The element to which the event was originally dispatched.
    - currentTarget: Node (Read only) - The element whose event listener triggered the event.
    - bubbles: boolean (Read only) - Indicates if the event bubbles up through the DOM.
    - cancelable: boolean (Read only) - Indicates if the event can be canceled.
    - composed: boolean (Read only) - Indicates if the event will trigger a shadow DOM boundary.
    - eventPhase: number (Read only) - The current phase of the event flow.
    - defaultPrevented: boolean (Read only) - Indicates if preventDefault() has been called.
    - returnValue: any - The return value of the event.
```

----------------------------------------

TITLE: Background Color Styling in UXP
DESCRIPTION: Demonstrates how to apply background color styling using the UXP CSS reference. This component likely takes a query parameter to specify the target product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/background-color.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/background-color";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: ReadableStreamDefaultController Import
DESCRIPTION: Imports the ReadableStreamDefaultController from the uxp-documentation library, used for managing readable streams.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Streams/ReadableStreamDefaultController.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Streams/ReadableStreamDefaultController";
```

----------------------------------------

TITLE: ImageBlob Component Usage
DESCRIPTION: Demonstrates how to use the ImageBlob component with a specific product query.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/ImageBlob.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/ImageBlob/ImageBlob.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Data Transfer Component
DESCRIPTION: Renders the UXP data transfer documentation component, allowing queries for specific products like Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Data Transfers/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Data Transfers/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Query Product Information with Spectrum UXP Widgets
DESCRIPTION: Demonstrates how to use the imported Content component to query for product information. The 'query' prop is set to 'product=xd', indicating a request for data related to Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/Using with React.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Content Component Usage
DESCRIPTION: Demonstrates the usage of the Content component, likely for rendering or interacting with file system data, with a query parameter specifying the product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Persistent File Storage/localFileSystem.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Applying CSS Content Query
DESCRIPTION: Shows how to apply a content query to CSS styles, targeting Photoshop as the product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/border-style.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP API Reference: Modules
DESCRIPTION: Documentation for UXP modules, including uxp/User Information and uxp/XMP.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/changelog3P.md#_snippet_14

LANGUAGE: APIDOC
CODE:
```
API Reference: Modules

uxp/User Information:
  GUID: string
    Description: Provides a unique identifier for the Creative Cloud User (currently Photoshop only).

uxp/XMP:
  (See getting-started/xmp.md for details on XMP support)

```

----------------------------------------

TITLE: Import UXP OS Module
DESCRIPTION: Imports the OS module from the uxp-documentation library, typically used for interacting with the operating system within UXP plugins.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/os/OS.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/os/OS";
```

----------------------------------------

TITLE: Rendering Content Component with Query
DESCRIPTION: Renders the imported Content component, passing a query parameter to specify the product as 'photoshop'. This is likely used to fetch or display content specific to Photoshop within the UXP environment.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Streams/CountQueuingStrategy.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Data Storage Component
DESCRIPTION: This snippet demonstrates how to use the UXP data storage component, likely for persisting data within the UXP environment. It shows a basic usage pattern with a query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Data Storage/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Data Storage/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Query UxpPanelInfo for Product Data
DESCRIPTION: Renders the UxpPanelInfo component, querying for product-specific data, with 'product=xd' indicating a focus on Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Entry Points/UxpPanelInfo.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Display Photoshop UXP API Reference
DESCRIPTION: Renders the Content component to display API reference information specific to Adobe Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/Hierarchy/h1.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP General Styling - Product XD
DESCRIPTION: Imports and renders general styling content for Adobe UXP, specifically for the product XD. This component likely handles the visual presentation and layout of UXP elements within the XD environment.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/General/style.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/General/style";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Using Content Component with Query
DESCRIPTION: Renders the 'Content' component with a specific query parameter for 'product=xd'. This is likely used to display documentation related to the 'active' pseudo-class for Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Pseudo-classes/active.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: sp-detail Component Usage
DESCRIPTION: Demonstrates the basic usage of the sp-detail component to render detail text.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/Typography/sp-detail.md#_snippet_0

LANGUAGE: html
CODE:
```
<sp-detail>A NICE DIVIDER<sp-detail>
```

----------------------------------------

TITLE: Rendering UXP Content for Photoshop
DESCRIPTION: Renders the imported UXP documentation content, specifying 'photoshop' as the product query.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Pseudo-elements/before.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Importing UXP Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library, specifically for CSS styling reference.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/min-height.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/min-height";
```

----------------------------------------

TITLE: UXP Clipboard Data Transfer (XD)
DESCRIPTION: Demonstrates how to use the UXP clipboard API for data transfer, specifically querying for product=xd. This involves importing a Content component and rendering it with a query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Data Transfers/Clipboard.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Data Transfers/Clipboard";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Photoshop Product Query for UXP Content
DESCRIPTION: This snippet shows how to query UXP content for the Photoshop product. It utilizes a Content component and passes a query parameter to specify the product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Events/ErrorEvent.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Query Product Information using Content Component
DESCRIPTION: Demonstrates how to use the imported Content component to query product information, specifying 'xd' as the product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML DOM/NodeList.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Path Component Documentation
DESCRIPTION: Renders documentation for the Path component, allowing filtering by product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Path.md#_snippet_0

LANGUAGE: markdown
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Path/Path.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: File System API Documentation
DESCRIPTION: Provides details on UXP file system operations.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/fs/fs.md#_snippet_9

LANGUAGE: APIDOC
CODE:
```
writeFileSync(path, data, options)
  Writes data to a path synchronously, appending if desired.
  The format of the file is controlled via the encoding option, and defaults to a binary format.
  
  Parameters:
    path (string): path where the file to write is located
    data (string | ArrayBuffer | ArrayBufferView): the data to write to the file
    options (any):
      flag (number | string, optional, default: 'w'): see [file-system-flags](https://nodejs.org/api/fs.html#file-system-flags) in Node.js
      mode (number | string, optional, default: '0o666'): see [File modes](https://nodejs.org/api/fs.html#file-modes) in Node.js
      encoding (string, optional): the encoding of the file can be "utf-8", "utf-16be" or "utf-16le"
  
  Returns: number - the length of contents written to the file

open(path, [flag], [mode], callback)
  Opens or a creates a file asynchronously
  
  Parameters:
    path (string): path where to open a file
    flag (number | string, optional, default: 'r'): see [file-system-flags](https://nodejs.org/api/fs.html#file-system-flags) in Node.js
    mode (number | string, optional, default: '0o666'): see [File modes](https://nodejs.org/api/fs.html#file-modes) in Node.js
    callback (function, optional): if not provided, this function will return Promise object
  
  Returns: Promise<number> - fd(file descriptor)

close(fd, callback)
  Closes a file descriptor asynchronously
  
  Parameters:
    fd (number): file descriptor of the file to close
    callback (function, optional): if not provided, this function will return Promise object
  
  Returns: number - 0 if succeeded, otherwise throws an Error

read(fd, buffer, offset, length, position, callback)
  Reads data in chunks from the file it refers to the file descriptor
  
  Parameters:
    fd (number): a file descriptor obtained from fs.open
    buffer (ArrayBuffer): the buffer where read bytes are written to
    offset (number): the offset to the buffer where read bytes are written from
    length (number): the length to read
    position (number): the position of the file to read from. if -1, the current file position to read from. when the bytes are read, the current file position advances by size of the read bytes. if the value is greater than or equal to 0, it specifies a file position to read from. after the bytes are read, a current file position stayed the same
    callback (function, optional): if not provided, this function will return Promise object
  
  Returns: Promise<Object> - { bytesRead: number, buffer: ArrayBuffer }
  Throws:
    Error: if invalid file descriptor is passed.
    Error: if invalid parameter format or value is passed.
```

----------------------------------------

TITLE: UxpMenuItem Class Overview
DESCRIPTION: Provides details about the UxpMenuItem class, which represents a single menu item within a UXP panel. It outlines the read-only properties and methods for interacting with menu item states and structure.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/UxpMenuItem.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
UxpMenuItem:
  __init__()
    Class describing a single menu item of a panel

  id : `string` (read-only)
    Get menu item id

  label ⇒ `string`
    Get menu item label, localized string
    Returns: `string`

  enabled ⇒ `boolean`
    Get menu item enable state
    Returns: `boolean`

  checked ⇒ `boolean`
    Get menu item checked state
    Returns: `boolean`

  submenu ⇒ `UxpMenuItems`
    Get menu submenu
    Returns: `UxpMenuItems`

  parent ⇒ `UxpMenuItems`
    Get menu parent.
    Returns: `UxpMenuItems`

  label(label: `string`)
    Set label of the menu item. The label will be updated immediately, asynchronously.
    Parameters:
      label: should be a localized string

  enabled(enabled: `boolean`)
    Set enabled state of the menu item. The state will be updated immediately, asynchronously.
    Parameters:
      enabled: `boolean`

  checked(checked: `boolean`)
    Set checked state of the menu item. The state will be updated immediately, asynchronously.
    Parameters:
      checked: `boolean`

  remove()
    Remove the menu item
```

----------------------------------------

TITLE: Rendering UXP Content for Adobe XD
DESCRIPTION: Renders UXP content, specifically querying for product=xd, indicating it's used to display documentation or components related to Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML DOM/Path2D.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Import UXP Versions Module
DESCRIPTION: Imports the Versions module from the uxp-documentation library, used for accessing UXP API reference information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Versions/Versions.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Versions/Versions";
```

----------------------------------------

TITLE: Spectrum UXP Widget - Menu (Photoshop)
DESCRIPTION: Demonstrates the usage of the 'sp-menu' component from the Spectrum UXP Widgets library, configured for Adobe Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-menu.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-menu";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Applying CSS Styles with Query Parameters
DESCRIPTION: Applies CSS styles using a Content component, with a query parameter to specify the target product, such as Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/flex-basis.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Render Content Component
DESCRIPTION: Renders the Content component with a query parameter for 'product=xd', likely used to display product-specific information within the UXP documentation.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Streams/WritableStreamDefaultController.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Render Content Component
DESCRIPTION: Renders the Content component, passing a query parameter to specify the product context, likely Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML DOM/Node.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Feature Support by Application
DESCRIPTION: This table details which Adobe applications support UXP Plugins, UXP C++ Hybrid Plugins, and UXP Scripting, along with the specific UXP version requirements for each feature.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/versions3P.md#_snippet_1

LANGUAGE: html
CODE:
```
<table>
  <thead>
    <tr>
      <th>Application</th>
      <th>UXP Plugins</th>
      <th>UXP C++ Hybrid Plugins</th>
      <th>UXP Scripting</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Photoshop</td>
      <td>✅</td>
      <td>✅ from 24.2</td>
      <td>✅ from 24.1</td>
    </tr>
    <tr>
      <td>InDesign</td>
      <td>✅ from 18.5</td>
      <td>-</td>
      <td>✅ from 18.0</td>
    </tr>
    <tr>
      <td>Premiere Pro</td>
      <td>✅ from 25.1</td>
      <td>-</td>
      <td>-</td>
    </tr>
  </tbody>
</table>
```

----------------------------------------

TITLE: Import Content Component for UXP
DESCRIPTION: Imports the Content component from the uxp-documentation library, used for querying UXP API references.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/General/style.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/General/style";
```

----------------------------------------

TITLE: SecureStorage API Usage in Photoshop
DESCRIPTION: Demonstrates how to import and use the SecureStorage module within a UXP plugin for Photoshop to manage key-value data.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Key-Value Storage/SecureStorage.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Key-Value Storage/SecureStorage";

// Example usage within a Photoshop UXP plugin
// Assuming 'Content' is the imported SecureStorage module

async function storeSensitiveData(key, value) {
  try {
    await Content.setItem(key, value);
    console.log(`Data stored successfully for key: ${key}`);
  } catch (error) {
    console.error(`Error storing data: ${error}`);
  }
}

async function retrieveSensitiveData(key) {
  try {
    const data = await Content.getItem(key);
    if (data !== null) {
      console.log(`Retrieved data for key ${key}:`, data);
      return data;
    } else {
      console.log(`No data found for key: ${key}`);
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving data: ${error}`);
    return null;
  }
}

async function removeSensitiveData(key) {
  try {
    await Content.removeItem(key);
    console.log(`Data removed successfully for key: ${key}`);
  } catch (error) {
    console.error(`Error removing data: ${error}`);
  }
}

// Example calls:
// storeSensitiveData("userToken", "a1b2c3d4e5f6");
// retrieveSensitiveData("userToken");
// removeSensitiveData("userToken");

```

----------------------------------------

TITLE: Importing UXP Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library, used for displaying UXP API reference information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/border-top-color.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/border-top-color";
```

----------------------------------------

TITLE: Create Directory
DESCRIPTION: Creates a directory at the specified path asynchronously. Supports a callback or returns a Promise.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_46

LANGUAGE: javascript
CODE:
```
mkdir(path, callback)

Parameters:
path (String): path where to create the directory
callback (function, optional): if not provided, this function will return Promise object.

Returns: Promise<int> - 0 if succeeded, otherwise throws an Error.

Example:
await fs.mkdir("plugin-data:/newDir");
```

----------------------------------------

TITLE: Content Component Usage
DESCRIPTION: Demonstrates the usage of the Content component, likely used for displaying documentation or API information, with a query parameter for 'photoshop'.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Events/CloseEvent.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Storage API Reference
DESCRIPTION: API documentation for the UXP storage module, detailing functions for file and folder management, persistent tokens, and type checking.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_26

LANGUAGE: APIDOC
CODE:
```
createPersistentToken(entry)
  - Returns a token suitable for use with host-specific APIs or for storing a persistent reference to an entry.
  - Parameters:
    - entry: Entry - The file system entry for which to create a token.
  - Returns: Promise<String> - The persistent token for the given entry.

getEntryForPersistentToken(token)
  - Returns the file system Entry that corresponds to the persistent token.
  - Throws: ReferenceError: token is not defined - If an entry cannot be found that matches the token.
  - Parameters:
    - token: String - The persistent token.
  - Returns: Promise<Entry> - The corresponding entry for the persistent token.

isFileSystemProvider(fs)
  - Checks if the supplied object is a FileSystemProvider.
  - Parameters:
    - fs: any - The object to check.
  - Returns: Boolean - True if the object is a file system provider.

Folder
  - Represents a folder on a file system.

isFolder
  - Indicates that this instance is a folder. Useful for type checking.

getEntries()
  - Returns an array of entries contained within this folder.
  - Returns: Promise<Array<Entry>> - The entries within the folder.

createEntry(name, options)
  - Creates an entry within this folder and returns the appropriate instance.
  - Parameters:
    - name: String - The name of the entry to create.
    - options: any - Optional settings for entry creation.
      - [options.type]: Symbol - Indicates the kind of entry to create (defaults to types.file).
      - [options.overwrite]: Boolean - If true, overwrites an existing file (defaults to false).
  - Returns: Promise<File | Folder> - The created entry.
```

----------------------------------------

TITLE: UXP File System API Documentation
DESCRIPTION: Provides detailed API documentation for UXP file system operations.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_38

LANGUAGE: APIDOC
CODE:
```
/**
 * @function readFileSync
 * @description Reads data from the path synchronously.
 * The file format can be specified with the encoding options. If an encoding is not supplied, the file is assumed to be a binary format.
 * @param {string} path - path where the file to read is located
 * @param {object} [options] - Optional settings for reading the file.
 * @param {string} [options.encoding] - The encoding of the file. Can be "utf-8", "utf-16be" or "utf-16le".
 * @returns {string|ArrayBuffer} The contents of the file.
 * @example
 * const data = fs.readFileSync("plugin-data:/binaryFile.obj");
 * const text = fs.readFileSync("plugin-data:/textFile.txt", {encoding: "utf-8"});
 */

/**
 * @function writeFile
 * @description Writes data to the path asynchronously, appending if desired.
 * The format of the file is controlled via the encoding option, and defaults to a binary format.
 * @param {string} path - path where the file to write is located
 * @param {string|ArrayBuffer|ArrayBufferView} data - the data to write to the file
 * @param {object} [options] - Optional settings for writing the file.
 * @param {int|string} [options.flag='w'] - see [file-system-flags](https://nodejs.org/api/fs.html#file-system-flags) in Node.js
 * @param {int|string} [options.mode='0o666'] - see [File modes](https://nodejs.org/api/fs.html#file-modes) in Node.js
 * @param {string} [options.encoding] - the encoding of the file. Can be "utf-8", "utf-16be" or "utf-16le".
 * @param {function} [callback] - if not provided, this function will return Promise object.
 * @returns {Promise<int>} the length of contents written to the file.
 * @example
 * const bufLen = await fs.writeFile("plugin-data:/binaryFile.obj", new Uint8Array([1, 2, 3]));
 * const strLen = await fs.writeFile("plugin-data:/textFile.txt", "It was a dark and stormy night.\n", {encoding: "utf-8"});
 */

/**
 * @function writeFileSync
 * @description Writes data to a path synchronously, appending if desired.
 * The format of the file is controlled via the encoding option, and defaults to a binary format.
 * @param {string} path - path where the file to write is located
 * @param {string|ArrayBuffer|ArrayBufferView} data - the data to write to the file
 * @param {object} [options] - Optional settings for writing the file.
 * @param {int|string} [options.flag='w'] - see [file-system-flags](https://nodejs.org/api/fs.html#file-system-flags) in Node.js
 * @param {int|string} [options.mode='0o666'] - see [File modes](https://nodejs.org/api/fs.html#file-modes) in Node.js
 * @param {string} [options.encoding] - the encoding of the file. Can be "utf-8", "utf-16be" or "utf-16le".
 * @returns {int} the length of contents written to the file.
 * @example
 * const bufLen = fs.writeFileSync("plugin-data:/binaryFile.obj", new Uint8Array([1, 2, 3]));
 * const strLen = fs.writeFileSync("plugin-data:/textFile.txt", "It was a dark and stormy night.\n", {encoding: "utf-8"});
 */

/**
 * @function open
 * @description Opens or creates a file asynchronously.
 * @param {string} path - path where to open a file
 * @param {int|string} [flag='r'] - see [file-system-flags](https://nodejs.org/api/fs.html#file-system-flags) in Node.js
 * @param {int|string} [mode='0o666'] - see [File modes](https://nodejs.org/api/fs.html#file-modes) in Node.js
 * @param {function} [callback] - if not provided, this function will return Promise object.
 * @returns {Promise<int>} fd (file descriptor).
 * @example
 * const fd = await fs.open("plugin-data:/fileToRead.txt", "r");
 */

/**
 * @function close
 * @description Closes a file descriptor asynchronously.
 * @param {int} fd - file descriptor of the file to close
 * @param {function} [callback] - if not provided, this function will return Promise object.
 * @returns {int} 0 if succeeded, otherwise throws an Error.
 * @example
 * await fs.close(fd);
 */
```

----------------------------------------

TITLE: Importing File Types for Persistent File Storage
DESCRIPTION: Demonstrates how to import the Content component, which is used for managing file types in UXP's Persistent File Storage. This is typically used to query and specify product contexts.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Persistent File Storage/fileTypes.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/fileTypes";
```

----------------------------------------

TITLE: window.prompt() Usage in UXP
DESCRIPTION: Demonstrates how to use the window.prompt() function with a message and a default value. It also includes notes on UXP version-specific feature flag requirements for plugins and limitations for scripts.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML DOM/prompt.md#_snippet_0

LANGUAGE: javascript
CODE:
```
prompt("Enter your name: ","Adobe");
```

LANGUAGE: json
CODE:
```
{
    "featureFlags": {
        "enableAlerts": true
    }
}
```

----------------------------------------

TITLE: UXP Response Component
DESCRIPTION: Demonstrates the usage of the UXP Response component for handling data transfers, specifically querying product information for Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Data Transfers/Response.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Data Transfers/Response";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: XMPIterator API Documentation
DESCRIPTION: Provides documentation for the XMPIterator class methods, including next(), skipSiblings(), and skipSubtree().

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/XMP/XMP Classes/XMPIterator.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
XMPIterator:
  // Created by a call to XMPMeta.iterator()
  // Walks recursively through the properties and qualifiers of an XMPMeta object.
  // Returns them as XMPProperty objects.
  // The object has no JavaScript properties.

  next(): XMPProperty | null
    // Retrieves the next item in the metadata.
    // Returns: The next XMPProperty object or null if there are no more items.

  skipSiblings(): void
    // Skips the subtree below and the siblings of the current node on the subsequent call to next().

  skipSubtree(): void
    // Skips the subtree below the current node on the subsequent call to next().
```

----------------------------------------

TITLE: Import Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library for rendering documentation.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/Hierarchy/footer.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/Hierarchy/footer";
```

----------------------------------------

TITLE: Querying UXP Events for Photoshop
DESCRIPTION: Demonstrates how to query UXP events specifically for the Photoshop product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Events/EventTarget.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Importing UXP Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library, used for displaying UXP API reference CSS styles.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/flex-grow.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/flex-grow";
```

----------------------------------------

TITLE: UXP Data Transfer with Adobe XD
DESCRIPTION: Demonstrates how to perform data transfers within UXP, specifically for Adobe XD. This snippet shows the usage of a Content component with a query parameter to specify the product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Data Transfers/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Data Transfers/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Rendering UXP Content with Query Parameter
DESCRIPTION: Renders the imported Content component with a specific query parameter for Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/top.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: XMPUtils Class Documentation (Photoshop)
DESCRIPTION: Provides utility functions for working with XMP metadata in Photoshop documents using UXP.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/XMP/XMP Classes/XMPUtils.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/XMP/XMP Classes/XMPUtils.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Import UXP Content Module
DESCRIPTION: Imports the Content module from the uxp-documentation library, used for accessing UXP API reference information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Plugin Manager/Script.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Plugin Manager/Script";
```

----------------------------------------

TITLE: Content Component Usage
DESCRIPTION: Renders the Content component with a query parameter for product=photoshop, likely used to display Photoshop-specific documentation or features within the UXP environment.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Events/GestureEvent.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: HTMLHtmlElement Usage in UXP
DESCRIPTION: Demonstrates how to use the HTMLHtmlElement, specifically querying for Photoshop products.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Elements/HTMLHtmlElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLHtmlElement";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Query Persistent File Storage for Photoshop
DESCRIPTION: Demonstrates how to query the Persistent File Storage API to retrieve content specifically for Adobe Photoshop. This is a common use case for storing product-specific data.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Persistent File Storage/domains.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Import Persistent File Storage Content
DESCRIPTION: Imports the Content component for UXP persistent file storage documentation, allowing for product-specific queries.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Persistent File Storage/modes.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/modes";
```

----------------------------------------

TITLE: Create and Read a File using Persistent File Storage
DESCRIPTION: Demonstrates how to create a new file with text content and then read its content back using the Persistent File Storage API.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Persistent File Storage/index.md#_snippet_1

LANGUAGE: javascript
CODE:
```
import { PersistentFileStorage } from 'uxp';

async function manageFile() {
  const storage = new PersistentFileStorage('xd');
  const fileName = 'my-document.txt';
  const fileContent = 'This is the content of my document.';

  try {
    // Create the file
    await storage.createFile(fileName, fileContent);
    console.log(`File '${fileName}' created successfully.`);

    // Read the file content
    const readContent = await storage.readFile(fileName);
    console.log(`Content of '${fileName}':`, readContent);

    // Clean up: delete the file
    await storage.deleteFile(fileName);
    console.log(`File '${fileName}' deleted successfully.`);

  } catch (error) {
    console.error('An error occurred:', error);
  }
}

manageFile();
```

----------------------------------------

TITLE: Rendering UXP Documentation Content
DESCRIPTION: Renders the imported `Content` component, likely to display documentation related to the `:first-child` pseudo-class, with a query parameter specifying the product as 'xd'.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Pseudo-classes/first-child.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Link Content in UXP for Adobe XD
DESCRIPTION: This snippet demonstrates how to link content within UXP, specifically for Adobe XD. It utilizes the `Content` component from `uxp-documentation` to establish links based on product queries.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/General/link.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/General/link";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Importing Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library, used for displaying UXP API reference CSS styles.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/padding.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/padding";
```

----------------------------------------

TITLE: Background Image CSS Style
DESCRIPTION: Demonstrates how to use the background-image CSS style with a specific product query.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/background-image.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/background-image";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP API Reference - XMPPacketInfo
DESCRIPTION: Provides information about XMP packets within UXP, likely for Adobe Photoshop integration.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/XMP/XMP Classes/XMPPacketInfo.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/XMP/XMP Classes/XMPPacketInfo.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: General Content Linking in Photoshop
DESCRIPTION: This snippet demonstrates how to link general content within Photoshop using the UXP framework. It utilizes a Content component with a specific query parameter to target Photoshop products.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/General/link.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/General/link";
```

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Content Component with Product Query
DESCRIPTION: Renders the Content component with a query parameter specifying the product as 'xd', likely for filtering or displaying product-specific documentation or features.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Events/EventTarget.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Render Content in Photoshop
DESCRIPTION: Renders content within Photoshop using the UXP framework. It takes a query parameter to specify the product context.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/General/body.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/General/body";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Spectrum Detail Component (Typography)
DESCRIPTION: Demonstrates the usage of the 'sp-detail' component from the UXP Spectrum Widgets library for displaying detailed text. It accepts a 'query' parameter to specify the product context.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/Typography/sp-detail.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/Typography/sp-detail";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP File System mkdir API
DESCRIPTION: Creates a directory asynchronously. Supports recursive creation of parent directories. Returns a Promise that resolves to 0 on success or throws an error.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/fs/fs.md#_snippet_16

LANGUAGE: APIDOC
CODE:
```
mkdir(path, options, callback)
  Creates a directory of the path asynchronously
  Returns: Promise<number> - 0 if succeeded, otherwise throws an Error
  Parameters:
    path (string): path where to create the directory
    options (*):
      recursive (boolean, optional, default: false): whether parents folders should be created
    callback (function, optional): if not provided, this function will return Promise object
  Example:
    await fs.mkdir("plugin-data:/newDir");
```

----------------------------------------

TITLE: Spectrum UXP Widget - Checkbox
DESCRIPTION: Demonstrates the usage of the sp-checkbox component from Spectrum UXP Widgets. It shows how to import and render the component with specific product queries.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-checkbox.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-checkbox";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Import Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library, used for rendering documentation content.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/Hierarchy/footer.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/Hierarchy/footer";
```

----------------------------------------

TITLE: Import Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library for rendering documentation content.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/Hierarchy/h3.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/Hierarchy/h3";
```

----------------------------------------

TITLE: Query Product Information for Spectrum Textfield
DESCRIPTION: Demonstrates how to query product information, specifically for 'xd', using the imported Content component. This is useful for filtering or configuring UI elements based on the product context.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-textfield.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Spectrum UXP Body Component
DESCRIPTION: Demonstrates the usage of the Spectrum UXP Body component for typography. It takes a 'product' query parameter to specify the target product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/Typography/sp-body.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/Typography/sp-body";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Query Spectrum UXP Content
DESCRIPTION: Demonstrates how to query content for a Spectrum UXP Widget, specifically the sp-action-button, with a product filter. This is useful for dynamically loading or configuring widget behavior based on product context.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-action-button.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP Host Information (Photoshop)
DESCRIPTION: Retrieves host information for UXP applications, specifically configured for Adobe Photoshop. This component likely provides details about the host environment, such as version, platform, and capabilities.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Host Information/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Host Information/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Importing WritableStream
DESCRIPTION: Demonstrates how to import the WritableStream class from the uxp-documentation library for use in UXP development.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Streams/WritableStream.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Streams/WritableStream";
```

----------------------------------------

TITLE: Display UXP Command Information for Adobe XD
DESCRIPTION: Renders the UxpCommandInfo component, querying for product information related to Adobe XD. This is likely used to display specific commands or features available in UXP for XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Entry Points/UxpCommandInfo.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: FileSystemProvider Usage for Adobe XD
DESCRIPTION: Demonstrates how to import and use the FileSystemProvider for persistent file storage in UXP applications, specifically configured for Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Persistent File Storage/FileSystemProvider.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/FileSystemProvider";

// Example usage within a UXP component:
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Using Spectrum UXP Button Widget
DESCRIPTION: Demonstrates how to use a built-in Spectrum UXP button widget. These widgets mimic SWC APIs and are used directly as HTML tags.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-spectrum/index.md#_snippet_0

LANGUAGE: html
CODE:
```
<sp-button variant="primary">I'm a Spectrum button</sp-button>
```

----------------------------------------

TITLE: Query UXP API Versions for a Product
DESCRIPTION: Demonstrates how to use the UXP API to query for version information related to a specific product, such as Adobe XD. This involves importing a content component and passing a query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Versions/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Versions/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Render Content Component with Product Query
DESCRIPTION: Demonstrates how to use the imported Content component, likely for rendering documentation or UI elements, with a query parameter specifying the product as 'xd'.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML DOM/CharacterData.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: WritableStreamDefaultWriter API Documentation
DESCRIPTION: Provides detailed API documentation for the WritableStreamDefaultWriter interface, including its constructor, properties, and methods for managing writable streams.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/Streams/WritableStreamDefaultWriter.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
WritableStreamDefaultWriter:
  __init__(stream: WritableStream)
    Constructs a new WritableStreamDefaultWriter object.
    Parameters:
      stream: The WritableStream to associate with this writer.
    Returns: WritableStreamDefaultWriter

  closed : Promise<void>
    A Promise that fulfills when the stream is closed or rejects if the stream errors or the writer's lock is released.

  desiredSize : number | null
    The desired size required to fill the stream's internal queue. Returns null if the stream cannot be written to, or zero if the stream is closed.
    Throws:
      TypeError: If the writer's lock is released.

  ready : Promise<void>
    A Promise that resolves when the stream's internal queue is ready for writing (transitions from non-positive to positive desired size). Rejects if the stream errors or the writer's lock is released.

  abort(reason: string) : Promise<void>
    Aborts the stream, discarding queued writes and moving the stream to an errored state.
    Parameters:
      reason: A string indicating the reason for the abort.
    Returns: Promise<void>: Fulfills if the stream shuts down successfully, rejects on error or if the stream is locked.
    Throws:
      TypeError: If the stream is not a WritableStream or is locked.

  close() : Promise<void>
    Closes the stream, ensuring all remaining chunks are written successfully.
    Returns: Promise<void>: Fulfills on successful closure, rejects on error or if the stream is locked.
    Throws:
      TypeError: If the stream is locked.

  releaseLock() : void
    Releases the writer's lock on the associated stream. The writer becomes inactive.

  write(chunk: *) : Promise<void>
    Writes a chunk to the writable stream.
    Parameters:
      chunk: The data chunk to write.
    Returns: Promise<void>: Resolves on successful write, rejects on failure.
    Throws:
      TypeError: If the stream is not a writable stream or does not have an owner.
```

----------------------------------------

TITLE: Importing UXP Documentation Component
DESCRIPTION: Imports the Content component from the uxp-documentation library for displaying UXP API reference CSS styles.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/font-weight.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/font-weight";
```

----------------------------------------

TITLE: Import UxpMenuItems Module
DESCRIPTION: Imports the UxpMenuItems module from the uxp-documentation library, typically used for defining menu items within UXP plugins.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Entry Points/UxpMenuItems.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/UxpMenuItems";
```

----------------------------------------

TITLE: XMPUtils Class Overview
DESCRIPTION: Provides utility functions for the XMP Toolkit, layered upon the XMPMeta object. This class has only static functions and cannot be instantiated. It aids in composing path expressions for nested properties and manipulating metadata trees.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/XMP/XMP Classes/XMPUtils.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
require('uxp').xmp.XMPUtils

**Since**: v7.2.0

## XMPUtils()
This class provides additional utility functions for the XMP Toolkit, layered upon the functionality of the [XMPMeta object](./XMPMeta.md). It has only static functions, you cannot create an instance.

Path-composition functions such as composeArrayItemPath(), provide support for composing path expressions to deeply nested properties, which you can then pass to the accessor functions in [XMPMeta object](./XMPMeta.md), such as xmpmetaobj-getProperty.

Higher-level functions such as xmputils-duplicateSubtree allow you to manipulate the metadata tree in an [XMPMeta object](./XMPMeta.md).
```

----------------------------------------

TITLE: Importing Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library, specifically for UXP API reference regarding streams and queuing strategies.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Streams/CountQueuingStrategy.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Streams/CountQueuingStrategy";
```

----------------------------------------

TITLE: Rendering EntryMetadata Component with Query
DESCRIPTION: Demonstrates how to render the EntryMetadata component, likely a React or similar framework component, with a specific query parameter. The 'product=photoshop' query suggests filtering or configuring the metadata display for Adobe Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Persistent File Storage/EntryMetadata.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Importing UXP Documentation Component
DESCRIPTION: Imports the Content component from the uxp-documentation library, used for displaying UXP API reference documentation.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/border-style.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/border-style";
```

----------------------------------------

TITLE: UXP Plugin Manager - Photoshop Integration
DESCRIPTION: Demonstrates how to use the Plugin Manager module to interact with Photoshop plugins.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Plugin Manager/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Plugin Manager/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Importing and Using Border-Left Styles
DESCRIPTION: Demonstrates how to import and use the Content component for UXP API reference, specifically for CSS border-left styles, with a query parameter for product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/border-left.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/border-left";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Create Folder Entry
DESCRIPTION: Creates a Folder within the current folder and returns the appropriate instance.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_28

LANGUAGE: APIDOC
CODE:
```
createFolder(name)
  Creates a Folder within this folder and returns the appropriate instance.
  Parameters:
    name (String): the name of the folder to create.
  Returns: Promise<Folder> - the created folder entry object
  Example:
    const myCollectionsFolder = await aFolder.createFolder("collections");
```

----------------------------------------

TITLE: Import Persistent File Storage Module
DESCRIPTION: Imports the necessary Content module from the uxp-documentation library for interacting with persistent file storage.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Persistent File Storage/File.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/File";
```

----------------------------------------

TITLE: Importing UXP Documentation Content
DESCRIPTION: Imports the Content component from the UXP documentation for CSS pseudo-elements, targeting Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Pseudo-elements/before.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Pseudo-elements/before";
```

----------------------------------------

TITLE: Accessing Session Storage with a Product Query
DESCRIPTION: Demonstrates how to import and use the Session Storage component, specifying a product context via a query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Data Storage/SessionStorage.md#_snippet_1

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Data Storage/SessionStorage";

// Example usage:
// const sessionStorageData = Content.getItem("myKey");
// Content.setItem("product", "xd");
```

----------------------------------------

TITLE: Importing Content Component
DESCRIPTION: Imports the 'Content' component from the uxp-documentation library, specifically for UXP API reference CSS pseudo-classes.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Pseudo-classes/empty.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Pseudo-classes/empty";
```

----------------------------------------

TITLE: HTMLElement Reference
DESCRIPTION: Provides reference for HTMLElement in UXP, allowing querying for specific product elements.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Elements/HTMLElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLElement";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: HTMLDialogElement Methods
DESCRIPTION: API documentation for showing dialogs in UXP. Includes methods for displaying non-modal and modal dialogs with options for positioning and handling return values.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLDialogElement.md#_snippet_3

LANGUAGE: APIDOC
CODE:
```
HTMLDialogElement:
  show([options]): void
    Shows the non-modal dialog.
    Parameters:
      [options] (object, optional, default={}): Options for the show method.
        [options.anchorOffset] (object):
          Offset from the anchor for the initial positioning of the dialog.
          [options.anchorOffset.top] (number): Top offset from the anchor.
          [options.anchorOffset.left] (number): Left offset from the anchor.

  showModal(): Promise<any>
    Shows the modal dialog.
    Returns: A promise that resolves when the dialog is closed with a return value, or rejects if closed due to user interaction (e.g., Escape key) or application restrictions. The error object may contain a 'code' property indicating the rejection reason.

  close([returnValue]): void
    Closes the dialog. Optionally accepts a returnValue.
```

----------------------------------------

TITLE: Render UXP Content Component
DESCRIPTION: Renders the UXP Content component, likely used for displaying documentation or UI elements. It accepts a query parameter to filter content, such as specifying the product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/border-top-width.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Render Content Component with Query
DESCRIPTION: Renders the imported Content component, likely a UI element or data display, with a specific query parameter for product=photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Streams/ReadableStream.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Content Component for UXP Documentation
DESCRIPTION: Shows how the 'Content' component is used to render documentation for specific UXP API references, filtered by product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML DOM/Path2D.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Import Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library, used for displaying UXP API reference information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/Hierarchy/h1.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/Hierarchy/h1";
```

----------------------------------------

TITLE: Render UxpMenuItem with Product Query
DESCRIPTION: Renders the UxpMenuItem component, specifying 'xd' as the product query parameter. This is likely used to configure the menu item for Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Entry Points/UxpMenuItem.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP CSS Selector Query
DESCRIPTION: Demonstrates how to import and use a UXP component to query CSS selectors for a specific product, like Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Selectors/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css//Selectors/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Import UXP Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library, used for displaying UXP API reference styles.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/background-color.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/background-color";
```

----------------------------------------

TITLE: Importing UXP Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library, used for displaying UXP API reference CSS styles.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/border-width.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/border-width";
```

----------------------------------------

TITLE: UxpMenuItems Class Overview
DESCRIPTION: Provides an overview of the UxpMenuItems class, which represents the menu of a panel. It includes properties like size and methods for accessing, inserting, and removing menu items.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/UxpMenuItems.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
UxpMenuItems:
  size : Number
    Read only
    Get number of menu items

  getItem(id)
    Get menu item with specified id
    Parameters:
      id (string): The ID of the menu item to retrieve.
    Returns: UxpMenuItem

  getItemAt(index)
    Get menu item at specified index
    Parameters:
      index (Number): The index of the menu item to retrieve.
    Returns: UxpMenuItem

  insertAt(index, newItem)
    Inserts/replaces the menu item at the specified index with the new menu item.
    - If index < size of menuItems array: replaces the existing menu item.
    - If index = size of menuItems array: Inserts menu item at end.
    - If index > size of menuItems array: throws invalid index exception.
    Parameters:
      index (Number): The index at which to insert or replace the menu item.
      newItem (Object): The new menu item to insert. See 'entrypoints.setup' API for menu item description.

  removeAt(index)
    Removes menu item from specified index.
    Parameters:
      index (Number): The index of the menu item to remove.
```

----------------------------------------

TITLE: Import Local File System Module
DESCRIPTION: Imports the Persistent File Storage Content component for UXP.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Persistent File Storage/localFileSystem.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/localFileSystem";
```

----------------------------------------

TITLE: Spectrum UXP Body Component
DESCRIPTION: Imports and uses the Spectrum UXP Body component, querying for Photoshop product integration.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/Typography/sp-body.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/Typography/sp-body";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Create Entry with URL - JavaScript
DESCRIPTION: Creates a file or folder entry for a given URL. Supports specifying the entry type (file or folder) and an overwrite option for existing files. Returns a Promise that resolves to a File or Folder object. Throws errors for invalid URLs, non-existent parent folders, or conflicts with existing entries.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/FileSystemProvider.md#_snippet_5

LANGUAGE: javascript
CODE:
```
const newImgFolder = await fs.createEntryWithUrl("plugin-temp:/img", { type: types.folder });
const newTmpFolder = await fs.createEntryWithUrl("file:/Users/user/Documents/tmp", { type: types.folder });
```

LANGUAGE: javascript
CODE:
```
const newDatFile = await fs.createEntryWithUrl("plugin-temp:/tmp/test.dat", { overwrite: true });
const newTxtFile = await fs.createEntryWithUrl("file:/Users/user/Documents/test.txt", { overwrite: true });
```

----------------------------------------

TITLE: Render Photoshop Documentation
DESCRIPTION: Renders documentation content specifically for Photoshop using the imported Content component.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/Hierarchy/h3.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: HTMLScriptElement Usage
DESCRIPTION: Demonstrates the usage of the HTMLScriptElement component within UXP, specifically for querying product information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Elements/HTMLScriptElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLScriptElement";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: FileSystemProvider API Documentation
DESCRIPTION: Provides access to files and folders on a file system. These APIs work with UXP Manifest version v5 and above.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/FileSystemProvider.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
module storage.localFileSystem
  Provides access to files and folders on a file system. You'll typically not instantiate this directly; instead you'll use an instance of one that has already been created for you by UXP.

  These APIs work with UXP Manifest version v5 and above.

  isFileSystemProvider : boolean
    Indicates that this is a FileSystemProvider. Useful for type-checking.

  supportedDomains : Array<Symbol>
    An array of the domains this file system supports. If the file system can open a file picker to the user's documents folder, for example, then [userDocuments](./domains#module-storage-domains-userdocuments) will be in this list.
    Example:
    if (fs.supportedDomains.contains(domains.userDocuments)) {
        console.log("We can open a picker to the user's documents.")
    }

  getFileForOpening(options)
    Gets a file (or files) from the file system provider for the purpose of opening them. Files are read-only.
    Multiple files can be returned if the allowMultiple option is true.
    Returns: Promise<File|Array<File>> based on allowMultiple. Return empty if no file was selected.
    Parameters:
      options: *
        [options.initialDomain]: Symbol - the preferred initial location of the file picker. If not defined, the most recently used domain from a file picker is used instead.
        [options.types]: Array<string> - array of file types that the file open picker displays. Defaults to ['.*'].
        [options.initialLocation]: File | Folder - the initial location of the file picker. You can pass an existing file or folder entry to suggest the picker to start at this location. If this is a file entry then the method will pick its parent folder as initial location. This will override initialDomain option.
        [options.allowMultiple]: boolean - if true, multiple files can be selected. Defaults to false.
    Example:
    const folder = await fs.getFolder({initialDomain: domains.userDocuments});
    const file = await fs.getFileForOpening({initialLocation: folder});
    if (!file) {
        // no file selected
        return;
    }
    const text = await file.read();
    Example:
    const files = await fs.getFileForOpening({allowMultiple: true, types: fileTypes.images});
    if (files.length === 0) {
        // no files selected
    }

  getFileForSaving(suggestedName, options)
    Gets a file reference suitable for read-write. Displays a file picker to select a location to "Save" the file.
    If the act of writing to the file would overwrite it, the file picker will prompt the user to confirm before returning a result to you.
    Returns: Promise<File> - returns the selected file, or null if no file were selected.
    Parameters:
      suggestedName: string - Required when options.types is not defined.
      options: Object
        [options.initialDomain]: Symbol - The preferred initial location of the file picker. If not defined, the most recently used domain from a file picker is used instead.
        [options.types]: Array<string> - Allowed file extensions, with no "." prefix.
    Example:
    const file = await fs.getFileForSaving("output.txt", { types: [ "txt" ]});
    if (!file) {
        // file picker was cancelled
        return;
    }
    await file.write("It was a dark and stormy night");

  getFolder(options)
    Gets a folder from the file system provider.
    Returns: Promise<Folder> - returns the selected folder, or null if no folder was selected.
    Parameters:
      options: *
        [options.initialDomain]: Symbol - the preferred initial location of the file picker. If not defined, the most recently used domain from a file picker is used instead.
        [options.initialLocation]: File | Folder - the initial location of the file picker. You can pass an existing file or folder entry to suggest the picker to start at this location. If this is a file entry then the method will pick its parent folder as initial location. This will override initialDomain option.
    Example:
    const folder = await fs.getFolder({initialDomain: domains.userDocuments});
    if (!folder) {
        // no folder selected
        return;
    }
    const files = await folder.getFiles();

```

----------------------------------------

TITLE: UXP Spectrum Typography Widget (Photoshop)
DESCRIPTION: Demonstrates the usage of UXP Spectrum Typography widgets within the Photoshop product context. This snippet shows how to import and render a Content component with a specific query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/Typography/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/Typography/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Storage Modes Overview
DESCRIPTION: Describes the file open modes for UXP storage, such as read-only or read-write access.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/modes.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
module storage.modes
  This namespace describes the file open modes. for eg: open file in read-only or both read-write

  readOnly : Symbol
    The file is read-only; attempts to write will fail.

  readWrite : Symbol
    The file is read-write.
```

----------------------------------------

TITLE: Importing UXP Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library, used for referencing UXP API styles.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/top.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/top";
```

----------------------------------------

TITLE: Node API Documentation
DESCRIPTION: Documentation for Node-related methods in the UXP API, including checking for containment and retrieving the root node.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML DOM/Text.md#_snippet_4

LANGUAGE: APIDOC
CODE:
```
Node:
  contains(node: Node): boolean
    Checks if the current node contains another node.
    Parameters:
      node: The Node to check for containment.

  getRootNode(options: Object): Node
    Retrieves the root node of the UXP hierarchy.
    Parameters:
      options: An object for specifying retrieval options.
```

----------------------------------------

TITLE: UXP Panel Entrypoints
DESCRIPTION: Details custom entrypoints for UXP panels, allowing host apps to define custom lifecycle events. Photoshop has no custom entrypoints, while XD has an 'update' entrypoint.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/EntryPoints.md#_snippet_3

LANGUAGE: APIDOC
CODE:
```
entrypoints.panels.customEntrypoint: `function`
  Apart from the above default uxp panel entrypoints, Host Apps can define additional entrypoints to support custon lifecycle events. Details of the entrypoint like name, parameters passed, return type, etc. are defined by the host app.
  Currently, Photoshop hasn't defined any custom entrypoints.
  Xd has defined one custom entrypoint `update`.
  update entrypoint in XD is called whenever panel UI content should be updated.
  Parameters : update(scenegraph.selection, scenegraph.update)
  https://developer.adobe.com/xd/uxp/develop/reference/ui/panels/update/
```

----------------------------------------

TITLE: UXP CSS Pseudo-classes - Root
DESCRIPTION: Demonstrates the usage of CSS pseudo-classes within UXP, specifically the ':root' pseudo-class for Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Pseudo-classes/root.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Pseudo-classes/root";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Import UXP Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library, used for displaying UXP API reference CSS styles.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/background.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/background";
```

----------------------------------------

TITLE: UXP Storage Entry API
DESCRIPTION: Provides documentation for the base Entry class in the UXP storage module. Covers properties like name, provider, url, nativePath, and methods for type checking (isEntry, isFile, isFolder).

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
Entry:
  Base class for File and Folder.

  Properties:
    isEntry: Boolean - Indicates this instance is an Entry.
    isFile: Boolean - Indicates this instance is a File.
    isFolder: Boolean - Indicates this instance is a Folder.
    name: String - The name of this entry.
    provider: FileSystemProvider - The associated provider servicing this entry.
    url: String - The URL of this entry.
    nativePath: String - The platform-native file-system path of this entry.

  Methods:
    toString(): String - Returns a readable string representation of the entry.
    copyTo(folder, options): Promise<File | Folder> - Copies this entry to the specified folder.
      Parameters:
        folder: Folder - The destination folder.
        options: Object - Optional settings.
          overwrite: Boolean (default: false) - Allow overwriting existing entries.
          allowFolderCopy: Boolean (default: false) - Allow copying folders.
      Throws:
        EntryExists - If overwriting is not allowed and the entry exists.
        PermissionDenied - If the file system rejects the operation.
        OutOfSpace - If the file system is out of storage space.
    moveTo(folder, options): Promise<void> - Moves this entry to the target folder.
      Parameters:
        folder: Folder - The destination folder.
        options: Object - Optional settings.
          overwrite: Boolean (default: false) - Allow overwriting existing files.
          newName: String - A new name for the entry.
    delete(): Promise<void> - Deletes this entry.
```

----------------------------------------

TITLE: UXP CSS Padding-Top Style
DESCRIPTION: Demonstrates the usage of the padding-top CSS style within the UXP framework. It imports a Content component and applies a query parameter for product integration.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/padding-top.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/padding-top";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Render Content Component with Product Query
DESCRIPTION: Demonstrates how to render the Content component and pass a query parameter to specify the product, in this case, 'xd'. This is useful for filtering or displaying content specific to Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/top.md#_snippet_1

LANGUAGE: jsx
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Import and Use sp-label Component
DESCRIPTION: Demonstrates how to import the sp-label component from the uxp-documentation library and use it with a specific product query.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/Typography/sp-label.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/Typography/sp-label";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP API Reference: Spectrum Web Components
DESCRIPTION: Information on Spectrum Web Components (SWC) support in UXP, including a list of supported components and integration guidance.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/changelog3P.md#_snippet_15

LANGUAGE: APIDOC
CODE:
```
API Reference: Spectrum Web Components

Overview:
  Spectrum Web Components (SWC) are now promoted to release in UXP.
  Use 'swc-uxp-wrappers' to consume these components within UXP.

Supported Components:
  A comprehensive list of supported SWC components can be found at:
  https://developer.adobe.com/photoshop/uxp/2022/uxp-api/reference-spectrum/swc/

React Integration:
  Sample plugins demonstrating SWC integration with React are available:
  - https://github.com/AdobeDocs/uxp-photoshop-plugin-samples/tree/main/swc-uxp-react-starter
  - https://github.com/AdobeDocs/uxp-photoshop-plugin-samples/tree/main/swc-uxp-react-starter

```

----------------------------------------

TITLE: EventTarget API Documentation
DESCRIPTION: Documentation for EventTarget methods in the UXP API, covering adding, removing, and dispatching events.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML DOM/Text.md#_snippet_5

LANGUAGE: APIDOC
CODE:
```
EventTarget:
  addEventListener(eventName: *, callback: *, options: boolean | Object): void
    Attaches an event listener to the target.
    See: [EventTarget - addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
    Parameters:
      eventName: The name of the event to listen for.
      callback: The function to call when the event is triggered.
      options: A boolean value denoting capture or an options object. Currently supports only capture in options object ({ capture: bool_value }).

  removeEventListener(eventName: *, callback: *, options: boolean | Object): void
    Removes an event listener from the target.
    See: [EventTarget - removeEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)
    Parameters:
      eventName: The name of the event to remove.
      callback: The callback function to remove.
      options: A boolean value denoting capture or an options object. Currently supports only capture in options object ({ capture: bool_value }).

  dispatchEvent(event: *): boolean
    Dispatches an event to the target.
    Parameters:
      event: The event to dispatch.
```

----------------------------------------

TITLE: Rendering Content with Query
DESCRIPTION: Renders the imported Content component with a specific query parameter for the product, likely to filter or display product-specific styles.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/color.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Importing and Using CSS Styles in UXP (Photoshop)
DESCRIPTION: Demonstrates how to import and utilize CSS style components within a UXP project targeting Photoshop. It shows a typical import statement and how to apply a query parameter to the imported content.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/border-left.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/border-left";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Response Constructor
DESCRIPTION: Constructs a new Response object. It can take an optional body and an options object to customize status, headers, and status text.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/Data Transfers/Response.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
Response([body], [options])
  Parameters:
    body: string | Blob | ArrayBuffer | TypedArray | FormData | ReadableStream | URLSearchParams - The body of the response. Defaults to null.
    options: Object - Custom settings for the response.
      status: number - The status code of the response. Defaults to 200.
      statusText: string - The status message associated with the status code. Defaults to "".
      headers: Headers | string - Any headers to add to the response. Defaults to {}.
  
```

----------------------------------------

TITLE: Query Persistent File Storage Content
DESCRIPTION: Demonstrates how to query content from the persistent file storage, specifying the product context.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Persistent File Storage/File.md#_snippet_1

LANGUAGE: APIDOC
CODE:
```
Content:
  query(product: string)
    product: The product identifier for which to retrieve content (e.g., "xd").
    Returns: Content related to the specified product from persistent storage.
```

----------------------------------------

TITLE: General UXP Content Scripting (Adobe XD)
DESCRIPTION: This snippet demonstrates how to use the UXP Content component to query information about Adobe XD. It's useful for scripting and automating tasks within XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/General/script.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/General/script";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: HTMLHtmlElement Global Member
DESCRIPTION: Demonstrates the usage of the HTMLHtmlElement global member with a query parameter for product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Elements/HTMLHtmlElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLHtmlElement";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Import UXP Documentation Component
DESCRIPTION: Imports a specific content component from the UXP documentation library, likely for displaying API reference information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/text-align.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/text-align";
```

----------------------------------------

TITLE: Content Component Usage
DESCRIPTION: Demonstrates the usage of the Content component with a product query parameter for Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML DOM/TreeWalker.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Importing and Using Content Component in UXP
DESCRIPTION: Demonstrates how to import the `Content` component from `uxp-documentation` and use it to apply styles, specifically querying for 'product=xd'. This component is likely used to dynamically load or apply CSS based on product context.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/bottom.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/bottom";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP Streams API Reference
DESCRIPTION: Provides the API documentation for the UXP Streams module. This includes details on available methods, parameters, and return values for interacting with data streams.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Streams/index.md#_snippet_1

LANGUAGE: apidoc
CODE:
```
UXPStreams:
  // Represents a stream of data within the UXP environment.
  // Provides methods to subscribe, unsubscribe, and process data.

  subscribe(streamName: string, callback: function, options?: object): Subscription
    // Subscribes to a named data stream.
    // Parameters:
    //   streamName: The name of the stream to subscribe to.
    //   callback: A function to be called when new data is received.
    //   options: Optional configuration for the subscription.
    // Returns: A Subscription object that can be used to unsubscribe.

  unsubscribe(subscription: Subscription): void
    // Unsubscribes from a data stream using a Subscription object.
    // Parameters:
    //   subscription: The Subscription object returned by subscribe().

  // Example Usage:
  // const mySubscription = UXPStreams.subscribe('myDataStream', (data) => {
  //   console.log('Received data:', data);
  // });
  // UXPStreams.unsubscribe(mySubscription);
```

----------------------------------------

TITLE: Import UXP Content Module
DESCRIPTION: Imports the UXP content module for use in JavaScript applications. It allows querying content based on product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js//Modules/index.md";
```

----------------------------------------

TITLE: Import and Use justify-content Component
DESCRIPTION: Demonstrates how to import and use the justify-content component from the UXP documentation library, querying for Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/justify-content.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/justify-content";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: HTMLWebViewElement in UXP
DESCRIPTION: Demonstrates the usage of the HTMLWebViewElement in UXP, specifically for loading content within Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Elements/HTMLWebViewElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLWebViewElement";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Import UXP Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library, used for displaying UXP-related content.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/top.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/top";
```

----------------------------------------

TITLE: Content Component with Photoshop Query
DESCRIPTION: Renders a Content component, likely for displaying UXP-related information, with a query parameter specifying 'product=photoshop' for Photoshop integration.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML DOM/DocumentFragment.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: XMPFile Class Usage with Photoshop
DESCRIPTION: Demonstrates how to use the XMPFile class to interact with XMP metadata in files, with a specific query for Photoshop integration. This snippet likely involves instantiating XMPFile and calling methods to read or write metadata.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/XMP/XMP Classes/XMPFile.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/XMP/XMP Classes/XMPFile.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Importing UXP Documentation Component
DESCRIPTION: Imports the 'Content' component from the UXP documentation for CSS pseudo-classes.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Pseudo-classes/active.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Pseudo-classes/active";
```

----------------------------------------

TITLE: Basic Spectrum UXP Button
DESCRIPTION: Demonstrates the basic usage of a Spectrum UXP button component. This widget is globally available and can be used directly in HTML.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/index.md#_snippet_0

LANGUAGE: html
CODE:
```
<sp-button>Get started!</sp-button>
```

----------------------------------------

TITLE: HTMLVideoElement in UXP
DESCRIPTION: Demonstrates the usage of the HTMLVideoElement within the UXP environment, specifically for Photoshop integration. It shows how to query for product-specific content.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Elements/HTMLVideoElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLVideoElement";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Render Content with Query Parameter
DESCRIPTION: Renders the imported Content component with a specific query parameter, likely to filter documentation for Adobe Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/Hierarchy/footer.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: ReadableStreamDefaultController Import
DESCRIPTION: Imports the ReadableStreamDefaultController from the uxp-documentation library, typically used for managing readable streams in UXP applications.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Streams/ReadableStreamDefaultController.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Streams/ReadableStreamDefaultController";
```

----------------------------------------

TITLE: UXP CSS Selectors Usage with Photoshop
DESCRIPTION: Demonstrates how to use UXP CSS selectors within a Photoshop context. This snippet shows the import of a content component and its usage with a specific query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Selectors/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css//Selectors/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Render Content Component with Query
DESCRIPTION: Renders the imported Content component with a specific query parameter for 'product=xd'. This is likely used to filter or display content related to Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/background.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: WebView Manifest Configuration
DESCRIPTION: Shows the necessary manifest.json configuration for enabling and configuring the WebView component, including permissions for domains and message bridging.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLWebViewElement.md#_snippet_1

LANGUAGE: json
CODE:
```
{
"manifestVersion": 5,
"requiredPermissions": {
    "webview": {
       "allow": "yes",
        "domains": [ "https://*.adobe.com", "https://*.google.com"],
        "enableMessageBridge": "localAndRemote"
     }
  }
}
```

----------------------------------------

TITLE: Render Content Component
DESCRIPTION: Renders the Content component with a query parameter specifying the product as Photoshop. This is likely used to display UXP-related content specific to Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Streams/WritableStreamDefaultWriter.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Importing UXP Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library, used for displaying UXP API reference CSS styles.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/left.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/left";
```

----------------------------------------

TITLE: Import UXP Content Module
DESCRIPTION: Imports the Content module from the uxp-documentation library, used for accessing UXP API reference information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Plugin Manager/Script.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Plugin Manager/Script";
```

----------------------------------------

TITLE: Using Content Component with Query
DESCRIPTION: Demonstrates how to use the imported Content component with a specific query parameter. The 'product=xd' query suggests filtering or targeting content related to Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/margin.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: KeyboardEvent Methods
DESCRIPTION: Details the methods available on KeyboardEvent objects for managing event modifiers, initialization, and propagation.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Events/KeyboardEvent.md#_snippet_1

LANGUAGE: APIDOC
CODE:
```
KeyboardEvent Methods:

  getModifierState(keyArgs: string): boolean
    - Checks if a modifier key is active.
    - Parameters:
      - keyArgs: The name of the modifier key to check (e.g., 'Alt', 'Control', 'Shift', 'Meta').
    - Returns: true if the modifier key is pressed, false otherwise.

  initEvent(typeArg: string, bubblesArg: boolean, cancelableArg: boolean): void
    - Initializes the event.
    - Parameters:
      - typeArg: The event type.
      - bubblesArg: Whether the event bubbles.
      - cancelableArg: Whether the event is cancelable.

  composedPath(): EventTarget[]
    - Returns the event's path.
    - See: https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath

  preventDefault(): void
    - Cancels the event if it is cancelable.

  stopImmediatePropagation(): void
    - Prevents further propagation of the current event and prevents any listeners from being called.

  stopPropagation(): void
    - Prevents further propagation of the current event.
```

----------------------------------------

TITLE: Render Content Component with Product Query
DESCRIPTION: Renders the imported Content component, specifying 'xd' as the product query parameter. This is likely used to fetch or display documentation specific to Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/Hierarchy/h2.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Importing UXP Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library, used for displaying UXP API reference CSS styles.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/color.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/color";
```

----------------------------------------

TITLE: Import WritableStreamDefaultController
DESCRIPTION: Imports the WritableStreamDefaultController class from the uxp-documentation library, used for managing writable streams in UXP applications.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Streams/WritableStreamDefaultController.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Streams/WritableStreamDefaultController";
```

----------------------------------------

TITLE: HTMLMenuElement Usage in UXP
DESCRIPTION: Demonstrates how to use the HTMLMenuElement in UXP, specifically for Photoshop, by querying product information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Elements/HTMLMenuElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLMenuElement";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Import Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library for rendering documentation content.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/Hierarchy/h3.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/Hierarchy/h3";
```

----------------------------------------

TITLE: Render UXP Content Component
DESCRIPTION: Renders the Content component from the uxp-documentation library, likely used to display specific UXP-related content based on a query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/os/OS.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Importing UXP Documentation Component
DESCRIPTION: Imports the Content component from the UXP documentation library, specifically for CSS pseudo-classes.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Pseudo-classes/first-child.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Pseudo-classes/first-child";
```

----------------------------------------

TITLE: XMPProperty Methods for Photoshop
DESCRIPTION: Provides documentation for methods associated with the XMPProperty class when used with Photoshop. These methods allow for the retrieval and manipulation of XMP metadata.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/XMP/XMP Classes/XMPProperty.md#_snippet_1

LANGUAGE: APIDOC
CODE:
```
XMPProperty:
  // Methods for interacting with XMP data in Photoshop
  getProperty(propertyName: str) -> str
    Retrieves the value of a specific XMP property.
    Parameters:
      propertyName: The name of the XMP property to retrieve.
    Returns: The string value of the property.

  setProperty(propertyName: str, value: str) -> None
    Sets the value of a specific XMP property.
    Parameters:
      propertyName: The name of the XMP property to set.
      value: The new string value for the property.

  removeProperty(propertyName: str) -> None
    Removes a specific XMP property.
    Parameters:
      propertyName: The name of the XMP property to remove.
```

----------------------------------------

TITLE: Import Persistent File Storage Module
DESCRIPTION: Imports the Persistent File Storage module from the uxp-documentation library, which is used to manage persistent data storage within UXP plugins.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Persistent File Storage/domains.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/domains";
```

----------------------------------------

TITLE: XMPMeta Class Overview
DESCRIPTION: Provides core services for XMP Toolkit, enabling creation and querying of metadata properties and namespaces. It offers static functions for namespace and alias management.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/XMP/XMP Classes/XMPMeta.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
XMPMeta
This class provides the core services of the XMP Toolkit. The functions provide the ability to create and query metadata properties from an XMP namespace. The class also provides static functions that allow you to create and query namespaces and aliases.

There is one static property on the class that provides XMP version information; there are no JavaScript properties in the instance. The object encapsulates a set of metadata properties, which you access through the object functions.

The generic functions [getProperty()](#getpropertyschemans-propname-valuetype), [setProperty()](#setpropertyschemans-propname-propvalue-setoptions-valuetype), and [deleteProperty()](#deletepropertyschemans-propname) allow you to manipulate all types of properties, when used with appropriately composed path expressions. For convenience, the object also provides more specific functions for use with specific types of properties, such as arrays.

**Since**: v7.2.0
```

----------------------------------------

TITLE: UXP CSS Styles Background Size
DESCRIPTION: Demonstrates how to use the background-size CSS style within UXP, querying for Photoshop product specifics.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/background-size.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/background-size";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Font Size Styling in UXP
DESCRIPTION: Demonstrates how to apply font size styling using the UXP CSS reference for Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/font-size.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/font-size";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: MessageEvent API Documentation
DESCRIPTION: Provides a comprehensive overview of the MessageEvent API, including its constructor, properties, and methods. This documentation is crucial for handling cross-origin communication and events within UXP applications.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Events/MessageEvent.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
window.MessageEvent:
  Constructor: MessageEvent(data, origin, source, eventInit)
    - data: The data sent by the server.
    - origin: The origin of the message.
    - source: The messageEventSource.
    - eventInit: Initialization parameters for the event.

  Properties:
    - data: string - Returns the data sent by the server.
    - origin: string - Returns the origin of the message.
    - source: string - Returns the string indicating the messageEventSource.
    - type: string - Read only. The name of the event.
    - isTrusted: boolean - Read only. Indicates if the event was initiated by the user.
    - target: Node - Read only. The target EventTarget to which the event was originally dispatched.
    - currentTarget: Node - Read only. The EventTarget to which the event is currently being dispatched.
    - bubbles: boolean - Read only. Indicates whether the event bubbles.
    - cancelable: boolean - Read only. Indicates whether the event is cancelable.
    - composed: boolean - Read only. Indicates whether the event will trigger listeners outside of a shadow root.
    - eventPhase: string - Read only. Returns the current phase of the event flow.
    - defaultPrevented: boolean - Read only. Indicates whether preventDefault() has been called.
    - returnValue: any - Used to determine the return value of the event.

  Methods:
    - initEvent(typeArg, bubblesArg, cancelableArg)
      - typeArg: string - The event type.
      - bubblesArg: boolean - Whether the event bubbles.
      - cancelableArg: boolean - Whether the event is cancelable.
    - composedPath(): string[] - Returns the event's path.
    - preventDefault(): void - Cancels the event if it is cancelable.
    - stopImmediatePropagation(): void - Prevents further propagation of the current event in the bubbling phase.
    - stopPropagation(): void - Prevents further propagation of the current event in the capturing and bubbling phases.
```

----------------------------------------

TITLE: Element API Methods
DESCRIPTION: Provides documentation for common Element methods in UXP, including query selectors, attribute manipulation, and pointer capture.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLDialogElement.md#_snippet_10

LANGUAGE: APIDOC
CODE:
```
removeAttributeNode(oldAttr)
  - Removes an attribute node from an element.
  - Parameters:
    - oldAttr: The attribute node to remove.

click()
  - Simulates a mouse click on the element.

getElementsByClassName(name)
  - Returns a NodeList of all descendant elements with the specified class name.
  - Parameters:
    - name: The class name to search for.
  - Returns: NodeList

getElementsByTagName(name)
  - Returns a NodeList of all descendant elements with the specified tag name.
  - Parameters:
    - name: The tag name to search for.
  - Returns: NodeList

querySelector(selector)
  - Returns the first descendant element that matches the specified CSS selector.
  - Parameters:
    - selector: The CSS selector to match.
  - Returns: Element

querySelectorAll(selector)
  - Returns a NodeList of all descendant elements that match the specified CSS selector.
  - Parameters:
    - selector: The CSS selector to match.
  - Returns: NodeList

setPointerCapture(pointerId)
  - Sets pointer capture for the element. This implementation does not dispatch the `gotpointercapture` event on the element.
  - Throws: DOMException if the element is not connected to the DOM.
  - Parameters:
    - pointerId: The unique identifier of the pointer to be captured.
  - Example:
    ```js
    // HTML
    // <div id="slider">SLIDE ME</div>

    // JS
    function beginSliding(e) {
         slider.setPointerCapture(e.pointerId);
         slider.addEventListener("pointermove", slide);
     }

     function stopSliding(e) {
         slider.releasePointerCapture(e.pointerId);
         slider.removeEventListener("pointermove", slide);
     }

     function slide(e) {
         slider.style.left = e.clientX;
     }

     const slider = document.getElementById("slider");

     slider.addEventListener("pointerdown", beginSliding);
     slider.addEventListener("pointerup", stopSliding);
    ```

releasePointerCapture(pointerId)
  - Releases pointer capture for the element. This implementation does not dispatch the `lostpointercapture` event on the element.
  - Parameters:
    - pointerId: The unique identifier of the pointer to be released.

hasPointerCapture(pointerId)
  - Checks if the element has pointer capture for the specified pointer.
  - Parameters:
    - pointerId: The unique identifier of the pointer to check.
  - Returns: boolean - True if the element has pointer capture for the specified pointer, false otherwise.

getBoundingClientRect()
  - Returns a DOMRect object providing information about the size of an element and its position relative to the viewport.
  - Returns: *

closest(selectorString)
  - Returns the closest ancestor element (or the element itself) that matches the specified CSS selector.
  - Parameters:
    - selectorString: The CSS selector to match.
  - Returns: Element
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/closest

matches(selectorString)
  - Tests whether an element matches a CSS selector.
  - Parameters:
    - selectorString: The CSS selector to match.
  - Returns: boolean
  - See: https://developer.mozilla.org/en-US/docs/Web/API/Element/matches

insertAdjacentHTML(position, value)
  - Inserts an HTML string into the DOM at a specified position relative to the element.
  - Parameters:
    - position: Specifies the position relative to the element (e.g., 'beforebegin', 'afterbegin', 'beforeend', 'afterend').
    - value: The HTML string to insert.

insertAdjacentElement(position, node)
  - Inserts a given DOM node into the DOM at a specified position relative to the element.
  - Parameters:
    - position: Specifies the position relative to the element.
    - node: The DOM node to insert.
  - Returns: Node

insertAdjacentText(position, text)
  - Inserts a given text node into the DOM at a specified position relative to the element.
  - Parameters:
    - position: Specifies the position relative to the element.
    - text: The text to insert.

```

----------------------------------------

TITLE: Content Component with Query Parameter
DESCRIPTION: A component used for displaying content, with a query parameter to filter by product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML DOM/ResizeObserverEntry.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Render UXP Content for Photoshop
DESCRIPTION: Renders UXP content specifically for Adobe Photoshop, likely displaying version information or related features.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Versions/Versions.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Spectrum UXP Widget: sp-link
DESCRIPTION: Demonstrates the usage of the sp-link component from Spectrum UXP Widgets, allowing for the creation of clickable links within the UXP interface. It supports querying for specific product integrations.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-link.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-link";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Sp-Label Component Usage
DESCRIPTION: Demonstrates how to import and use the Sp-Label component with a specific product query.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/Typography/sp-label.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/Typography/sp-label";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: ProgressEvent API Documentation
DESCRIPTION: Comprehensive documentation for the ProgressEvent interface, including its constructor, properties, and inherited Event methods.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Events/ProgressEvent.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
ProgressEvent:
  Constructor:
    ProgressEvent(typeArg, [eventInit])
    - Creates an instance of ProgressEvent.
    - Parameters:
      - typeArg: *
      - eventInit: * (optional, defaults to {})

  Properties:
    lengthComputable: Read only
    loaded: Read only
    total: Read only
    type: Read only
    isTrusted: boolean (Read only)
    target: Node (Read only)
    currentTarget: Node (Read only)
    bubbles: boolean (Read only)
    cancelable: boolean (Read only)
    composed: boolean (Read only)
    eventPhase: Read only
    defaultPrevented: boolean (Read only)
    returnValue: *

  Methods:
    initEvent(typeArg, bubblesArg, cancelableArg)
      - Parameters:
        - typeArg: string
        - bubblesArg: boolean
        - cancelableArg: boolean

    composedPath(): Returns the event's path.

    preventDefault():

    stopImmediatePropagation():

    stopPropagation():

  See:
    - https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent
    - https://xhr.spec.whatwg.org/#progressevent
    - https://dom.spec.whatwg.org/#dom-event-composedpath
```

----------------------------------------

TITLE: Render Persistent File Storage Component
DESCRIPTION: Renders the Persistent File Storage component, querying for Photoshop product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/Persistent File Storage/localFileSystem.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Importing UXP Documentation Component
DESCRIPTION: Imports the 'Content' component from the UXP documentation library, specifically for CSS pseudo-classes.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Pseudo-classes/active.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Pseudo-classes/active";
```

----------------------------------------

TITLE: UXP Text Component
DESCRIPTION: Demonstrates the usage of the Text component within UXP, allowing for dynamic content rendering based on a query.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML DOM/Text.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML DOM/Text";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Spectrum UXP Widgets for Photoshop
DESCRIPTION: This snippet demonstrates how to use Spectrum UXP Widgets within the UXP environment, specifically querying for Photoshop products. It highlights the integration of UXP components with Adobe applications.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: XMPFile Constructor and Parameters
DESCRIPTION: The XMPFile constructor initializes an XMPFile object, requiring the file path, its format, and flags to control how the file is opened. The format and openFlags parameters use constants defined in XMPConst to specify file types and access modes.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/XMP/XMP Classes/XMPFile.md#_snippet_4

LANGUAGE: APIDOC
CODE:
```
XMPFile(filePath, format, openFlags)
  Parameters:
    filePath (string): The path of the document file.
    format (number): The file format constant (e.g., XMPConst.FILE_PHOTOSHOP).
    openFlags (number): Flags for opening the file. Options include:
      - XMPConst.OPEN_FOR_READ: Read-only access.
      - XMPConst.OPEN_FOR_UPDATE: Read and write access.
      - XMPConst.OPEN_ONLY_XMP: Optimize for retrieving only XMP data.
      - XMPConst.OPEN_STRICTLY: Strict XMP location and reconciliation.
      - XMPConst.OPEN_USE_SMART_HANDLER: Use smart handler, no packet scanning.
      - XMPConst.OPEN_USE_PACKET_SCANNING: Force packet scanning.
      - XMPConst.OPEN_LIMITED_SCANNING: Scan only files known to need it.
```

----------------------------------------

TITLE: UXP Hierarchy Content Component
DESCRIPTION: Renders UXP Hierarchy API documentation content, allowing filtering by product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/Hierarchy/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html//Hierarchy/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Render Content with Query
DESCRIPTION: Renders the imported Content component with a specific query parameter. The query 'product=xd' suggests filtering or targeting content related to Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/letter-spacing.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Spectrum UXP Radio Button Widget
DESCRIPTION: Demonstrates the usage of the sp-radio component from Spectrum UXP Widgets, configured for Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-radio.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-radio";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Attr Interface Documentation
DESCRIPTION: Provides a comprehensive reference for the Attr interface, including its constructor, properties, and methods. This is based on the Web API specification.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML DOM/Attr.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
Attr:
  __init__(document, nodeName)
    Creates an instance of Attr.
    Parameters:
      document: Document
      nodeName: string

  Properties:
    nodeName: string (Read only)
    localName: string (Read only)
    name: string (Read only)
    specified: boolean (Read only)
    value: *
    nodeType: number (Read only)
    nodeValue: *
    ownerElement: Element (Read only)
    contentEditable: (Read only)
    isConnected: boolean (Read only)
    parentNode: Node (Read only)
    parentElement: Element (Read only)
    firstChild: Node (Read only)
    lastChild: Node (Read only)
    previousSibling: Node (Read only)
    nextSibling: Node (Read only)
    firstElementChild: Node (Read only)
    lastElementChild: Node (Read only)
    previousElementSibling: Node (Read only)
    nextElementSibling: Node (Read only)
    textContent: string
    childNodes: NodeList (Read only)
    children: HTMLCollection (Read only)
    ownerDocument: (Read only)
    attributes: (Read only)

  Methods:
    remove()
    hasChildNodes(): boolean
    cloneNode(deep): Node
      Parameters:
        deep: boolean
    appendChild(child): Node
      Parameters:
        child: Node
    insertBefore(child, before): Node
      Parameters:
        child: Node
        before: Node
    replaceChild(newChild, oldChild): Node
      Parameters:
        newChild: Node
        oldChild: Node
    removeChild(child): Node
      Parameters:
        child: Node
    before(...nodes)
      Parameters:
        ...nodes: Array<Node>
    after(...nodes)
      Parameters:
        ...nodes: Array<Node>
    replaceWith(...nodes)
      Parameters:
        ...nodes: Array<Node>
    contains(node)
      Parameters:
        node: Node
    getRootNode(options): Node
      Parameters:
        options: Object
    addEventListener(eventName, callback, options)
      See: EventTarget - addEventListener
      Parameters:
        eventName: *
        callback: *
        options: boolean | Object
    removeEventListener(eventName, callback, options)
      Parameters:
        eventName: *
        callback: *
        options: boolean | Object
```

----------------------------------------

TITLE: Render Content for Adobe XD
DESCRIPTION: Renders content specifically for Adobe XD by querying the Content component with the product set to 'xd'.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/General/body.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: HTMLTemplateElement in UXP
DESCRIPTION: Demonstrates the usage of the HTMLTemplateElement within the UXP environment, specifically for querying product information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Elements/HTMLTemplateElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLTemplateElement";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Render UXP Content with Query
DESCRIPTION: Renders the imported Content component with a specific query parameter, likely to filter or specify content related to 'product=xd'.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/background-color.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: HTMLButtonElement Usage in UXP
DESCRIPTION: Demonstrates the usage of the HTMLButtonElement within the UXP environment, specifically for Photoshop. It shows how to query for product-specific configurations.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Elements/HTMLButtonElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLButtonElement";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP CSS Media Query - Width
DESCRIPTION: Demonstrates how to use UXP's CSS media query functionality to apply styles based on product width. This component likely targets specific UXP products.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Media Queries/width.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Media Queries/width";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Rendering UXP Content Component with Query
DESCRIPTION: Renders the imported 'Content' component with a specific query parameter for 'product=photoshop'. This is likely used to display UXP-related content filtered for Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Pseudo-classes/active.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP CSS Styles - Padding Bottom
DESCRIPTION: Demonstrates the usage of padding-bottom CSS style within the UXP framework. It imports a Content component and applies a query parameter for product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/padding-bottom.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/padding-bottom";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Event API Documentation
DESCRIPTION: Comprehensive documentation for the Event API, including its constructor, properties, and methods. This API is used for creating and managing events within the UXP environment.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Events/Event.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
Event:
  Constructor:
    Event(eventType, eventInit)
      - Creates an instance of Event.
      - Parameters:
        - eventType: *
        - eventInit: *

  Properties:
    type: *
      - Read only.
    isTrusted: boolean
      - Read only.
    target: Node
      - Read only.
    currentTarget: Node
      - Read only.
    bubbles: boolean
      - Read only.
    cancelable: boolean
      - Read only.
    composed: boolean
      - Read only.
    eventPhase: *
      - Read only.
    defaultPrevented: boolean
      - Read only.
    returnValue: *

  Methods:
    initEvent(typeArg, bubblesArg, cancelableArg)
      - Parameters:
        - typeArg: string
        - bubblesArg: boolean
        - cancelableArg: boolean

    composedPath(): *
      - Returns the event's path.
      - See: https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath, https://dom.spec.whatwg.org/#dom-event-composedpath

    preventDefault(): void

    stopImmediatePropagation(): void

    stopPropagation(): void

  Constants:
    NONE: *
    CAPTURING_PHASE: *
    AT_TARGET: *
    BUBBLING_PHASE: *
```

----------------------------------------

TITLE: Importing UXP Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library, specifically for CSS styles and padding references.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/padding.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/padding";
```

----------------------------------------

TITLE: Import Persistent File Storage Entry
DESCRIPTION: Imports the Entry component from the UXP documentation for persistent file storage.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Persistent File Storage/Entry.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/Entry";
```

----------------------------------------

TITLE: UXP Shell Module Import
DESCRIPTION: Imports the Content component from the uxp-documentation library, likely used for rendering API reference documentation.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/shell/Shell.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/shell/Shell";
```

----------------------------------------

TITLE: ReadableStream Global Member
DESCRIPTION: Demonstrates the usage of the ReadableStream global member within UXP, specifically for querying product information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Streams/ReadableStream.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Streams/ReadableStream";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Apply UXP Styles with Product Query
DESCRIPTION: Applies imported UXP styles to a specific product (e.g., Adobe XD) using a query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/border-right-style.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: HTMLOptionElement in UXP
DESCRIPTION: Demonstrates the usage of the HTMLOptionElement within the Adobe UXP environment, specifically when querying for product information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Elements/HTMLOptionElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLOptionElement";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Loading a Script with HTML
DESCRIPTION: Demonstrates how to load an external JavaScript file using the HTML script tag. This is the standard method for including scripts in web-based environments.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-html/General/script.md#_snippet_0

LANGUAGE: html
CODE:
```
<script src="index.js"></script>
```

----------------------------------------

TITLE: Import UXP Content Component
DESCRIPTION: Imports the Content component from the UXP documentation library for referencing hierarchy information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/Hierarchy/hr.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/Hierarchy/hr";
```

----------------------------------------

TITLE: UXP HTML Element Reference
DESCRIPTION: Provides reference documentation for HTML elements used within the UXP environment. This component allows querying for specific product documentation.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Elements/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: HTMLLabelElement Usage in UXP
DESCRIPTION: Demonstrates how to use the HTMLLabelElement within the UXP environment, specifically querying for Photoshop products.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Elements/HTMLLabelElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLLabelElement";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: HTMLBodyElement in UXP
DESCRIPTION: Demonstrates the usage of the HTMLBodyElement within the UXP environment, specifically for querying product information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Elements/HTMLBodyElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLBodyElement";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Rendering UXP Shell API Reference
DESCRIPTION: Renders the UXP Shell API reference documentation, specifically filtered for Photoshop products. This component likely displays detailed information about the methods and properties available in the Shell module.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/shell/Shell.md#_snippet_1

LANGUAGE: jsx
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Spectrum Typography Widget
DESCRIPTION: Demonstrates the usage of UXP Spectrum Typography widgets, specifically for Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/Typography/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets//Typography/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Content Component with Product Query
DESCRIPTION: Demonstrates the usage of a 'Content' component, likely a custom UXP component, with a 'product' query parameter set to 'xd'. This suggests a way to filter or configure content based on a specific Adobe product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Elements/HTMLButtonElement.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Render Content Component with Query
DESCRIPTION: Renders the imported Content component with a specific query parameter for 'product=photoshop'. This is likely used to fetch or display Photoshop-specific UXP content.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/border-bottom-right-radius.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Importing and Using UXP Content Component
DESCRIPTION: Demonstrates how to import the `Content` component from the UXP documentation library and use it with a specific query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Pseudo-classes/defined.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Pseudo-classes/defined";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Import WritableStreamDefaultController
DESCRIPTION: Imports the WritableStreamDefaultController class from the uxp-documentation library for use in UXP development.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Streams/WritableStreamDefaultController.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Streams/WritableStreamDefaultController";
```

----------------------------------------

TITLE: UXP Hierarchy Links
DESCRIPTION: Provides links to documentation for different levels of the UXP hierarchy, from h1 to h6, and horizontal rules.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-html/Hierarchy/index.md#_snippet_0

LANGUAGE: markdown
CODE:
```
* [footer](footer.md)
* [h1](h1.md)
* [h2](h2.md)
* [h3](h3.md)
* [h4](h4.md)
* [h5](h5.md)
* [h6](h6.md)
* [hr](hr.md)
```

----------------------------------------

TITLE: Content Component Usage
DESCRIPTION: Renders the Content component with a query parameter for 'product=xd'. This is likely used to display specific documentation related to Adobe XD within the UXP framework.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Events/ErrorEvent.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: XMPProperty Class Initialization
DESCRIPTION: Initializes an XMPProperty object. This class is used to represent and manipulate XMP properties within UXP applications, particularly when interacting with Adobe Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/XMP/XMP Classes/XMPProperty.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
XMPProperty:
  __init__(product: str, query: str = None)
    product: Specifies the Adobe product context, e.g., 'photoshop'.
    query: An optional query string for more specific data retrieval or filtering.
```

----------------------------------------

TITLE: Rendering UXP Documentation Content
DESCRIPTION: Renders the imported Content component, likely to display documentation related to CSS border-style for a specific product (e.g., Adobe XD).

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/border-style.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP Persistent File Storage API Reference
DESCRIPTION: Provides a comprehensive reference for the UXP Persistent File Storage API, covering methods for file operations, storage management, and error handling.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Persistent File Storage/index.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
PersistentFileStorage:
  __init__(product: str)
    product: The product identifier for storage context (e.g., 'xd').

  createFile(fileName: str, content: str | Blob | ArrayBuffer, options?: { overwrite?: boolean }): Promise<FileEntry>
    Creates a new file with the specified name and content.
    - fileName: The name of the file to create.
    - content: The content to write to the file. Can be a string, Blob, or ArrayBuffer.
    - options: Optional configuration for file creation.
      - overwrite: If true, overwrites the file if it already exists.
    - Returns: A Promise that resolves with the FileEntry of the created file.

  readFile(fileName: str): Promise<string | Blob | ArrayBuffer>
    Reads the content of a file.
    - fileName: The name of the file to read.
    - Returns: A Promise that resolves with the file content in the appropriate format.

  deleteFile(fileName: str): Promise<void>
    Deletes a file.
    - fileName: The name of the file to delete.
    - Returns: A Promise that resolves when the file is deleted.

  listFiles(): Promise<FileEntry[]>
    Lists all files in the persistent storage.
    - Returns: A Promise that resolves with an array of FileEntry objects.

  getFileEntry(fileName: str): Promise<FileEntry>
    Retrieves metadata for a specific file.
    - fileName: The name of the file.
    - Returns: A Promise that resolves with the FileEntry for the specified file.

FileEntry:
  name: str
    The name of the file.
  size: number
    The size of the file in bytes.
  createdAt: Date
    The creation timestamp of the file.
  updatedAt: Date
    The last modification timestamp of the file.

Error Handling:
  - Errors may be thrown for invalid file names, insufficient permissions, or storage issues.
  - Specific error types may include FileNotFoundError, PermissionError, StorageError.
```

----------------------------------------

TITLE: Importing UXP Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library, used for displaying UXP API reference CSS styles.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/margin.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/margin";
```

----------------------------------------

TITLE: Import Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library for use in UXP applications.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/Hierarchy/h5.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/Hierarchy/h5";
```

----------------------------------------

TITLE: HTMLMenuElement Usage
DESCRIPTION: Demonstrates the usage of the HTMLMenuElement within Adobe UXP, specifically when querying for a product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Elements/HTMLMenuElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLMenuElement";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: ReadableStreamDefaultReader API
DESCRIPTION: Provides documentation for the ReadableStreamDefaultReader interface, including its constructor, properties, and methods for interacting with readable streams.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/Streams/ReadableStreamDefaultReader.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
window.ReadableStreamDefaultReader:
  Constructor(stream: ReadableStream)
    Description: Creates a new ReadableStreamDefaultReader object and locks the stream to the new reader.
    Parameters:
      - stream: ReadableStream - The stream to create a reader for.
    Returns: ReadableStreamDefaultReader
    Throws:
      - TypeError: If the supplied stream parameter is not a ReadableStream, or it is already locked for reading by another reader.

  closed ⇒ Promise<void>
    Description: Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or the reader’s lock is released before the stream finishes closing.
    Returns: Promise<void>

  cancel(reason: string): Promise<string>
    Description: Cancels the stream, signaling a loss of interest in the stream by a consumer. The supplied reason argument will be given to the underlying source’s cancel() method. The returned promise will fulfill if the stream shuts down successfully, or reject if the underlying source signaled that there was an error doing so. It will reject with a TypeError (without attempting to cancel the stream) if the stream is currently locked.
    Parameters:
      - reason: string - The reason for canceling the stream.
    Returns: Promise<string>
    Throws:
      - TypeError: Thrown if the source is not a ReadableStreamDefaultReader.

  read(): Promise<Object>
    Description: Returns a promise that allows access to the next chunk from the stream’s internal queue, if available.
    Returns: Promise<Object> - If a chunk is available, the promise will be fulfilled with an object of the form { value: theChunk, done: false }.
                           If the stream becomes closed, the promise will be fulfilled with an object of the form { value: undefined, done: true }.
                           If the stream becomes errored, the promise will be rejected with the relevant error.
    Throws:
      - TypeError: Thrown if the source is not a ReadableStreamDefaultReader or if the source is not readable.

  releaseLock(): void
    Description: Releases the reader’s lock on the corresponding stream. After the lock is released, the reader is no longer active. If the associated stream is errored when the lock is released, the reader will appear errored in the same way from now on; otherwise, the reader will appear closed. If the reader’s lock is released while it still has pending read requests, then the promises returned by the reader’s read() method are immediately rejected with a TypeError. Any unread chunks remain in the stream’s internal queue and can be read later by acquiring a new reader.
    Throws:
      - TypeError: Thrown if the source is not a ReadableStreamDefaultReader.
```

----------------------------------------

TITLE: Event Handling Methods
DESCRIPTION: Provides essential methods for managing events, including initializing events with specific parameters, preventing default actions, and controlling event propagation.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Events/PointerEvent.md#_snippet_1

LANGUAGE: APIDOC
CODE:
```
Event Methods:
  initEvent(typeArg, bubblesArg, cancelableArg)
    - typeArg: string - The event type.
    - bubblesArg: boolean - Whether the event bubbles.
    - cancelableArg: boolean - Whether the event is cancelable.

  composedPath(): Node[] - Returns the event's path.

  preventDefault(): void - Prevents the default action of the event.

  stopImmediatePropagation(): void - Stops the propagation of the current event and prevents any listeners from being called.

  stopPropagation(): void - Stops the propagation of the event.
```

----------------------------------------

TITLE: HTMLVideoElement in UXP
DESCRIPTION: Demonstrates the usage of the HTMLVideoElement within the Adobe UXP environment, specifically for querying product information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Elements/HTMLVideoElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLVideoElement";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP HTML Reference
DESCRIPTION: Technical documentation for supported HTML elements and attributes in UXP.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/index.md#_snippet_2

LANGUAGE: APIDOC
CODE:
```
HTML Reference:
  Provides technical documentation for supported HTML elements and attributes in UXP.
  See: reference-html/index.md
```

----------------------------------------

TITLE: UXP Hierarchy Content
DESCRIPTION: Renders UXP hierarchy content, likely for API reference documentation, filtered by a specific product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/Hierarchy/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html//Hierarchy/index.md";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP API Reference for Photoshop
DESCRIPTION: This snippet references the main UXP API documentation for Photoshop, allowing specific queries to filter the API reference.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Render UXP Content Component
DESCRIPTION: Renders the UXP Content component with a specific query parameter. The 'product=xd' query indicates that the content is related to Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/width.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP Element API Documentation
DESCRIPTION: This section details the UXP Element API, providing information on methods for manipulating and interacting with DOM elements. It includes details on attaching shadow DOM, managing attributes, focusing elements, and querying the DOM.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLHeadElement.md#_snippet_3

LANGUAGE: APIDOC
CODE:
```
attachShadow(init)
  Attaches a shadow DOM tree to the specified element and returns a reference to its ShadowRoot.
  Parameters:
    init: An object which contains the fields : mode(open/closed) ,delegatesFocus ,slotAssignment
  Returns: ShadowRoot
  See: Element - attachShadow

focus()
  Sets focus to the element.

blur()
  Removes focus from the element.

getAttribute(name)
  Returns the value of a specified attribute on the element.
  Parameters:
    name: Name of the attribute whose value you want to get. (string)
  Returns: string
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute

setAttribute(name, value)
  Adds or replaces a specified attribute that has been set or changes the value of that attribute.
  Parameters:
    name: Name of the attribute whose value is to be set (string)
    value: Value to assign to the attribute (string)
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute

removeAttribute(name)
  Removes a specified attribute from the element.
  Parameters:
    name: Name of the attribute to remove (string)

hasAttribute(name)
  Returns a boolean indicating whether the element has the specified attribute.
  Parameters:
    name: The name of the attribute to test (string)
  Returns: boolean
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute

hasAttributes()
  Returns a boolean value indicating whether the current element has any attributes or not.
  Returns: boolean
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttributes

getAttributeNames()
  Returns the attribute names of the element as an Array of strings.
  Returns: Array
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNames

getAttributeNode(name)
  Returns the attribute node with the given name.
  Parameters:
    name: The name of the attribute node to retrieve (string)
  Returns: *
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNode

setAttributeNode(newAttr)
  Adds a new attribute node to the element.
  Parameters:
    newAttr: The attribute node to add (*)
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttributeNode

removeAttributeNode(oldAttr)
  Removes a specified attribute node from the element.
  Parameters:
    oldAttr: The attribute node to remove (*)

click()
  Programmatically simulates a mouse click on the element.

getElementsByClassName(name)
  Returns a NodeList of all elements in the document that have the specified class name.
  Parameters:
    name: The class name to search for (string)
  Returns: NodeList

getElementsByTagName(name)
  Returns a NodeList of all elements in the document with the specified tag name.
  Parameters:
    name: The tag name to search for (string)
  Returns: NodeList

querySelector(selector)
  Returns the first Element within the document that matches the specified group of selectors.
  Parameters:
    selector: A string containing one or more CSS selectors separated by commas (string)
  Returns: Element

querySelectorAll(selector)
  Returns a NodeList representing a list of the document's elements that match the specified group of selectors.
  Parameters:
    selector: A string containing one or more CSS selectors separated by commas (string)
  Returns: NodeList

setPointerCapture(pointerId)
  Captures the pointer and redirects all events associated with that pointer to this element.
```

----------------------------------------

TITLE: UXP XMP Classes Reference (Photoshop)
DESCRIPTION: This snippet references the main documentation for UXP XMP Classes, filtered for Photoshop. It serves as an entry point to understanding how to manipulate XMP metadata using UXP in Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/XMP/XMP Classes/index.md#_snippet_0

LANGUAGE: md
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/XMP/XMP Classes/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Query Content for Product
DESCRIPTION: A React component or directive to query content, specifically for the 'xd' product. This is likely used for rendering or fetching product-specific information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Streams/ReadableStreamDefaultReader.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Importing UXP CSS Styles
DESCRIPTION: Demonstrates how to import CSS style components for UXP applications, specifically for styling borders.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/border-bottom-color.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/border-bottom-color";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Spectrum UXP Correlate for h6
DESCRIPTION: Shows how to achieve a similar visual rendering to the h6 element using the Spectrum UXP 'sp-heading' component. This component offers theme-aware styling.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-html/Hierarchy/h6.md#_snippet_1

LANGUAGE: html
CODE:
```
<sp-heading size="XXS">Hello, World</sp-heading>
```

----------------------------------------

TITLE: UXP Photoshop API Reference
DESCRIPTION: This snippet provides access to the UXP API reference for Photoshop. It allows querying specific product information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML DOM/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML DOM/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Spectrum UXP Checkbox Widget
DESCRIPTION: Demonstrates the usage of the sp-checkbox component from the Spectrum UXP Widgets library. This snippet shows how to import and use the component, potentially with specific product queries.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-checkbox.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-checkbox";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP CSS Border Bottom Styling
DESCRIPTION: Demonstrates how to apply bottom border styling using UXP's CSS reference. This component likely takes a query parameter to specify the product context.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/border-bottom.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/border-bottom";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: HTMLTemplateElement in UXP
DESCRIPTION: Demonstrates the usage of the HTMLTemplateElement within the UXP environment, specifically for Photoshop integration. It shows how to query product information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Elements/HTMLTemplateElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLTemplateElement";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Import Spectrum UXP Widget
DESCRIPTION: Imports the Content component from the uxp-documentation library, specifically for Spectrum UXP Widgets and User Interface elements like sp-icon.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-icon.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-icon";
```

----------------------------------------

TITLE: Render Content Component
DESCRIPTION: Renders the Content component with a query parameter specifying the product as 'photoshop'. This is likely used to dynamically load or display content related to Photoshop within the UXP environment.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML DOM/ResizeObserverSize.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Script Module
DESCRIPTION: The Script module in UXP provides essential properties and methods for writing scripts. It allows access to arguments passed by the host application and the execution context.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Plugin Manager/Script.md#_snippet_0

LANGUAGE: javascript
CODE:
```
require('uxp').script;
```

----------------------------------------

TITLE: Using Content Component with Query
DESCRIPTION: Renders the Content component with a specific query parameter, likely to filter or display documentation related to Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/border-top-color.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Compose Qualifier Path
DESCRIPTION: Creates a path expression for a qualifier attached to a property, using the registered namespace prefix. The format is schemaNS:propName/?qualNS:qualName.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/XMP/XMP Classes/XMPUtils.md#_snippet_7

LANGUAGE: APIDOC
CODE:
```
composeQualifierPath(schemaNS: string, propName: string, qualNS: string, qualName: string): string
  Creates and returns a string containing the path expression for a qualifier attached to a property.
  Parameters:
    schemaNS: The namespace URI string. See [Schema namespace string constants](./XMPConst.md#schema-namespace-string-constants).
    propName: The property name string. Can be a general path expression.
    qualNS: The qualifier namespace URI string.
    qualName: The qualifier name. Must be a simple XML name.
  Returns: A string containing the path expression for a qualifier attached to a property.
  Example:
    XMPUtils.composeQualifierPath(schemaNS, propName, qualNS, qualName)
```

----------------------------------------

TITLE: Import Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library for use in UXP applications.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/General/body.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/General/body";
```

----------------------------------------

TITLE: Render Content Component with Product Query
DESCRIPTION: Renders the Content component, likely a custom UXP component, with a specific product query parameter set to 'xd'. This is used to display or configure content related to Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Events/BaseUIEvent.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Importing and Using Content Component for Photoshop
DESCRIPTION: Demonstrates how to import and use a Content component, likely for displaying UXP API reference documentation, with a specific query parameter for Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Pseudo-elements/after.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Pseudo-elements/after";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Importing and Using align-items Component
DESCRIPTION: Demonstrates how to import and use a component related to CSS styles, specifically 'align-items', within a UXP project. It shows a typical import statement and how to render the component with a query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/align-items.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/align-items";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Basic sp-menu Structure
DESCRIPTION: Demonstrates the basic structure of an sp-menu component, including menu items and a divider. This is a standard way to define a menu in UXP.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-menu.md#_snippet_0

LANGUAGE: html
CODE:
```
<sp-menu>
    <sp-menu-item> Deselect </sp-menu-item>
    <sp-menu-item> Select inverse </sp-menu-item>
    <sp-menu-item> Feather... </sp-menu-item>
    <sp-menu-item> Select and mask... </sp-menu-item>
    <sp-menu-divider></sp-menu-divider>
    <sp-menu-item> Save selection </sp-menu-item>
    <sp-menu-item disabled> Make work path </sp-menu-item>
</sp-menu>
```

----------------------------------------

TITLE: XMPFile Batch Metadata Processing
DESCRIPTION: Processes image files in a folder to read, modify, and write XMP metadata. It specifically handles deleting existing creator values and adding a new one. Requires the 'uxp' library.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/XMP/getting-started/xmp.md#_snippet_3

LANGUAGE: js
CODE:
```
console.log( "XMPFiles batch processing example" );
// Load the XMPScript library
const {XMPMeta, XMPConst, XMPFile} = require("uxp").xmp;

// Iterate through the photos in the folder
const uxpfs = require("uxp").storage;
const ufs = uxpfs.localFileSystem;
let folder = await ufs.getFolder({initialDomain: uxpfs.domains.userDocuments});
let files = await folder.getEntries();
files.forEach((file) => {
     console.log( "Process file: " + file.name );

     // Applies only to files, not to folders
     if ( file instanceof Entry ) {
         let xmpFile = new XMPFile( file.nativePath, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_UPDATE );
         let xmp = xmpFile.getXMP();

         // Delete existing authors and add a new one
         // Existing metadata stays untouched
         xmp.deleteProperty( XMPConst.NS_DC, "creator" );
         xmp.appendArrayItem( XMPConst.NS_DC, "creator", "Judy", 0, XMPConst.ARRAY_IS_ORDERED );

         // Write updated metadata into the file
         if ( xmpFile.canPutXMP( xmp ) ) {
             xmpFile.putXMP( xmp );
         }
         xmpFile.closeFile( XMPConst.CLOSE_UPDATE_SAFELY );
     }
}
```

----------------------------------------

TITLE: Using Content Component with Query
DESCRIPTION: Renders the Content component with a specific query parameter for product=xd. This is likely used to fetch or display product-specific information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/max-height.md#_snippet_1

LANGUAGE: jsx
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Import Spectrum UXP Widget
DESCRIPTION: Imports the Content component from the uxp-documentation library, specifically for Spectrum UXP Widgets and User Interface elements.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-icon.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-icon";
```

----------------------------------------

TITLE: UXP Element Component
DESCRIPTION: Demonstrates the usage of the UXP Element component for interacting with application-specific content, such as Photoshop products.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML DOM/Element.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML DOM/Element";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: HTMLHeadElement in UXP
DESCRIPTION: Demonstrates the usage of the HTMLHeadElement within the Adobe UXP environment, specifically for setting product queries.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Elements/HTMLHeadElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLHeadElement";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Background Repeat Styles
DESCRIPTION: Imports and uses the Content component to apply background repeat styles for a specific product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/background-repeat.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/background-repeat";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: HTMLMenuItemElement Usage
DESCRIPTION: Demonstrates the usage of the HTMLMenuItemElement in UXP, specifically for product integration.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Elements/HTMLMenuItemElement.md#_snippet_0

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: HTML Input Element Query
DESCRIPTION: Demonstrates how to use the HTMLInputElement component to query product-specific information, such as for Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Elements/HTMLInputElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLInputElement";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Rendering Content Component with Query
DESCRIPTION: Renders the imported Content component with a specific query parameter, likely to filter or display content related to 'product=xd'.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/flex-grow.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Importing UXP CSS Styles
DESCRIPTION: Imports CSS styles for UXP reference, specifically for visibility properties.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/visibility.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/visibility";
```

----------------------------------------

TITLE: Import ReadableStream Component
DESCRIPTION: Imports the ReadableStream component from the uxp-documentation library for use in UXP plugins.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Streams/ReadableStream.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Streams/ReadableStream";
```

----------------------------------------

TITLE: Manifest Setting for Local File System Access
DESCRIPTION: Required manifest.json permission to enable access to the local file system for UXP plugins.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLWebViewElement.md#_snippet_5

LANGUAGE: json
CODE:
```
// manifest.json
"requiredPermissions": {
  // permission for localFileSystem
  "localFileSystem": "request"
}
```

----------------------------------------

TITLE: Using Content Component with Query
DESCRIPTION: Renders the Content component with a specific query parameter, likely to filter or display content related to Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/opacity.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Spectrum UXP Heading Element Usage
DESCRIPTION: Shows how to use the Spectrum UXP sp-heading component to achieve a similar rendering to the HTML h1 element, with theme-aware styling capabilities.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-html/Hierarchy/h1.md#_snippet_1

LANGUAGE: html
CODE:
```
<sp-heading size="L">Hello, World</sp-heading>
```

----------------------------------------

TITLE: DragEvent Constructor and Properties
DESCRIPTION: Details the creation of DragEvent instances and provides a comprehensive list of its read-only properties, including those inherited from BaseUIEvent and Event.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Events/DragEvent.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
DragEvent:
  __constructor__(type: string, eventInit: object)
    Creates an instance of DragEvent.
    Parameters:
      type: The event type.
      eventInit: An object containing properties to initialize the event.

  dataTransfer: DataTransfer | null
    Read only. The DataTransfer object associated with the event.

  pointerId: number
    Read only. The unique identifier for the pointer.

  width: number
    Read only. The width of the pointer input.

  height: number
    Read only. The height of the pointer input.

  pressure: number
    Read only. The pressure applied by the pointer.

  tangentialPressure: number
    Read only. The tangential pressure applied by the pointer.

  tiltX: number
    Read only. The tilt angle of the pointer along the X-axis.

  tiltY: number
    Read only. The tilt angle of the pointer along the Y-axis.

  twist: number
    Read only. The twist rotation of the pointer.

  clientX: number
    Read only. The X coordinate within the target's padding edge.

  clientY: number
    Read only. The Y coordinate within the target's padding edge.

  offsetX: number
    Read only. The X coordinate of the pointer relative to the padding edge of the target.

  offsetY: number
    Read only. The Y coordinate of the pointer relative to the padding edge of the target.

  pageX: number
    Read only. The X coordinate of the pointer relative to the top-left corner of the document.

  pageY: number
    Read only. The Y coordinate of the pointer relative to the top-left corner of the document.

  screenX: number
    Read only. The X coordinate of the pointer relative to the top-left corner of the screen.

  screenY: number
    Read only. The Y coordinate of the pointer relative to the top-left corner of the screen.

  movementX: number
    Read only. The difference between the current pointer position and the previous pointer position along the X-axis.

  movementY: number
    Read only. The difference between the current pointer position and the previous pointer position along the Y-axis.

  button: number
    Read only. The button that was pressed or released.

  buttons: number
    Read only. The buttons that are currently pressed.

  detail: number
    Read only. The number of times the mouse button was clicked.

  pointerType: string
    Read only. The type of pointer used (e.g., 'mouse', 'pen', 'touch').

  altKey: boolean
    Read only. True if the Alt key was pressed.

  shiftKey: boolean
    Read only. True if the Shift key was pressed.

  metaKey: boolean
    Read only. True if the Meta key (e.g., Command on macOS) was pressed.

  ctrlKey: boolean
    Read only. True if the Control key was pressed.

  isPrimary: boolean
    Read only. True if the pointer is the primary pointer for the current input device.

  which: number
    Read only. The key code of the key that was pressed or released.

  type: string
    Read only. The name of the event.

  isTrusted: boolean
    Read only. True if the event was generated by the user, false otherwise.

  target: Node | null
    Read only. The target Node to which the event was originally dispatched.

  currentTarget: Node | null
    Read only. The target Node to which the event is currently being dispatched.

  bubbles: boolean
    Read only. Indicates whether the event bubbles up through the DOM.

  cancelable: boolean
    Read only. Indicates whether the event can be canceled.

  composed: boolean
    Read only. Indicates whether the event will trigger event listeners outside of a shadow root.

  eventPhase: number
    Read only. The current phase of the event flow.

  defaultPrevented: boolean
    Read only. Indicates whether preventDefault() has been called.

  returnValue: any
    The return value of the event.
```

----------------------------------------

TITLE: UXP Spectrum Reference
DESCRIPTION: Information on Spectrum UXP Widgets and Spectrum Web Components, including their capabilities.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/index.md#_snippet_3

LANGUAGE: APIDOC
CODE:
```
Spectrum UXP Reference:
  Provides information on Spectrum UXP Widgets and Spectrum Web Components, and their capabilities.
  See: reference-spectrum/index.md
```

----------------------------------------

TITLE: Spectrum UXP Widget: sp-menu-item
DESCRIPTION: Demonstrates the usage of the sp-menu-item component within UXP, likely for creating menu structures in applications. It imports a Content component for rendering and queries for product-specific configurations.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-menu-item.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-menu-item";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Importing Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library for use in UXP development.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/Hierarchy/h4.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/Hierarchy/h4";
```

----------------------------------------

TITLE: Import Spectrum UXP Button
DESCRIPTION: Imports the sp-action-button component from the UXP Spectrum library for use in UXP projects. This allows developers to leverage pre-built UI elements.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-action-button.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-action-button";
```

----------------------------------------

TITLE: Rendering Content with Query Parameter
DESCRIPTION: Renders the imported Content component with a specific query parameter, likely to filter or display content related to Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/background.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Node API Methods
DESCRIPTION: Provides documentation for common Node methods in UXP, including checking for child nodes, cloning nodes, and appending/inserting child nodes.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLDialogElement.md#_snippet_11

LANGUAGE: APIDOC
CODE:
```
hasChildNodes()
  - Returns a boolean indicating whether the node has any child nodes.
  - Returns: boolean

cloneNode(deep)
  - Returns a clone of the node.
  - Parameters:
    - deep: If true, all descendants of the node are also cloned. If false, only the node itself is cloned.
  - Returns: Node

appendChild(child)
  - Adds a node to the end of the list of children of a specified parent node. If the node is already in the document, it is removed from its current parent first.
  - Parameters:
    - child: The node to insert.
  - Returns: Node

insertBefore(referenceNode, newNode)
  - Inserts a node into the DOM as a child of a specified parent node, before a specified reference node.
  - Parameters:
    - referenceNode: The node before which the new node should be inserted.
    - newNode: The node to insert.
  - Returns: Node

```

----------------------------------------

TITLE: KeyboardEvent Handling in UXP
DESCRIPTION: Demonstrates how to handle KeyboardEvent in Adobe UXP. This snippet imports a specific KeyboardEvent component and applies a query parameter for product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Events/KeyboardEvent.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Events/KeyboardEvent";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: XMPDateTime Class Documentation
DESCRIPTION: Provides comprehensive documentation for the XMPDateTime class, including its constructor, properties, and methods for date and time manipulation with time zone support.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/XMP/XMP Classes/XMPDateTime.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
require('uxp').xmp.XMPDateTime

XMPDateTime Class

Represents a date and time with time zone support and up to nanosecond resolution.

Constructor:

XMPDateTime()
  Creates an XMPDateTime object with the current date and time.

XMPDateTime(date: Date | string)
  Creates an XMPDateTime object.
  Parameters:
    date: A JavaScript Date object or an ISO 8601 formatted string.
          If a Date object is provided, the time zone is set to the local system's time zone.
          Note: Conversion to/from JavaScript Date reduces time resolution to milliseconds.

Properties:

year: number
  The year, in the range [0000…9999].

month: number
  The month, in the range [1…12].

day: number
  The day, in the range [1…31].

hour: number
  The hour, in the range [1…23].

minute: number
  The minute, in the range [1…59].

second: number
  The second, in the range [1…59].

nanosecond: number
  The nanosecond, in the range [0…1e+9 -1].

tzSign: number
  The time zone direction offset: 0 for UTC, -1 for west, 1 for east.

tzHour: number
  The time zone hour offset from the prime meridian, in the range [1…23].

tzMinute: number
  The time zone minute offset from the prime meridian, in the range [1…59].

Methods:

compareTo(dateTime: XMPDateTime): number
  Reports the time order of two date-time values.
  Returns:
    0 if the two values are the same.
    1 if this date-time is later than the comparison value.
    -1 if this date-time is earlier than the comparison value.

convertToLocalTime(): void
  Sets the time zone in this object to the local operating-system time zone, adjusting time values.

convertToUTCTime(): void
  Sets the time zone in this object to UTC, adjusting time values.

getDate(): Date
  Converts this date-time value to a JavaScript Date object. Time zone is normalized, and accuracy is reduced to milliseconds.
  Returns: A JavaScript Date object.

setLocalTimeZone(): void
  Sets the time zone in this object to the current operation-system value, replacing any existing value. Does not affect other fields.

hasDate(): boolean
  Checks if the date is available.
  Returns: true if the date is available, false otherwise.

hasTime(): boolean
  Checks if the time is available.
  Returns: true if the time is available, false otherwise.

hasTimeZone(): boolean
  Checks if the time zone information is available.
  Returns: true if time zone information is available, false otherwise.

```

----------------------------------------

TITLE: HTMLDialogElement in UXP
DESCRIPTION: Demonstrates the usage of the HTMLDialogElement within the Adobe UXP environment, specifically for querying product information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Elements/HTMLDialogElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLDialogElement";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Content Query for Photoshop User Information
DESCRIPTION: A content query to retrieve user information relevant to Adobe Photoshop using the UXP API.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/User Information/index.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Import Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library for use in UXP applications.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/Hierarchy/h4.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/Hierarchy/h4";
```

----------------------------------------

TITLE: HTMLSelectElement Usage with Content Component
DESCRIPTION: Demonstrates how to use the Content component to query information about an HTMLSelectElement, specifically for the 'xd' product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Elements/HTMLSelectElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLSelectElement";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Applying Product-Specific Content Query
DESCRIPTION: Applies a content query to a component, specifying 'product=xd'. This is used to filter or retrieve content relevant to Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/text-align.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP CSS Styles - Margin Top
DESCRIPTION: Demonstrates the usage of the 'margin-top' CSS style within the UXP framework. It imports a Content component and applies a query parameter for product specification.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/margin-top.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/margin-top";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Using Spectrum Web Component Button
DESCRIPTION: Illustrates the usage of an imported Spectrum Web Component (SWC) button. The tag is identical to Spectrum UXP widgets, but the implementation and debugging differ.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-spectrum/index.md#_snippet_2

LANGUAGE: html
CODE:
```
<sp-button variant="primary">I'm a SWC button</sp-button>
```

----------------------------------------

TITLE: Content Component Usage
DESCRIPTION: Demonstrates the usage of a Content component, likely for rendering or fetching content within the UXP environment. The 'product=xd' query parameter suggests it's configured for Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML DOM/NamedNodeMap.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP Global Members - Document API
DESCRIPTION: This snippet demonstrates the usage of the Document API within UXP, specifically for querying product information. It imports the Content component and uses it to make a query for 'product=xd'.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML DOM/Document.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML DOM/Document";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Render sp-button with Product Query
DESCRIPTION: Renders the sp-button component with a specific query parameter for 'product=xd'. This is a common pattern for configuring UXP components based on the target product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-button.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: HTMLElement Global Member
DESCRIPTION: Imports and uses the HTMLElement component for UXP documentation, querying for a specific product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Elements/HTMLElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLElement";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: window.path API Documentation
DESCRIPTION: Provides utilities for manipulating file and directory paths. Supports string and Entry objects as path parameters. Local file schemes like 'plugin-data:' or 'plugin-temp:' are not resolved to native paths in string paths.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/Path/Path.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
window.path:
  Description: Utilities for working with file and directory paths. Accepts string and Entry objects. Local file schemes are not resolved to native paths in string paths.
  Properties:
    sep: The platform-specific file separator ('\' or '/').
    delimiter: The platform-specific file delimiter (';' or ':').
    posix: Object providing POSIX-specific path implementations.
    win32: Object providing Windows-specific path implementations.
  Methods:
    normalize(path): Normalizes a string path, reducing '..' and '.' parts. Preserves trailing slashes and uses backslashes on Windows. Returns a normalized string path. Throws an Error if path is not a string.
    join(paths): Joins all arguments together and normalizes the resulting path. Returns the joined string path. Throws an Error if any path segment is not a string.
    resolve(paths): Resolves a sequence of paths or path segments to an absolute path. Prepends 'from' paths to 'to' until an absolute path is found, using the current working directory if necessary. Normalizes the result and removes trailing slashes unless it's the root directory. Returns the resolved string path. Throws an Error if any argument is not a string.
    isAbsolute(path): Determines if a path is an absolute path. Returns false for zero-length strings. Returns a boolean. Throws an Error if path is not a string.
    relative(from, to): Solves the relative path from 'from' to 'to' based on the current working directory. Returns the relative string path. Throws an Error if 'from' or 'to' is not a string.
    dirname(path): Returns the directory name of a path. Similar to Unix dirname. Returns the directory name string. Throws an Error if path is not a string.
    basename(path, [ext]): Returns the last portion of a path. Similar to Unix basename. Often used to extract the file name. Returns the last portion string. Throws an Error if path is not a string or if ext is given and is not a string.
    extname(path): Returns the extension of the path, from the last '.' to the end of the string in the last portion of the path. If there is no '.' in the last portion of a non-empty path, an empty string is returned. Returns the extension string. Throws an Error if path is not a string.
```

----------------------------------------

TITLE: Using Content Component with Photoshop Query
DESCRIPTION: Renders the Content component with a query parameter set to 'product=photoshop'. This is likely used to display UXP-related content specific to Adobe Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/border-left-style.md#_snippet_1

LANGUAGE: javascript
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Importing UXP Documentation Component
DESCRIPTION: Imports the `Content` component from the UXP documentation library, specifically for pseudo-classes.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Pseudo-classes/first-child.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Pseudo-classes/first-child";
```

----------------------------------------

TITLE: Manifest Settings for Local WebView Rendering
DESCRIPTION: Shows the required manifest.json configuration to enable local content rendering and message bridging in UXP WebViews.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLWebViewElement.md#_snippet_3

LANGUAGE: json
CODE:
```
"requiredPermissions": {
 "webview": {
     "allow": "yes",
     "domains": [],
     "allowLocalRendering": "yes",
     "enableMessageBridge": "localOnly"
  }
}
```

----------------------------------------

TITLE: Using Content Component with Photoshop Query
DESCRIPTION: Renders the Content component, specifically querying for Photoshop-related product information. This is likely used to display CSS properties or component styles relevant to Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/flex-grow.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: XMLHttpRequest Constructor and Manifest Permissions
DESCRIPTION: Demonstrates how to instantiate an XMLHttpRequest object and the necessary network domain permissions required in the manifest.json file for server interactions.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/Data Transfers/XMLHttpRequest.md#_snippet_0

LANGUAGE: javascript
CODE:
```
const xhr = new XMLHttpRequest();
```

LANGUAGE: json
CODE:
```
{
  "permissions": {
      "network": {
          "domains": [
              "https://www.adobe.com",
              "https://*.adobeprerelease.com",
              "wss://*.myplugin.com"
          ]
      }
  }
}
```

----------------------------------------

TITLE: Render align-items Content for Photoshop
DESCRIPTION: Renders the Content component with a query parameter specifying the product as Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/align-items.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Import Persistent File Storage Formats
DESCRIPTION: Imports the Content component for accessing UXP persistent file storage formats. This is typically used to query and display data related to specific products.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Persistent File Storage/formats.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/formats";
```

----------------------------------------

TITLE: XMPFileInfo Class Documentation
DESCRIPTION: Provides detailed information about the XMPFileInfo class, its properties, and methods for managing XMP metadata within files. This class is essential for developers working with XMP data in UXP plugins.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/XMP/XMP Classes/XMPFileInfo.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
XMPFileInfo:
  __init__(product: str = 'photoshop')
    product: Specifies the product context for XMP operations (e.g., 'photoshop').

  Properties:
    fileInfo: An object containing file-related metadata.

  Methods:
    getFileInfo(): Returns the fileInfo object.
    setFileInfo(info: object): Sets the fileInfo object with provided metadata.
    getMetadata(schema: str, property: str): Retrieves a specific XMP metadata property from a given schema.
    setMetadata(schema: str, property: str, value: any): Sets a specific XMP metadata property.
    removeMetadata(schema: str, property: str): Removes a specific XMP metadata property.
    save(): Saves the current XMP metadata changes to the file.

  Example Usage:
  const xmpFile = new XMPFileInfo('photoshop');
  const fileInfo = xmpFile.getFileInfo();
  console.log(fileInfo);
  
  xmpFile.setMetadata('http://ns.adobe.com/photoshop/1.0/', 'City', 'San Jose');
  xmpFile.save();
```

----------------------------------------

TITLE: UXP Element API Documentation
DESCRIPTION: This section details the UXP Element API, providing information on methods for manipulating and interacting with DOM elements. It includes details on attaching shadow DOM, managing attributes, focusing elements, and querying the DOM.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLLabelElement.md#_snippet_4

LANGUAGE: APIDOC
CODE:
```
attachShadow(init)
  Attaches a shadow DOM tree to the specified element and returns a reference to its ShadowRoot.
  Parameters:
    init: An object which contains the fields : mode(open/closed) ,delegatesFocus ,slotAssignment
  Returns: ShadowRoot
  See: Element - attachShadow

focus()
  Sets focus to the element.

blur()
  Removes focus from the element.

getAttribute(name)
  Returns the value of a specified attribute on the element.
  Parameters:
    name: Name of the attribute whose value you want to get. (string)
  Returns: string
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute

setAttribute(name, value)
  Adds or replaces a specified attribute that has been set or changes the value of that attribute.
  Parameters:
    name: Name of the attribute whose value is to be set (string)
    value: Value to assign to the attribute (string)
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute

removeAttribute(name)
  Removes a specified attribute from the element.
  Parameters:
    name: Name of the attribute to remove (string)

hasAttribute(name)
  Returns a boolean indicating whether the element has the specified attribute.
  Parameters:
    name: The name of the attribute to test (string)
  Returns: boolean
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute

hasAttributes()
  Returns a boolean value indicating whether the current element has any attributes or not.
  Returns: boolean
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttributes

getAttributeNames()
  Returns the attribute names of the element as an Array of strings.
  Returns: Array
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNames

getAttributeNode(name)
  Returns the attribute node with the given name.
  Parameters:
    name: The name of the attribute node to retrieve (string)
  Returns: *
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNode

setAttributeNode(newAttr)
  Adds a new attribute node to the element.
  Parameters:
    newAttr: The attribute node to add (*)
  See: https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttributeNode

removeAttributeNode(oldAttr)
  Removes a specified attribute node from the element.
  Parameters:
    oldAttr: The attribute node to remove (*)

click()
  Programmatically simulates a mouse click on the element.

getElementsByClassName(name)
  Returns a NodeList of all elements in the document that have the specified class name.
  Parameters:
    name: The class name to search for (string)
  Returns: NodeList

getElementsByTagName(name)
  Returns a NodeList of all elements in the document with the specified tag name.
  Parameters:
    name: The tag name to search for (string)
  Returns: NodeList

querySelector(selector)
  Returns the first Element within the document that matches the specified group of selectors.
  Parameters:
    selector: A string containing one or more CSS selectors separated by commas (string)
  Returns: Element

querySelectorAll(selector)
  Returns a NodeList representing a list of the document's elements that match the specified group of selectors.
  Parameters:
    selector: A string containing one or more CSS selectors separated by commas (string)
  Returns: NodeList

setPointerCapture(pointerId)
  Captures the pointer and redirects all events associated with that pointer to this element.
```

----------------------------------------

TITLE: Rendering UXP Content with Query Parameter
DESCRIPTION: Renders the imported UXP content component, passing a query parameter to filter or configure the displayed documentation. In this case, it's set to 'product=xd'.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Pseudo-classes/root.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Accessing Plugin Folders
DESCRIPTION: JavaScript code to access the root folders of 'plugin', 'plugin-data', and 'plugin-temp' using the localFileSystem API.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLWebViewElement.md#_snippet_4

LANGUAGE: javascript
CODE:
```
const localFileSystem = require("uxp").storage.localFileSystem;
const pluginFolder = await localFileSystem.getPluginFolder();
const pluginDataFolder = await localFileSystem.getDataFolder();
const tempFolder = await localFileSystem.getTemporaryFolder();

console.log(`pluginFolder = ${pluginFolder.nativePath}`);
console.log(`pluginDataFolder = ${pluginDataFolder.nativePath}`);
console.log(`pluginTempFolder = ${tempFolder.nativePath}`);
```

----------------------------------------

TITLE: WritableStream Constructor and Methods
DESCRIPTION: Defines the WritableStream constructor and its core methods like abort, close, and getWriter. It also details the properties of the underlyingSink and strategy objects used during stream creation.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/Streams/WritableStream.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
WritableStream:
  __constructor__(underlyingSink: Object, strategy?: Object)
    underlyingSink: Defines how the constructed stream object will behave.
      start(controller): Called immediately when the object is constructed. Can return a promise. The controller parameter is a WritableStreamDefaultController.
      write(chunk, controller): Called when a new chunk of data is ready to be written. Can return a promise. The controller parameter is a WritableStreamDefaultController. Called only after previous writes have succeeded and never after the stream is closed or aborted.
      close(controller): Called if the app signals that it has finished writing chunks. Can return a promise. Called only after all queued-up writes have succeeded. The controller parameter is a WritableStreamDefaultController.
    strategy: Defines a queuing strategy for the stream.
      highWaterMark: The total number of chunks that can be contained in the internal queue before backpressure is applied.
      size(chunk): Indicates the size to use for each chunk, in bytes.
    Returns: WritableStream

  locked: boolean
    Indicate whether the WritableStream is locked.

  abort(reason: *)
    Aborts the stream, signalling that the producer can no longer successfully write to the stream and it's to be immediately moved to an error state, with any queued writes discarded.
    Returns: Promise<void>

  close():
    Closes the stream.
    Returns: Promise<void>
    Throws:
      TypeError: thrown if the stream is locked.
      TypeError: thrown if the stream is closed or closing.

  getWriter(): WritableStreamDefaultWriter
    Returns a new WritableStreamDefaultWriter object and locks the stream to that object. While the stream is locked, no other writer can be acquired until this one is released.
    Returns: WritableStreamDefaultWriter
```

----------------------------------------

TITLE: UXP CSS Visibility Styles
DESCRIPTION: Demonstrates how to use the UXP CSS visibility styles, specifically for controlling element visibility within the UXP environment. This component likely takes a query parameter to specify the product context.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/visibility.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/visibility";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP Global Members - Data Transfers Headers
DESCRIPTION: Demonstrates the usage of global members for data transfers, specifically focusing on headers within the UXP environment. This snippet shows how to import and utilize a Content component for interacting with Photoshop data.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/Data Transfers/Headers.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Data Transfers/Headers";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: PointerEvent Constructor and Properties
DESCRIPTION: Details the constructor for creating PointerEvent instances and lists various read-only properties that capture pointer characteristics like ID, dimensions, pressure, tilt, twist, coordinates (client, offset, page, screen), movement, button states, and pointer type.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Events/PointerEvent.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
window.PointerEvent:
  Constructor:
    PointerEvent(type, eventInit)
    - type: The event type.
    - eventInit: Initialization options for the event.

  Properties:
    pointerId: number (Read only) - The unique identifier for the pointer.
    width: number (Read only) - The width of the pointer, in pixels.
    height: number (Read only) - The height of the pointer, in pixels.
    pressure: number (Read only) - The normalized pressure of the pointer input, ranging from 0.0 to 1.0.
    tangentialPressure: number (Read only) - The normalized tangential pressure (also known as "barrel rotation"), ranging from -1.0 to 1.0.
    tiltX: number (Read only) - The tilt of the pointer on the X-axis, in degrees, ranging from -90 to 90.
    tiltY: number (Read only) - The tilt of the pointer on the Y-axis, in degrees, ranging from -90 to 90.
    twist: number (Read only) - The twist rotation of the pointer, in degrees, ranging from 0 to 359.
    clientX: number (Read only) - The X coordinate of the pointer's position relative to the target element's padding edge.
    clientY: number (Read only) - The Y coordinate of the pointer's position relative to the target element's padding edge.
    offsetX: number (Read only) - The X coordinate of the pointer's position relative to the target element's offset parent.
    offsetY: number (Read only) - The Y coordinate of the pointer's position relative to the target element's offset parent.
    pageX: number (Read only) - The X coordinate of the pointer's position relative to the top-left corner of the entire document.
    pageY: number (Read only) - The Y coordinate of the pointer's position relative to the top-left corner of the entire document.
    screenX: number (Read only) - The X coordinate of the pointer's position relative to the top-left corner of the user's screen.
    screenY: number (Read only) - The Y coordinate of the pointer's position relative to the top-left corner of the user's screen.
    movementX: number (Read only) - The difference between the current pointer position and the last pointer position on the X-axis.
    movementY: number (Read only) - The difference between the current pointer position and the last pointer position on the Y-axis.
    button: number (Read only) - The button that was pressed or released.
    buttons: number (Read only) - The buttons that are currently pressed.
    detail: number (Read only) - The number of times the mouse button has been clicked.
    pointerType: string (Read only) - The type of pointer that triggered the event (e.g., 'mouse', 'pen', 'touch').
    altKey: boolean (Read only) - Indicates if the Alt key was pressed during the event.
    shiftKey: boolean (Read only) - Indicates if the Shift key was pressed during the event.
    metaKey: boolean (Read only) - Indicates if the Meta key (e.g., Command on macOS, Windows key on Windows) was pressed during the event.
    ctrlKey: boolean (Read only) - Indicates if the Control key was pressed during the event.
    isPrimary: boolean (Read only) - Indicates if the pointer is the primary pointer for the current interaction.
    which: number (Read only) - Deprecated. Use event.button or event.key instead.
    type: string (Read only) - The name of the event.
    isTrusted: boolean (Read only) - Indicates if the event was generated by the user or by an API.
    target: Node (Read only) - The element to which the event was originally dispatched.
    currentTarget: Node (Read only) - The element whose event listener triggered the event.
    bubbles: boolean (Read only) - Indicates if the event bubbles through the DOM.
    cancelable: boolean (Read only) - Indicates if the event's default action can be prevented.
    composed: boolean (Read only) - Indicates if the event will trigger listeners outside of a shadow root.
    eventPhase: number (Read only) - The current phase of the event flow.
    defaultPrevented: boolean (Read only) - Indicates if the event's default action has been prevented.
    returnValue: any - The value returned by the event handler.

```

----------------------------------------

TITLE: Importing CSS Styles for UXP in Photoshop
DESCRIPTION: Demonstrates how to import and utilize CSS style components from the 'uxp-documentation' library for use in Photoshop plugins.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/border-right-style.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/border-right-style";
```

----------------------------------------

TITLE: UXP JavaScript Reference
DESCRIPTION: Technical documentation for functions, classes, and modules available globally or via require in UXP JavaScript.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/index.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
JavaScript Reference:
  Provides technical documentation for functions, classes, and modules available globally (e.g., on window) and via `require` in UXP.
  See: reference-js/index.md
```

----------------------------------------

TITLE: Background Image Component for Photoshop
DESCRIPTION: This snippet demonstrates the usage of the `Content` component from `uxp-documentation` to manage background images specifically for Photoshop plugins. It takes a query parameter to specify the target product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/background-image.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/background-image";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Entry.copyTo() Method
DESCRIPTION: Allows copying an entry (File or Folder) to a specified destination folder, with options to overwrite existing entries and allow folder copying.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/Entry.md#_snippet_3

LANGUAGE: javascript
CODE:
```
await someFile.copyTo(someFolder);
```

LANGUAGE: javascript
CODE:
```
await someFile.copyTo(someFolder, {overwrite: true});
```

LANGUAGE: javascript
CODE:
```
await someFolder.copyTo(anotherFolder, {overwrite: true, allowFolderCopy: true});
```

----------------------------------------

TITLE: Spectrum Action Button Usage in Photoshop
DESCRIPTION: Demonstrates how to use the Spectrum Action Button component with a specific product query for Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-action-button.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-action-button";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Global Member - HTML Event
DESCRIPTION: Demonstrates the usage of a global member for HTML events within UXP, specifically querying for product information like Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Events/Event.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Events/Event";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Importing CSS Styles in UXP
DESCRIPTION: Demonstrates how to import CSS styles for use within UXP applications, specifically for Photoshop.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/border-style.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/border-style";
```

----------------------------------------

TITLE: UXP Application Integration Matrix
DESCRIPTION: This table shows the compatibility of different UXP versions with various Adobe applications, including Photoshop, InDesign, Premiere Pro, and XD. It helps developers understand which UXP version is required for a specific application version.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/versions3P.md#_snippet_0

LANGUAGE: html
CODE:
```
<table>
  <thead>
    <tr>
      <th>Application</th>
      <th>UXP v8.1</th>
      <th>UXP v8.0</th>
      <th>UXP v7.4</th>
      <th>UXP v7.3</th>
      <th>UXP v7.2</th>
      <th>UXP v7.1</th>
      <th>UXP v7.0</th>
      <th>UXP v6.5</th>
      <th>UXP v6.4</th>
      <th>UXP v6.3</th>
      <th>UXP v6.2</th>
      <th>UXP v6.1</th>
      <th>UXP v6.0</th>
      <th>UXP v5.6</th>
      <th>UXP v5.5</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Photoshop</td>
      <td>26.1</td>
      <td>26.0</td>
      <td>25.5</td>
      <td>25.2</td>
      <td>25.0</td>
      <td>24.6</td>
      <td>24.4</td>
      <td>24.1</td>
      <td>24.1</td>
      <td>24.0</td>
      <td>23.5</td>
      <td>23.4</td>
      <td>23.3</td>
      <td>23.2</td>
      <td>23.0</td>
    </tr>
    <tr>
      <td>InDesign & InDesign Server</td>
      <td>-</td>
      <td>20.0</td>
      <td>19.4</td>
      <td>19.0</td>
      <td>-</td>
      <td>18.5</td>
      <td>-</td>
      <td>18.1</td>
      <td>-</td>
      <td>18.0</td>
      <td>17.4</td>
      <td>-</td>
      <td>-</td>
      <td>17.1</td>
      <td>17.0</td>
    </tr>
    <tr>
      <td>Premiere Pro</td>
      <td>25.1</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
      <td>XD</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>55</td>
      <td>54</td>
      <td>-</td>
      <td>-</td>
      <td>53</td>
      <td>45</td>
    </tr>
  </tbody>
</table>
```

----------------------------------------

TITLE: ProgressEvent in UXP
DESCRIPTION: This snippet demonstrates the usage of the ProgressEvent within the UXP framework, specifically for interacting with global members and HTML events. It is designed to be used with a query parameter to specify the product context.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Events/ProgressEvent.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Events/ProgressEvent";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Open File Asynchronously - UXP
DESCRIPTION: Opens or creates a file asynchronously. Returns a Promise that resolves with the file descriptor. Supports specifying flags and modes for file access. Dependencies: None. Input: file path, optional flag, optional mode. Output: Promise resolving to the file descriptor.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/storage.md#_snippet_36

LANGUAGE: javascript
CODE:
```
const fd = await fs.open("plugin-data:/fileToRead.txt", "r");
```

----------------------------------------

TITLE: UXP v7.0.0: Dialogs and Streams
DESCRIPTION: Covers the addition of alert(), prompt(), and confirm() dialog functions, as well as support for pipeThrough() and tee() methods in ReadableStream.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/changelog3P.md#_snippet_21

LANGUAGE: APIDOC
CODE:
```
Dialogs:
  alert(message): Displays an alert box with a specified message and an OK button.
  prompt(message, defaultText): Displays a dialog box that prompts the visitor for input.
  confirm(message): Displays a dialog box that asks for confirmation.

ReadableStream Methods:
  pipeThrough(transform, options): Connects a ReadableStream to a TransformStream.
  tee(): Splits a ReadableStream into two independent ReadableStreams.
```

----------------------------------------

TITLE: Open File Asynchronously
DESCRIPTION: Opens or creates a file asynchronously, returning a file descriptor. Supports custom flags and modes, and can return a Promise or use a callback.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/fs/fs.md#_snippet_6

LANGUAGE: javascript
CODE:
```
const fd = await fs.open("plugin-data:/fileToRead.txt", "r");
```

----------------------------------------

TITLE: sp-heading Sizes
DESCRIPTION: Demonstrates the different available sizes for the sp-heading component, ranging from XXS to XXXL.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/Typography/sp-heading.md#_snippet_1

LANGUAGE: html
CODE:
```
<sp-heading size="XXXL">Heading XXXL</sp-heading>
<sp-heading size="XXL">Heading XXL</sp-heading>
<sp-heading size="XL">Heading XL</sp-heading>
<sp-heading size="L">Heading L</sp-heading>
<sp-heading size="M">Heading M</sp-heading>
<sp-heading size="S">Heading S</sp-heading>
<sp-heading size="XS">Heading XS</sp-heading>
<sp-heading size="XXS">Heading XXS</sp-heading>
```

----------------------------------------

TITLE: XMLHttpRequest Usage with Product Query
DESCRIPTION: Demonstrates how to use XMLHttpRequest to fetch data for a specific product, in this case, 'xd'. This is a common pattern for interacting with APIs or data sources within UXP.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Data Transfers/XMLHttpRequest.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/Data Transfers/XMLHttpRequest";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP CSS Styles Height Reference
DESCRIPTION: Imports and uses the Height component for UXP CSS styles, querying for product information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/height.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/height";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: HTMLCollection Properties and Methods
DESCRIPTION: Documentation for the HTMLCollection interface, including its length property and methods like item(), keys(), values(), entries(), and forEach().

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML DOM/HTMLCollection.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
HTMLCollection:
  length: number (read only)
    The number of items in the collection.

  item(index): Node
    Returns the node at the specified index in the collection.
    Parameters:
      index: number - The index of the node to retrieve.

  keys(): IterableIterator<number>
    Returns an iterator that yields the indices of the collection.

  values(): IterableIterator<Node>
    Returns an iterator that yields the nodes in the collection.

  entries(): IterableIterator<[number, Node]>
    Returns an iterator that yields key-value pairs (index, node) of the collection.

  forEach(callback):
    Executes a provided function once for each node in the collection.
    Parameters:
      callback: Function - A function to execute for each node. It receives the node, its index, and the collection itself as arguments.
```

----------------------------------------

TITLE: Import ResizeObserverSize
DESCRIPTION: Imports the ResizeObserverSize component from the UXP JavaScript API reference for Global Members, specifically within the HTML DOM section.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML DOM/ResizeObserverSize.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML DOM/ResizeObserverSize";
```

----------------------------------------

TITLE: UXP Scripting: Error Handling
DESCRIPTION: Illustrates proper error handling in UXP scripts, specifically addressing the issue where error messages and stack traces were empty when using `reject("error string")`.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/changelog3P.md#_snippet_31

LANGUAGE: javascript
CODE:
```
try {
  // Some operation that might fail
  throw new Error("Something went wrong");
} catch (e) {
  script.reject(e.message);
}
```

----------------------------------------

TITLE: XMPIterator Class Documentation
DESCRIPTION: Provides methods for iterating over XMP properties. It allows traversal of XMP data structures, enabling access to individual properties and their values.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Modules/uxp/XMP/XMP Classes/XMPIterator.md#_snippet_0

LANGUAGE: apidoc
CODE:
```
XMPIterator:
  __init__(xmpObject: XMPObject, query: str = None)
    Initializes an XMPIterator.
    Parameters:
      xmpObject: The XMPObject to iterate over.
      query: An optional query string to filter properties.

  next():
    Moves to the next XMP property in the iteration.
    Returns: The next XMP property or None if the iteration is finished.

  hasNext():
    Checks if there are more properties to iterate over.
    Returns: True if there are more properties, False otherwise.

  current():
    Gets the current XMP property.
    Returns: The current XMP property.

  reset():
    Resets the iterator to the beginning of the iteration.

Example Usage:
  const xmpObject = new XMPObject(); // Assume xmpObject is populated with XMP data
  const iterator = new XMPIterator(xmpObject, "product=photoshop");
  while (iterator.hasNext()) {
    const property = iterator.next();
    console.log(property.name, property.value);
  }
```

----------------------------------------

TITLE: NamedNodeMap API Reference
DESCRIPTION: Provides a comprehensive reference for the NamedNodeMap interface, including its constructor, properties, and methods for managing attributes of a Node.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML DOM/NamedNodeMap.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
window.NamedNodeMap:
  Description: Represents a collection of attributes (NamedNodeMap) associated with a Node.
  See: https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap

  Constructor:
    NamedNodeMap(node)
    Description: Creates an instance of NamedNodeMap.
    Parameters:
      - node: Node - The node to associate with the NamedNodeMap.

  Properties:
    length : number (Read only)
    Description: The number of attributes in the NamedNodeMap.

  Methods:
    getNamedItem(name)
    Description: Retrieves an attribute by its name.
    Parameters:
      - name: *
    Returns: *

    setNamedItem(attr)
    Description: Adds or replaces an attribute in the NamedNodeMap.
    Parameters:
      - attr: * - The attribute to add or replace.

    removeNamedItem(name)
    Description: Removes an attribute by its name.
    Parameters:
      - name: * - The name of the attribute to remove.

    item(index)
    Description: Retrieves an attribute by its index.
    Parameters:
      - index: * - The index of the attribute to retrieve.
    Returns: *
```

----------------------------------------

TITLE: UXP Local File System API Reference
DESCRIPTION: Provides access to the user's local file system for reading, writing, and managing files and directories.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/localFileSystem.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
module storage.localFileSystem
  // Provides access to the user's local file system.

  // getFolder(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileForApplication(appName: string, subPath?: string): Promise<File>
  //   Retrieves a file associated with a specific application.
  //   Parameters:
  //     appName: The name of the application.
  //     subPath: An optional sub-path within the application's directory.
  //   Returns: A Promise that resolves with the File object.

  // getPluginFolder(): Promise<Folder>
  //   Retrieves the current plugin's folder.
  //   Returns: A Promise that resolves with the Folder object representing the plugin's directory.

  // getTemporaryFolder(): Promise<Folder>
  //   Retrieves the temporary folder for the application.
  //   Returns: A Promise that resolves with the Folder object.

  // getDocumentsFolder(): Promise<Folder>
  //   Retrieves the user's Documents folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getPicturesFolder(): Promise<Folder>
  //   Retrieves the user's Pictures folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getMusicFolder(): Promise<Folder>
  //   Retrieves the user's Music folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getVideoFolder(): Promise<Folder>
  //   Retrieves the user's Video folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getDownloadsFolder(): Promise<Folder>
  //   Retrieves the user's Downloads folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getDesktopFolder(): Promise<Folder>
  //   Retrieves the user's Desktop folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFile(folder: Folder, filename: string): Promise<File>
  //   Retrieves a file within a given folder.
  //   Parameters:
  //     folder: The Folder object to search within.
  //     filename: The name of the file to retrieve.
  //   Returns: A Promise that resolves with the File object.

  // createFile(folder: Folder, filename: string): Promise<File>
  //   Creates a new file within a given folder.
  //   Parameters:
  //     folder: The Folder object to create the file in.
  //     filename: The name of the file to create.
  //   Returns: A Promise that resolves with the newly created File object.

  // createFolder(folder: Folder, foldername: string): Promise<Folder>
  //   Creates a new folder within a given folder.
  //   Parameters:
  //     folder: The Folder object to create the folder in.
  //     foldername: The name of the folder to create.
  //   Returns: A Promise that resolves with the newly created Folder object.

  // copyFile(file: File, destinationFolder: Folder, newFilename?: string): Promise<File>
  //   Copies a file to a different folder.
  //   Parameters:
  //     file: The File object to copy.
  //     destinationFolder: The Folder object to copy the file to.
  //     newFilename: An optional new name for the copied file.
  //   Returns: A Promise that resolves with the copied File object.

  // copyFolder(folder: Folder, destinationFolder: Folder, newFolderName?: string): Promise<Folder>
  //   Copies a folder to a different folder.
  //   Parameters:
  //     folder: The Folder object to copy.
  //     destinationFolder: The Folder object to copy the folder to.
  //     newFolderName: An optional new name for the copied folder.
  //   Returns: A Promise that resolves with the copied Folder object.

  // moveFile(file: File, destinationFolder: Folder, newFilename?: string): Promise<File>
  //   Moves a file to a different folder.
  //   Parameters:
  //     file: The File object to move.
  //     destinationFolder: The Folder object to move the file to.
  //     newFilename: An optional new name for the moved file.
  //   Returns: A Promise that resolves with the moved File object.

  // moveFolder(folder: Folder, destinationFolder: Folder, newFolderName?: string): Promise<Folder>
  //   Moves a folder to a different folder.
  //   Parameters:
  //     folder: The Folder object to move.
  //     destinationFolder: The Folder object to move the folder to.
  //     newFolderName: An optional new name for the moved folder.
  //   Returns: A Promise that resolves with the moved Folder object.

  // deleteFile(file: File): Promise<void>
  //   Deletes a file.
  //   Parameters:
  //     file: The File object to delete.
  //   Returns: A Promise that resolves when the file is deleted.

  // deleteFolder(folder: Folder): Promise<void>
  //   Deletes a folder.
  //   Parameters:
  //     folder: The Folder object to delete.
  //   Returns: A Promise that resolves when the folder is deleted.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getEntries(folder: Folder): Promise<Array<File | Folder>>
  //   Retrieves all entries (files and subfolders) within a folder.
  //   Parameters:
  //     folder: The Folder object to list entries from.
  //   Returns: A Promise that resolves with an array of File and Folder objects.

  // read(file: File): Promise<string>
  //   Reads the content of a file as a string.
  //   Parameters:
  //     file: The File object to read.
  //   Returns: A Promise that resolves with the file content as a string.

  // write(file: File, content: string, options?: { append?: boolean }): Promise<void>
  //   Writes content to a file.
  //   Parameters:
  //     file: The File object to write to.
  //     content: The string content to write.
  //     options: Optional configuration, including 'append' to append content instead of overwriting.
  //   Returns: A Promise that resolves when the content is written.

  // getFileExtension(filename: string): string
  //   Gets the file extension from a filename.
  //   Parameters:
  //     filename: The name of the file.
  //   Returns: The file extension (e.g., 'txt', 'jpg').

  // getFilenameWithoutExtension(filename: string): string
  //   Gets the filename without its extension.
  //   Parameters:
  //     filename: The name of the file.
  //   Returns: The filename without the extension.

  // getFileExtensionWithDot(filename: string): string
  //   Gets the file extension including the leading dot.
  //   Parameters:
  //     filename: The name of the file.
  //   Returns: The file extension with a leading dot (e.g., '.txt', '.jpg').

  // getFilenameWithExtension(filename: string, extension: string): string
  //   Gets the filename with a specified extension.
  //   Parameters:
  //     filename: The base filename.
  //     extension: The extension to add (with or without a leading dot).
  //   Returns: The filename with the extension.

  // getPath(folder: Folder, filename: string): string
  //   Constructs the full path to a file within a folder.
  //   Parameters:
  //     folder: The Folder object.
  //     filename: The name of the file.
  //   Returns: The full path string.

  // getPathWithFolder(folder: Folder, subPath: string): string
  //   Constructs the full path to a sub-path within a folder.
  //   Parameters:
  //     folder: The Folder object.
  //     subPath: The sub-path to append.
  //   Returns: The full path string.

  // getParent(folder: Folder): Promise<Folder | null>
  //   Retrieves the parent folder of a given folder.
  //   Parameters:
  //     folder: The Folder object.
  //   Returns: A Promise that resolves with the parent Folder object, or null if it's the root.

  // getRoot(): Promise<Folder>
  //   Retrieves the root folder of the file system.
  //   Returns: A Promise that resolves with the root Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The path to the file.
  //   Returns: A Promise that resolves with the File object.

  // getFolderByPath(path: string): Promise<Folder>
  //   Retrieves a folder at the specified path.
  //   Parameters:
  //     path: The path to the folder.
  //   Returns: A Promise that resolves with the Folder object.

  // getFileByPath(path: string): Promise<File>
  //   Retrieves a file at the specified path.
  //   Parameters:
  //     path: The
```

----------------------------------------

TITLE: Render UXP Content for Adobe XD
DESCRIPTION: Renders the imported Content component, querying for product information specific to Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/right.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Render Text Component with Query
DESCRIPTION: Renders the Text component with a specific product query parameter.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML DOM/Text.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Applying Border Top Styles with Query Parameter
DESCRIPTION: Renders the CSS border-top styles component, applying styles based on a query parameter. The 'product=xd' query suggests that these styles are intended for Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/border-top.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: sp-dropdown Basic Structure
DESCRIPTION: Renders a basic dropdown with a placeholder and a list of menu items. It requires an sp-menu with slot='options' containing sp-menu-item elements.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-dropdown.md#_snippet_0

LANGUAGE: html
CODE:
```
<sp-dropdown placeholder="Make a selection..." style="width: 320px">
    <sp-menu slot="options">
        <sp-menu-item> Deselect </sp-menu-item>
        <sp-menu-item> Select inverse </sp-menu-item>
        <sp-menu-item> Feather... </sp-menu-item>
        <sp-menu-item> Select and mask... </sp-menu-item>
        <sp-menu-divider></sp-menu-divider>
        <sp-menu-item> Save selection </sp-menu-item>
        <sp-menu-item disabled> Make work path </sp-menu-item>
    </sp-menu>
</sp-dropdown>
```

----------------------------------------

TITLE: Importing UXP Content Component
DESCRIPTION: Imports the Content component from the uxp-documentation library, used for displaying UXP API reference styles.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Styles/text-overflow.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/text-overflow";
```

----------------------------------------

TITLE: Render sp-menu-item
DESCRIPTION: Demonstrates how to render a basic sp-menu-item, a selected item, and a disabled item.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-spectrum/Spectrum UXP Widgets/User Interface/sp-menu-item.md#_snippet_0

LANGUAGE: html
CODE:
```
<sp-menu-item>Chicago</sp-menu-item>
<sp-menu-item selected>New York City</sp-menu-item>
<sp-menu-item disabled>St. Louis</sp-menu-item>
```

----------------------------------------

TITLE: Render Content Component
DESCRIPTION: Renders the Content component with a specific product query. This is a React component used for displaying UXP-related content.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-html/Hierarchy/h6.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html/Hierarchy/h6";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Spectrum UXP Correlate for h3
DESCRIPTION: Shows how to achieve a similar rendering to an h3 element using the Spectrum UXP sp-heading component. This component is theme-aware.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-html/Hierarchy/h3.md#_snippet_1

LANGUAGE: html
CODE:
```
<sp-heading size="XS">Hello, World</sp-heading>
```

----------------------------------------

TITLE: UXP Hierarchy API Documentation
DESCRIPTION: Provides details on interacting with product hierarchies via the UXP API. This includes methods for querying and manipulating hierarchical data structures within Adobe applications.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/Hierarchy/index.md#_snippet_1

LANGUAGE: APIDOC
CODE:
```
Hierarchy API:

This API allows developers to access and manipulate the hierarchical structure of elements within Adobe applications.

Methods:

query(product: string):
  Description: Retrieves the hierarchical data for a specified product.
  Parameters:
    - product: The identifier of the product (e.g., 'photoshop', 'illustrator').
  Returns:
    - An object representing the product's hierarchy.

Example:
  const hierarchyData = Hierarchy.query('photoshop');

Limitations:
  - The available hierarchy structure may vary between different Adobe products.
  - Ensure the product identifier is valid to retrieve data.
```

----------------------------------------

TITLE: Render UXP Content Component
DESCRIPTION: Renders the Content component, likely used to display documentation or interactive elements within a UXP application. The 'product' query parameter specifies the target Adobe product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML DOM/NodeFilter.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP Media Query Width - Product Parameter
DESCRIPTION: Demonstrates how to use the `product` query parameter within UXP CSS media queries to apply styles based on the product context. This is useful for tailoring the user interface to specific Adobe products like Adobe XD.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Media Queries/width.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Media Queries/width";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: UXP Menu Items Module
DESCRIPTION: Imports the UXP Menu Items module for use in UXP development. This module likely provides functionality for creating and managing menu items within UXP applications.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Entry Points/UxpMenuItems.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Entry Points/UxpMenuItems";
```

----------------------------------------

TITLE: Content Component for Photoshop
DESCRIPTION: Renders content specific to Adobe Photoshop using the Content component, likely for displaying documentation or interactive elements.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML Events/BaseUIEvent.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP CSS General Units Usage
DESCRIPTION: Demonstrates how to use general CSS units within UXP components. The `Content` component is used here to query for product-specific unit information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/General/units.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/General/units";

<Content query="product=xd"/>
```

----------------------------------------

TITLE: Import Persistent File Storage EntryMetadata
DESCRIPTION: Imports the EntryMetadata class from the UXP Persistent File Storage module for use in JavaScript applications.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Persistent File Storage/EntryMetadata.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/EntryMetadata";
```

----------------------------------------

TITLE: ShadowRoot Usage with Query Parameter
DESCRIPTION: Demonstrates how to use the ShadowRoot component with a query parameter to specify the product context, likely for rendering or data fetching within UXP.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-js/Global Members/HTML DOM/ShadowRoot.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML DOM/ShadowRoot";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: UXP CSS Styles - Border Bottom Style
DESCRIPTION: Imports and renders the border-bottom-style component for UXP documentation, querying for Photoshop product.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-css/Styles/border-bottom-style.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Styles/border-bottom-style";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: Importing UXP Documentation Component
DESCRIPTION: Imports the `Content` component from the UXP documentation library, specifically for pseudo-classes reference.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-css/Pseudo-classes/empty.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-css/Pseudo-classes/empty";
```

----------------------------------------

TITLE: Content Component for Adobe XD
DESCRIPTION: Renders the Content component, likely used for displaying or interacting with Adobe XD specific content, with a query parameter specifying the product as 'xd'.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/Streams/TransformStreamDefaultController.md#_snippet_1

LANGUAGE: html
CODE:
```
<Content query="product=xd"/>
```

----------------------------------------

TITLE: Loading Local HTML Content in WebView
DESCRIPTION: Demonstrates how to load HTML files from plugin, plugin-data, and plugin-temp folders into a WebView using the 'plugin:' protocol.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLWebViewElement.md#_snippet_2

LANGUAGE: html
CODE:
```
<webview src="plugin:/webview.html"></webview>
<webview src="plugin-data:/webview-in-plugin-data.html"></webview>
<webview src="plugin-temp:/webview-in-plugin-temp.html"></webview>
```

----------------------------------------

TITLE: Import Local File System Module
DESCRIPTION: Imports the Persistent File Storage module for local file system operations within UXP.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Modules/uxp/Persistent File Storage/localFileSystem.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Modules/uxp/Persistent File Storage/localFileSystem";
```

----------------------------------------

TITLE: AbortSignal API Documentation
DESCRIPTION: Provides details on the AbortSignal interface, its properties (aborted, reason), and methods (throwIfAborted, abort). AbortSignal is used to communicate with web streams to signal cancellation.

SOURCE: https://github.com/adobedocs/uxp/blob/main/src/pages/uxp-api/reference-js/Global Members/HTML DOM/AbortSignal.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
window.AbortSignal:
  Description: Represents a signal that allows you to communicate with a web service and about its state, so that you can disconnect one or more web requests or another asynchronous process that is given the signal.
  See: https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
  Note: AbortSignal works only for web streams.

  Properties:
    aborted: boolean
      Description: Whether the request that the signal is communicating with is aborted or not.
    reason: *
      Description: The abort reason, once the signal has aborted. Undefined when the signal has not been aborted.

  Methods:
    throwIfAborted(): void
      Description: Throws the signal's abort reason if the signal has been aborted. Otherwise, it does nothing.

    abort(reason: *): AbortSignal
      Description: Creates an AbortSignal object that is already set as aborted.
      Parameters:
        reason: The reason for the abortion.
      Returns: AbortSignal - AbortSignal object with the AbortSignal.aborted property set to true and AbortSignal.reason set to the specified or default reason.
```

----------------------------------------

TITLE: UXP Photoshop Content Component
DESCRIPTION: Renders UXP documentation content specific to Photoshop. It takes a query parameter to filter the content.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/photoshop/uxp/reference-html/General/index.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-html//General/index.md";

<Content query="product=photoshop"/>
```

----------------------------------------

TITLE: HTMLAnchorElement in UXP
DESCRIPTION: Demonstrates the usage of the HTMLAnchorElement within the UXP environment, specifically for querying product information.

SOURCE: https://github.com/adobedocs/uxp/blob/main/_transclusions/xd/uxp/reference-js/Global Members/HTML Elements/HTMLAnchorElement.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import Content from "uxp-documentation/src/pages/uxp-api/reference-js/Global Members/HTML Elements/HTMLAnchorElement";

<Content query="product=xd"/>
```