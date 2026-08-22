import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    CartesianGrid,
    Rectangle,
} from "recharts";
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

function ChartTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: { payload: { category: string; count: number } }[];
}) {
    if (!active || !payload?.length) return null;
    const { category, count } = payload[0].payload;
    return (
        <div className="rounded-md border border-border bg-popover px-3 py-2 text-popover-foreground shadow-md">
            <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                {category}
            </p>
            <p className="text-sm font-bold">{count} books</p>
        </div>
    );
}

export default function BooksSummaryPage() {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
                <Skeleton className="h-72" />
                <Skeleton className="h-72" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-6 p-6">
            {/* stat cards unchanged */}
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

            {/* interactive chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Books by Category</CardTitle>
                    <p className="text-xs text-muted-foreground">
                        Click a bar to view that category
                    </p>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart
                            data={data.by_category}
                            onMouseLeave={() => setActiveCategory(null)}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="var(--color-border)"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="category"
                                fontSize={12}
                                stroke="var(--color-muted-foreground)"
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                fontSize={12}
                                stroke="var(--color-muted-foreground)"
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                content={<ChartTooltip />}
                                cursor={{ fill: "var(--color-muted)" }}
                            />
                            <Bar
                                dataKey="count"
                                radius={4}
                                onMouseEnter={(entry) =>
                                    setActiveCategory(entry.payload.category)
                                }
                                onClick={(entry) =>
                                    navigate(
                                        `/books?category=${encodeURIComponent(entry.payload.category)}`,
                                    )
                                }
                                cursor="pointer"
                                animationDuration={400}
                                shape={(props: any) => (
                                    <Rectangle
                                        {...props}
                                        fill={
                                            activeCategory ===
                                            props.payload.category
                                                ? "var(--color-primary)"
                                                : "var(--color-accent)"
                                        }
                                    />
                                )}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* recent books table unchanged */}
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
