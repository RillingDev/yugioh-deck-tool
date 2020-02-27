interface PaginatedResponse<T> {
    data: T;
    meta: {
        currentrows: number;
        totalrows: number;
        rowsremaining: number;
        totalpages: number;
        pagesremaining: number;
        nextpage: string;
    };
}
export { PaginatedResponse };
//# sourceMappingURL=PaginatedResponse.d.ts.map