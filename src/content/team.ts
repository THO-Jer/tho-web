export type TeamMember = {
  name: string;
  role: string;
  /** Nombre usado en el archivo de imagen: /team/{slug}_tho.png */
  slug: string;
  /** Color de fondo mientras no haya foto */
  color: string;
  initials: string;
};

/**
 * Equipo fijo (fila superior, tarjetas más grandes)
 */
export const CORE_TEAM: TeamMember[] = [
  {
    name: "Jeremías Ortiz",
    role: "Fundador y Director",
    slug: "jeremias",
    color: "#d13ca2",
    initials: "JO",
  },
  {
    name: "Francisco Castro",
    role: "Socio Director",
    slug: "francisco",
    color: "#1e71b8",
    initials: "FC",
  },
  {
    name: "Maximiliano Muñoz",
    role: "Jefe de Adm. y Fin.",
    slug: "maximiliano",
    color: "#e06418",
    initials: "MM",
  },
];

/**
 * Equipo extendido — fijos y por proyecto (fila inferior, tarjetas más pequeñas)
 */
export const EXTENDED_TEAM: TeamMember[] = [
  {
    name: "Rogelio Salinas",
    role: "Asesor Desarrollo Organizacional",
    slug: "rogelio",
    color: "#5e8c14",
    initials: "RS",
  },
  {
    name: "Felipe Muñoz",
    role: "Asesor Sociocomunitario",
    slug: "felipe",
    color: "#a82d7e",
    initials: "FM",
  },
  {
    name: "Gerson Sanhueza",
    role: "Asistente Diseño Gráfico",
    slug: "gerson",
    color: "#145a8c",
    initials: "GS",
  },
  {
    name: "Sebastián Araya",
    role: "Asesor Audiovisual",
    slug: "sebastian",
    color: "#b88200",
    initials: "SA",
  },
];
