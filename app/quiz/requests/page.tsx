"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { PagePagination } from "@/custom_components/PagePagination";
import { QuizRequests } from "@/utils/types";
import { client } from "@/utils/supabaseClient";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { currentYear } from "@/lib/constants";
import { calculateQueryRangeBeginning } from "@/lib/utils";
import LoadingOverlay from "@/custom_components/LoadingOverlay";
import { toast } from "sonner";
import BrowseQuizResultsForm from "@/custom_components/BrowseQuizReqeustsForm";

export interface QuizRequestsPageSearchParams {
  school?: string,
  subject?: string,
  courseCode?: string,
  professor?: string,
  year?: string,
  pageNumber?: string,
  sorting?: string,
}

interface QuizRequestData {
  id: string,
  upvotes: number
}

interface QuizRequestsPageParams {
  searchParams: Promise<QuizRequestsPageSearchParams>
}

export default function QuizRequestsPage({ searchParams }: QuizRequestsPageParams) {

  const [quizRequests, setQuizRequests] = useState<QuizRequests[]>([])
  const router = useRouter()
  const [pageNumber, setPageNumber] = useState<number>(1)
  const pageLimit: number = 10
  const pathname: string = usePathname()
  const oldSearchParams = useSearchParams()
  const [loading, setLoading] = useState<boolean>(false)
  const [queriedQuizRequestsData, setQueriedQuizRequestsData] = useState<QuizRequestsPageSearchParams>({})

  // This function adjsuts the sorting of the fetched quiz results
  function adjustSorting(value: string) {
    const newSearchParams = new URLSearchParams(oldSearchParams.toString())
    newSearchParams.set("sorting", value)

    // defaults
    newSearchParams.set("pageNumber", String(pageNumber))
    router.push(`${pathname}?${newSearchParams.toString()}`)
  }

  // This function makes sure the pageNumber is in sync with the actual page number
  function initPageNumber(pageNumber: string | undefined) {
    if (pageNumber) setPageNumber(Number(pageNumber))
  }

  // This functioin handles the way that quiz requests upvotes are updated. 
  // Currently because there is no user auth, this can be spammed by users. This is to be fixed when user auth is added.
  async function handleUpvotes(quizRequestId: number | undefined, index: number) {
    // quizRequestId will never actually be undefined. This is here to make typeescript happy 
    if (!quizRequestId) {
      return;
    }
    const quizRequestDataQuery = await client.from("quizRequest").select("id, upvotes").eq("id", quizRequestId).single()
    if (quizRequestDataQuery.error) {
      toast.error("Could not record upvote. Please try again later.")
    }
    else {
      if (quizRequestDataQuery.data) {
        const { id, upvotes } = quizRequestDataQuery.data as QuizRequestData
        const quizRequestUpvoteUpdateQuery = await client.from("quizRequest").update({ "upvotes": upvotes + 1 }).eq("id", id)
        if (quizRequestUpvoteUpdateQuery.error) {
          toast.error("Could not record upvote. Please try again later.")
        }
        else {
          setQuizRequests(prev =>
            prev.map((item, i) =>
              i === index
                ? { ...item, upvotes: upvotes + 1 }
                : item
            )
          )
          toast.success("Upvote Record Successfully.")
        }
      }
    }
  }

  // This function fetches quiz results from the database
  async function fetchQuizRequests() {
    setLoading(true)
    const quizRequestSearchParams = await searchParams;
    // side affects
    initPageNumber(quizRequestSearchParams.pageNumber)

    setQueriedQuizRequestsData(quizRequestSearchParams)

    const rangeStart: number = calculateQueryRangeBeginning(Number(quizRequestSearchParams.pageNumber), pageLimit)
    const rangeEnd: number = rangeStart + pageLimit - 1


    let quizRequestsQuery = client.from("quizRequest").select("*")
    if (quizRequestSearchParams.sorting == "oldest") {
      quizRequestsQuery = quizRequestsQuery.order("createdAt", { ascending: true })
    }
    else if (quizRequestSearchParams.sorting == "upvotes") {
      quizRequestsQuery = quizRequestsQuery.order("upvotes", { ascending: false })
    }
    else {
      quizRequestsQuery = quizRequestsQuery.order("createdAt", { ascending: false })
    }

    // if all are props on the search params are falsey (excluding pageNumber and sorting props), just get the last 10 quiz results
    const { pageNumber, sorting, ...filteredParams } = quizRequestSearchParams;
    if (!(Object.values(filteredParams).some(value => !!value))) {
      const quizRequestsResponse: PostgrestSingleResponse<QuizRequests[]> = await quizRequestsQuery.range(rangeStart, rangeEnd).limit(pageLimit)
      // const quizRequestsQuery: PostgrestSingleResponse<QuizRequests[]> = await client.from("quizRequest").select("*").order("createdAt", { ascending: false }).range(rangeStart, rangeEnd).limit(pageLimit)
      // if (quizRequestsQuery.error) {
      if (quizRequestsResponse.error) {
        toast.error("An error occured. Please try again later.")
      }
      else {
        // setQuizRequests(quizRequestsQuery.data as QuizRequests[])
        setQuizRequests(quizRequestsResponse.data as QuizRequests[])
      }
    }
    // else of at least one the quiz requests search props are truthy, query the database with them
    else {
      // let quizRequestsQuery = client.from("quizRequest").select("*")
      if (quizRequestSearchParams.school) quizRequestsQuery = quizRequestsQuery.ilike("school", `%${quizRequestSearchParams.school}%`)
      if (quizRequestSearchParams.subject) quizRequestsQuery = quizRequestsQuery.ilike("subject", `%${quizRequestSearchParams.subject}%`)
      if (quizRequestSearchParams.courseCode) quizRequestsQuery = quizRequestsQuery.ilike("courseCode", `%${quizRequestSearchParams.courseCode}%`)
      if (quizRequestSearchParams.professor) quizRequestsQuery = quizRequestsQuery.ilike("professor", `%${quizRequestSearchParams.professor}%`)

      // get requests that match year with one year offset (give or take)
      // lower limit
      if (quizRequestSearchParams.year) {
        if ((Number(quizRequestSearchParams.year) > 2000)) {
          quizRequestsQuery = quizRequestsQuery.gte("year", Number(quizRequestSearchParams.year) - 1)
        }
        else {
          quizRequestsQuery = quizRequestsQuery.gte("year", Number(quizRequestSearchParams.year))
        }
        // upper limit
        if ((Number(quizRequestSearchParams.year) < currentYear)) {
          quizRequestsQuery = quizRequestsQuery.lte("year", Number(quizRequestSearchParams.year) + 1)
        }
        else {
          quizRequestsQuery = quizRequestsQuery.lte("year", Number(quizRequestSearchParams.year))
        }
      }

      if (quizRequestSearchParams.sorting == "oldest") {
        quizRequestsQuery = quizRequestsQuery.order("createdAt", { ascending: true })
      }
      else if (quizRequestSearchParams.sorting == "upvotes") {
        quizRequestsQuery = quizRequestsQuery.order("upvotes", { ascending: false })
      }
      else {
        quizRequestsQuery = quizRequestsQuery.order("createdAt", { ascending: false })
      }
      const quizRequestsResponse: PostgrestSingleResponse<QuizRequests[]> = await quizRequestsQuery.range(rangeStart, rangeEnd).limit(pageLimit)

      if (quizRequestsResponse.error) {
        console.log("An Error Ocurred trying to retrieve the quizrequests", quizRequestsResponse.error)
      }
      else {
        if (quizRequestsResponse.data) {
          console.log(quizRequestsResponse.data)
          setQuizRequests(quizRequestsResponse.data)
        }
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchQuizRequests()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 px-6 pt-20 pb-20 relative">
      <div className="max-w-6xl pt-12 mx-auto">
        
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Quiz Requests</h1>
            <p className="text-gray-600 mt-1">See what the community is asking for. Help locate or upload missing exams.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/quiz/requests/create" className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700">New request</Link>
          </div>
        </div>


        <LoadingOverlay show={loading} label="Fetching Quiz Requests" />
        <BrowseQuizResultsForm queriedQuizRequestsData={queriedQuizRequestsData} />

        {/* results header */}
        <div className="flex items-center justify-between mb-3">

          {quizRequests &&
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{quizRequests.length}</span> requests
            </p>
          }

          <div>
            <select className="border rounded-md px-3 py-2 text-sm" onChange={e => adjustSorting(e.target.value)}>
              <option value="newest">Sort: Most Recent</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="upvotes">Sort: Upvotes</option>
            </select>
          </div>
        </div>

        {/* requests list */}
        <ul className="space-y-3">
          {quizRequests && quizRequests.map((quizRequest, index) => (
            <li key={index}>
              <div className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition overflow-hidden">
                <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

                  {/* title + meta */}
                  <div className="md:col-span-8">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{quizRequest.title}</h3>

                    </div>
                    <div className="text-sm text-gray-700 flex flex-wrap gap-x-4 gap-y-1">
                      <span><span className="text-gray-500">School:</span> {quizRequest.school}</span>
                      <span><span className="text-gray-500">Course:</span> {quizRequest.courseCode}</span>
                      <span><span className="text-gray-500">Professor:</span> {quizRequest.professor}</span>
                      <span><span className="text-gray-500">Year:</span> {quizRequest.year}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Requested on {new Date(quizRequest.createdAt).toLocaleString()}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                      <span className="rounded-md border px-2 py-1 bg-gray-50 flex items-center gap-1">
                        <ArrowUp size={16} className="text-gray-700" />
                        {quizRequest.upvotes} upvotes
                      </span>
                    </div>
                  </div>

                  {/* actions */}
                  <div className="md:col-span-4 flex md:justify-end">
                    <div className="flex items-center gap-2 md:gap-3 text-sm">
                      <button className="rounded-lg border px-3 py-2 hover:bg-gray-50" onClick={() => handleUpvotes(quizRequest.id, index)}>Upvote</button>
                      <button className="rounded-lg bg-emerald-600 text-white px-3 py-2 hover:bg-emerald-700" onClick={() => { router.push("/quiz/upload") }}>I have this</button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

      </div>
      <PagePagination pageNumber={pageNumber} nextPageAvailable={quizRequests.length == pageLimit}></PagePagination>
    </div>
  );
}