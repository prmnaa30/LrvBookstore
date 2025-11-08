import React, { useState, useEffect, useRef } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { useDebounce } from "use-debounce";

import MainLayout from "@/Layouts/MainLayout";
import { BookCard } from "@/Components/custom/BookCard";
import { FilterSidebar } from "@/Components/custom/FilterSidebar";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Paginator from "@/Components/custom/Paginator";
import { toast } from "sonner";

export default function BooksIndex() {
    const { books, filters, filterData, flash } = usePage().props;

    const isInitialLoad = useRef(true);

    const [queryParams, setQueryParams] = useState(filters);
    const [debouncedSearch] = useDebounce(queryParams.search, 300);

    // set query
    const setQuery = (key, value) => {
        setQueryParams((prev) => ({ ...prev, [key]: value }));
    };

    // saat apply filter di klik
    const applySidebarFilters = (sidebarState) => {
        setQueryParams((prev) => ({
            ...prev,
            ...sidebarState,
        }));
    };

    // flash message
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash?.success, {
                duration: 5000,
                richColors: true,
                position: "top-center",
                action: {
                    label: "Tutup",
                },
            });
        }
    }, [flash]);


    // handle filter sidebar
    useEffect(() => {
        // agar tidak jalan ketika pertama kali load
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            return;
        }

        const effectiveParams = { ...queryParams, search: debouncedSearch };

        router.get(route("index"), effectiveParams, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    }, [
        debouncedSearch,
        queryParams.sort,
        queryParams.categories,
        queryParams.authors,
        queryParams.stores,
        queryParams.status,
        queryParams.year_min,
        queryParams.year_max,
        queryParams.rating_min,
        queryParams.rating_max,
        queryParams.category_logic,
    ]);

    return (
        <>
            <Head title="Daftar Buku" />
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
                    <main className="lg:col-span-3">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
                            <Input
                                type="text"
                                placeholder="Cari judul, penulis, ISBN, publisher..."
                                value={queryParams.search || ""}
                                onChange={(e) =>
                                    setQuery("search", e.target.value)
                                }
                                className="w-full sm:w-1/2 lg:w-2/3 bg-neutral-50"
                            />
                            <Select
                                value={queryParams.sort || "rating_desc"}
                                onValueChange={(value) =>
                                    setQuery("sort", value)
                                }
                            >
                                <SelectTrigger className="w-full bg-neutral-50 sm:w-auto">
                                    <SelectValue placeholder="Urutkan berdasarkan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rating_desc">
                                        Rating Tertinggi
                                    </SelectItem>
                                    <SelectItem value="votes_desc">
                                        Paling Populer (Votes)
                                    </SelectItem>
                                    <SelectItem value="recent_popularity">
                                        Trending (30 Hari)
                                    </SelectItem>
                                    <SelectItem value="alphabetical_asc">
                                        Judul (A-Z)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {books.data.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>

                        {books.data.length === 0 && (
                            <div className="col-span-full text-center py-20">
                                <h2 className="text-2xl font-semibold text-muted-foreground">
                                    Tidak ada buku yang ditemukan
                                </h2>
                                <p className="text-muted-foreground">
                                    Coba ubah filter atau kata kunci pencarian
                                    Anda.
                                </p>
                            </div>
                        )}

                        <Paginator links={books.links} />
                    </main>

                    <FilterSidebar
                        filterData={filterData}
                        activeFilters={filters}
                        onApplyFilters={applySidebarFilters}
                    />
                </div>
            </div>
        </>
    );
}

BooksIndex.layout = (page) => <MainLayout children={page} />;
