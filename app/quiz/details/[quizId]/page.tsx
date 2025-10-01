"use client";

import LoadingOverlay from "@/custom_components/LoadingOverlay";
import { client } from "@/utils/supabaseClient";
import { Quiz, QuizTag } from "@/utils/types";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface QuizDetailPageProps {
  params: Promise<{ quizId: string }>
}

export type QuizToTags = {
  id: number,
  createdAt: string,
  quizId: number,
  tagId: number
}

// This function fetches the tags assocaited with the quiz
export async function fetchQuizTags(quizToTags: QuizToTags[]): Promise<QuizTag[]> {
  const allTags: QuizTag[] = []
  for (let i = 0; i < quizToTags.length; i++) {
    const fetchQuizTagResponse: PostgrestSingleResponse<QuizTag> = await client.from("quizTag").select("*").eq("id", quizToTags[i].tagId).single()
    if (fetchQuizTagResponse.error) {
      toast.error("Failed fetching one of the quiz tags.")
    }
    else {
      if (fetchQuizTagResponse.data) {
        allTags.push(fetchQuizTagResponse.data as QuizTag)
      }
    }
  }
  return allTags
}

// This function fetches the quiz tags associated with a quiz
export async function fetchQuizToTags(quizId: number): Promise<QuizToTags[]> {
  let fetchedQuizToTags: QuizToTags[] = []
  const fetchQuizToTagsResponse: PostgrestSingleResponse<QuizToTags[]> = await client.from("quizToTags").select("*").eq("quizId", quizId)
  if (fetchQuizToTagsResponse.error) {
    toast.error("Failed to retrieve tags associated with this quiz.")
  }
  else {
    if (fetchQuizToTagsResponse.data) {
      fetchedQuizToTags = fetchQuizToTagsResponse.data as QuizToTags[]
    }
  }
  return fetchedQuizToTags
}

export default function QuizDetailPage({ params }: QuizDetailPageProps) {

  const [quiz, setQuiz] = useState<Quiz>()
  const [quizTags, setQuizTags] = useState<QuizTag[]>([])
  const [loading, setLoading] = useState<boolean>(false);

  // This function retrievs the quiz
  async function fetchQuiz() {
    setLoading(true)
    const paramsValue = await params
    const quizId: number = Number(paramsValue.quizId)

    const fetchQuizResponse: PostgrestSingleResponse<null> = await client.from("quiz").select("*").eq("id", quizId).single()
    if (fetchQuizResponse.error) {
      toast.error("There was an error. Please try again later.")
    }
    else {
      if (fetchQuizResponse.data) {
        const fetchedQuiz = fetchQuizResponse.data as Quiz
        setLoading(false)
        setQuiz(fetchedQuiz)
        const fetchedQuizToTags: QuizToTags[] = await fetchQuizToTags(quizId)
        const allTags: QuizTag[] = await fetchQuizTags(fetchedQuizToTags)
        setQuizTags(allTags)
      }
    }
    setLoading(false)  
  }

  useEffect(() => {
    fetchQuiz()
  }, [params, fetchQuiz])


  return (
    <div className="min-h-dvh w-full px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-blue-100 pt-20 pb-20 relative">
      <LoadingOverlay show={loading} label="Fetching Quiz..."/>

      {/* header */}
      {quiz ? (
        <>
          <div className="mb-4 mt-10">
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <a href="/quiz/browse" className="hover:underline">Browse</a>
              <span>/</span>
              <span className="text-gray-700 font-medium">{quiz.title}</span>
            </div>
          </div>

          {/* title + actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {quiz.title}
            </h1>
            <div className="flex items-center gap-2">
              <a
                href={quiz.quizFileLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
              >
                Open in new tab
              </a>
              <a
                href={quiz.quizFileLink}
                download
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
              >
                Download PDF
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* metadata card */}
            <section className="lg:col-span-4">
              <div className="rounded-2xl border bg-white/60 backdrop-blur-sm shadow-sm p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Course</p>
                    <p className="font-medium">{quiz.courseCode}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Professor</p>
                    <p className="font-medium">{quiz.professor}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">School</p>
                    <p className="font-medium">{quiz.school}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Term</p>
                    <p className="font-medium">{quiz.semester} {quiz.year}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Uploaded</p>
                    <p className="font-medium">{new Date(quiz.createdAt!).toLocaleString()}</p>
                  </div>
                </div>

                {/* tags */}
                {quizTags &&

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {quizTags.map((quizTag: QuizTag, index) => (
                        <span key={index} className="rounded-full border px-2.5 py-1 text-xs bg-gray-50">{quizTag.name}</span>
                      ))}
                    </div>
                  </div>
                }

                {/* description */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-sm leading-relaxed text-gray-800">{quiz.description}</p>
                </div>

                {/* Fix this later. Needs User Auth to be implemented. V0 has no user auth*/}
                {/* Actions */}
                {/* <div className="flex flex-wrap gap-2 pt-2">
                <button type="button" className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">
                  ⭐ Save
                </button>
                <button type="button" className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">
                  ⚑ Report
                </button>
                <button type="button" className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">
                  🔗 Copy link
                </button>
              </div> */}

              </div>
            </section>

            {/* quizFile viewer */}
            <section className="lg:col-span-8">
              <div className="rounded-2xl border overflow-hidden bg-white shadow-sm">
                <div className="relative w-full pt-[100%] sm:pt-[80%] md:pt-[70%] lg:pt-[65%]">
                  {quiz.quizFileLink ?
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={quiz.quizFileLink!}
                      title="Quiz PDF Viewer"
                      referrerPolicy="no-referrer"
                    />
                    :
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="max-w-md rounded-xl border border-indigo-200 bg-indigo-50 px-6 py-4 shadow-sm text-center">
                        <p className="text-base font-medium text-indigo-800">Quiz File unavailable</p>
                        <p className="mt-1 text-sm text-indigo-600">
                          There was an error retrieving this quiz file. Please try again later.
                        </p>
                      </div>
                    </div>
                  }

                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Having trouble viewing? Try the “Open in new tab” button above or download the File.
              </p>
            </section>
          </div>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );

}