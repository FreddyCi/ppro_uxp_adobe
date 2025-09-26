// @ts-ignore
import React, { useState } from "react";

import { uxp, premierepro } from "./globals";
import { api } from "./api/api";

export const App = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount((prev: number) => prev + 1);

  const hostName = (uxp.host.name as string).toLowerCase();

  //* Call Functions Conditionally by App
  if (hostName === "premierepro") {
    console.log("Hello from Premiere Pro", premierepro);
  }
  
  //* Or call the unified API object directly and the correct app function will be used
  const helloWorld = () => {
    api.notify("Hello World");
  };
  const hybridTest = async () => {
    try {
      let hybridModule: {
        execSync: (cmd: string) => string;
      } = await require("bolt-uxp-hybrid.uxpaddon");
      let execSyncRes = hybridModule.execSync("echo test");
      console.log(`execSyncRes = `, execSyncRes);
      api.notify(`execSyncRes = ${execSyncRes}`);
    } catch (err) {
      console.log("Execute as execSync command failed", err);
    }
  };

  return (
    <>
      <main>
        <div className="button-group">
          {/* @ts-ignore */}
          <sp-button onClick={increment}>count is {count}</sp-button>
          {/* @ts-ignore */}
          <sp-button onClick={helloWorld}>Hello World</sp-button>
          {/* @ts-ignore */}
          <sp-button onClick={hybridTest}>Hybrid</sp-button>
        </div>
      </main>
    </>
  );
};
