import {
    Accordion,
    AccordionTrigger,
    AccordionContent,
    AccordionItem,
} from "@/Components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Skeleton } from "@/Components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import MainLayout from "@/Layouts/MainLayout";
import { Head, usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import {
    Award,
    Book,
    ShieldAlert,
    Star,
    TrendingUp,
    Users,
} from "lucide-react";

function AuthorMainStat({ author, tab }) {
    switch (tab) {
        case "rating":
            return (
                <div className="flex items-center text-lg">
                    <Star className="w-4 h-4 mr-1 text-accent fill-accent" />
                    <span>
                        {parseFloat(author.ratings_avg_rating).toFixed(2)} Avg
                    </span>
                </div>
            );
        case "trending":
            return (
                <div className="flex items-center text-lg text-emerald-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>
                        {parseFloat(author.trending_score).toFixed(0)} Score
                    </span>
                </div>
            );
        case "popularity":
        default:
            return (
                <div className="flex items-center text-lg">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{author.popularity_count} Votes</span>
                </div>
            );
    }
}

function AuthorStats({ author }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Ratings
                    </CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {author.ratings_count}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        dari semua bukunya
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Best Rated Book
                    </CardTitle>
                    <Book className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-lg font-semibold truncate">
                        {author.best_rated_book?.title || "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Buku dengan rating tertinggi
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Worst Rated Book
                    </CardTitle>
                    <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-lg font-semibold truncate">
                        {author.worst_rated_book?.title || "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Buku dengan rating terendah
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default function AuthorsIndex() {
    const { authors, currentTab } = usePage().props;
    // const authors = [
    //     {
    //         id: 1,
    //         name: "John Doe",
    //         trending_score: 10,
    //         ratings_count: 100,
    //         ratings_avg_rating: 4.5,
    //         popularity_count: 1000,
    //         worst_rated_book: {
    //             id: 1,
    //             title: "Book 1",
    //         },
    //         best_rated_book: {
    //             id: 2,
    //             title: "Book 2",
    //         }
    //     },
    // ];

    return (
        <>
            <Head title="Top Authors" />
            <div className="container mx-auto">
                <h1 className="mb-4 text-2xl">Top 20 Most Famous Authors</h1>

                <Tabs defaultValue={currentTab}>
                    <TabsList className="border">
                        <TabsTrigger value="popularity" asChild>
                            <Link
                                href={route("authors.index", {
                                    tab: "popularity",
                                })}
                            >
                                By Popularity
                            </Link>
                        </TabsTrigger>
                        <TabsTrigger value="trending" asChild>
                            <Link
                                href={route("authors.index", {
                                    tab: "trending",
                                })}
                            >
                                By Trending
                            </Link>
                        </TabsTrigger>
                        <TabsTrigger value="rating" asChild>
                            <Link
                                href={route("authors.index", { tab: "rating" })}
                            >
                                By Average Rating
                            </Link>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value={currentTab}>
                        <Accordion type="single" collapsible>
                            {authors.map((author, index) => (
                                <AccordionItem
                                    value={`author-${author.id}`}
                                    key={author.id}
                                >
                                    <AccordionTrigger className="text-lg px-2">
                                        <div className="flex justify-between items-center w-full pr-4">
                                            <div className="flex items-center text-lg">
                                                <span className="w-12 font-bold">
                                                    #{index + 1}
                                                </span>
                                                <span className="font-semibold">
                                                    {author.name}
                                                </span>
                                            </div>

                                            <AuthorMainStat
                                                author={author}
                                                tab={currentTab}
                                            />
                                        </div>
                                    </AccordionTrigger>

                                    <AccordionContent>
                                        <AuthorStats author={author} />
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}

AuthorsIndex.layout = (page) => <MainLayout children={page} />;
