import { clsx } from "clsx";

interface NotificationProps {
  title: string;
  message: string;
  date: string;
  type?: "info" | "alert" | "success";
  isNew?: boolean;
}

export default function NotificationCard({
  title,
  message,
  date,
  type = "info",
  isNew = false,
}: NotificationProps) {
  return (
    <div
      className={clsx(
        "group relative flex flex-col gap-2 sm:gap-3 p-4 sm:p-6 rounded-lg border transition-all duration-300",
        "bg-white/5 backdrop-blur-sm hover:bg-white/10",
        "border-white/10 hover:border-[#EBD87D]/50",
        isNew && "border-l-4 border-l-[#EBD87D]"
      )}
    >
      <div className="flex justify-between items-start flex-wrap gap-2">
        <h3 className="text-lg sm:text-xl md:text-2xl font-futura font-bold text-[#EBD87D] tracking-wide uppercase leading-snug">
          {title}
        </h3>
        {isNew && (
          <span className="px-2 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-black bg-[#EBD87D] rounded-sm">
            New
          </span>
        )}
      </div>

      <p className="text-white/80 font-euclid text-sm sm:text-base leading-relaxed break-words">
        {message}
      </p>

      <div className="mt-2 flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity text-xs sm:text-sm">
        <div className="w-1.5 h-1.5 rounded-full bg-[#EBD87D]" />
        <span className="font-euclid text-[#EBD87D]">{date}</span>
      </div>
    </div>
  );
}
