import { ReactNode } from "react";

export function Section(props: {
  id?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  tone?: "white" | "soft";
}) {
  const bg = props.tone === "soft" ? "bg-slate-50" : "bg-white";
  return (
    <section id={props.id} className={`border-t border-slate-200 ${bg}`}>
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-tho-title text-3xl font-normal md:text-4xl">{props.title}</h2>
        {props.subtitle ? <p className="mt-2 max-w-3xl text-slate-600">{props.subtitle}</p> : null}
        <div className="mt-8">{props.children}</div>
      </div>
    </section>
  );
}
