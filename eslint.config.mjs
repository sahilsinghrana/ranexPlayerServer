import config from "eslint-config-standard";
import js from "@eslint/js";

export default [js.configs.recommended, ...[].concat(config)];
