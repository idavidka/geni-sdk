/**
 * Profiles API for Geni
 *
 * Endpoints for managing profiles (people) in the family tree
 */

import type { HttpClient } from "../utils/http";
import type {
	GeniProfile,
	ImmediateFamilyResponse,
	ProfileSearchResponse,
} from "../types";

/**
 * Profiles API class
 */
export class ProfilesAPI {
	private http: HttpClient;

	constructor(http: HttpClient) {
		this.http = http;
	}

	/**
	 * Get current authenticated user's profile
	 */
	async getCurrentUser(): Promise<GeniProfile> {
		const response = await this.http.get<GeniProfile>("/profile");
		if (!response.data) {
			throw new Error("No profile data returned");
		}
		return response.data;
	}

	/**
	 * Get profile by ID
	 */
	async getProfile(profileId: string): Promise<GeniProfile> {
		const response = await this.http.get<GeniProfile>(`/profile-${profileId}`);
		if (!response.data) {
			throw new Error(`Profile ${profileId} not found`);
		}
		return response.data;
	}

	/**
	 * Get immediate family (parents, siblings, spouses, children)
	 */
	async getImmediateFamily(profileId: string): Promise<ImmediateFamilyResponse> {
		const response = await this.http.get<ImmediateFamilyResponse>(
			`/profile-${profileId}/immediate-family`,
		);
		if (!response.data) {
			throw new Error(`Immediate family for profile ${profileId} not found`);
		}
		return response.data;
	}

	/**
	 * Get family tree structure
	 */
	async getTree(profileId: string, depth?: number): Promise<ImmediateFamilyResponse> {
		const params: Record<string, string> = {};
		if (depth) {
			params.depth = depth.toString();
		}
		const response = await this.http.get<ImmediateFamilyResponse>(
			`/profile-${profileId}/tree`,
			params,
		);
		if (!response.data) {
			throw new Error(`Tree for profile ${profileId} not found`);
		}
		return response.data;
	}

	/**
	 * Update profile data
	 */
	async updateProfile(
		profileId: string,
		data: Partial<GeniProfile>,
	): Promise<GeniProfile> {
		const response = await this.http.put<GeniProfile>(`/profile-${profileId}`, data);
		if (!response.data) {
			throw new Error(`Failed to update profile ${profileId}`);
		}
		return response.data;
	}

	/**
	 * Search profiles
	 */
	async searchProfiles(query: string): Promise<ProfileSearchResponse> {
		const response = await this.http.get<ProfileSearchResponse>("/search/profiles", {
			q: query,
		});
		if (!response.data) {
			throw new Error("No search results returned");
		}
		return response.data;
	}
}
