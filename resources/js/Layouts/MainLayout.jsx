import Dropdown from "@/Components/Dropdown";
import { Button } from "@headlessui/react";
import { Link, usePage } from "@inertiajs/react";
import { BookOpen, ChevronDown, LogIn, Star, User } from "lucide-react";
import { Toaster } from "sonner";

export default function MainLayout({ children }) {
    const { user } = usePage().props.auth;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <Link
                                href="/"
                                className="flex items-center space-x-2"
                            >
                                <BookOpen className="h-6 w-6 text-blue-600" />
                                <span className="font-bold">
                                    BookStore John Doe
                                </span>
                            </Link>

                            {/* Link Navigasi */}
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <Link
                                    href={route("index")}
                                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                >
                                    Daftar Buku
                                </Link>
                                <Link
                                    href={route("authors.index")}
                                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                >
                                    Author Teratas
                                </Link>
                                {user && (
                                    <Link
                                        href={route("ratings.create")}
                                        className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    >
                                        Beri Rating
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Auth */}
                        <div className="flex items-center">
                            {user ? (
                                <div className="flex items-center">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                                >
                                                    {user.name}

                                                    <ChevronDown className="h-4" />
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            <Dropdown.Link
                                                href={route("profile.edit")}
                                            >
                                                Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            ) : (
                                <div className="space-x-2 flex gap-4">
                                    <Link href={route("login")}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex items-center gap-2"
                                        >
                                            <LogIn className="h-5 w-5" />
                                            Log In
                                        </Button>
                                    </Link>
                                    <Link href={route("register")}>
                                        <Button size="sm">Register</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="py-12">{children}</main>
            <Toaster />
        </div>
    );
}
