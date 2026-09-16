import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SubjectPractice from "@/components/SubjectPractice";
import TrumaCurriculumPractice from "@/components/TrumaCurriculumPractice";
import { SUBJECT_META } from "@/lib/questions";
import { TRUMA_CURRICULUM } from "@/lib/curriculum";

interface Props {
  params: Promise<{ subject: string }>;
}

// Subjects that use Truma's curriculum-based practice
const TRUMA_CURRICULUM_SUBJECTS = ["prealgebra", "writing", "science", "history", "bible", "grammar", "literature", "logic", "theology"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  const meta = SUBJECT_META[subject];
  const curriculumLabel = TRUMA_CURRICULUM[subject]?.subjectLabel;
  const label = meta?.label ?? curriculumLabel;
  return { title: label ? `${label} | Schoolhouse` : "Schoolhouse" };
}

export default async function PracticePage({ params }: Props) {
  const { subject } = await params;

  // Route Truma's curriculum subjects to the new practice component
  if (TRUMA_CURRICULUM_SUBJECTS.includes(subject)) {
    const curriculum = TRUMA_CURRICULUM[subject];
    if (!curriculum) notFound();
    return <TrumaCurriculumPractice curriculum={curriculum} />;
  }

  if (!SUBJECT_META[subject]) notFound();
  return <SubjectPractice subject={subject} subjectKey={subject} />;
}
