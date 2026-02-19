import { ReactNode } from "react";
import { ScribbleUnderline } from "@/components/Scribble";

export function Section(props: {
  id?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  tone?: "white" | "soft";
}) {
  const bg = props.tone === "soft" ? "bg-tho-bg" : "bg-white";
  return (
    <section id={props.id} className={`${bg}`}>
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
        <h2 className="font-tho-title text-3xl font-normal md:text-4xl">{props.title}</h2>
        <ScribbleUnderline className="mt-2 opacity-80" stroke="rgba(11,11,12,0.32)" />
        {props.subtitle ? <p className="mt-3 max-w-3xl text-slate-700">{props.subtitle}</p> : null}
        <div className="mt-8">{props.children}</div>
      </div>
    </section>
  );
}
