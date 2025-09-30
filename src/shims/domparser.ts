// src/shims/domparser.ts
// UXP DOM API shims for XML processing compatibility

// 🔧 DOMParser shim
if (typeof (globalThis as any).DOMParser === "undefined") {
  (globalThis as any).DOMParser = class {
    parseFromString(str: string, type?: string) {
      const tpl = document.createElement("template");

      if (type === "image/svg+xml") {
        tpl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${str.replace(
          /^<\?xml[^>]*\?>/,
          ""
        )}</svg>`;
        const svg = tpl.content.firstElementChild!;
        return { documentElement: svg };
      }

      tpl.innerHTML = str.trim();
      return {
        body: tpl.content,
        documentElement: tpl.content.firstElementChild,
        querySelector: (sel: string) => tpl.content.querySelector(sel),
        querySelectorAll: (sel: string) => tpl.content.querySelectorAll(sel),
      };
    }
  };
  console.log("✅ DOMParser shim injected");
}

// 🔧 XMLSerializer shim
if (typeof (globalThis as any).XMLSerializer === "undefined") {
  (globalThis as any).XMLSerializer = class {
    serializeToString(node: Node): string {
      // Basic XML serialization - for our use case, we mainly need this for XML documents
      if (node.nodeType === Node.DOCUMENT_NODE) {
        const doc = node as Document;
        if (doc.documentElement) {
          return this.serializeElement(doc.documentElement);
        }
        return '';
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        return this.serializeElement(node as Element);
      }

      if (node.nodeType === Node.TEXT_NODE) {
        return (node as Text).textContent || '';
      }

      // For other node types, return basic string representation
      return node.textContent || '';
    }

    private serializeElement(element: Element): string {
      const tagName = element.tagName.toLowerCase();
      let result = `<${tagName}`;

      // Add attributes
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        result += ` ${attr.name}="${attr.value}"`;
      }

      result += '>';

      // Add child nodes
      for (let i = 0; i < element.childNodes.length; i++) {
        result += this.serializeToString(element.childNodes[i]);
      }

      result += `</${tagName}>`;
      return result;
    }
  };
  console.log("✅ XMLSerializer shim injected");
}

// 🔧 document.implementation shim
if (typeof document.implementation === "undefined") {
  (document as any).implementation = {};
}

if (typeof (document.implementation as any).createDocument === "undefined") {
  (document.implementation as any).createDocument = function (
    _namespaceURI?: string,
    qualifiedName?: string,
    _doctype?: any
  ) {
    // Create a minimal "Document" mock that satisfies libs like Azure Storage SDK
    const root = qualifiedName
      ? document.createElement(qualifiedName)
      : document.createElement("root");

    return {
      nodeType: 9, // DOCUMENT_NODE
      documentElement: root,
      createElement: (tag: string) => document.createElement(tag),
      createTextNode: (text: string) => document.createTextNode(text),
      appendChild: (child: any) => {
        root.appendChild(child);
        return child;
      },
      toString: () => root.outerHTML,
    };
  };

  console.log("✅ document.implementation.createDocument shim injected");
}