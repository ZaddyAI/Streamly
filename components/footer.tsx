"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import IconFork from "./fork";
import IconStar from "./star";

export function Footer() {
    const [forkStars, setForkStars] = useState<number | null>(null);
    const [star, setStar] = useState<number | null>(null);

    useEffect(() => {
        fetchGitHubData();
    }, []);
    const fetchGitHubData = async () => {
        try {
            const response = await fetch("/api/github-stats");
            const data = await response.json();
            setForkStars(data.forks);
            setStar(data.stars);
        } catch (error) {
            console.error("Error fetching GitHub data:", error);
        }
    }



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
                <div className="mt-8 pt-8 border-t border-border text-center">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        <strong>Disclaimer:</strong> Streamly does not host or store any video files on our servers.
                        All content is provided by third-party services. We are not responsible for the accuracy,
                        compliance, copyright, legality, decency, or any other aspect of the content from these
                        sources. If you have any legal issues, please contact the appropriate media file owners or
                        host sites.
                    </p>

                    <p className="text-xs text-muted-foreground mt-4">
                        © {new Date().getFullYear()} Streamly. All rights reserved.
                    </p>
                    {/* Designed & Built By */}
                    <p className="text-sm text-muted-foreground mt-4">
                        Designed & Built by{" "}
                        <a
                            href="https://github.com/ZaddyAI"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary font-medium hover:underline"
                        >
                            Zaddy
                        </a>
                    </p>
                    {/* GitHub Stats Centered */}
                    <div className="flex justify-center items-center gap-4 mt-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5">
                                <IconFork />
                            </div>
                            <span>{forkStars !== null ? forkStars : "..."}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5">
                                <IconStar />
                            </div>
                            <span>{star !== null ? star : "..."}</span>
                        </div>
                    </div>


                </div>
            </div>
        </footer>
    );
}
