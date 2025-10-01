import { clsx, type ClassValue } from "clsx"
import { use } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function capitalizeFirstLetter(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export function calculateQueryRangeBeginning(pageNumber: number, pageLimit: number): number {
  return (pageNumber - 1) * pageLimit;
}

export function wait(seconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
// export function constructPageRoute(baseUrl: string, searchParams: object): string {
//   const params = new URLSearchParams()

//   Object.entries(searchParams).forEach(([key, value]) => {
//     if (value && key !== "pageNumber") {
//       params.append(key, value)
//     }
//   })

//   const queryString = params.toString()
//   return queryString ? `${baseUrl}${queryString}` : baseUrl
// }
