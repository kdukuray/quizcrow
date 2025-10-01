"use client";
import { fetchQuizTags, fetchQuizToTags, QuizToTags } from "@/app/quiz/details/[quizId]/page";
import { Quiz, QuizTag } from "@/utils/types"
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type BrowseResultsCardProp = {
    quiz: Quiz
}

export default function ResultsCard({ quiz }: BrowseResultsCardProp) {
    const [quizTags, setQuizTags] = useState<QuizTag[]>([])
    
    useEffect(() => {
        fetchQuizToTags(quiz.id!)
            .then((quizToTags: QuizToTags[]) => {
                fetchQuizTags(quizToTags)
                    .then((fetchedQuizTags: QuizTag[]) => {
                        setQuizTags(fetchedQuizTags)
                    })
            })
            .catch(() => {
                toast.error("Error occured fetching quiz tags.")
            })
    }, [quiz.id])

    return (
        <li key={quiz.id}>
            <Link
                href={`/quiz/details/${quiz.id}`}
                className="block rounded-xl sm:rounded-2xl border bg-white shadow-sm hover:shadow-md transition overflow-hidden"
            >
                <div className="p-3 sm:p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">

                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 sm:line-clamp-1">{quiz.title}</h3>
                        <div className="mt-1.5 sm:mt-1 text-xs sm:text-sm text-gray-700 flex flex-col sm:flex-row sm:flex-wrap gap-y-0.5 sm:gap-x-3 sm:gap-y-1">
                            <span className="truncate"><span className="text-gray-500">School:</span> {quiz.school}</span>
                            <span className="truncate"><span className="text-gray-500">Course:</span> {quiz.courseCode}</span>
                            <span className="truncate"><span className="text-gray-500">Professor:</span> {quiz.professor}</span>
                            <span className="truncate"><span className="text-gray-500">Semester:</span> {quiz.semester} {quiz.year}</span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                            {quizTags && quizTags.map((t, index) => (
                                <span key={`${index}-${t}`} className="text-xs border rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 bg-gray-50 whitespace-nowrap">
                                    {t.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="md:ml-auto md:flex-shrink-0">
                        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 md:gap-4 text-sm text-gray-600">                            <div className="sm:hidden text-xs text-blue-600 font-medium">View →</div>
                            <div className="hidden sm:block">
                                <span className="inline-flex items-center rounded-md border px-3 py-2 hover:bg-gray-50 transition-colors text-xs sm:text-sm whitespace-nowrap">View details →</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </li>

    )
}