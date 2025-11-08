import { Link } from "@inertiajs/react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../ui/pagination";

export default function Paginator({ links }) {
    if (!links || links.length === 0) return null;

    const prev = links.find((link) =>
        link.label.toLowerCase().includes("previous")
    );
    const next = links.find((link) =>
        link.label.toLowerCase().includes("next")
    );

    const pages = links.filter(
        (link) =>
            !link.label.toLowerCase().includes("previous") &&
            !link.label.toLowerCase().includes("next")
    );

    return (
        <>
            <Pagination className="mt-4">
                <PaginationContent>
                    <PaginationItem>
                        {prev?.url ? (
                            <PaginationPrevious href={prev.url} />
                        ) : (
                            <PaginationPrevious
                                disabled
                                className="pointer-events-none opacity-50"
                            />
                        )}
                    </PaginationItem>

                    {pages.map((link, index) => {
                        if (link.label.includes("...")) {
                            return (
                                <PaginationItem key={index}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            );
                        }

                        return (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    isActive={link.active}
                                    href={link.url || "#"}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            </PaginationItem>
                        );
                    })}

                    <PaginationItem>
                        {next?.url ? (
                            <PaginationNext href={next.url} />
                        ) : (
                            <PaginationNext
                                disabled
                                className="pointer-events-none opacity-50"
                            />
                        )}
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </>
    );
}
