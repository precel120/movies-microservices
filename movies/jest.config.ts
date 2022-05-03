import type {Config} from "@jest/types";

const config: Config.InitialOptions = {
	preset: "ts-jest",
	testEnvironment: "node",
	setupFilesAfterEnv: ["dotenv/config"],
}

export default config;