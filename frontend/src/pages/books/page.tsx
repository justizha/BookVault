import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTable, tableFeatures, flexRender } from "@tanstack/react-table";
import { getBooks } from "@/api/books";
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
import { Skeleton } from "@/components/ui/skeleton";
import type { Book } from "@/types/book";

const features = tableFeatures({});

export default function BooksPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["books", page, search],
        queryFn: () =>
            getBooks({ page, search: search || undefined, per_page: 20 }),
    });

    const columns = getColumns(
        (book: Book) => console.log("edit", book),
        (book: Book) => console.log("delete", book),
    );

    const table = useTable({
        features,
        data: data?.data ?? [],
        columns,
    });

    return (
        <div className="space-y-4 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Books</h1>
                <Input
                    placeholder="Search books..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="max-w-sm"
                />
            </div>

            {isLoading ? (
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
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= (data?.last_page ?? 1)}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
