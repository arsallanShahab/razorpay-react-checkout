import { defineConfig } from "tsup";

export default defineConfig([
    {
        entry: ["src/index.ts"],
        format: ["cjs", "esm"],
        dts: true,
        splitting: false,
        sourcemap: true,
        clean: true,
        treeshake: true,
        external: ["react", "react-dom"],
        banner: {
            js: '"use client";',
        },
    },
    {
        entry: ["src/server.ts"],
        format: ["cjs", "esm"],
        dts: true,
        splitting: false,
        sourcemap: true,
        clean: false,
        treeshake: true,
        external: ["react", "react-dom"],
    },
]);
