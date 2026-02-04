/**
 * Tests for Geni SDK Client
 */

import { describe, it, expect, beforeEach } from "vitest";
import { GeniSDK, createGeniSDK, initGeniSDK, getGeniSDK, resetGeniSDK } from "../client";

describe("GeniSDK Client", () => {
	beforeEach(() => {
		resetGeniSDK();
	});

	describe("createGeniSDK", () => {
		it("should create a new SDK instance", () => {
			const sdk = createGeniSDK({
				clientId: "test-client-id",
			});

			expect(sdk).toBeInstanceOf(GeniSDK);
		});

		it("should initialize with access token", () => {
			const sdk = createGeniSDK({
				clientId: "test-client-id",
				accessToken: "test-token",
			});

			expect(sdk.getAccessToken()).toBe("test-token");
		});

		it("should have API modules", () => {
			const sdk = createGeniSDK({
				clientId: "test-client-id",
			});

			expect(sdk.profiles).toBeDefined();
			expect(sdk.unions).toBeDefined();
			expect(sdk.photos).toBeDefined();
			expect(sdk.search).toBeDefined();
			expect(sdk.oauth).toBeDefined();
		});
	});

	describe("setAccessToken", () => {
		it("should update access token", () => {
			const sdk = createGeniSDK({
				clientId: "test-client-id",
			});

			sdk.setAccessToken("new-token");
			expect(sdk.getAccessToken()).toBe("new-token");
		});
	});

	describe("Singleton pattern", () => {
		it("should initialize global instance", () => {
			const sdk = initGeniSDK({
				clientId: "test-client-id",
			});

			expect(sdk).toBeInstanceOf(GeniSDK);
		});

		it("should get global instance", () => {
			initGeniSDK({
				clientId: "test-client-id",
			});

			const sdk = getGeniSDK();
			expect(sdk).toBeInstanceOf(GeniSDK);
		});

		it("should throw error if not initialized", () => {
			expect(() => getGeniSDK()).toThrow("Geni SDK not initialized");
		});

		it("should reset global instance", () => {
			initGeniSDK({
				clientId: "test-client-id",
			});

			resetGeniSDK();

			expect(() => getGeniSDK()).toThrow("Geni SDK not initialized");
		});
	});

	describe("Rate limiting", () => {
		it("should get rate limit status", () => {
			const sdk = createGeniSDK({
				clientId: "test-client-id",
			});

			const status = sdk.getRateLimitStatus();
			expect(status).toContain("5000");
		});

		it("should get remaining requests", () => {
			const sdk = createGeniSDK({
				clientId: "test-client-id",
			});

			const remaining = sdk.getRemainingRequests();
			expect(remaining).toBe(5000);
		});
	});
});
