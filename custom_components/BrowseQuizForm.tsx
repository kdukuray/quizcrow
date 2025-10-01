"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { currentYear } from "@/lib/constants";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function BrowseQuizForm() {
  const router = useRouter()
  const years = useMemo(
    () =>
      Array.from({ length: currentYear - 2000 + 1 }, (_, i) =>
        String(currentYear - i)
      ),
    [currentYear]
  );

  const quizFilterFormSchema = z.object({
    school: z.string().min(2, {
      message: "School names must be at least 2 characters long."
    }),
    subject: z.string().optional(),
    courseCode: z.string().optional(),
    professor: z.string().optional(),
    yearStart: z.string().optional(),
    yearEnd: z.string().optional()
  })
  const quizFilterForm = useForm<z.infer<typeof quizFilterFormSchema>>({
    resolver: zodResolver(quizFilterFormSchema),
    defaultValues: {
      school: "",
      subject: "",
      courseCode: "",
      professor: "",
      yearStart: "",
      yearEnd: ""
    }
  })

  // This function handles the submission of the quiz filter form
  function handleQuizFilterFormSubmit(values: z.infer<typeof quizFilterFormSchema>) {
    const newSearchParams = new URLSearchParams()
    newSearchParams.set("school", values.school)
    if (values.subject) newSearchParams.set("subject", values.subject)
    if (values.courseCode) newSearchParams.set("courseCode", values.courseCode)
    if (values.professor) newSearchParams.set("professor", values.professor)
    if (values.yearStart) newSearchParams.set("yearStart", values.yearStart)
    if (values.yearEnd) newSearchParams.set("yearEnd", values.yearEnd)
    
    // defaults for routes (find a better way to do this later)
    newSearchParams.set("pageNumber", String(1))
    newSearchParams.set("soritng", "newest")
    router.push(`/quiz/browse/results?${newSearchParams.toString()}`)

  }

  // This function resets the values in the quiz filter form
  function resetQuizFilterForm() {
    quizFilterForm.reset()
  }

  return (
    <aside className="bg-white/80 backdrop-blur-sm border rounded-2xl shadow-sm w-full max-w-2xl p-6">
      <h2 className="text-base font-semibold mb-4">Filter results</h2>

      {/* quiz filter form */}
      <Form {...quizFilterForm}>
        <form
          onSubmit={quizFilterForm.handleSubmit(handleQuizFilterFormSubmit)}
          className="grid grid-cols-1 gap-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* school input */}
            <FormField
              control={quizFilterForm.control}
              name="school"
              render={({ field }) => {
                const error = quizFilterForm.formState.errors.school?.message
                return (
                  <FormItem>
                    <FormLabel className="text-sm">School</FormLabel>
                    <TooltipProvider>
                      <Tooltip open={!!error}>
                        <TooltipTrigger asChild>
                          <FormControl>
                            <Input {...field} aria-invalid={!!error} />
                          </FormControl>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs bg-red-500 text-white ">
                          {error}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormItem>)
              }}
            />

            {/* subject input */}
            <FormField
              control={quizFilterForm.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Subject</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* courseCode input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={quizFilterForm.control}
              name="courseCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Course Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* professor input */}
            <FormField
              control={quizFilterForm.control}
              name="professor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Professor</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* yearStart input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={quizFilterForm.control}
              name="yearStart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Year Start</FormLabel>
                  <FormControl>
                    <select
                      className="w-full border rounded-md px-2 py-2"
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

            {/* yearEnd input */}
            <FormField
              control={quizFilterForm.control}
              name="yearEnd"
              render={({ field }) => {
                const start = quizFilterForm.watch("yearStart");
                const filtered = start
                  ? years.filter((year) => +year >= +start)
                  : years;
                return (
                  <FormItem>
                    <FormLabel className="text-sm">Year End</FormLabel>
                    <FormControl>
                      <select
                        className="w-full border rounded-md px-2 py-2"
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

          {/* actions */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={resetQuizFilterForm}
              className="w-full px-4 py-2 text-sm rounded-md border hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </form>
      </Form>
    </aside>
  );
}
