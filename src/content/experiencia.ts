export type Client = { name: string; isNew: boolean };

export type Era = {
  id: string;
  year: string;
  label: string;
  accent: string;
  body: string[];
  clients: Client[];
  clientNote?: string;
};

export type Project = {
  id: string;
  client: string;
  title: string;
  tag: string;
  tagColor: string;
  since: string;
  summary: string;
  detail: string;
  illustration: string;
  photo?: string;
};

export const ERAS: Era[] = [
  {
    id: "origen",
    year: "Antes de 2023",
    label: "Origen",
    accent: "#d13ca2",
    body: [
      "El director de THO acumula trayectoria desde 2009 en trabajo de campo, levantamiento de datos y facilitación. Pasó por programas de fortalecimiento comunitario del FOSIS y luego por una consultora local acompañando organizaciones de distinto rubro y escala.",
      "Ahí se hizo evidente un patrón: muchas asesorías operaban sin metodología real, terminando como confirmaciones del diagnóstico del cliente o como ejercicios puramente comunicacionales.",
      "THO nació para cerrar esa brecha — trabajo sistemático, resultados concretos.",
    ],
    clients: [],
    clientNote: "THO se constituye formalmente en 2022.",
  },
  {
    id: "inicio",
    year: "2023",
    label: "Primeros pasos",
    accent: "#1e71b8",
    body: [
      "Iniciamos operaciones con fuerza en 2023. Los primeros proyectos definieron bien el perímetro de lo que hacemos: relacionamiento comunitario con la Cámara Chilena de la Construcción Concepción, gestión de contenido para Club34.",
      "Dos relaciones que comenzaron ese año siguen activas hoy — lo que dice más de cómo trabajamos que cualquier credencial.",
    ],
    clients: [
      { name: "CChC Concepción", isNew: true },
      { name: "Club34", isNew: true },
    ],
  },
  {
    id: "consolidacion",
    year: "2024",
    label: "Consolidación",
    accent: "#fa7f33",
    body: [
      "El segundo año fue de profundización, no de expansión por expansión. Continuamos con los clientes del año anterior, sumamos nuevos proyectos y formalizamos vínculo con IAP2 Latinoamérica, la red de referencia en participación pública de la región.",
      "Acompañamos a INDAMA S.A. en la construcción de su cultura organizacional a través de una revista trimestral interna. Empezamos también a proyectar servicios de sostenibilidad, orientados a la gestión, la reportabilidad y el cumplimiento de estándares.",
      "El trabajo dejó de ser acumulación de proyectos y empezó a tener una arquitectura.",
    ],
    clients: [
      { name: "CChC Concepción", isNew: false },
      { name: "Club34", isNew: false },
      { name: "Conce Con Todos", isNew: true },
      { name: "INDAMA S.A.", isNew: true },
      { name: "IAP2 Latinoamérica", isNew: true },
    ],
  },
  {
    id: "certificacion",
    year: "2025",
    label: "Certificación y equipo",
    accent: "#f2b705",
    body: [
      "Asesoramos al Círculo de Mujeres de la CChC en vocería estratégica. Llegamos a CChC Araucanía — primera expansión geográfica fuera del Gran Concepción.",
      "El director se certificó como entrenador internacional IAP2. Se incorpora un nuevo director, enriqueciendo la conducción de THO con una mirada complementaria. El equipo crece con un área audiovisual y una jefatura de administración y finanzas.",
    ],
    clients: [
      { name: "CChC Concepción", isNew: false },
      { name: "Club34", isNew: false },
      { name: "Conce Con Todos", isNew: false },
      { name: "IAP2 Latinoamérica", isNew: false },
      { name: "Círculo de Mujeres CChC", isNew: true },
      { name: "CChC Araucanía", isNew: true },
    ],
    clientNote: "Primera expansión geográfica fuera del Gran Concepción.",
  },
  {
    id: "hoy",
    year: "2026",
    label: "Hoy",
    accent: "#93bf24",
    body: [
      "Trabajamos con Paleo Andes en un proceso de fortalecimiento organizacional y actualización de su arquitectura interna. Sumamos a Credyhogar y Vanrom en contenido digital con foco en las personas detrás de cada operación.",
      "El equipo incorporó un asesor de relacionamiento comunitario, un diseñador gráfico y un asesor en desarrollo organizacional. Los servicios cubren hoy el ciclo completo: comunidad, comunicación, organización y sostenibilidad.",
    ],
    clients: [
      { name: "CChC Concepción", isNew: false },
      { name: "Club34", isNew: false },
      { name: "Conce Con Todos", isNew: false },
      { name: "IAP2 Latinoamérica", isNew: false },
      { name: "Credyhogar", isNew: true },
      { name: "Vanrom", isNew: true },
      { name: "Paleo Andes", isNew: true },
    ],
    clientNote: "CChC Concepción y Club34 llevan con THO desde el primer día.",
  },
];

export const PROJECTS: Project[] = [
  {
    id: "cchc",
    client: "CChC Concepción",
    title: "Estrategia de Relacionamiento Comunitario",
    tag: "Comunidad",
    tagColor: "#fa7f33",
    since: "Desde 2023",
    summary: "Acompañamiento continuo al vínculo entre el gremio y las comunidades del Gran Concepción.",
    detail:
      "Desde el segundo semestre de 2023 acompañamos el relacionamiento con las comunidades del Gran Concepción. Desde encuentros iniciales hasta documentos de consenso sobre desarrollo urbano, generamos confianza a través de programas que permiten vínculos auténticos entre el gremio y las organizaciones sociocomunitarias: la Escuela Itinerante, los Encuentros de Diseño Participativo y el documento Visión 2050.",
    illustration: "/ilustraciones/5.png",
    photo: "/proyectos/cchc-comunidad.png",
  },
  {
    id: "indama",
    client: "INDAMA S.A.",
    title: "Revista Interna Trimestral",
    tag: "Comunicaciones",
    tagColor: "#1e71b8",
    since: "2024",
    summary: "Cultura organizacional desde adentro, a través de una publicación propia.",
    detail:
      "Acompañamos a INDAMA en la promoción de su cultura organizacional mediante una revista trimestral que abordaba eventos, cambios y proyecciones importantes para la empresa. Aniversarios, trabajadores con larga trayectoria, fiestas patrias e inauguración de nueva tecnología fueron contenidos valorados a lo largo del proceso.",
    illustration: "/ilustraciones/11.png",
    photo: "/proyectos/indama-evento.png",
  },
  {
    id: "iap2",
    client: "IAP2 Latinoamérica",
    title: "Training en Participación Pública",
    tag: "Formación",
    tagColor: "#f2b705",
    since: "Desde 2025",
    summary: "Formaciones certificadas en el Enfoque IAP2 para organizaciones y empresas.",
    detail:
      "Con la certificación internacional de nuestro director como entrenador IAP2, realizamos formaciones a distintas organizaciones y empresas en el Enfoque IAP2 para la Participación Pública. Esta alianza ha permitido una internacionalización del trabajo de THO y un intercambio de experiencias que enriquece cada asesoría.",
    illustration: "/ilustraciones/10.png",
    photo: "/proyectos/iap2-training.png",
  },
  {
    id: "voceria",
    client: "CChC Concepción",
    title: "Mi Voz Construye",
    tag: "Comunidad",
    tagColor: "#fa7f33",
    since: "2025",
    summary: "Programa de vocería estratégica para mujeres líderes del sector construcción.",
    detail:
      "Acompañamos al Círculo de Mujeres de la CChC en un programa de formación en vocería estratégica. Mujeres líderes del sector construcción desarrollaron herramientas para comunicar con claridad, construir presencia pública y representar al gremio con confianza frente a medios, comunidades y autoridades.",
    illustration: "/ilustraciones/3.png",
    photo: "/proyectos/cchc-voceria.png",
  },
  {
    id: "vanrom",
    client: "Vanrom",
    title: "Contenido Audiovisual",
    tag: "Comunicaciones",
    tagColor: "#1e71b8",
    since: "Desde 2026",
    summary: "Producción de contenido digital centrado en las personas de la empresa.",
    detail:
      "Producción audiovisual para Vanrom con foco en los equipos y operaciones reales de la empresa. El contenido muestra el trabajo desde adentro — rodajes en terreno, personas reales, procesos concretos — generando una presencia digital auténtica que conecta con sus audiencias.",
    illustration: "/ilustraciones/7.png",
    photo: "/proyectos/vanrom-rodaje.png",
  },
  {
    id: "paleoandes",
    client: "Paleo Andes",
    title: "Fortalecimiento Organizacional",
    tag: "Desarrollo org.",
    tagColor: "#d13ca2",
    since: "Desde 2026",
    summary: "Actualización de la arquitectura interna para una empresa de arqueología y paleontología.",
    detail:
      "Luego de un acercamiento en torno a la sostenibilidad en 2025, en 2026 iniciamos un proceso de fortalecimiento con foco en la arquitectura organizacional. La revisión del organigrama, el manual de cargos y las matrices de gestión interna permite mayor alineación, el desarrollo de una cultura organizacional sólida y un despliegue más coordinado de las distintas funciones.",
    illustration: "/ilustraciones/2.png",
  },
];
