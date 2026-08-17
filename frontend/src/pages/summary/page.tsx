import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { getBooksSummary } from "@/api/books";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BooksSummaryPage() {
    const { data, isLoading } = useQuery({
        queryKey: ["books-summary"],
        queryFn: getBooksSummary,
    });

    if (isLoading) {
        return (
            <div className="space-y-6 p-6">
                <div className="grid grid-cols-3 gap-4">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
                <Skeleton className="h-64" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-6 p-6">
            {/* stat cards */}
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground">
                            Total Books
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-bold">
                        {data.total_books}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground">
                            Low Stock
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-bold text-yellow-600">
                        {data.low_stock_count}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground">
                            Out of Stock
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-bold text-destructive">
                        {data.out_of_stock_count}
                    </CardContent>
                </Card>
            </div>

            {/* chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Books by Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={data.by_category}>
                            <XAxis dataKey="category" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Bar
                                dataKey="count"
                                fill="var(--color-primary)"
                                radius={4}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* recent books table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Books</CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        render={<Link to="/books" />}
                    >
                        View all
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.recent_books.map((book) => (
                                <TableRow key={book.book_code}>
                                    <TableCell className="font-medium">
                                        {book.title}
                                    </TableCell>
                                    <TableCell>{book.category}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                (book.stock?.quantity ?? 0) ===
                                                0
                                                    ? "destructive"
                                                    : "secondary"
                                            }
                                        >
                                            {book.stock?.quantity ?? 0}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {book.current_price
                                            ? new Intl.NumberFormat("id-ID", {
                                                  style: "currency",
                                                  currency: "IDR",
                                                  minimumFractionDigits: 0,
                                              }).format(
                                                  book.current_price.price,
                                              )
                                            : "—"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
