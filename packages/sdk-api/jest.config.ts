import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  preset: "ts-jest",
  rootDir: "./",
  restoreMocks: true,
};

export default config;
