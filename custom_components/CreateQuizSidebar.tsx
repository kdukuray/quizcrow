import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"

export default function CreateQuizSidebar() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-3">
          <p><strong>*</strong> Fields with an asterisk are <strong>mandatory</strong>.</p>
          <p>• <strong>School*</strong>, <strong>Subject*</strong>, and <strong>Title*</strong> must be at least 3 characters long.</p>
          <p>• <strong>Professor</strong>, <strong>Year</strong>, <strong>Semester</strong>, and <strong>Course Code</strong> are optional, but help others find this quiz more easily.</p>
          <p>• <strong>Description</strong> and <strong>Type</strong> are optional, but recommended for clarity.</p>
          <p>• You must upload at least one file (<strong>PDF*</strong> preferred; clear images in <strong>JPG/PNG</strong> are also fine).</p>
          <p>• Please avoid uploading copyrighted material you don’t have permission to share.</p>
          <p>• Add descriptive tags so others can quickly discover relevant quizzes.</p>
        </CardContent>
      </Card>
    </div>
  )
}
