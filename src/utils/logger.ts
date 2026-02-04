/**
 * Logger utility for Geni SDK
 */

import type { SDKLogger } from "../types";

/**
 * No-op logger (default)
 */
export const noopLogger: SDKLogger = {
	log: () => {},
	warn: () => {},
	error: () => {},
};

/**
 * Console logger (for debug mode)
 */
export const consoleLogger: SDKLogger = {
	log: (message: string, ...args: unknown[]) => {
		// eslint-disable-next-line no-console
		console.log(`[Geni SDK] ${message}`, ...args);
	},
	warn: (message: string, ...args: unknown[]) => {
		// eslint-disable-next-line no-console
		console.warn(`[Geni SDK] ${message}`, ...args);
	},
	error: (message: string, ...args: unknown[]) => {
		// eslint-disable-next-line no-console
		console.error(`[Geni SDK] ${message}`, ...args);
	},
};

/**
 * Create a logger based on debug flag
 */
export function createLogger(debug: boolean): SDKLogger {
	return debug ? consoleLogger : noopLogger;
}
