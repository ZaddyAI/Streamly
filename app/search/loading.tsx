import { Header } from "@/components/header"

export default function SearchLoading() {
    return (
        <div className="min-h-screen">
            <Header />

            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="h-10 w-64 bg-secondary animate-pulse rounded mb-2" />
                <div className="h-6 w-32 bg-secondary animate-pulse rounded mb-8" />

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="aspect-[2/3] bg-secondary animate-pulse rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    )
}
