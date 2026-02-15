import Image from "next/image";
import { Clickable } from "@/components/Clickable";
import { Countdown } from "@/components/Landing/Countdown";

export function HeroSection() {
  return (
    <section className="w-full py-16 flex flex-col">
      <Image
        src="/images/srijan-wide-icon.svg"
        alt="A wide layout logo for Srijan'26"
        height={200}
        width={2.298 * 200} // Aspect ratio 2.298:1
      />
      <h2 className="py-5 pl-12 text-xl sm:text-2xl md:text-3xl">
        The Annual Techno-Management Fest of{" "}
        <div className="font-elnath py-2 text-3xl sm:text-4xl md:text-5xl uppercase">
          Jadavpur University
        </div>
      </h2>
      <article className="self-end grid py-8 pr-12">
        <h3 className="p-2 border-t border-b text-xl text-center">
          Time Remaining
        </h3>
        {/* <CountDown targetDate={new Date("2024-02-29T00:00:00")} /> */}
        <Countdown targetDate={new Date("2026-04-17T00:00:00").getTime()} />
        <p className="text-2xl font-elnath p-2">17 - 25 April, 2026</p>
        <Clickable
          as="a"
          href="/register"
          className="justify-self-center w-fit! h-12! uppercase bg-red hover:bg-red-500"
        >
          Register Now!
        </Clickable>
      </article>
    </section>
  );
}
