/**
 * HTTP client utilities for Geni SDK
 */

import type { GeniApiResponse, SDKLogger } from "../types";
import { createErrorFromResponse, createNetworkError } from "../errors";

/**
 * HTTP Client Configuration
 */
export interface HttpClientConfig {
	/** Base URL for API requests */
	baseUrl: string;
	/** Access token for authentication */
	accessToken?: string;
	/** Logger instance */
	logger: SDKLogger;
}

/**
 * HTTP Client for Geni API
 */
export class HttpClient {
	private baseUrl: string;
	private accessToken?: string;
	private logger: SDKLogger;

	constructor(config: HttpClientConfig) {
		this.baseUrl = config.baseUrl;
		this.accessToken = config.accessToken;
		this.logger = config.logger;
	}

	/**
	 * Set access token
	 */
	setAccessToken(token: string): void {
		this.accessToken = token;
	}

	/**
	 * Get access token
	 */
	getAccessToken(): string | undefined {
		return this.accessToken;
	}

	/**
	 * Make a GET request
	 */
	async get<T>(path: string, params?: Record<string, string>): Promise<GeniApiResponse<T>> {
		return this.request<T>("GET", path, undefined, params);
	}

	/**
	 * Make a POST request
	 */
	async post<T>(
		path: string,
		body?: unknown,
		params?: Record<string, string>,
	): Promise<GeniApiResponse<T>> {
		return this.request<T>("POST", path, body, params);
	}

	/**
	 * Make a PUT request
	 */
	async put<T>(
		path: string,
		body?: unknown,
		params?: Record<string, string>,
	): Promise<GeniApiResponse<T>> {
		return this.request<T>("PUT", path, body, params);
	}

	/**
	 * Make a DELETE request
	 */
	async delete<T>(path: string, params?: Record<string, string>): Promise<GeniApiResponse<T>> {
		return this.request<T>("DELETE", path, undefined, params);
	}

	/**
	 * Make an HTTP request
	 */
	private async request<T>(
		method: string,
		path: string,
		body?: unknown,
		params?: Record<string, string>,
	): Promise<GeniApiResponse<T>> {
		// Build URL with query parameters
		const url = new URL(path.startsWith("http") ? path : `${this.baseUrl}${path}`);
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				url.searchParams.append(key, value);
			});
		}

		// Add access token to query params if available
		if (this.accessToken) {
			url.searchParams.append("access_token", this.accessToken);
		}

		// Build request options
		const options: RequestInit = {
			method,
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		};

		if (body) {
			options.body = JSON.stringify(body);
		}

		this.logger.log(`${method} ${url.toString()}`);

		try {
			const response = await fetch(url.toString(), options);

			// Parse response
			let data: T | undefined;
			const contentType = response.headers.get("content-type");
			if (contentType?.includes("application/json")) {
				const json = await response.json();
				data = json as T;
			}

			// Build response object
			const apiResponse: GeniApiResponse<T> = {
				data,
				status: response.status,
				headers: Object.fromEntries(response.headers.entries()),
			};

			// Handle errors
			if (!response.ok) {
				const error = createErrorFromResponse(response.status, {
					message: `Request failed with status ${response.status}`,
				});
				this.logger.error(`Request failed: ${error.message}`);
				apiResponse.error = {
					code: error.code,
					message: error.message,
					details: error.details,
				};
				throw error;
			}

			this.logger.log(`Response: ${response.status}`);
			return apiResponse;
		} catch (error) {
			if (error instanceof Error && error.name.startsWith("Geni")) {
				// Already a Geni error, rethrow
				throw error;
			}
			// Network error
			const networkError = createNetworkError(error);
			this.logger.error(`Network error: ${networkError.message}`);
			throw networkError;
		}
	}
}

/**
 * Create an HTTP client
 */
export function createHttpClient(config: HttpClientConfig): HttpClient {
	return new HttpClient(config);
}
