<?php

namespace App\Http\Controllers\Masters;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use function Laravel\Prompts\select;

class BookController extends Controller
{
    /**
     * Retrieves active books with stock and current-price data.
     *
     * @param Request $request Request parameters for category filtering, title search, pagination size, and pagination.
     * @return \Illuminate\Http\JsonResponse A paginated JSON response containing the matching books.
     */
    public function index(Request $request){
        $books = Book::with(['stock', 'currentPrice'])
                ->active()
                ->when($request->filled('category'), fn ($q) =>
                    $q->where('category', $request->category)
                )
                ->when($request->filled('search'), fn ($q) =>
                    $q->where('title', 'ILIKE', '%' . $request->search . '%')
                )
                ->orderBy('title')
                ->paginate($request->integer('per_page', 20));

        return response()->json($books);
    }

    /**
     * Provides aggregate inventory statistics and recently created active books.
     *
     * @return \Illuminate\Http\JsonResponse The totals, stock counts, category aggregates, and five most recent active books.
     */
    public function summary()
    {
        return response()->json([
            'total_books' => Book::active()->count(),
            'low_stock_count' => Book::active()->whereHas('stock', fn ($q) =>
                $q->where('quantity', '>', 0)->where('quantity', '<=', 10)
            )->count(),
            'out_of_stock_count' => Book::active()->whereHas('stock', fn ($q) =>
                $q->where('quantity', 0)
            )->count(),
            'by_category' => Book::active()
                ->selectRaw('category, count(*) as count')
                ->groupBy('category')
                ->orderByDesc('count')
                ->get(),
            'recent_books' => Book::with(['stock', 'currentPrice'])
                ->active()
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }

    /**
     * Retrieves a book by its code.
     *
     * @param string $bookCode The code identifying the book.
     * @return \Illuminate\Http\JsonResponse The book with stock and current-price data, or a 404 response if the book is not found.
     */
    public function show(string $bookCode){
        $book = Book::with(['stock', 'currentPrice'])
                ->where('book_code', $bookCode)
                ->first();

        if (!$book) {
            return response()->json(['message' => 'Book not found'], 404);
        }

        return response()->json($book);
    }

    public function store (Request $request){

        $validator = Validator::make($request->all(), [
            'book_code' => 'required|string|max:20|unique:books_master,book_code',
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'publication_year' => 'nullable|integer|min:1000|max:' . (date('Y') + 1),
            'isbn' => 'nullable|string|max:20',
            'category' => 'nullable|string|max:100',
            'page_count' => 'nullable|integer|min:1',
            'language' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([                
                'message' => 'Validation failed',
                'errors' => $validator->errors()], 422);
        }

         $book = Book::create($validator->validated());

         return response()->json([
            'message' => 'Book created successfully',
            'book' => $book,
        ], 201);

    }

    public function update(Request $request, string $bookCode)
    {
        $book = Book::where('book_code', $bookCode)->first();

        if (! $book) {
            return response()->json(['message' => 'Book not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'author' => 'sometimes|required|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'publication_year' => 'nullable|integer|min:1000|max:' . (date('Y') + 1),
            'isbn' => 'nullable|string|max:20',
            'category' => 'nullable|string|max:100',
            'page_count' => 'nullable|integer|min:1',
            'language' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }
        $book->update($validator->validated());

        return response()->json([
            'message' => 'Book updated successfully',
            'book' => $book->fresh(),
        ]);
    }

    public function destroy(string $bookCode)
    {
        $book = Book::where('book_code', $bookCode)->first();
    
        if (! $book) {
            return response()->json(['message' => 'Book not found'], 404);
        }
    
        if (! $book->is_active) {
            return response()->json(['message' => 'Book is already inactive'], 409);
        }
    
        $book->update(['is_active' => false]);
    
        return response()->json([
            'message' => 'Book deactivated successfully',
        ]);
    }
    
    public function restore(string $bookCode)
    {
        $book = Book::where('book_code', $bookCode)->first();
    
        if (! $book) {
            return response()->json(['message' => 'Book not found'], 404);
        }
    
        if ($book->is_active) {
            return response()->json(['message' => 'Book is already active'], 409);
        }
    
        $book->update(['is_active' => true]);
    
        return response()->json([
            'message' => 'Book restored successfully',
            'book' => $book->fresh(),
        ]);
    }
}
