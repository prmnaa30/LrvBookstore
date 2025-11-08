import Combobox from "@/Components/custom/Combobox";
import { Button } from "@/Components/ui/button";
import MainLayout from "@/Layouts/MainLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function RatingsCreate() {
    const { authors, books, selectedAuthorId } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        author_id: selectedAuthorId || "",
        book_id: "",
        rating: "",
    });

    useEffect(() => {
        const errorMessages = Object.values(errors);
        errorMessages.forEach((message) => {
            toast.error(message, {
                duration: 5000,
                richColors: true,
                position: "top-center",
                action: {
                    label: "Tutup"
                },
            });
        });
    }, [errors]);

    const onAuthorChange = (authorId) => {
        setData("author_id", authorId);
        setData("book_id", "");

        router.get(
            route("ratings.create"),
            { author_id: authorId },
            {
                preserveState: true,
                replace: true,
                only: ["books", "selectedAuthorId"],
            }
        );
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("ratings.store"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Rate Buku" />
            <div className="container max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Rate Buku</h1>
                <form onSubmit={onSubmit}>
                    <div className="my-2">
                        <h3 className="text-md pl-1">Author</h3>
                        <Combobox
                            items={authors.map((author) => ({
                                value: author.id,
                                label: author.name,
                            }))}
                            value={parseInt(data.author_id)}
                            onChange={onAuthorChange}
                            placeholder="Author"
                        />
                    </div>

                    <div className="my-2">
                        <h3 className="text-md pl-1">Buku</h3>
                        <Combobox
                            items={books.map((book) => ({
                                value: book.id,
                                label: book.name,
                            }))}
                            value={parseInt(data.book_id)}
                            onChange={(bookId) => setData("book_id", bookId)}
                            placeholder={
                                data.author_id
                                    ? "Buku"
                                    : "Author terlebih dahulu"
                            }
                            disabled={!data.author_id}
                        />
                    </div>

                    <div className="my-2">
                        <h3 className="text-md pl-1">Rating</h3>
                        <Combobox
                            items={[
                                { value: 1, label: "⭐1" },
                                { value: 2, label: "⭐2" },
                                { value: 3, label: "⭐3" },
                                { value: 4, label: "⭐4" },
                                { value: 5, label: "⭐5" },
                                { value: 6, label: "⭐6" },
                                { value: 7, label: "⭐7" },
                                { value: 8, label: "⭐8" },
                                { value: 9, label: "⭐9" },
                                { value: 10, label: "⭐10" },
                            ]}
                            value={parseInt(data.rating)}
                            onChange={(rating) => setData("rating", rating)}
                            placeholder="Rating"
                            disabled={!data.author_id || !data.book_id}
                        />
                    </div>

                    <div className="relative">
                        <Button
                            type="submit"
                            className="mt-2 absolute right-0"
                            disabled={processing}
                        >
                            {processing ? "Menyimpan..." : "Simpan rating"}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

RatingsCreate.layout = (page) => <MainLayout children={page} />;
