/* eslint-disable @typescript-eslint/naming-convention */

export interface PaginatedResponse<T> {
    data: T;
    meta: {
        current_rows: number;
        total_rows: number;
        rows_remaining: number;
        total_pages: number;
        pages_remaining: number;
        previous_page?: string;
        previous_page_offset?: number;
        next_page?: string;
        next_page_offset?: number;
    };
}

export const createEmptyPaginatedResponse = <T>(
    data: T
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
