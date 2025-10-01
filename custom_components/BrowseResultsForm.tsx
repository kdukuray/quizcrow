"use client";
import { useEffect, useMemo } from "react";
import { Form, FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { BrowseQuizResultsPageSearchParams } from "@/app/quiz/browse/results/page";
import { currentYear } from "@/lib/constants";
import { TooltipProvider, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { Tooltip } from "@/components/ui/tooltip";

export interface BrowseResultsFormProps {
    queriedQuizData: BrowseQuizResultsPageSearchParams

}

export default function BrowseResultsForm({ queriedQuizData }: BrowseResultsFormProps) {
    const router = useRouter()
    const pathname = usePathname()

    const years = useMemo(
        () =>
            Array.from({ length: currentYear - 2000 + 1 }, (_, i) =>
                String(currentYear - i)
            ),
        [currentYear]
    );

    const browseResultsFormSchema = z.object({
        school: z.string().min(2, { message: "Must be at least 2 characters long." }),
        subject: z.string(),
        courseCode: z.string(),
        professor: z.string(),
        yearStart: z.string(),
        yearEnd: z.string()
    })

    const browseResultsForm = useForm<z.infer<typeof browseResultsFormSchema>>({
        resolver: zodResolver(browseResultsFormSchema),
        defaultValues: {
            school: "",
            subject: "",
            courseCode: "",
            professor: "",
            yearStart: "2000",
            yearEnd: "2025"
        }
    })

    // This function handles the submission of the browse results form
    function handleBrowseResultsFormSubmit(values: z.infer<typeof browseResultsFormSchema>) {
        const newSearchParams = new URLSearchParams()
        newSearchParams.set("school", values.school)
        if (values.subject) newSearchParams.set("subject", values.subject)
        if (values.courseCode) newSearchParams.set("courseCode", values.courseCode)
        if (values.professor) newSearchParams.set("professor", values.professor)
        if (values.yearStart) newSearchParams.set("yearStart", values.yearStart)
        if (values.yearEnd) newSearchParams.set("yearEnd", values.yearEnd)

        // defaults for routes (find a better way to do this later)
        newSearchParams.append("pageNumber", String(1))
        router.push(`${pathname}?${newSearchParams.toString()}`)

    }
    useEffect(() => {
        browseResultsForm.setValue("school", queriedQuizData.school)
        if (queriedQuizData.subject) browseResultsForm.setValue("subject", queriedQuizData.subject)
        if (queriedQuizData.courseCode) browseResultsForm.setValue("courseCode", queriedQuizData.courseCode)
        if (queriedQuizData.professor) browseResultsForm.setValue("professor", queriedQuizData.professor)
        if (queriedQuizData.yearStart) browseResultsForm.setValue("yearStart", queriedQuizData.yearStart)
        if (queriedQuizData.yearEnd) browseResultsForm.setValue("yearEnd", queriedQuizData.yearEnd)
    }, [queriedQuizData])

    return (
        <div className="bg-white/80 backdrop-blur-sm border rounded-2xl shadow-sm p-3 sm:p-4 mb-6">
            <Form {...browseResultsForm}>
                <form
                    onSubmit={browseResultsForm.handleSubmit(handleBrowseResultsFormSubmit)}
                    className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3"
                >
                    {/* school input */}
                    <div className="w-full sm:flex-1 sm:min-w-[160px]">

                        <FormField
                            control={browseResultsForm.control}
                            name="school"
                            render={({ field }) => {
                                const error = browseResultsForm.formState.errors.school?.message
                                return (
                                    <FormItem>
                                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                                            School
                                        </FormLabel>
                                        <TooltipProvider>
                                            <Tooltip open={!!error}>
                                                <TooltipTrigger asChild>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className={`w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${error
                                                                ? "border border-red-500 focus:ring-red-500"
                                                                : "border border-gray-300 focus:ring-primary"
                                                                }`}
                                                        />
                                                    </FormControl>
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    side="bottom"
                                                    className="text-xs bg-red-500 text-white rounded-md px-2 py-1 mt-2 shadow-md transition-all duration-200"
                                                >
                                                    {error}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </FormItem>
                                )
                            }}
                        >
                        </FormField>
                    </div>

                    {/* subject input */}
                    <div className="w-full sm:flex-1 sm:min-w-[160px]">
                        <FormField
                            control={browseResultsForm.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-sm sm:text-xs text-gray-700 sm:text-gray-600 mb-1">Subject</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="w-full border rounded-md px-3 py-2 text-sm"></Input>
                                    </FormControl>
                                </FormItem>
                            )}

                        ></FormField>
                    </div>

                    {/* courseCode input */}
                    <div className="w-full sm:flex-1 sm:min-w-[160px]">
                        <FormField
                            control={browseResultsForm.control}
                            name="courseCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-sm sm:text-xs text-gray-700 sm:text-gray-600 mb-1">Course Code</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="w-full border rounded-md px-3 py-2 text-sm"></Input>
                                    </FormControl>
                                </FormItem>
                            )}


                        ></FormField>
                    </div>

                    {/* professor input */}
                    <div className="w-full sm:flex-1 sm:min-w-[160px]">
                        <FormField
                            control={browseResultsForm.control}
                            name="professor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-sm sm:text-xs text-gray-700 sm:text-gray-600 mb-1">Professor</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="w-full border rounded-md px-3 py-2 text-sm"></Input>
                                    </FormControl>
                                </FormItem>
                            )}

                        ></FormField>
                    </div>

                    {/* years pair */}
                    <div className="w-full sm:flex-1 sm:min-w-[200px] flex gap-2 sm:gap-3">
                        <div className="flex-1">
                            {/* year start input */}
                            <FormField
                                control={browseResultsForm.control}
                                name="yearStart"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block text-sm sm:text-xs text-gray-700 sm:text-gray-600 mb-1">Year Start</FormLabel>
                                        <FormControl>
                                            <select
                                                className="w-full border rounded-md px-2 sm:px-3 py-2 text-sm"
                                                {...field}
                                            >
                                                <option value="">Any</option>
                                                {years.map((year) => (
                                                    <option key={`ys-${year}`} value={year}>
                                                        {year}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                        </div>
                        <div className="flex-1">
                            {/* year End input */}
                            <FormField
                                control={browseResultsForm.control}
                                name="yearEnd"
                                render={({ field }) => {
                                    const start = browseResultsForm.watch("yearStart");
                                    const filtered = start
                                        ? years.filter((year) => +year >= +start)
                                        : years;
                                    return (
                                        <FormItem>
                                            <FormLabel className="block text-sm sm:text-xs text-gray-700 sm:text-gray-600 mb-1">Year End</FormLabel>
                                            <FormControl>
                                                <select
                                                    className="w-full border rounded-md px-2 sm:px-3 py-2 text-sm"
                                                    {...field}
                                                >
                                                    <option value="">Any</option>
                                                    {filtered.map((year) => (
                                                        <option key={`ye-${year}`} value={year}>
                                                            {year}
                                                        </option>
                                                    ))}
                                                </select>
                                            </FormControl>
                                        </FormItem>
                                    );
                                }}
                            />

                        </div>
                    </div>

                    {/* search button */}
                    <div className="w-full sm:w-auto sm:flex sm:items-end">
                        <button
                            type="submit"
                            className="w-full sm:w-auto whitespace-nowrap rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            Search
                        </button>
                    </div>
                </form>


            </Form>

        </div>


    )
}