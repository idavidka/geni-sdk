/**
 * Geni SDK Client
 *
 * A modern, TypeScript-first SDK for Geni.com API
 *
 * Features:
 * - Full TypeScript support with comprehensive type definitions
 * - OAuth 2.0 authentication
 * - Promise-based API
 * - Rate limiting (5,000 req/day)
 * - Configurable logging
 */

import type {
	GeniSDKConfig,
	SDKLogger,
	GeniApiResponse,
} from "./types";
import { OAuthAPI } from "./auth";
import { ProfilesAPI } from "./api/profiles";
import { UnionsAPI } from "./api/unions";
import { PhotosAPI } from "./api/photos";
import { SearchAPI } from "./api/search";
import { RateLimiter } from "./rate-limiter";
import { createLogger } from "./utils/logger";
import { createHttpClient, HttpClient } from "./utils/http";

/**
 * Geni API base URL
 */
const GENI_API_BASE_URL = "https://www.geni.com/api";

/**
 * Geni SDK Client
 */
export class GeniSDK {
	private config: GeniSDKConfig;
	private logger: SDKLogger;
	private rateLimiter: RateLimiter;
	private http: HttpClient;

	// API modules
	public readonly oauth: OAuthAPI;
	public readonly profiles: ProfilesAPI;
	public readonly unions: UnionsAPI;
	public readonly photos: PhotosAPI;
	public readonly search: SearchAPI;

	/**
	 * Create a new Geni SDK instance
	 */
	constructor(config: GeniSDKConfig) {
		this.config = config;
		this.logger = config.logger || createLogger(config.debug || false);
		this.rateLimiter = new RateLimiter(config.rateLimiter || {});

		// Initialize HTTP client
		this.http = createHttpClient({
			baseUrl: GENI_API_BASE_URL,
			accessToken: config.accessToken,
			logger: this.logger,
		});

		// Initialize OAuth API
		this.oauth = new OAuthAPI({
			clientId: config.clientId,
			redirectUri: "", // Will be set by user
			scope: "read",
		});

		// Initialize API modules
		this.profiles = new ProfilesAPI(this.http);
		this.unions = new UnionsAPI(this.http);
		this.photos = new PhotosAPI(this.http);
		this.search = new SearchAPI(this.http);

		this.logger.log("Geni SDK initialized");
	}

	/**
	 * Set access token
	 */
	setAccessToken(token: string): void {
		this.http.setAccessToken(token);
		this.logger.log("Access token updated");
	}

	/**
	 * Get access token
	 */
	getAccessToken(): string | undefined {
		return this.http.getAccessToken();
	}

	/**
	 * Make an API request (internal method with rate limiting)
	 */
	async request<T>(
		method: string,
		path: string,
		body?: unknown,
		params?: Record<string, string>,
	): Promise<GeniApiResponse<T>> {
		// Apply rate limiting
		await this.rateLimiter.consume();

		// Make request
		switch (method.toUpperCase()) {
			case "GET":
				return this.http.get<T>(path, params);
			case "POST":
				return this.http.post<T>(path, body, params);
			case "PUT":
				return this.http.put<T>(path, body, params);
			case "DELETE":
				return this.http.delete<T>(path, params);
			default:
				throw new Error(`Unsupported HTTP method: ${method}`);
		}
	}

	/**
	 * Get rate limiter status
	 */
	getRateLimitStatus(): string {
		return this.rateLimiter.getStatus();
	}

	/**
	 * Get remaining rate limit tokens
	 */
	getRemainingRequests(): number {
		return this.rateLimiter.getRemainingTokens();
	}
}

/**
 * Create a new Geni SDK instance
 */
export function createGeniSDK(config: GeniSDKConfig): GeniSDK {
	return new GeniSDK(config);
}

/**
 * Singleton instance
 */
let instance: GeniSDK | null = null;

/**
 * Initialize the global Geni SDK instance
 */
export function initGeniSDK(config: GeniSDKConfig): GeniSDK {
	instance = new GeniSDK(config);
	return instance;
}

/**
 * Get the global Geni SDK instance
 */
export function getGeniSDK(): GeniSDK {
	if (!instance) {
		throw new Error("Geni SDK not initialized. Call initGeniSDK() first.");
	}
	return instance;
}

/**
 * Reset the global Geni SDK instance
 */
export function resetGeniSDK(): void {
	instance = null;
}
