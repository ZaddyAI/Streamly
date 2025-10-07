import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-background/50 border-t border-border mt-16">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-3">
                        <h3 className="text-xl font-bold text-primary">Streamly</h3>
                        <p className="text-sm text-muted-foreground">
                            Your ultimate destination for streaming movies and TV shows.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <h4 className="font-semibold">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/movies" className="text-muted-foreground hover:text-primary transition-colors">
                                    Movies
                                </Link>
                            </li>
                            <li>
                                <Link href="/tv-shows" className="text-muted-foreground hover:text-primary transition-colors">
                                    TV Shows
                                </Link>
                            </li>
                            <li>
                                <Link href="/trending" className="text-muted-foreground hover:text-primary transition-colors">
                                    Trending
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="space-y-3">
                        <h4 className="font-semibold">Categories</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Action</li>
                            <li>Comedy</li>
                            <li>Drama</li>
                            <li>Thriller</li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-3">
                        <h4 className="font-semibold">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Terms of Service</li>
                            <li>Privacy Policy</li>
                            <li>Contact Us</li>
                        </ul>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-8 pt-8 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center leading-relaxed">
                        <strong>Disclaimer:</strong> Streamly does not host or store any video files on our servers. All content is
                        provided by third-party services. We are not responsible for the accuracy, compliance, copyright, legality,
                        decency, or any other aspect of the content from these sources. If you have any legal issues, please contact
                        the appropriate media file owners or host sites.
                    </p>
                    <p className="text-xs text-muted-foreground text-center mt-4">
                        © {new Date().getFullYear()} Streamly. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
