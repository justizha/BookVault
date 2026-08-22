import type { ColumnDef } from "@tanstack/react-table";
import type { Book } from "@/types/book";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {  tableFeatures } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
const features = tableFeatures({})
export function getColumns(
    onEdit: (book: Book) => void,
    onDelete: (book: Book) => void
): ColumnDef<typeof features, Book>[] {
    return [
        { accessorKey: "title", header: "Title" },
        { accessorKey: "author", header: "Author" },
        { accessorKey: "category", header: "Category" },
        {
            id: "stock",
            header: "Stock",
            cell: ({ row }) => {
                const qty = row.original.stock?.quantity ?? 0;
                const variant =
                    qty === 0
                        ? "destructive"
                        : qty <= 10
                          ? "outline"
                          : "secondary";
                return <Badge variant={variant}>{qty}</Badge>;
            },
        },
        {
            id: "price",
            header: "Price",
            cell: ({ row }) => {
                const price = row.original.current_price;
                if (!price)
                    return <span className="text-muted-foreground">—</span>;
                return new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                }).format(price.price);
            },
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon" />}
                    >
                        <MoreHorizontalIcon className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(row.original)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(row.original)}
                            className="text-destructive"
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];
}
