"use client";

import React, { useState } from "react";
import WavyGradient from "@/components/WavyGradient";
import Header from "@/components/events/Header";
import Sidebar from "@/components/events/Sidebar";
import MobileFilter from "@/components/events/MobileFilter";
import EventGrid from "@/components/events/EventGrid";
import { EVENTS_DATA, CATEGORIES, STATUSES } from "@/components/events/constants/events";
import { Category } from "@/components/events/types/events";



export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter Logic
  const filteredEvents = EVENTS_DATA.filter((event) => {
    const matchesCategory =
      activeCategory === "All" || event.category === activeCategory;

    // Assumes your event object has a `status` property mapping to our STATUSES
    const matchesStatus =
      activeStatus === "All" || event.status === activeStatus;

    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCategory && matchesSearch && matchesStatus;
  });

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-orange-400 selection:text-white">
      {/* Background Gradient */}
      <WavyGradient
        color1="#F09400"
        color2="#A80000"
        color3="#1A0000"
        direction={20}
        speed={1.5}
        waveHeight={0.45}
        noiseIntensity={5}
        waveAmplitude={1}
      />

      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 p-6">
        <Sidebar
          categories={CATEGORIES}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          statuses={STATUSES}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
        />

        {/* You will likely need to pass the status props to MobileFilter eventually too */}
        <MobileFilter
          categories={CATEGORIES}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          statuses={STATUSES}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
        />

        <EventGrid filteredEvents={filteredEvents} />
      </main>
    </div>
  );
}