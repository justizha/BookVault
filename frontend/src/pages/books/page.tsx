import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { useTable, tableFeatures, flexRender } from "@tanstack/react-table";
import { getBooks, getBooksSummary, deleteBook } from "@/api/books";
import { getColumns } from "@/components/books/columns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { Book } from "@/types/book";
import CategoryCombobox from "@/components/CategoryComboBox";

const features = tableFeatures({});
const ALL_CATEGORIES = "__all__";

export default function BooksPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();

    const category = searchParams.get("category") ?? undefined;
    const search = searchParams.get("search") ?? "";
    const page = Number(searchParams.get("page") ?? 1);

    const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["books", page, search, category],
        queryFn: () =>
            getBooks({
                page,
                search: search || undefined,
                category,
                per_page: 20,
            }),
    });

    const { data: summary } = useQuery({
        queryKey: ["books-summary"],
        queryFn: getBooksSummary,
        staleTime: 5 * 60 * 1000,
    });

    const deleteMutation = useMutation({
        mutationFn: (bookCode: string) => deleteBook(bookCode),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books"] });
            queryClient.invalidateQueries({ queryKey: ["books-summary"] });
            setBookToDelete(null);
            toast.success("Book deactivated successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    

    const columns = getColumns(
        (book: Book) => console.log("edit", book),
        (book: Book) => setBookToDelete(book),
    );

    const table = useTable({
        features,
        data: data?.data ?? [],
        columns,
    });

    function updateParams(updates: Record<string, string | undefined>) {
        const next = new URLSearchParams(searchParams);
        for (const [key, value] of Object.entries(updates)) {
            if (value) next.set(key, value);
            else next.delete(key);
        }
        setSearchParams(next);
    }

    function handleSearchChange(value: string) {
        updateParams({ search: value || undefined, page: undefined });
    }

    function handleCategoryChange(value: string) {
        updateParams({
            category: value === ALL_CATEGORIES ? undefined : value,
            page: undefined,
        });
    }

    function goToPage(nextPage: number) {
        updateParams({ page: nextPage > 1 ? String(nextPage) : undefined });
    }

    function handleDialogOpenChange(open: boolean) {
        if (!open) {
            setBookToDelete(null);
            deleteMutation.reset();
        }
    }

    return (
        <div className="space-y-4 p-6">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">Books</h1>
                <div className="flex items-center gap-2">
                    <CategoryCombobox
                        categories={summary?.by_category ?? []}
                        value={category}
                        onChange={(value) =>
                            handleCategoryChange(value ?? ALL_CATEGORIES)
                        }
                    />
                    <Input
                        placeholder="Search books..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
            </div>

            {category && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Filtering by</span>
                    <Badge variant="secondary">{category}</Badge>
                    <button
                        onClick={() => handleCategoryChange(ALL_CATEGORIES)}
                        className="underline underline-offset-2 hover:text-foreground"
                    >
                        Clear
                    </button>
                </div>
            )}

            {isLoading || deleteMutation.isPending ? (
                <Skeleton className="h-140 w-full" />
            ) : (
                <div className="border h-140 overflow-y-auto">
                    <Table className="**:data-[slot=table-container]:overflow-visible">
                        <TableHeader className="sticky top-0 z-10 bg-background border">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getAllCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                    Page {data?.current_page ?? 1} of {data?.last_page ?? 1} —{" "}
                    {data?.total ?? 0} total books
                </span>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => goToPage(page - 1)}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= (data?.last_page ?? 1)}
                        onClick={() => goToPage(page + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <AlertDialog
                open={!!bookToDelete}
                onOpenChange={handleDialogOpenChange}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deactivate book?</AlertDialogTitle>
                        <AlertDialogDescription>
                            "{bookToDelete?.title}" will be marked inactive and
                            hidden from the active book list. This can be
                            reversed later.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {deleteMutation.isError && (
                        <p className="text-sm text-destructive">
                            Failed to deactivate this book. Please try again.
                        </p>
                    )}

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteMutation.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={deleteMutation.isPending}
                            onClick={() =>
                                bookToDelete &&
                                deleteMutation.mutate(bookToDelete.book_code)
                            }
                        >
                            {deleteMutation.isPending
                                ? "Deactivating..."
                                : "Deactivate"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
