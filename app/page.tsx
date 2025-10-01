"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, UploadCloud, Search, Users, Shield, Sparkles, ArrowRight, Podcast, LucideProps } from "lucide-react";
import { motion } from "framer-motion";
import { currentYear, discordLink, githubRepoLink } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes, useRef } from "react";
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { capitalizeFirstLetter } from "@/lib/utils";

type Statistic = {
  label: string,
  value: string
}
type ValueProposition = {
  tag_icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>,
  title: string,
  content: string
}

type SmartFormValues = {
  school?: string;
  subject?: string;
  professor?: string;
  year?: number;
};

export default function Home() {

  const router = useRouter()
  const instantSearchRef = useRef<HTMLInputElement | null>(null)

  const statistics: Statistic[] = [
    { label: "Resources", value: "12,480+" },
    { label: "Schools", value: "320+" },
    { label: "Contributors", value: "2,100+" },
    { label: "Requests filled", value: "87%" },
  ]
  const valuePropositions: ValueProposition[] = [
    { tag_icon: BookOpen, title: "Massive library", content: "Quickly filter by school, course code, term, and professor to find relevant past papers and material." },
    { tag_icon: Users, title: "Built by the community", content: "Earn recognition by uploading resources and fulfilling requests. Your uploads help classmates everywhere." },
    { tag_icon: Shield, title: "Integrity-first", content: "We support academic integrity: historical materials and study guides only—no cheating or live exam content." },

  ]
  const inner_workings: string[] = [
    "Use advanced filters to browse by school, year range, course code, and professor.",
    "Can’t find it? Submit a request. Others are notified and can upload what you need.",
    "Share your own materials to help the next cohort and build your contributor profile.",
  ]

  const smartFilterFormSchema = z.object({
    school: z.string().optional(),
    subject: z.string().optional(),
    professor: z.string().optional(),
    year: z.number().optional()
  })
  const smartFilterForm = useForm<z.infer<typeof smartFilterFormSchema>>({
    resolver: zodResolver(smartFilterFormSchema),
    defaultValues: {
      school: "",
      subject: "",
      professor: "",
      year: currentYear
    }
  })
  const smartFormFilterFields = ["school", "subject", "professor", "year"] as const
  type SmartFieldName = typeof smartFormFilterFields[number];

  // This function handles the submission as the smart filter form
  function handleSmartFilterFormSubmit(values: z.infer<typeof smartFilterFormSchema>) {
    // if at least one value in the filter is not falsey, filter based on that
    if ((Object.values(values).some(value => !!value))) {
      const searchParams = new URLSearchParams()
      if (values.school) searchParams.append("school", values.school)
      if (values.subject) searchParams.append("subject", values.subject)
      if (values.professor) searchParams.append("professor", values.professor)
      if (values.year) searchParams.append("year", String(values.year))

      searchParams.append("pageNumber", String(1))
      searchParams.append("sorting", "newest")
      router.push(`/quiz/browse/results?${searchParams.toString()}`)
    }
  }

  // This function handles the use the instant school search
  function instantSearch() {
    if (instantSearchRef && instantSearchRef.current && instantSearchRef.current.value) {
      const searchTerm: string = instantSearchRef.current.value;
      const searchParams = new URLSearchParams()
      searchParams.append("school", searchTerm)
      searchParams.append("pageNumber", String(1))
      router.push(`/quiz/browse/results?${searchParams.toString()}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 pt-20 pb-20 z-0">

      {/* announcement bar */}
      <div className="w-full bg-blue-600/90 text-white text-center text-sm py-2">
        <span className="opacity-90">Open source • </span>
        <Link href={githubRepoLink} target="_blank" className="underline underline-offset-4 hover:no-underline">
          Contribute on GitHub
        </Link>
      </div>

      {/* hero */}
      <motion.section className="relative overflow-hidden mb-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >

        {/* background grid */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.12),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(14,165,233,0.12),transparent_40%)]" />
        <div className="container mx-auto px-6 pt-6 pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">New • Requests beta</Badge>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Welcome to <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">QuizCrow</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
              A community-driven library of past exams, quizzes, and study resources. Find exactly what you need—or request it and the community will help.
            </p>

            {/* primary CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">

              <Button asChild size="lg" variant="outline" className="px-6">
                <Link href="/quiz/requests/create" className="flex items-center gap-2">
                  <UploadCloud className="h-4 w-4" /> Request a Quiz
                </Link>
              </Button>

              <Button asChild size="lg" className="px-6">
                <Link href="/quiz/browse" className="flex items-center gap-2">
                  <Search className="h-4 w-4" /> Browse Quizes
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="px-6">
                <Link href={discordLink} className="flex items-center gap-2">
                  <Podcast className="h-4 w-4" /> Join Discord
                </Link>
              </Button>
            </div>

            {/* instant search */}
            <div className="mt-10 mx-auto max-w-xl">
              <div className="flex items-center gap-2 rounded-2xl border bg-white p-2 shadow-sm">
                <Search className="ml-2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search by school..." className="border-0 focus-visible:ring-0" ref={instantSearchRef} />
                <Button asChild type="button" onClick={() => instantSearch()}>
                  <span className="flex items-center gap-1">
                    Search <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">e.g. “Harvard • Columbia • NYU”</p>
            </div>
          </div>

          {/* statistics */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {statistics.map((statistic, index) => (
              <Card key={index} className="border-blue-100">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-semibold">{statistic.value}</div>
                  <div className="text-sm text-muted-foreground">{statistic.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      {/* value propositoins */}
      <section className="container mx-auto px-6 pb-20 pt-4">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">Why students use QuizCrow</h2>
          <p className="mt-2 text-muted-foreground">Study smarter with community-sourced materials and transparent, integrity-first guidelines.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {
            valuePropositions.map((valueProposition, index) => (
              <Card className="hover:shadow-md transition-shadow" key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><valueProposition.tag_icon className="h-5 w-5" /> {valueProposition.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {valueProposition.content}
                </CardContent>
              </Card>
            ))
          }

        </div>
      </section>

      {/* inner workings */}
      <section className="bg-white/60 border-t">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold">Find, request, contribute</h3>
              <ol className="mt-4 space-y-4 text-muted-foreground">
                {inner_workings.map((content, index) => (
                  <li className="flex items-center gap-3" key={index}>
                    <span className="inline-flex h-6 w-8 md:w-6 items-center justify-center rounded-full bg-blue-600 text-white text-sm ">
                      {index + 1}
                    </span>
                    <p>
                      {content}
                    </p>
                  </li>

                ))}
              </ol>

              <div className="mt-6 flex gap-3">
                <Button asChild>
                  <Link href="/quiz/upload" className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Upload</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/faq">Read our FAQ</Link>
                </Button>
              </div>
            </div>

            <Card className="border-blue-100 shadow-sm">
              <Form
                {...smartFilterForm}
              >
                <form onSubmit={smartFilterForm.handleSubmit(handleSmartFilterFormSubmit)}>
                  <CardHeader>
                    <CardTitle className="text-lg">Smart filters preview</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      {
                        smartFormFilterFields.map((smartFormFilterField, index) => (
                          <FormField<SmartFormValues, SmartFieldName>
                            key={index}
                            control={smartFilterForm.control}
                            name={smartFormFilterField}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder={capitalizeFirstLetter(smartFormFilterField)} {...field}></Input>
                                </FormControl>
                              </FormItem>
                            )}
                          >
                          </FormField>
                        ))
                      }
                    </div>
                    <Button className="w-full">Apply filters</Button>
                  </CardContent>
                </form>
              </Form>
            </Card>
          </div>
        </div>
      </section >

      {/* CTA */}
      < section className="container mx-auto px-6 pt-16" >
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:p-12 text-white shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">Join the community. Study smarter.</h3>
              <p className="mt-2 text-white/90 max-w-xl"> Join us on Discord</p>
            </div>
            <div className="flex gap-3">
              <Button asChild size="lg" variant="secondary" className="text-blue-700">
                <Link href={discordLink} target="_blank">QuizCrow Discord</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white/60 hover:bg-white/10">
                <Link href="/quiz/browse">Explore first</Link>
              </Button>
            </div>
          </div>
        </div>
      </section >
    </div >
  );
}
