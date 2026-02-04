/**
 * Unions API for Geni
 *
 * Endpoints for managing unions (marriages/partnerships)
 */

import type { HttpClient } from "../utils/http";
import type {
	GeniUnionDetail,
	UnionResponse,
	CreateUnionInput,
	UpdateUnionInput,
	UnionChildrenResponse,
} from "../types";

/**
 * Unions API class
 */
export class UnionsAPI {
	private http: HttpClient;

	constructor(http: HttpClient) {
		this.http = http;
	}

	/**
	 * Get union details by ID
	 */
	async getUnion(unionId: string): Promise<GeniUnionDetail> {
		const response = await this.http.get<UnionResponse>(`/union-${unionId}`);
		if (!response.data?.union) {
			throw new Error(`Union ${unionId} not found`);
		}
		return response.data.union;
	}

	/**
	 * Get children of a union
	 */
	async getChildren(unionId: string): Promise<string[]> {
		const response = await this.http.get<UnionChildrenResponse>(`/union-${unionId}/children`);
		if (!response.data?.children) {
			return [];
		}
		return response.data.children;
	}

	/**
	 * Create a new union (marriage/partnership)
	 */
	async createUnion(data: CreateUnionInput): Promise<GeniUnionDetail> {
		const response = await this.http.post<UnionResponse>("/union", data);
		if (!response.data?.union) {
			throw new Error("Failed to create union");
		}
		return response.data.union;
	}

	/**
	 * Update union data
	 */
	async updateUnion(unionId: string, data: UpdateUnionInput): Promise<GeniUnionDetail> {
		const response = await this.http.put<UnionResponse>(`/union-${unionId}`, data);
		if (!response.data?.union) {
			throw new Error(`Failed to update union ${unionId}`);
		}
		return response.data.union;
	}

	/**
	 * Delete a union
	 */
	async deleteUnion(unionId: string): Promise<void> {
		await this.http.delete(`/union-${unionId}`);
	}
}
