"use client";

import FloatingTutor from "./FloatingTutor";

interface Props {
  kidId: string;
  children: React.ReactNode;
}

export default function BiblePageWrapper({ kidId, children }: Props) {
  return (
    <>
      {children}
      <FloatingTutor kidId={kidId} subject="bible" autoGreet={true} />
    </>
  );
}
