<?php

namespace App\Http\Controllers\Masters;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use function Laravel\Prompts\select;

class BookController extends Controller
{
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

    public function create(Request $request){
        return;
    }
}
