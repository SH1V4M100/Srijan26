
import Link from "next/link";
import { Radio } from "lucide-react";
import { getLiveEvents } from "@/lib/liveEvents";

export default async function LiveEvents() {
    const events = await getLiveEvents();

    if (events.length === 0) {
        return (
            <div className="w-full flex justify-center py-4 bg-black/20 backdrop-blur-sm border-t border-b border-white/5 text-white/50 font-euclid tracking-wide">
                No Live Events
            </div>
        );
    }

    return (
        <div className="w-full bg-black/20 backdrop-blur-md border-t border-b border-white/10 overflow-hidden relative z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-red-500 animate-pulse">
                        <Radio className="h-5 w-5" />
                        <span className="font-elnath tracking-wider text-sm md:text-base">LIVE NOW</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event) => (
                        <Link
                            key={event.id}
                            href={`/events/${event.slug}`}
                            className="
                                group
                                relative
                                bg-white/5 hover:bg-white/10
                                border border-white/10 hover:border-[#EBD87D]/50
                                rounded-lg p-4
                                transition-all duration-300
                            "
                        >
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-elnath text-[#EBD87D] tracking-wide group-hover:text-white transition-colors">
                                    {event.name}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-white/70 font-euclid">
                                    <span className="text-[#EBD87D]">{event.round}</span>
                                    <span>•</span>
                                    <span>{event.location}</span>
                                </div>
                            </div>

                            <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)] animate-pulse" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
