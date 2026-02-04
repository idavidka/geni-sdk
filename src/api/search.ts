/**
 * Search API for Geni
 *
 * Endpoints for searching profiles
 */

import type { HttpClient } from "../utils/http";
import type { ProfileSearchResponse } from "../types";

/**
 * Search filters interface
 */
export interface SearchFilters {
	/** Search query */
	query: string;
	/** Birth year */
	birth_year?: number;
	/** Death year */
	death_year?: number;
	/** Location */
	location?: string;
	/** Maximum results (default: 20) */
	limit?: number;
}

/**
 * Search API class
 */
export class SearchAPI {
	private http: HttpClient;

	constructor(http: HttpClient) {
		this.http = http;
	}

	/**
	 * Search for profiles
	 */
	async searchProfiles(filters: SearchFilters): Promise<ProfileSearchResponse> {
		const params: Record<string, string> = {
			q: filters.query,
		};

		if (filters.birth_year) {
			params.birth_year = filters.birth_year.toString();
		}

		if (filters.death_year) {
			params.death_year = filters.death_year.toString();
		}

		if (filters.location) {
			params.location = filters.location;
		}

		if (filters.limit) {
			params.limit = filters.limit.toString();
		}

		const response = await this.http.get<ProfileSearchResponse>("/search/profiles", params);
		if (!response.data) {
			throw new Error("No search results returned");
		}
		return response.data;
	}
}
