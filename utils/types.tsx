export interface Quiz {
  id?: number,
  createdAt?: string,
  school: string,
  subject: string,
  professor: string,
  year: number
  semester: string,
  courseCode: string,
  title?: string, 
  quizFileLink?: string,
  description?: string
  assessmentType: string
}


export interface QuizRequests{
    id?: number,
    createdAt: string,
    title: string,
    school: string,
    subject: string,
    courseCode: string,
    professor: string,
    year: number,
    semester: string,
    upvotes: number
}

export interface QuizTag {
    id?: number,
    createdA?: string,
    name: string
}
