// rollup.config.js
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

// Node.js configuration
const nodeESMConfig = {
  input: {
    index: "src/index.ts",
    JSONstore: "src/json_store.ts",
    JSONparser: "src/json_parser.ts",
  }, // change to your entry point TS file
  output: {
    dir: "dist/node",
    format: "esm",
    sourcemap: false,
    entryFileNames: "[name].js", // Outputs index.js, JSONstore.js
  },
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist/node/types",
    }), // ensure you have the correct path to your tsconfig.json
    json(),
    terser(),
    // Add any other rollup plugins that you may need
  ],
  external: ["node-fetch", "stream"],
};

// // CJS configuration for Node.js
// const nodeCJSConfig = {
//   input: {
//     index: "src/index.ts",
//     JSONstore: "src/json_store.ts",
//     JSONparser: "src/json_parser.ts",
//   },
//   output: {
//     dir: "dist/node/cjs",
//     format: "cjs",
//     sourcemap: true,
//     entryFileNames: "[name].cjs",
//   },
//   plugins: [
//     typescript({
//       tsconfig: "./tsconfig.json",
//       declaration: true,
//       declarationDir: "dist/node/cjs/types",
//     }),
//     json(),
//     terser(),
//   ],
//   external: ["stream"],
// };

// Browser configuration
const browserESMConfig = {
  input: {
    index: "src/index.ts",
    JSONstore: "src/json_store.ts",
    JSONparser: "src/json_parser.ts",
  }, // change to your entry point TS file
  output: {
    dir: "dist/browser",
    format: "esm",
    sourcemap: false,
    entryFileNames: "[name].js", // Outputs index.js, JSONstore.js
  },
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: false,
      // declarationDir: "dist/browser/types",
    }), // ensure you have the correct path to your tsconfig.json
    resolve({ browser: true }),
    commonjs(),
    json(),
    replace({
      "node-fetch": "fetch", // Replace node-fetch with window.fetch in the browser build
      preventAssignment: true,
    }),
    terser(),
    // Add any other rollup plugins that you may need
  ],
};

const iifeConfig = (name, isMain = false, output_filename) => {
  const outputName = isMain ? "OllamaJS" : `OllamaJS_${name}`;
  return {
    input: `src/${name}.ts`,
    output: {
      file: `dist/browser/iife/${output_filename || name}.global.js`,
      format: "iife",
      name: outputName,
      extend: true,
      globals: {
        fetch: "fetch",
      },
      sourcemap: false,
    },
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
      }),
      resolve({ browser: true }),
      commonjs(),
      json(),
      replace({
        "node-fetch": "fetch",
        preventAssignment: true,
      }),
      terser(),
    ],
  };
};

export default [
  nodeESMConfig,
  // nodeCJSConfig, // outphased
  browserESMConfig,
  iifeConfig("index", true, "ollama-js"),
  iifeConfig("json_store", false, "ollama-js-json-store"),
  iifeConfig("json_parser", false, "ollama-js-json-parser"),
];
