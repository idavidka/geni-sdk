/**
 * Union (Marriage/Partnership) types for Geni API
 */

import type { ProfileDate } from "./profile";

/**
 * Geni Union (Marriage/Partnership) - Full details
 */
export interface GeniUnionDetail {
	/** Union ID */
	id: string;
	/** Union GUID */
	guid?: string;
	/** URL */
	url?: string;
	/** Union status */
	status?: "married" | "divorced" | "partners" | "unknown";
	/** Marriage date */
	marriage?: ProfileDate;
	/** Marriage location */
	marriage_location?: string;
	/** Divorce date */
	divorce?: ProfileDate;
	/** Divorce location */
	divorce_location?: string;
	/** Partner 1 ID */
	partner1_id?: string;
	/** Partner 2 ID */
	partner2_id?: string;
	/** Partners (array of profile IDs) */
	partners?: string[];
	/** Children (array of profile IDs) */
	children?: string[];
	/** Created at timestamp */
	created_at?: string;
	/** Updated at timestamp */
	updated_at?: string;
}

/**
 * Create Union Input
 */
export interface CreateUnionInput {
	/** Partner 1 profile ID */
	partner1: string;
	/** Partner 2 profile ID */
	partner2: string;
	/** Union status */
	status?: "married" | "partners";
	/** Marriage date */
	marriage_date?: string;
	/** Marriage location */
	marriage_location?: string;
}

/**
 * Update Union Input
 */
export interface UpdateUnionInput {
	/** Union status */
	status?: "married" | "divorced" | "partners";
	/** Marriage date */
	marriage_date?: string;
	/** Marriage location */
	marriage_location?: string;
	/** Divorce date */
	divorce_date?: string;
	/** Divorce location */
	divorce_location?: string;
}

/**
 * Union Response (API wrapper)
 */
export interface UnionResponse {
	/** Union data */
	union: GeniUnionDetail;
}

/**
 * Union Children Response
 */
export interface UnionChildrenResponse {
	/** Children profile IDs */
	children: string[];
	/** Children count */
	count?: number;
}
