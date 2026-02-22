import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: [
                    "/",
                    "/events",
                    "/events/",
                    "/merchandise",
                    "/login",
                    "/signup",
                ],
                disallow: [
                    "/api/",
                    "/admin/",
                    "/dashboard/",
                    "/notifications/",
                    "/register/",
                ],
            },
            {
                // Prevent AI crawlers from training on the content
                userAgent: [
                    "GPTBot",
                    "ChatGPT-User",
                    "CCBot",
                    "anthropic-ai",
                    "Claude-Web",
                    "Google-Extended",
                    "Omgilibot",
                    "FacebookBot",
                ],
                disallow: "/",
            },
        ],
        sitemap: "https://www.srijanju.in/sitemap.xml",
        host: "https://www.srijanju.in",
    };
}