"use client";
import { useEffect, useMemo } from "react";
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormControl, FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import { currentYear } from "@/lib/constants";
import { QuizRequestsPageSearchParams } from "@/app/quiz/requests/page";

export interface BrowseQuizRequestsFormProps {
    queriedQuizRequestsData: QuizRequestsPageSearchParams
}

export default function BrowseQuizResultsForm({ queriedQuizRequestsData }: BrowseQuizRequestsFormProps) {
    const router = useRouter()
    const pathname = usePathname()

    const years = useMemo(() => {
        return Array.from({ length: currentYear - 2000 + 1 }, (_, i) => String(currentYear - i))
    }, [currentYear])

    const quizRequestsFilterFormSchema = z.object({
        school: z.string().optional(),
        subject: z.string().optional(),
        courseCode: z.string().optional(),
        professor: z.string().optional(),
        year: z.string().optional()
    })

    const quizRequestsFilterForm = useForm<z.infer<typeof quizRequestsFilterFormSchema>>({
        resolver: zodResolver(quizRequestsFilterFormSchema),
        defaultValues: {
            school: "",
            subject: "",
            courseCode: "",
            professor: "",
            year: ""
        }
    })

    // function that handles the submission of the quiz requests filter form
    // even if all th fields are falsey, it still submits unlike filtering through regualr quizes. 
    async function handleQuizRequestsFilterFormSubmit(values: z.infer<typeof quizRequestsFilterFormSchema>) {
        const newSearchParams = new URLSearchParams()
        if (values.school) newSearchParams.set("school", values.school)
        if (values.subject) newSearchParams.set("subject", values.subject)
        if (values.courseCode) newSearchParams.set("courseCode", values.courseCode)
        if (values.professor) newSearchParams.set("professor", values.professor)
        if (values.year) newSearchParams.set("year", values.year)

        // defaults for routes (find a better way to do this later)
        newSearchParams.append("pageNumber", String(1))
        newSearchParams.set("sorting", "newest")
        router.push(`${pathname}?${newSearchParams.toString()}`)

    }

    // This function resets the values in the quiz filter form
    function resetQuizRequestsFilterForm() {
        quizRequestsFilterForm.reset()
    }

    useEffect(() => {
        quizRequestsFilterForm.setValue("school", queriedQuizRequestsData.school)
        if (queriedQuizRequestsData.subject) quizRequestsFilterForm.setValue("subject", queriedQuizRequestsData.subject)
        if (queriedQuizRequestsData.courseCode) quizRequestsFilterForm.setValue("courseCode", queriedQuizRequestsData.courseCode)
        if (queriedQuizRequestsData.professor) quizRequestsFilterForm.setValue("professor", queriedQuizRequestsData.professor)
        if (queriedQuizRequestsData.year) quizRequestsFilterForm.setValue("year", queriedQuizRequestsData.year)

    }, [queriedQuizRequestsData])

    return (
        <div className="bg-white/80 backdrop-blur-sm border rounded-2xl shadow-sm p-4 mb-6">
            <Form {...quizRequestsFilterForm}>
                <form
                    onSubmit={quizRequestsFilterForm.handleSubmit(handleQuizRequestsFilterFormSubmit)}
                    className="flex flex-wrap items-end gap-3"
                >
                    {/* school input */}
                    <div className="flex flex-col gap-1 w-full lg:w-1/6">
                        <FormField
                            control={quizRequestsFilterForm.control}
                            name="school"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs text-gray-600">School</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="w-full border rounded-md px-3 py-2 h-11"></Input>
                                    </FormControl>
                                </FormItem>
                            )}
                        >
                        </FormField>
                    </div>

                    {/* subject input */}
                    <div className="flex flex-col gap-1 w-full lg:w-1/6">
                        <FormField
                            control={quizRequestsFilterForm.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs text-gray-600">Subject</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="w-full border rounded-md px-3 py-2 h-11"></Input>
                                    </FormControl>
                                </FormItem>
                            )}
                        >
                        </FormField>
                    </div>

                    {/* courseCode input */}
                    <div className="flex flex-col gap-1 w-full lg:w-1/6">
                        <FormField
                            control={quizRequestsFilterForm.control}
                            name="courseCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs text-gray-600">Course Code</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="w-full border rounded-md px-3 py-2 h-11"></Input>
                                    </FormControl>
                                </FormItem>
                            )}

                        ></FormField>
                    </div>

                    {/* professor input */}
                    <div className="flex flex-col gap-1 w-full lg:w-1/6">
                        <FormField
                            control={quizRequestsFilterForm.control}
                            name="professor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs text-gray-600">Professor</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="w-full border rounded-md px-3 py-2 h-11"></Input>
                                    </FormControl>
                                </FormItem>
                            )}
                        >
                        </FormField>
                    </div>

                    {/* year input */}
                    <div className="flex flex-col gap-1 w-full lg:w-[12%]">
                        <FormField
                            control={quizRequestsFilterForm.control}
                            name="year"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs text-gray-600">Year</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="w-full border rounded-md px-3 py-2">
                                                <SelectValue placeholder="Type" />
                                            </SelectTrigger>
                                            <SelectContent className="w-full border rounded-md px-3 py-2">
                                                {years.map((year) => (
                                                    <SelectItem value={year} key={year}>{year}</SelectItem>
                                                ))}

                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}

                        ></FormField>

                    </div>

                    {/* buttons */}
                    <div className="flex gap-2 w-full lg:w-auto ml-auto">
                        <button className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700">
                            Apply
                        </button>
                        <button
                            type="button"
                            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
                            onClick={() => resetQuizRequestsFilterForm()}
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    )
}