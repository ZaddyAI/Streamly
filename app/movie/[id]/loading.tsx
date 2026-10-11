export default function MovieLoading() {
    return (
        <div className="space-y-8 md:space-y-10">
            <div className="relative h-[280px] md:h-[360px] w-full rounded-3xl bg-white/5 animate-pulse" />

            <div className="relative -mt-32 md:-mt-40 z-10 flex flex-col md:flex-row gap-8">
                <div className="flex-none w-44 md:w-64 mx-auto md:mx-0">
                    <div className="aspect-[2/3] rounded-2xl bg-white/5 animate-pulse" />
                </div>

                <div className="flex-1 space-y-6">
                    <div className="h-6 w-40 bg-white/5 animate-pulse rounded-full" />
                    <div className="h-12 w-3/4 bg-white/5 animate-pulse rounded-xl" />
                    <div className="h-6 w-1/2 bg-white/5 animate-pulse rounded-xl" />
                    <div className="h-32 w-full bg-white/5 animate-pulse rounded-2xl" />
                    <div className="h-11 w-48 bg-brand-accent/40 animate-pulse rounded-xl" />
                </div>
            </div>
        </div>
    )
}
