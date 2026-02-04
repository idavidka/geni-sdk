/**
 * Tests for Rate Limiter
 */

import { describe, it, expect, beforeEach } from "vitest";
import { RateLimiter } from "../rate-limiter";
import { GeniRateLimitError } from "../errors";

describe("RateLimiter", () => {
	let rateLimiter: RateLimiter;

	beforeEach(() => {
		rateLimiter = new RateLimiter({ maxRequestsPerDay: 100 });
	});

	describe("consume", () => {
		it("should allow requests when tokens are available", async () => {
			await expect(rateLimiter.consume()).resolves.toBeUndefined();
		});

		it("should throw error when rate limit is exceeded", async () => {
			// Set tokens to 0 by consuming all
			rateLimiter = new RateLimiter({ maxRequestsPerDay: 1 });
			await rateLimiter.consume();

			await expect(rateLimiter.consume()).rejects.toThrow(GeniRateLimitError);
		});
	});

	describe("getStatus", () => {
		it("should return status string", () => {
			const status = rateLimiter.getStatus();
			expect(status).toContain("100");
		});
	});

	describe("getRemainingTokens", () => {
		it("should return remaining tokens", () => {
			const remaining = rateLimiter.getRemainingTokens();
			expect(remaining).toBe(100);
		});

		it("should decrease after consuming", async () => {
			await rateLimiter.consume();
			const remaining = rateLimiter.getRemainingTokens();
			expect(remaining).toBe(99);
		});
	});

	describe("reset", () => {
		it("should reset tokens to max", async () => {
			await rateLimiter.consume();
			rateLimiter.reset();
			const remaining = rateLimiter.getRemainingTokens();
			expect(remaining).toBe(100);
		});
	});

	describe("disabled rate limiter", () => {
		it("should allow unlimited requests when disabled", async () => {
			const disabledLimiter = new RateLimiter({ enabled: false, maxRequestsPerDay: 1 });

			await disabledLimiter.consume();
			await disabledLimiter.consume();
			await disabledLimiter.consume();

			// Should not throw
			expect(disabledLimiter.getRemainingTokens()).toBe(1);
		});
	});
});
