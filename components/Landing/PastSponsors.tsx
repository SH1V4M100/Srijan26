import { MarqueeSlider } from "./MarqueeSlider";

const SPONSORS = [
  {
    image: "/shirt2.png",
    link: "https://example.com",
    name: "Sponsor 1",
  },
  {
    image: "/shirt2.png",
    link: "https://example.com",
    name: "Sponsor 2",
  },
  {
    image: "/shirt2.png",
    link: "https://example.com",
    name: "Sponsor 3",
  },
  {
    image: "/shirt2.png",
    link: "https://example.com",
    name: "Sponsor 4",
  },
  {
    image: "/shirt2.png",
    link: "https://example.com",
    name: "Sponsor 5",
  },
];

export const PastSponsors = () => {
  return (
    <MarqueeSlider name="Past Sponsors" itemCount={SPONSORS.length}>
      {SPONSORS.map((sponsor) => (
        <li
          key={sponsor.name}
          className={`bg-no-repeat bg-cover bg-center block h-[33vw] w-[33vw] m-4`}
          style={{
            backgroundImage: `url(${sponsor.image})`,
          }}
        >
          <a
            href={sponsor.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full w-full"
            aria-label={sponsor.name}
          ></a>
        </li>
      ))}
    </MarqueeSlider>
  );
};
