"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FileText, Trash2, School, BookOpen, User, CalendarClock, Tags } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { client } from "@/utils/supabaseClient";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";
import { Quiz, QuizTag } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";
import { currentYear } from "@/lib/constants";
import { toast } from "sonner";
import { wait } from "@/lib/utils";

interface fileData {
    id: string;
    path: string;
    fullPath: string;
}

interface CreateQuizFormProps {
    setLoading: Dispatch<SetStateAction<boolean>>
}

export default function UploadQuizForm({ setLoading }: CreateQuizFormProps) {

    const newTagRef: any = useRef(undefined)
    const [quizTags, setQuizTags] = useState<string[]>([])
    const [quizFile, setQuizFile] = useState<File | undefined>(undefined);
    const router = useRouter();
    const quizTypes: string[] = ["Quiz", "Midterm", "Final", "Homework", "Practice", "Other"]
    const years = useMemo(() => (
        Array.from({ length: currentYear - 2000 + 1 }, (_, i) => (String(currentYear - i)
        ))), [currentYear])

    const uploadedQuizFormSchema = z.object({
        school: z.string().min(3, { message: "School must be at least 3 charcaters long." }),
        subject: z.string().min(3, { message: "Subject must at least 3 charcaters long" }),
        professor: z.string().optional(),
        year: z.string().optional(),
        semester: z.string().optional(),
        courseCode: z.string().optional(),
        title: z.string().min(3, { message: "Please provide a better quiz title." }),
        description: z.string().optional(),
        type: z.string().optional(),
        quizFile: z.custom<File | undefined>().refine((files) => files, "You must upload at least one file")
    })

    const uploadQuizForm = useForm<z.infer<typeof uploadedQuizFormSchema>>({
        resolver: zodResolver(uploadedQuizFormSchema),
        defaultValues: {
            school: "",
            subject: "",
            courseCode: "",
            professor: "",
            year: "",
            semester: "",
            title: "",
            description: "",
            type: "",
            quizFile: undefined
        }
    })

    // Quiz tags funcitons

    // This function gets the quiz tags ids assocaited with the quiz being submitted.
    // for each tag, it either retrieves the id if the tag exists, or creates a new tag if it doesn't
    async function getQuizTagIds(quizTags: string[]): Promise<number[]> {
        // ids for the tags assocaited with this new quiz
        let quizTagIds: number[] = []

        // for each tag, if the tag doesn't exist, attempting to retreive it returns an error
        for (let i = 0; i < quizTags.length; i++) {
            const tagInstance: PostgrestSingleResponse<QuizTag> = await client.from("quizTag").select("*").ilike("name", `%${quizTags[i]}%`).single()

            // if there is an error, the tag doesnt exist and must be created
            if (tagInstance.error) {
                const newQuizTag: QuizTag = {
                    name: quizTags[i]
                }
                const newTag: PostgrestSingleResponse<null> = await client.from("quizTag").insert(newQuizTag).select("*").single()
                // if there was an error creating the new tag, log it
                if (newTag.error) {
                    toast.error("There was an error creating one of the quiz tags")
                }
                // if not, add it's id to quizTagIds
                else {
                    if (newTag.data) {
                        const createdTag = newTag.data as QuizTag
                        if (createdTag.id) {
                            quizTagIds.push(createdTag.id)
                        }
                    }
                }
            }
            // if there was no error retreiving it, the tag already exists, add its id to quizTagIds
            else {
                if (tagInstance.data) {
                    const retreivedTag = tagInstance.data as QuizTag
                    if (retreivedTag.id) {
                        quizTagIds.push(retreivedTag.id)
                    }
                }
            }
        }
        return quizTagIds
    }

    // This function binds tags to quizes in the database
    async function bindTagsToQuiz(quiz: Quiz, quizTagsIds: number[]) {
        for (let i = 0; i < quizTagsIds.length; i++) {
            let newQuizToTagBinding = {
                quizId: quiz.id!,
                tagId: quizTagsIds[i]
            }
            const bindResult = await client.from("quizToTags").insert(newQuizToTagBinding).select("*").single()
            // binding tags to quizes is not critical so if it fails, we simply tell the user that it failed but
            // uploads contine uniterupted
            if (bindResult.error) {
                toast.error("Failed to add one of the quiz tags to the quiz.")
            }
        }

    }

    // handles adding a new quiz tag
    function addTag(e: any) {
        e.preventDefault()
        if (newTagRef) {
            if (newTagRef.current.value) {
                const newTagValue = newTagRef.current.value;
                setQuizTags([...quizTags, newTagValue])
                newTagRef.current.value = "";
            }
        }
    }

    // handles removal of quiz tags
    function removeTag(tag_index: number) {
        setQuizTags(quizTags.filter((_, index) => index != tag_index))
    }

    // Quiz File functions

    // This function handles uplading the quiz file to the storage bucket
    // It returns the file path to the quiz file within the storage bucket
    async function uploadQuizFile(quizFile: File | undefined): Promise<string> {
        let uploadedFilePath: string = ""

        if (quizFile) {
            let pathToUploadFile = `quizDataFiles/${uuidv4()}`

            if (quizFile.type.endsWith("png")) {
                pathToUploadFile = `${pathToUploadFile}.png`
            }
            else if (quizFile.type.endsWith("jpeg") || quizFile.type.endsWith("jpg")) {
                pathToUploadFile = `${pathToUploadFile}.jpg`
            }
            else {
                pathToUploadFile = `${pathToUploadFile}.pdf`
            }

            const uploadedFile = await client.storage.from("quizData").upload(pathToUploadFile, quizFile, {
                cacheControl: "3600",
                upsert: false
            })
            // if there was an error uploading the file, bubble up the error
            if (uploadedFile.error) {
                throw Error("An error occured. Please try again later.")
            }
            // if there was no error, get the link of the uploaded file
            else {
                if (uploadedFile.data) {
                    const upladedFileData = uploadedFile.data as fileData
                    if (upladedFileData.path) {
                        uploadedFilePath = upladedFileData.path
                    }
                }
            }
        }
        return uploadedFilePath

    }

    // Retrievs the public url of a quiz file.
    function getFilePublicUrl(filePath: string): string {
        let quizFilePublicUrl: string = ""
        if (filePath) {
            const result = client.storage.from("quizData").getPublicUrl(filePath)
            if (result) {
                if (result.data) {
                    quizFilePublicUrl = result.data.publicUrl
                }
            }
            else {
                throw Error("An error occured. Please try again later.")
            }
        }
        return quizFilePublicUrl

    }

    // handles adding a quiz file via drag and drop
    function onDrop(ev: React.DragEvent<HTMLLabelElement>) {
        ev.preventDefault();
        const list = Array.from(ev.dataTransfer.files || []);
        if (list.length) setQuizFile(list[0]);
        if (list.length) uploadQuizForm.setValue("quizFile", list[0])
    }

    // handles adding a quiz file via file selection
    function onPick(ev: React.ChangeEvent<HTMLInputElement>) {
        const list = Array.from(ev.target.files || []);
        if (list.length) setQuizFile(list[0]);
        if (list.length) uploadQuizForm.setValue("quizFile", list[0])
    }

    // handles removal of quiz files
    function removeQuizFile() {
        setQuizFile(undefined);
        uploadQuizForm.setValue("quizFile", undefined)

    }

    // upload quiz form funcitons

    // function to create a new quiz
    async function handleUploadQuizFormSubmit(values: z.infer<typeof uploadedQuizFormSchema>) {
        setLoading(true);

        // first create/retrieve the tags associated with the quiz
        const quizTagIds = await getQuizTagIds(quizTags)
        // upload the file (pdf) associated with the quiz nd get it's public url

        let uploadedFilePath: string | undefined;
        let quizFilePublicUrl: string | undefined;
        // this try catch and return ensures that quizfiles and file paths must exist for all quizes that get created
        try {
            uploadedFilePath = await uploadQuizFile(quizFile)
            quizFilePublicUrl = getFilePublicUrl(uploadedFilePath);
        }
        catch {
            toast.error("An error occured. Please try again later.")
            return;
        }

        // create a new quiz
        let newQuiz = {
            school: values.school,
            subject: values.subject,
            professor: values.professor ? values.professor : "N/A",
            year: values.year ? Number(values.year) : undefined,
            semester: values.semester ? values.semester : "N/A",
            courseCode: values.courseCode ? values.courseCode : "N/A",
            title: values.title,
            quizFileLink: quizFilePublicUrl,
            description: values.description ? values.description : "Not Provided",
            assessmentType: values.type ? values.type : "N/A",
        }

        const uploadedQuiz: PostgrestSingleResponse<any> = await client.from("quiz").insert(newQuiz).select("*").single()
        if (uploadedQuiz.error) {
            toast.error("An error occured. Please try again later.")
        }
        // if there was no error, bind the quizTags to the quiz
        else {
            if (uploadedQuiz.data) {
                const createdQuizInstance: Quiz = uploadedQuiz.data as Quiz
                toast.success("your quiz was uploaded successfully.")
                await bindTagsToQuiz(createdQuizInstance, quizTagIds)
                // add timer so they can see the success message before being redirected.
                wait(2)
                router.push(`/quiz/details/${createdQuizInstance.id!}`)
            }
        }
        setLoading(false);
    }

    // This function resets the value of the quiz form
    function resetForm() {
        uploadQuizForm.reset()
    }

    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Quiz Details</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...uploadQuizForm}>
                    <form onSubmit={uploadQuizForm.handleSubmit(handleUploadQuizFormSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* school input */}
                            <div className="space-y-2">
                                <FormField
                                    control={uploadQuizForm.control}
                                    name="school"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="school" className="flex items-center gap-2"><School className="h-4 w-4" />School*</FormLabel>
                                            <FormControl>
                                                <Input id="school" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* subject input */}
                            <div className="space-y-2">
                                <FormField
                                    control={uploadQuizForm.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="subject" className="flex items-center gap-2"><BookOpen className="h-4 w-4" />Subject*</FormLabel>
                                            <FormControl>
                                                <Input id="subject" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* title input*/}
                            <div className="space-y-2">
                                <FormField
                                    control={uploadQuizForm.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="title" className="flex items-center gap-2"><Tags className="h-4 w-4" />Title*</FormLabel>
                                            <FormControl>
                                                <Input id="title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* courseCode input*/}
                            <div className="space-y-2">
                                <FormField
                                    control={uploadQuizForm.control}
                                    name="courseCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="courseCode" className="flex items-center gap-2"><BookOpen className="h-4 w-4" />Course Code</FormLabel>
                                            <FormControl>
                                                <Input id="courseCode" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* professor input */}
                            <div className="space-y-2">
                                <FormField
                                    control={uploadQuizForm.control}
                                    name="professor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="professor" className="flex items-center gap-2"><User className="h-4 w-4" />Professor</FormLabel>
                                            <FormControl>
                                                <Input id="professor" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {/* semester input */}
                                <div className="space-y-2">
                                    <FormField
                                        control={uploadQuizForm.control}
                                        name="semester"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2"><CalendarClock className="h-4 w-4" />Semester</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                                        <SelectTrigger className="w-26">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Fall">Fall</SelectItem>
                                                            <SelectItem value="Spring">Spring</SelectItem>
                                                            <SelectItem value="Summer">Summer</SelectItem>
                                                            <SelectItem value="Winter">Winter</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* year input */}
                                <div className="space-y-2">
                                    <FormField
                                        control={uploadQuizForm.control}
                                        name="year"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Year</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                                        <SelectTrigger className="w-full border rounded-md px-3 py-2">
                                                            <SelectValue placeholder="Year" />
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
                                    />
                                </div>

                                {/* type input */}
                                <div className="space-y-2">
                                    <FormField
                                        control={uploadQuizForm.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Quiz Type</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {quizTypes.map((type) => (
                                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* description input */}
                        <div className="space-y-2">
                            <FormField
                                control={uploadQuizForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description / Notes</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} id="description" placeholder="Brief info: topics covered, allowed materials, format, etc." />
                                        </FormControl>
                                    </FormItem>
                                )}
                            >
                            </FormField>
                        </div>

                        {/* tags */}
                        <div className="space-y-3">
                            <Label className="flex items-center gap-2"><Tags className="h-4 w-4" />Add Tags (up to 3)</Label>
                            <div className="flex flex-wrap gap-2">

                                {quizTags && quizTags.map((tag, index) => (
                                    <button
                                        type="button"
                                        key={index}
                                        onClick={() => removeTag(index)}
                                        className={"px-2.5 py-1.5 text-sm rounded-full border transition bg-blue-600 text-white border-blue-600"}
                                    >
                                        {quizTags.includes(tag) ? "✓ " : ""}{tag}
                                    </button>
                                ))}
                                <Input ref={newTagRef}></Input>
                                {(quizTags.length < 3) ?
                                    <Button type="button" onClick={(e) => addTag(e)}>Add Tag</Button>
                                    :
                                    <Button type="button" onClick={(e) => addTag(e)} disabled>Add Tag</Button>
                                }

                            </div>
                            <input type="hidden" name="tags" value={quizTags.join(",")} />
                        </div>

                        <Separator />

                        {/* file input */}
                        <div className="space-y-3">
                            <FormField
                                control={uploadQuizForm.control}
                                name="quizFile"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>File* (PDF or image)</FormLabel>
                                        <FormControl>
                                            {quizFile ?
                                                <Label
                                                    title="Only one file is allowed"
                                                    htmlFor="filepick"
                                                    onDrop={onDrop}
                                                    onDragOver={(e) => e.preventDefault()}
                                                    className="border-2 border-dashed border-gray-300 rounded-2xl p-8 bg-white/60 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50/50 transition"
                                                >
                                                    <Upload className="h-8 w-8 mb-2" />
                                                    <p className="font-medium">Drag & drop files here</p>
                                                    <p className="text-sm text-gray-600">or click to browse</p>
                                                    <Input id="filepick" type="file" accept=".pdf,image/*" className="hidden" disabled onChange={onPick} />
                                                </Label>
                                                :
                                                <Label

                                                    htmlFor="filepick"
                                                    onDrop={onDrop}
                                                    onDragOver={(e) => e.preventDefault()}
                                                    className="border-2 border-dashed border-gray-300 rounded-2xl p-8 bg-white/60 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition"
                                                >
                                                    <Upload className="h-8 w-8 mb-2" />
                                                    <p className="font-medium">Drag & drop files here</p>
                                                    <p className="text-sm text-gray-600">or click to browse</p>
                                                    <Input id="filepick" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={onPick} />
                                                </Label>
                                            }

                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            >
                            </FormField>

                            {/* displaying upladed quiz file */}
                            {quizFile && (
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-700">Selected file</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between bg-white rounded-xl border p-3">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <FileText className="h-5 w-5 text-gray-500 shrink-0" />
                                                <div className="truncate">
                                                    <p className="text-sm font-medium truncate">{quizFile.name || "example.pdf"}</p>
                                                    <p className="text-xs text-gray-500">{Math.max(1, Math.round((quizFile.size || 500000) / 1024))} KB</p>
                                                </div>
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeQuizFile()}>
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-start gap-3">
                            <Checkbox id="honor" required />
                            <Label htmlFor="honor" className="text-sm leading-6 text-gray-700">
                                I confirm this upload supports academic integrity (no current or restricted material) and I have rights to share it for educational purposes.
                            </Label>
                        </div>

                        <div className="flex gap-3">
                            <Button type="submit" className="">Submit</Button>
                            <Button type="button" variant="outline" onClick={() => { resetForm() }}>Reset</Button>
                        </div>
                    </form>
                </Form>

            </CardContent>
        </Card>

    )
}