import { Caveat, Geist, Geist_Mono, Poppins } from "next/font/google";

export const caveat = Caveat({ subsets: ["latin"] });
export const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
export const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
export const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "200",
});