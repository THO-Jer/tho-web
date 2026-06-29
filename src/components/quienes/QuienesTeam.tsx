"use client";

import { CORE_TEAM, EXTENDED_TEAM } from "@/content/team";

export function QuienesTeam() {
  return (
    <>
      {/* Equipo principal */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
        {CORE_TEAM.map((member) => (
          <div key={member.slug} className="team-card" style={{ height: "280px" }}>
            <div className="team-card-photo" style={{ backgroundColor: member.color }}>
              <span className="absolute inset-0 flex select-none items-center justify-center text-2xl font-medium text-white/90">
                {member.initials}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/team/${member.slug}_tho.png`}
                alt={member.name}
                className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-300"
                onLoad={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "1"; }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            </div>
            <div className="team-card-overlay">
              <p className="text-sm font-medium leading-snug text-white">{member.name}</p>
              <p className="mt-1 text-xs leading-snug text-white/75">{member.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Equipo extendido */}
      <div className="mt-3 grid grid-cols-2 gap-3 md:mt-4 md:grid-cols-4 md:gap-4">
        {EXTENDED_TEAM.map((member) => (
          <div key={member.slug} className="team-card" style={{ height: "210px" }}>
            <div className="team-card-photo" style={{ backgroundColor: member.color }}>
              <span className="absolute inset-0 flex select-none items-center justify-center text-xl font-medium text-white/90">
                {member.initials}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/team/${member.slug}_tho.png`}
                alt={member.name}
                className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-300"
                onLoad={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "1"; }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            </div>
            <div className="team-card-overlay">
              <p className="text-xs font-medium leading-snug text-white">{member.name}</p>
              <p className="mt-1 text-[10px] leading-snug text-white/75">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
