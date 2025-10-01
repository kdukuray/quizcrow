"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { client } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { wait } from "@/lib/utils";

interface CreateQuizRequestFormProps {
    setLoading: Dispatch<SetStateAction<boolean>>
}

export default function CreateQuizRequestForm({ setLoading }: CreateQuizRequestFormProps) {
    const router = useRouter()

    const createQuizRequestFormSchema = z.object({
        title: z.string().min(3, { message: "Title must be at least 3 characyers long." }),
        school: z.string().min(2, { message: "School must be at least 2 characyers long." }),
        subject: z.string().min(3, { message: "Subject must be at least 3 characyers long." }),
        courseCode: z.string().optional(),
        professor: z.string().optional(),
        year: z.string().optional()
    })

    const createQuizRequestForm = useForm<z.infer<typeof createQuizRequestFormSchema>>({
        resolver: zodResolver(createQuizRequestFormSchema),
        defaultValues: {
            title: "",
            school: "",
            subject: "",
            courseCode: "",
            professor: "",
            year: ""
        }
    })

    function resetForm() {
        createQuizRequestForm.reset()
    }

    async function handleSubmit(values: z.infer<typeof createQuizRequestFormSchema>) {
        setLoading(true)
        const newQuizRequest = {
            title: values.title,
            school: values.school,
            subject: values.subject,
            courseCode: values.courseCode,
            professor: values.professor,
            year: values.year,
            upvotes: 0
        }

        const createdQuiz = await client.from("quizRequest").insert(newQuizRequest).select("*").single()
        if (createdQuiz.error) {
            toast.error("There was an error. Please try again later.")
        }
        else {
            toast.success("New quiz request created successfully.")
            await wait(2)
            const pathname = "/quiz/requests"
            const newSearchParams = new URLSearchParams()
            // defaults
            newSearchParams.set("pageNumber", String(1))
            newSearchParams.set("sorting", "newest")
            router.push(`${pathname}?${newSearchParams.toString()}`)
        }
    }

    return (
        <Form {...createQuizRequestForm}>
            <form
                onSubmit={createQuizRequestForm.handleSubmit(handleSubmit)}
                className="bg-white rounded-xl shadow-sm border p-6 space-y-6"
            >
                {/* title input */}
                <FormField
                    control={createQuizRequestForm.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input {...field} className="w-full" placeholder="e.g. Algorithms 101 Midterm Review" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">

                    {/* school input */}
                    <div className="w-1/2">
                        <FormField
                            control={createQuizRequestForm.control}
                            name="school"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>School</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="w-full" placeholder="e.g. CCNY" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* courseCode input */}
                    <div className="w-1/2">
                        <FormField
                            control={createQuizRequestForm.control}
                            name="courseCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course Code</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="w-full" placeholder="e.g. CSC 101" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    {/* subject input */}
                    <div className="w-1/2">
                        <FormField
                            control={createQuizRequestForm.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subject</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="w-full" placeholder="e.g. Computer Science" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* professor input */}
                    <div className="w-1/2">
                        <FormField
                            control={createQuizRequestForm.control}
                            name="professor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Professor</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="w-full" placeholder="e.g. Mr.Kajani" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>


                <div className="flex items-end justify-between gap-4">

                    {/* year input */}
                    <div className="w-1/3">
                        <FormField
                            control={createQuizRequestForm.control}
                            name="year"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Year</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="w-full border rounded-md px-3 py-2"
                                        >
                                            <option value="" disabled>
                                                Select year
                                            </option>
                                            {Array.from({ length: 26 }, (_, i) => 2025 - i).map((y) => (
                                                <option key={y} value={y}>
                                                    {y}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* buttons */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
                        >
                            Submit Request
                        </button>
                         <button
                            type="reset"
                            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
                            onClick={() => resetForm()}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </form>
        </Form>


    )

}