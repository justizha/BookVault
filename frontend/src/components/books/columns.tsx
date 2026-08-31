import type { ColumnDef } from "@tanstack/react-table";
import type { Book } from "@/types/book";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { tableFeatures } from "@tanstack/react-table";
import { MoreHorizontalIcon, Trash2Icon, EditIcon } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

const features = tableFeatures({});

export function getColumns(
    onEdit: (book: Book) => void,
    onDelete: (book: Book) => void,
): ColumnDef<typeof features, Book>[] {
    return [
        { accessorKey: "title", header: "Title" },
        { accessorKey: "author", header: "Author" },
        { accessorKey: "category", header: "Category" },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <Tooltip>
                        <TooltipTrigger
                            render={
                                <DropdownMenuTrigger
                                    render={
                                        <Button variant="ghost" size="icon" />
                                    }
                                >
                                    <MoreHorizontalIcon className="size-4" />
                                </DropdownMenuTrigger>
                            }
                        />
                        <TooltipContent>
                            <p>Actions</p>
                        </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => onEdit(row.original)}
                            variant="warning"
                        >
                            <EditIcon className="size-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(row.original)}
                            variant="destructive"
                        >
                            <Trash2Icon className="size-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];
}