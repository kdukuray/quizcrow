"use client";

import { motion } from "framer-motion";
import { BookOpen, GraduationCap, ShieldCheck, UploadCloud, Users, Github, HelpCircle, Search, Sparkles, HeartHandshake, FileText, Star } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { githubRepoLink } from "@/lib/constants";

const uploadQuizPagePath: string = "/quiz/upload"
const brwoseQuizPagePath: string = "/quiz/browse"


export default function FAQPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-50 via-white to-blue-100 pt-20">

      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-20 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="relative mx-auto max-w-5xl px-6 py-10">
        
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm text-gray-600 shadow-sm">
            <HelpCircle className="h-4 w-4" />
            FAQ & About
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">QuizCrow</h1>
          <p className="mx-auto mt-3 max-w-2xl text-balance text-lg text-gray-700">
            A community library of past exams and study materials—built by students, for students.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">

            {/* small badges */}
            {[{content: "Student-run", tag: Users},
              {content: "Study-first", tag: BookOpen},
              {content: "Integrity‑aligned", tag: ShieldCheck}
            ].map((item, index)=>(
              <Badge variant="secondary" className="gap-1" key={index}>
                <item.tag className="h-3.5 w-3.5" />{item.content}
              </Badge>
            ))
            }
          </div>
        </motion.div>

        {/* about cards */}
        <div className="mb-10 grid gap-6 sm:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="rounded-2xl bg-blue-100 p-2 text-blue-700">
                <GraduationCap className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">What is QuizCrow?</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              QuizCrow is a <strong>crowdsourced</strong> repository of past quizzes, exams, and study notes. Browse by school, course, year, and professor, then practice with real question styles.
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge className="gap-1" variant="outline"><Search className="h-3.5 w-3.5" /> Smart filters</Badge>
                <Badge className="gap-1" variant="outline"><FileText className="h-3.5 w-3.5" /> Real papers</Badge>
                <Badge className="gap-1" variant="outline"><Sparkles className="h-3.5 w-3.5" /> Better prep</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Academic Integrity</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              We support and respect academic integrity. QuizCrow is a <strong>study aid</strong>—not a cheating tool. Use materials responsibly and follow your institution’s policies.
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-600">
                <li>Learn formats & recurring concepts.</li>
                <li>Practice under exam‑like constraints.</li>
                <li>Never submit others’ work as your own.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* contribution CTA */}
        <Card className="mb-12 border-blue-200/60 bg-gradient-to-br from-white to-blue-50 shadow-sm">
          <CardHeader className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border bg-white px-2.5 py-1 text-xs text-gray-600">
              <HeartHandshake className="h-3.5 w-3.5" /> Community powered
            </div>
            <CardTitle className="text-2xl">Contribute to the library</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="max-w-2xl text-gray-700">
              Upload past papers you’re allowed to share, or help improve the platform. Every contribution helps students prepare better.
            </p>
            <div className="flex gap-2">
              <Button asChild className="gap-2">
                <a href={uploadQuizPagePath}><UploadCloud className="h-4 w-4" /> Upload a paper</a>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <a href={githubRepoLink} target="_blank" rel="noreferrer"><Github className="h-4 w-4" /> Open source</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div className="mb-14">
          <div className="mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Frequently Asked Questions</h2>
          </div>

          <Accordion type="single" collapsible className="divide-y rounded-xl border bg-white">
            <AccordionItem value="q1" className="px-4">
              <AccordionTrigger className="text-left text-base font-medium text-gray-900">
                Is using QuizCrow considered cheating?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                No. QuizCrow is built to <strong>support academic integrity</strong>. It helps you study by reviewing past papers and understanding question styles. Always follow your school’s policies.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q2" className="px-4">
              <AccordionTrigger className="text-left text-base font-medium text-gray-900">
                Where do the quizzes and exams come from?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                The library is <strong>crowdsourced</strong>. Students and community members upload past quizzes and exams to share—together we build a helpful, growing archive.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q3" className="px-4">
              <AccordionTrigger className="text-left text-base font-medium text-gray-900">
                Do I have to pay to access quizzes?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                No. QuizCrow is free. Our mission is to keep study resources accessible to everyone, regardless of financial background.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q4" className="px-4">
              <AccordionTrigger className="text-left text-base font-medium text-gray-900">
                Can I contribute to QuizCrow?
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-gray-700">
                <p>
                  Absolutely. Upload quizzes, exams, or study notes you’re allowed to share (respecting integrity and fair‑use guidelines). Your uploads help other students succeed.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" className="gap-2"><a href={uploadQuizPagePath}><UploadCloud className="h-4 w-4" /> Upload</a></Button>
                  <Button asChild size="sm" variant="outline" className="gap-2"><a href={githubRepoLink} target="_blank" rel="noreferrer"><Github className="h-4 w-4" /> Contribute on GitHub</a></Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q5" className="px-4">
              <AccordionTrigger className="text-left text-base font-medium text-gray-900">
                How do I get started?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                Use filters on the Browse page to find a course, professor, and year range. Open a result to view details—or submit a request if a paper isn’t listed yet.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* lower CTA */}
        <Card className="border-blue-200/60 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
          <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-semibold">Ready to power up your prep?</h3>
              <p className="mt-1 text-blue-100">Search past papers, learn the patterns, and study smarter.</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="secondary" className="gap-2">
                <a href={brwoseQuizPagePath}><Search className="h-4 w-4" /> Browse papers</a>
              </Button>
              <Button asChild variant="secondary" className="gap-2">
                <a href={githubRepoLink} target="_blank" rel="noreferrer"><Star className="mr-2 h-4 w-4" /> Star on GitHub</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
