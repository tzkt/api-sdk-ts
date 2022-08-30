import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  rootDir: "./",
  restoreMocks: true,
};

export default config;
