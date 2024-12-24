export interface PaginatedResponse<T> {
	readonly data: T;
	readonly meta: {
		readonly current_rows: number;
		readonly total_rows: number;
		readonly rows_remaining: number;
		readonly total_pages: number;
		readonly pages_remaining: number;
		readonly previous_page?: string;
		readonly previous_page_offset?: number;
		readonly next_page?: string;
		readonly next_page_offset?: number;
	};
}

export const createEmptyPaginatedResponse = <T>(
	data: T,
): PaginatedResponse<T> => {
	return {
		data: data,
		meta: {
			current_rows: 0,
			total_rows: 0,
			rows_remaining: 0,
			total_pages: 0,
			pages_remaining: 0,
		},
	};
};
