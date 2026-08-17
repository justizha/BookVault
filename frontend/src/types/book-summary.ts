import type { Book } from "@/types/book"

export interface CategoryCount {
    category: string
    count: number
}

export interface BooksSummary {
    total_books: number
    low_stock_count: number
    out_of_stock_count: number
    by_category: CategoryCount[]
    recent_books: Book[]
}