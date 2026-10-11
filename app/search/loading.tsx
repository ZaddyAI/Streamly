export default function SearchLoading() {
    return (
        <div className="space-y-8 md:space-y-10">
            <div className="space-y-2">
                <div className="h-5 w-28 bg-brand-accent/20 animate-pulse rounded-full" />
                <div className="h-10 w-64 bg-white/5 animate-pulse rounded-xl" />
                <div className="h-4 w-40 bg-white/5 animate-pulse rounded-full" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="aspect-[2/3] bg-white/5 animate-pulse rounded-2xl" />
                ))}
            </div>
        </div>
    )
}
