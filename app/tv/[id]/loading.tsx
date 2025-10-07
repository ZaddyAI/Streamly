import { Header } from "@/components/header"

export default function TVShowLoading() {
    return (
        <div className="min-h-screen">
            <Header />

            <div className="relative h-[60vh] md:h-[70vh] w-full bg-secondary animate-pulse" />

            <div className="relative -mt-48 z-10">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-none w-48 md:w-64">
                            <div className="aspect-[2/3] rounded-lg bg-secondary animate-pulse" />
                        </div>

                        <div className="flex-1 space-y-6">
                            <div className="h-12 w-3/4 bg-secondary animate-pulse rounded" />
                            <div className="h-6 w-1/2 bg-secondary animate-pulse rounded" />
                            <div className="h-24 w-full bg-secondary animate-pulse rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
