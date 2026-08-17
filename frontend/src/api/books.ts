import api from "@/lib/axios";
import type { PaginatedBooks } from "@/types/book";
import type { BooksSummary } from "@/types/book-summary";

export interface GetBooksParams {
    page?: number;
    per_page?: number;
    category?: string;
    search?: string;
}

export const getBooks = (params: GetBooksParams = {}) =>
    api.get<PaginatedBooks>("/v1/books", { params }).then((res) => res.data);

export const getBooksSummary = () =>
    api.get<BooksSummary>("/v1/books/summary").then((res) => res.data);
