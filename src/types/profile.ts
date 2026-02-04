/**
 * Profile types for Geni API
 */

/**
 * Geni Profile (Person)
 */
export interface GeniProfile {
	/** Unique profile ID */
	id: string;
	/** GUID (globally unique identifier) */
	guid?: string;
	/** Profile URL */
	url?: string;
	/** Full name */
	name: string;
	/** First name */
	first_name?: string;
	/** Middle name */
	middle_name?: string;
	/** Last name (surname) */
	last_name?: string;
	/** Maiden name */
	maiden_name?: string;
	/** Display name */
	display_name?: string;
	/** Gender (male, female, unknown) */
	gender?: "male" | "female" | "unknown";
	/** Birth date (GEDCOM format or structured) */
	birth?: ProfileDate;
	/** Death date (GEDCOM format or structured) */
	death?: ProfileDate;
	/** Baptism date */
	baptism?: ProfileDate;
	/** Burial date */
	burial?: ProfileDate;
	/** Is profile locked by another user */
	locked?: boolean;
	/** Is profile living */
	is_alive?: boolean;
	/** Is profile public */
	public?: boolean;
	/** Profile photo URLs */
	mugshot_urls?: ProfilePhotoUrls;
	/** Profile creator ID */
	creator_id?: string;
	/** Created at timestamp */
	created_at?: string;
	/** Updated at timestamp */
	updated_at?: string;
	/** Nicknames */
	nicknames?: string[];
	/** Suffix (Jr., Sr., III, etc.) */
	suffix?: string;
	/** About/biography text */
	about?: string;
	/** Profile occupation */
	occupation?: string;
	/** Education */
	education?: string;
	/** Religion */
	religion?: string;
}

/**
 * Profile Date (can be string or structured)
 */
export interface ProfileDate {
	/** Date string (YYYY-MM-DD or GEDCOM format) */
	date?: string;
	/** Structured date components */
	year?: number;
	month?: number;
	day?: number;
	/** Circa flag */
	circa?: boolean;
}

/**
 * Profile Photo URLs (different sizes)
 */
export interface ProfilePhotoUrls {
	/** Thumbnail URL */
	thumb?: string;
	/** Small image URL */
	small?: string;
	/** Medium image URL */
	medium?: string;
	/** Large image URL */
	large?: string;
	/** Original image URL */
	original?: string;
}

/**
 * Profile Event (birth, death, baptism, burial, etc.)
 */
export interface ProfileEvent {
	/** Event type */
	type: "birth" | "death" | "baptism" | "burial" | "marriage" | "other";
	/** Event date */
	date?: ProfileDate;
	/** Event location */
	location?: ProfileLocation;
	/** Event description */
	description?: string;
}

/**
 * Profile Location
 */
export interface ProfileLocation {
	/** Location name/address */
	place_name?: string;
	/** City */
	city?: string;
	/** County */
	county?: string;
	/** State/Province */
	state?: string;
	/** Country */
	country?: string;
	/** Latitude */
	latitude?: number;
	/** Longitude */
	longitude?: number;
}

/**
 * Immediate Family Response
 */
export interface ImmediateFamilyResponse {
	/** Current profile */
	focus: GeniProfile;
	/** Nodes (family members) */
	nodes: Record<string, GeniProfile>;
	/** Unions (marriages/partnerships) */
	unions?: Record<string, GeniUnion>;
}

/**
 * Union (Marriage/Partnership) basic info embedded in profile responses
 */
export interface GeniUnion {
	/** Union ID */
	id: string;
	/** URL */
	url?: string;
	/** Status (married, divorced, etc.) */
	status?: string;
	/** Marriage date */
	marriage_date?: ProfileDate;
	/** Divorce date */
	divorce_date?: ProfileDate;
	/** Partners */
	partners?: string[];
	/** Children */
	children?: string[];
}

/**
 * Profile Search Response
 */
export interface ProfileSearchResponse {
	/** Search results */
	results: GeniProfile[];
	/** Total count */
	count?: number;
	/** Next page URL */
	next_page?: string;
}
