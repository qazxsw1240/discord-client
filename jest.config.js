import { createDefaultPreset } from "ts-jest";


const tsJestTransformConfig = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
    testEnvironment: "node",
    transform: {
        ...tsJestTransformConfig,
    },
};
