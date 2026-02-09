"use client";

import ProductView from "@/components/Merchandise/ProductView";
import Price from "@/components/Merchandise/Price";
import Contact from "@/components/Merchandise/Contact";
import Balls from "@/components/Balls";
import Image from "next/image";
import { Clickable } from "@/components/Clickable";
import { useState } from "react";

// export default function MerchandisePage() {
//   return (
//     <main className="full-bleed min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center relative text-white">
//       <Balls/>
//       <div className="absolute inset-0 bg-black/70" />

//       <div
//         className="
//           relative z-10
//           min-h-screen
//           grid
//           grid-cols-[1fr_1.2fr]
//           gap-24
//           px-24 py-20
//           items-center
//         "
//       >
//         <div className="flex flex-col items-center gap-10">
//           <ProductView />

//           {/* <div className="flex gap-4">
//             <div className="w-16 h-16 border border-white/40" />
//             <div className="w-16 h-16 border border-white/40" />
//             <div className="w-16 h-16 border border-white/40" />
//           </div> */}

//           <div className="flex gap-4">
//             {[1, 2, 3].map((i) => (
//               <div
//                 key={i}
//                 className="
//                   w-20 h-20
//                   border border-white/40
//                   flex items-center justify-center
//                   bg-white/5
//                 "
//               >
//                   <Image
//                     src="/shirt2.png"
//                     alt="Merchandise preview"
//                     width={52}
//                     height={52}
//                     className="object-contain"
//                   />
//                 </div>
//               ))}
//             </div>
//         </div>

//         <div
//           className="
//             flex flex-col
//             items-center
//             text-center
//             gap-8
//             max-w-xl
//             mx-auto
//           "
//         >
//           <h1 className="text-7xl font-elnath tracking-wide text-[#EBD87D]">
//             MERCHANDISE
//           </h1>

//           <div className="text-white/80 space-y-4 font-[var(--font-euclid)]">
//             <p className="text-[24px] leading-[120%] font-normal">
//               Presenting the Official Merchandise for Srijan’26!
//             </p>
//             <p className="text-[22px] leading-[120%] font-normal">
//               A polo t-shirt, available in black and white colors.
//             </p>
//           </div>
//           <Price />
//           <Clickable
//             className="
//               mt-4
//               bg-white text-black
//               text-2xl
//               tracking-wide
//               hover:bg-orange-400
//             "
//           >
//             BUY
//           </Clickable>

//           <div className="pt-10 flex flex-col items-center gap-6">
//             <h3 className="text-[#EBD87D] text-2xl">
//               Contact
//             </h3>
//             <Contact />
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }


export default function MerchandisePage() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <main className="full-bleed min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center relative text-white">
      <Balls />
      <div className="absolute inset-0 bg-black/70" />

      <div
        className="
          relative z-10 min-h-screen
          grid grid-cols-1 lg:grid-cols-[1fr_1.2fr]
          gap-12 md:gap-16 lg:gap-24
          px-6 py-10 md:px-12 md:py-16 lg:px-24 lg:py-20
          items-center
        "
      >
        <div className="flex flex-col items-center gap-6 md:gap-10">
          <ProductView />

          <div className="flex gap-3 md:gap-4">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`
                  w-16 h-16 md:w-20 md:h-20
                  flex items-center justify-center
                  bg-white/5
                  border
                  transition
                  outline-none
                  ${
                    activeIndex === i
                      ? "border-[#EBD87D] ring-2 ring-[#EBD87D]/60"
                      : "border-white/40 hover:border-white"
                  }
                  focus-visible:ring-2
                  focus-visible:ring-[#EBD87D]
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-black
                `}
              >
                <Image
                  src="/shirt2.png"
                  alt={`Merchandise preview ${i + 1}`}
                  width={48}
                  height={48}
                  className="object-contain pointer-events-none"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center text-center gap-6 md:gap-8 max-w-xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-elnath tracking-wide text-[#EBD87D]">
            MERCHANDISE
          </h1>

          <div className="text-white/80 space-y-3 md:space-y-4 font-[var(--font-euclid)]">
            <p className="text-lg md:text-[24px] leading-[120%]">
              Presenting the Official Merchandise for Srijan’26!
            </p>
            <p className="text-base md:text-[22px] leading-[120%]">
              A polo t-shirt, available in black and white colors.
            </p>
          </div>

          <Price />

          <Clickable
            className="mt-2 md:mt-4 bg-white text-black text-lg md:text-2xl tracking-wide hover:bg-orange-400"
          >
            BUY
          </Clickable>

          <div className="pt-6 md:pt-10 flex flex-col items-center gap-4 md:gap-6">
            <h3 className="text-[#EBD87D] text-lg md:text-2xl">
              Contact us
            </h3>
            <Contact />
          </div>
        </div>
      </div>
    </main>
  );
}