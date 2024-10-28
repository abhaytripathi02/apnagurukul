// "use client";
// import React from "react";
// import { WavyBackground } from "../../ui/Wavy-background";
// import { Tooltip } from "./Tooltip";

// export default function MeetOurEducators() {
//   return (
//     <WavyBackground className="max-w-4xl mx-auto pb-40">
//       <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
//         Meet Our Instructor
//       </p>
//       <Tooltip/>
//     </WavyBackground>
//   );
// }



import React from "react";
import { WavyBackground } from "../../ui/Wavy-background";
import { Tooltip } from "./Tooltip";

export default function  MeetOurEducators() {
  return (
    (<WavyBackground className="max-w-4xl mx-auto pb-40">
      <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
           Meet Our Instructor
      </p>
      <p
        className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
        Leverage the power of ApnaGurukul
      </p>
      <Tooltip/>
    </WavyBackground>)
  );
}

