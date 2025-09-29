import type { premierepro as premiereproTypes } from "./types/ppro";

if (typeof require === "undefined") {
  //@ts-ignore
  window.require = (moduleName: string) => {
    return {};
  };
}

const safeRequire = <T>(moduleName: string): T | undefined => {
  if (typeof require !== "function") {
    return undefined;
  }

  try {
    return require(moduleName) as T;
  } catch (error) {
    return undefined;
  }
};

const uxpModule = safeRequire<typeof import("uxp")>("uxp");
const hostName = uxpModule?.host?.name?.toLowerCase();

export const uxp =
  uxpModule ??
  ({
    host: {
      name: "",
    },
  } as unknown as typeof import("uxp"));

export const indesign = (
  hostName === "indesign" ? safeRequire("indesign") ?? {} : {}
) as any;
export const premierepro = (
  hostName === "premierepro" ? safeRequire("premierepro") ?? {} : {}
) as premiereproTypes;
export const illustrator = (
  hostName === "illustrator" ? safeRequire("illustrator") ?? {} : {}
) as any;
