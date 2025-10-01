"use client";

import { PagePagination } from "@/custom_components/PagePagination";
import { useState, useEffect } from "react";
import { client } from "@/utils/supabaseClient";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Quiz } from "@/utils/types";
import BrowseResultsCard from "@/custom_components/BrowseResultsCard";
import BrowseResultsForm from "@/custom_components/BrowseResultsForm";
import LoadingOverlay from "@/custom_components/LoadingOverlay";
import { toast } from "sonner";
import { calculateQueryRangeBeginning } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export interface BrowseQuizResultsPageSearchParams {
  school: string,
  subject?: string,
  courseCode?: string,
  professor?: string,
  yearStart?: string,
  yearEnd?: string,
  pageNumber?: string,
  sorting?: string,
}

interface BrowseQuizResultsPageProps {
  searchParams: Promise<BrowseQuizResultsPageSearchParams>
}

export default function BrowseQuizResults({ searchParams }: BrowseQuizResultsPageProps) {

  const [results, setResults] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // This is here so that it can be sent to the browse quiz form and populate it
  const [queriedQuizData, setQueriedQuizData]  = useState<BrowseQuizResultsPageSearchParams>({ school: "" })
  const [pageNumber, setPageNumber] = useState<number>(1)
  const pageLimit: number = 10

  const router = useRouter()
  const pathname: string = usePathname()                 
  const oldSearchParams = useSearchParams()    

  // This function makes sure the pageNumber is in sync with the actual page number
  function initPageNumber(pageNumber: string | undefined) {
    if (pageNumber) setPageNumber(Number(pageNumber))
  }

  // This function adjsuts the sorting of the fetched quizes
  function adjustSorting(sorting: string) {
    const newSearchParams = new URLSearchParams(oldSearchParams.toString());
    newSearchParams.set("sorting", sorting)
    console.log(`${pathname}?${newSearchParams.toString()}`)
    router.push(`${pathname}?${newSearchParams.toString()}`)
  }

  // This function retrieves Quiz Results from the database.
  async function fetchQuizResults() {
    setLoading(true)
    // resolve search params
    const browseResultsSearchParams = await searchParams

    // side affects
    initPageNumber(browseResultsSearchParams.pageNumber)

    setQueriedQuizData(browseResultsSearchParams)
    // query quiz results based on available search params
    let quizResultsQuery = client.from("quiz").select("*")
    if (browseResultsSearchParams.school) quizResultsQuery = quizResultsQuery.ilike("school", `%${browseResultsSearchParams.school}%`)
    if (browseResultsSearchParams.subject) quizResultsQuery = quizResultsQuery.ilike("subject", `%${browseResultsSearchParams.subject}%`)
    if (browseResultsSearchParams.courseCode) quizResultsQuery = quizResultsQuery.ilike("courseCode", `%${browseResultsSearchParams.courseCode}%`)
    if (browseResultsSearchParams.professor) quizResultsQuery = quizResultsQuery.ilike("professor", `%${browseResultsSearchParams.professor}%`)
    if (browseResultsSearchParams.yearStart) quizResultsQuery = quizResultsQuery.gte("year", Number(browseResultsSearchParams.yearStart))
    if (browseResultsSearchParams.yearEnd) quizResultsQuery = quizResultsQuery.lte("year", Number(browseResultsSearchParams.yearEnd))

    const rangeStart: number = calculateQueryRangeBeginning(Number(browseResultsSearchParams.pageNumber), pageLimit)
    const rangeEnd: number = rangeStart + pageLimit - 1

    if (browseResultsSearchParams.sorting && browseResultsSearchParams.sorting === "oldest") {
      quizResultsQuery = quizResultsQuery.order("createdAt", { ascending: true })
    } 
    else {
      quizResultsQuery = quizResultsQuery.order("createdAt", { ascending: false })
    }

    const quizResultsRespone: PostgrestSingleResponse<Quiz[]> = await quizResultsQuery.limit(pageLimit).range(rangeStart, rangeEnd)
    if (quizResultsRespone.error) {
      toast.error("An error occurred. Please try again later.")
    }
    else {
      const data: Quiz[] = quizResultsRespone.data as Quiz[];
      setResults(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchQuizResults()
  }, [searchParams, fetchQuizResults]);

  const currentSorting = queriedQuizData.sorting ?? "newest" 

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 pt-20 sm:pt-20 pb-20 sm:pb-30 relative">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pt-8 sm:pt-12">

        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Browse Results</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Tune the filters, then pick a quiz to view details.</p>
        </div>

        <LoadingOverlay show={loading} label="Fetching Results..." />
        <BrowseResultsForm queriedQuizData={queriedQuizData} />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3">
         
          <p className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
            Showing <span className="font-medium">{results.length}</span> result{results.length !== 1 ? 's' : ''}
          </p>
          <div className="order-1 sm:order-2">
            <select
              className="w-full sm:w-auto border rounded-md px-3 py-2 text-xs sm:text-sm bg-white"
              value={currentSorting}                            
              onChange={(e) => adjustSorting(e.target.value)} 
            >
              <option value="newest">Sort: Most recent</option>
              <option value="oldest">Sort: Oldest</option>
            </select>
          </div>
        </div>

        {results.length === 0 && !loading ? (
          <div className="bg-white/80 backdrop-blur-sm border rounded-xl sm:rounded-2xl shadow-sm p-8 sm:p-12 text-center">
            <p className="text-gray-500 text-sm sm:text-base">No results found. Try adjusting your filters.</p>
          </div>
        ) : (
          <ul className="space-y-2 sm:space-y-3">
            {results && results.map((quiz, index) => (
              <BrowseResultsCard quiz={quiz} key={index} />
            ))}
          </ul>
        )}

      </div>
      <PagePagination pageNumber={pageNumber} nextPageAvailable={results.length == pageLimit} ></PagePagination>

    </div>
  );
}