import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ kid: string }>;
}

export default async function KidDenPage({ params }: Props) {
  const { kid } = await params;
  if (kid !== "mercy") notFound();
  redirect("/kids/mercy/hub");
}
