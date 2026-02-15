"use client";

import Balls from "@/components/Balls";
import NotificationCard from "@/components/Notifications/NotificationCard";

export default function NotificationsPage() {
  const notifications: any[] = [];

  return (
    <main className="full-bleed min-h-screen relative text-white overflow-hidden">
      <div className="fixed inset-0 z-[-20] bg-[#160505]" />
      <Balls />
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-28 flex flex-col gap-10 sm:gap-12">
        <header className="flex flex-col items-center text-center gap-3 sm:gap-4 px-3">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-elnath text-[#EBD87D] drop-shadow-lg leading-tight">
            NOTIFICATIONS
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/70 font-euclid max-w-md sm:max-w-lg">
            Stay updated with the latest announcements from Srijan '26.
          </p>
        </header>

        <div className="flex flex-col gap-6 w-full min-h-[250px] sm:min-h-[300px]">
          {notifications.length > 0 ? (
            notifications.map((note) => (
              <NotificationCard
                key={note.id}
                title={note.title}
                message={note.message}
                date={note.date}
                isNew={note.isNew}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-4 sm:gap-6 text-center border border-white/10 rounded-xl bg-white/5 backdrop-blur-md mx-3">
              <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 sm:h-8 w-6 sm:w-8 text-[#EBD87D]/80"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <div className="space-y-2 sm:space-y-3 px-4">
                <h3 className="text-lg sm:text-2xl font-futura text-[#EBD87D] tracking-wide uppercase">
                  All Caught Up
                </h3>
                <p className="text-white/50 font-euclid text-sm sm:text-base max-w-xs sm:max-w-sm mx-auto">
                  We don't have any new updates for you right now. Check back closer to the event!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
