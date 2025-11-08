// resources/js/Components/BookCard.jsx

import React from "react";
import { Link } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, User, ImageIcon, ArrowUp } from "lucide-react";

const formatRating = (rating) =>
    rating ? parseFloat(rating).toFixed(1) : "N/A";

const isTrending = (book) => {
    const currentAvg = parseFloat(book.avg_rating_last_7_days);
    const prevAvg = parseFloat(book.avg_rating_prev_7_days);

    if (!isNaN(currentAvg) && !isNaN(prevAvg)) {
        return currentAvg > prevAvg;
    }

    if (!isNaN(currentAvg) && isNaN(prevAvg) && currentAvg > 5) {
        return true;
    }

    return false;
};

export function BookCard({ book }) {
    const trending = isTrending(book);

    return (
        <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
            <CardHeader className="p-0">
                <div className="relative aspect-[4/3] w-full bg-muted flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-muted-foreground/30" />

                    <Badge
                        variant={
                            book.availability === "available"
                                ? "default"
                                : "destructive"
                        }
                        className="absolute top-2 right-2"
                    >
                        {book.availability}
                    </Badge>
                    {trending && (
                        <div className="absolute left-2 top-2">
                            <div className="flex items-center gap-1 text-emerald-600">
                                <ArrowUp className="h-4 w-4" />
                                <span className="text-xs font-semibold">
                                    TRENDING
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-4 flex-grow">
                <div
                    className="mb-2 flex flex-wrap gap-1"
                    style={{ minHeight: "24px" }}
                >
                    {book.categories.slice(0, 2).map((category) => (
                        <Badge key={category.id} variant="secondary">
                            {category.name}
                        </Badge>
                    ))}
                </div>
                    <p className="text-sm">ISBN: {book.isbn}</p>
                <Link
                    href="#"
                    className="text-lg font-bold line-clamp-2 hover:text-primary"
                >
                    {book.title}
                </Link>

                <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary"
                >
                    {book.author.name}
                </Link>
            </CardContent>

            <CardFooter className="p-4 bg-muted/50 border-t">
                <div className="flex w-full justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Star className="h-4 w-4 text-accent fill-accent" />
                        <span className="font-bold text-foreground">
                            {formatRating(book.ratings_avg_rating)}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{book.ratings_count.toLocaleString()}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
