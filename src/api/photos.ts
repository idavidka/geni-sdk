/**
 * Photos API for Geni
 *
 * Endpoints for managing photos
 */

import type { HttpClient } from "../utils/http";

/**
 * Photo data interface
 */
export interface GeniPhoto {
	id: string;
	url: string;
	caption?: string;
	profile_id?: string;
}

/**
 * Photo response interface
 */
export interface PhotoResponse {
	photo: GeniPhoto;
}

/**
 * Photos API class
 */
export class PhotosAPI {
	private http: HttpClient;

	constructor(http: HttpClient) {
		this.http = http;
	}

	/**
	 * Get photo details by ID
	 */
	async getPhoto(photoId: string): Promise<GeniPhoto> {
		const response = await this.http.get<PhotoResponse>(`/photo-${photoId}`);
		if (!response.data?.photo) {
			throw new Error(`Photo ${photoId} not found`);
		}
		return response.data.photo;
	}

	/**
	 * Upload a photo
	 * Note: This is a simplified implementation. Real implementation would handle file uploads.
	 */
	async uploadPhoto(photoUrl: string, profileId: string, caption?: string): Promise<GeniPhoto> {
		const response = await this.http.post<PhotoResponse>("/photo", {
			url: photoUrl,
			profile_id: profileId,
			caption,
		});
		if (!response.data?.photo) {
			throw new Error("Failed to upload photo");
		}
		return response.data.photo;
	}

	/**
	 * Delete a photo
	 */
	async deletePhoto(photoId: string): Promise<void> {
		await this.http.delete(`/photo-${photoId}`);
	}
}
