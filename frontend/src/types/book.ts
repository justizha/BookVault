export interface Stock {
    stock_id: string;
    book_code: string;
    quantity: number;
    shelf_location: string;
    warehouse: string;
    last_restocked: string;
}

export interface Price {
    price_id: string;
    book_code: string;
    price: number;
    currency: string;
    discount_percent: number;
    effective_date: string;
}

export interface Book {
    book_code: string;
    title: string;
    author: string;
    publisher: string;
    publication_year: number;
    isbn: string;
    category: string;
    page_count: number;
    language: string;
    is_active: boolean;
    stock: Stock | null;
    current_price: Price | null;
}

export interface PaginatedBooks {
    current_page: number;
    data: Book[];
    total: number;
    last_page: number;
    per_page: number;
}
