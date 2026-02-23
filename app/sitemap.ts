import type { MetadataRoute } from "next";
import { EVENTS_DATA } from "@/components/events/constants/events";

const BASE_URL = "https://www.srijanju.in";

const FEST_DATE = new Date("2026-04-09T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
    const eventUrls: MetadataRoute.Sitemap = EVENTS_DATA.map((event) => ({
        url: `${BASE_URL}/events/${event.slug}`,
        lastModified: FEST_DATE,
        changeFrequency: "weekly",
        priority: 0.65,
    }));

    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/events`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.95,
        },
        {
            url: `${BASE_URL}/merchandise`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.85,
        },
        {
            url: `${BASE_URL}/login`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/signup`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        ...eventUrls,
    ];
}