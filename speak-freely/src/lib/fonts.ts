/* ==========================================================
   Speak Freely Brand Fonts
   Loaded via Next.js Font Optimization
   ========================================================== */

   import { Staatliches, Poppins } from "next/font/google";

   /**
    * Staatliches — Display font (used for logo, headings, nav)
    */
   export const staatliches = Staatliches({
     weight: "400", // only one weight available for Staatliches
     subsets: ["latin"],
     display: "swap",
     variable: "--font-staatliches",
   });
   
   /**
    * Poppins — Body font (used for paragraphs, cards, UI)
    */
   export const poppins = Poppins({
     subsets: ["latin"],
     weight: ["300", "400", "500", "600"],
     display: "swap",
     variable: "--font-poppins",
   });
   