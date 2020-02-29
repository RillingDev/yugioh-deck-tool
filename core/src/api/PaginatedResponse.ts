interface PaginatedResponse<T> {
    data: T;
    meta: {
        current_rows: number;
        total_rows: number;
        rows_remaining: number;
        total_pages: number;
        pages_remaining: number;
        previous_page?: string;
        next_page?: string;
    };
}

export { PaginatedResponse };
