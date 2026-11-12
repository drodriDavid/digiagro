/* =====================================================================
   INVENTARIO DE EQUIPAMIENTO — Drones y Sensores
   AEROLAB — Grupo GGGJ, Universidad de Jaén
   Fuentes: web del grupo (gggj.ujaen.es),
            inventario interno y tabla de pólizas (LivingSoiLL / CEATIC).
   ===================================================================== */

const EQUIPAMIENTO = [

  /* ------------------------------------------------------------------ */
  /*  DRONES / AERONAVES                                                 */
  /* ------------------------------------------------------------------ */
  {
    id: "m300",
    type: "drone",
    art: "industrial",
    img: "assets/img/m300.png",
    name: "DJI Matrice 300 RTK",
    brand: "DJI",
    tagline: "Plataforma industrial de cartografía y carga útil dual",
    status: { label: "Operativo", level: "ok" },
    serial: "1ZDH3LO011089",
    poliza: "Asegurado · CASER 96028176 · vto. 24/04/2027 · financiado por CEATIC",
    description:
      "Aeronave insignia del grupo para vuelos de larga duración y cargas profesionales. " +
      "Admite gimbal dual inferior más un gimbal superior, posicionamiento RTK centimétrico y " +
      "es la plataforma habitual para la cámara fotogramétrica Zenmuse P1 y sensores LiDAR.",
    specs: [
      ["Autonomía de vuelo", "55 min"],
      ["Posicionamiento", "RTK (Real Time Kinematics), precisión centimétrica"],
      ["Configuración de gimbal", "Dual inferior + 1 superior"],
      ["Cargas compatibles", "Zenmuse P1 / L1 / H20 / XT2"],
      ["Resistencia al viento", "15 m/s"],
      ["Grado de protección", "IP45"],
      ["Sistema de detección", "Omnidireccional de 6 direcciones"],
    ],
    features: ["RTK", "Gimbal dual", "Industrial", "55 min"],
    doc: "https://enterprise.dji.com/es/matrice-300/specs",
  },
  {
    id: "phantom4rtk",
    type: "drone",
    art: "quad",
    img: "assets/img/phantom4rtk.png",
    name: "DJI Phantom 4 RTK",
    brand: "DJI",
    tagline: "Fotogrametría de precisión en formato compacto",
    status: { label: "En reserva", level: "warn" },
    serial: "0V2SH7QRA30055",
    poliza: "Asegurado · CASER 96028308 · vto. 12/05/2027 · uso reducido",
    description:
      "Cuadricóptero compacto con módulo RTK integrado para levantamientos topográficos " +
      "de alta precisión sin necesidad de gran cantidad de puntos de control en tierra.",
    specs: [
      ["Autonomía de vuelo", "30 min"],
      ["Cámara", "20 MP, sensor CMOS 1''"],
      ["Posicionamiento", "RTK, precisión centimétrica"],
      ["Mecanismo TimeSync", "Alinea módulo RTK, cámara y obturador"],
      ["GSD", "2,74 cm a 100 m de altura"],
    ],
    features: ["RTK", "20 MP", "Topografía"],
    doc: "https://enterprise.dji.com/es/phantom-4-rtk",
  },
  {
    id: "m210",
    type: "drone",
    art: "industrial",
    img: "assets/img/m210.png",
    name: "DJI Matrice 210 (M210)",
    brand: "DJI",
    tagline: "Plataforma dual de inspección",
    status: { label: "En reserva", level: "warn" },
    serial: "0G0DF1B0230004",
    poliza: "Asegurado · CASER 96028302 · vto. 12/05/2027 · uso reducido",
    description:
      "Plataforma robusta de la serie Matrice 200 preparada para configuraciones de gimbal " +
      "dual, pensada para inspección y captura simultánea de distintos sensores.",
    specs: [
      ["Autonomía de vuelo", "35 min"],
      ["Configuración de gimbal", "Dual (simultáneo)"],
      ["Cargas compatibles", "Zenmuse XT2 / X4S / X5S"],
      ["Resistencia al viento", "12 m/s"],
      ["Grado de protección", "IP43"],
    ],
    features: ["Gimbal dual", "Inspección"],
    doc: "https://www.dji.com/es/matrice-200-series",
  },
  {
    id: "mavic3m",
    type: "drone",
    art: "quad",
    img: "assets/img/mavic3m.png",
    name: "DJI Mavic 3M (Multispectral)",
    brand: "DJI",
    tagline: "RGB + multiespectral para agricultura de precisión",
    status: { label: "Operativo", level: "ok" },
    serial: "1581F5FKD233200D9PVN",
    poliza: "Asegurado · CASER 96026216 · vto. 07/06/2026 · financiado por CEATIC",
    description:
      "Dron agrícola que combina una cámara RGB de 20 MP con un conjunto multiespectral de " +
      "4 bandas (verde, rojo, red-edge e infrarrojo cercano) para cálculo de índices de " +
      "vegetación (NDVI, NDRE) con georreferenciación RTK.",
    specs: [
      ["Autonomía de vuelo", "43 min"],
      ["Cámara RGB", "20 MP, CMOS 4/3''"],
      ["Cámaras multiespectrales", "4 × 5 MP (G, R, RE, NIR)"],
      ["Sensor de luz solar", "Integrado, para calibración de reflectancia"],
      ["Posicionamiento", "RTK, precisión centimétrica"],
    ],
    features: ["RTK", "Multiespectral", "NDVI", "Agricultura"],
    doc: "https://enterprise.dji.com/es/mavic-3-enterprise/specs",
  },
  {
    id: "mavic3t",
    type: "drone",
    art: "quad",
    img: "assets/img/mavic3t.png",
    name: "DJI Mavic 3T (Thermal)",
    brand: "DJI",
    tagline: "Cámara térmica radiométrica + zoom",
    status: { label: "Operativo", level: "ok" },
    serial: "1581F5FJD235X00D0G76",
    poliza: "Asegurado · CASER 96026689 · vto. 06/08/2026 · LivingSoiLL",
    description:
      "Variante térmica de la serie Mavic 3 Enterprise. Integra una cámara térmica " +
      "radiométrica, una cámara con zoom y una gran angular, ideal para estrés hídrico, " +
      "inspección y detección de anomalías de temperatura.",
    specs: [
      ["Autonomía de vuelo", "45 min"],
      ["Cámara térmica", "640 × 512 px, radiométrica"],
      ["Cámara zoom", "12 MP, zoom 56×"],
      ["Cámara gran angular", "48 MP"],
      ["Posicionamiento", "RTK (módulo)"],
    ],
    features: ["RTK", "Térmica", "Zoom 56×"],
    doc: "https://enterprise.dji.com/es/mavic-3-enterprise/specs",
  },
  {
    id: "mavicpro",
    type: "drone",
    art: "quad",
    img: "assets/img/mavicpro.png",
    name: "DJI Mavic Pro (Fly More)",
    brand: "DJI",
    tagline: "Plataforma RGB ligera y plegable",
    status: { label: "En reserva", level: "warn" },
    serial: "08QUE4500102DN",
    poliza: "CASER 96026645 · vto. 09/08/2026",
    description:
      "Dron plegable ligero para captura RGB rápida, reconocimiento de zonas y vídeo. " +
      "Pack Fly More con baterías y accesorios adicionales.",
    specs: [
      ["Autonomía de vuelo", "27 min"],
      ["Cámara", "12,5 MP, vídeo 4K"],
      ["Estabilización", "Gimbal mecánico de 3 ejes"],
      ["Peso", "743 g"],
    ],
    features: ["RGB", "Ligero", "Plegable"],
    doc: "https://www.dji.com/es/mavic",
  },
  {
    id: "mini4pro",
    type: "drone",
    art: "quad",
    img: "assets/img/mini4pro.png",
    name: "DJI Mini 4 Pro",
    brand: "DJI",
    tagline: "Ultraligero para reconocimiento ágil",
    status: { label: "Operativo", level: "ok" },
    serial: "1581F6Z9C23B003F3HZ",
    poliza: "Sub-250 g · sin póliza obligatoria",
    description:
      "Dron de menos de 250 g, ideal para reconocimiento rápido, divulgación y captura " +
      "ágil de vídeo/foto sin los requisitos regulatorios de las aeronaves más pesadas.",
    specs: [
      ["Peso", "< 249 g"],
      ["Cámara", "48 MP, CMOS 1/1.3''"],
      ["Vídeo", "4K HDR a 60 fps"],
      ["Detección de obstáculos", "Omnidireccional"],
      ["Autonomía de vuelo", "34 min"],
    ],
    features: ["< 250 g", "48 MP", "4K HDR"],
    doc: "https://www.dji.com/es/mini-4-pro/specs",
  },
  {
    id: "matrice400",
    type: "drone",
    art: "industrial",
    img: "assets/img/matrice400.png",
    name: "DJI Matrice 400",
    brand: "DJI",
    tagline: "Nueva plataforma industrial de largo alcance",
    status: { label: "Operativo", level: "ok" },
    serial: "1581F8DBW255P00A2MHA",
    poliza: "Asegurado · CASER 96028983 · vto. 12/09/2026 · LivingSoiLL",
    description:
      "Última incorporación al parque de aeronaves del grupo. Plataforma industrial de " +
      "nueva generación con gran autonomía y capacidad de carga útil para misiones de " +
      "cartografía y teledetección de largo alcance.",
    specs: [
      ["Autonomía de vuelo", "≈ 59 min"],
      ["Posicionamiento", "RTK"],
      ["Cargas compatibles", "Serie Zenmuse / LiDAR"],
      ["Detección", "Omnidireccional + radar"],
    ],
    features: ["RTK", "Industrial", "Largo alcance"],
    doc: "https://enterprise.dji.com/es",
  },
  {
    id: "lidardrone",
    type: "drone",
    art: "industrial",
    img: "assets/img/lidardrone.png",
    name: "LiDARdrone XL (Aeromedia)",
    brand: "Aeromedia / Phoenix",
    tagline: "Hexacóptero de carga pesada para LiDAR aerotransportado",
    status: { label: "Revisión de póliza", level: "warn" },
    serial: "UDATR 0014",
    poliza: "CASER 96028197 · gestionado con LivingSoiLL",
    description:
      "Multicóptero de carga pesada (configuración X6 plegable, fibra de carbono y aluminio " +
      "6061) diseñado por Aeromedia para transportar el sistema LiDAR Phoenix Scout-Ultra y " +
      "sensores asociados (hiperespectral, térmico). Es el vector aéreo del escaneado láser de " +
      "alta densidad del grupo: cubre hasta 130 ha por vuelo con densidades de 200–300 pts/m².",
    specs: [
      ["Autonomía de vuelo", "hasta 45 min"],
      ["Capacidad de carga útil", "13 kg"],
      ["Peso máx. al despegue (MTOW)", "25 kg"],
      ["Configuración", "Hexacóptero X6 plegable (fibra de carbono + Al 6061)"],
      ["Motores", "T-Motor de grado industrial, resistentes al agua"],
      ["Carga útil principal", "LiDAR Phoenix Scout-Ultra"],
      ["Cobertura", "130 ha/vuelo · 200 m de ancho de pasada · 100 m AGL · 10 m/s"],
      ["Densidad de puntos", "200–300 puntos/m²"],
      ["Software de vuelo/proceso", "SpatialExplorer"],
    ],
    features: ["LiDAR", "Carga 13 kg", "45 min", "Aeromedia"],
    doc: "https://aeromedia.es/lidardrone-xl/",
  },

  /* ------------------------------------------------------------------ */
  /*  SENSORES / CÁMARAS / CARGAS ÚTILES                                 */
  /* ------------------------------------------------------------------ */
  {
    id: "p1",
    type: "sensor",
    art: "camera",
    img: "assets/img/p1.png",
    name: "DJI Zenmuse P1",
    brand: "DJI",
    tagline: "Cámara full-frame de 45 MP para fotogrametría",
    status: { label: "Operativo", level: "ok" },
    description:
      "Carga fotogramétrica de referencia: sensor full-frame de 45 MP con obturador mecánico " +
      "y objetivos intercambiables. Combinada con el Matrice 300 RTK ofrece levantamientos de " +
      "precisión centimétrica.",
    specs: [
      ["Sensor", "Full-frame 45 MP"],
      ["Precisión", "3 cm horizontal · 5 cm vertical"],
      ["Obturador", "Mecánico global"],
      ["Objetivos", "Intercambiables (24 / 35 / 50 mm)"],
      ["Plataforma", "Zenmuse, gimbal de 3 ejes"],
    ],
    features: ["45 MP", "Full-frame", "Fotogrametría"],
    doc: "https://enterprise.dji.com/es/zenmuse-p1/specs",
  },
  {
    id: "xt2",
    type: "sensor",
    art: "thermal",
    img: "assets/img/xt2.png",
    name: "DJI Zenmuse XT2",
    brand: "DJI / FLIR",
    tagline: "Cámara dual RGB + térmica radiométrica",
    status: { label: "Operativo", level: "ok" },
    description:
      "Carga dual desarrollada con FLIR: combina sensor térmico radiométrico y cámara visual " +
      "de 12 MP en un mismo gimbal, con fusión de imagen para inspección y análisis térmico.",
    specs: [
      ["Sensor térmico", "FLIR, rango -40 °C a 550 °C"],
      ["Cámara visual", "12 MP"],
      ["Resolución térmica", "640 × 512 / 336 × 256 px"],
      ["Modos de fusión", "MSX, mezcla, foto/vídeo simultáneo"],
    ],
    features: ["Térmica", "RGB", "FLIR"],
    doc: "https://www.dji.com/es/zenmuse-xt2",
  },
  {
    id: "scoutultra",
    type: "sensor",
    art: "lidar",
    img: "assets/img/lidar.png",
    name: "Phoenix LiDAR Scout-Ultra",
    brand: "Phoenix LiDAR",
    tagline: "Sistema LiDAR aerotransportado multisensor",
    status: { label: "Operativo", level: "ok" },
    description:
      "Sistema LiDAR aerotransportado de alta densidad, integrable con sensores hiperespectral " +
      "y térmico para captura simultánea. Proporciona nubes de puntos 3D georreferenciadas con " +
      "visión de 360°. Se procesa con SpatialExplorer.",
    specs: [
      ["Tecnología", "LiDAR de escaneo láser"],
      ["Campo de visión", "360°"],
      ["Integración", "Hiperespectral + térmico"],
      ["Salida", "Nube de puntos 3D georreferenciada"],
      ["Software", "SpatialExplorer (Phoenix)"],
    ],
    features: ["LiDAR", "360°", "Nube de puntos 3D"],
    doc: "https://www.phoenixlidar.com",
  },
  {
    id: "rededgemx",
    type: "sensor",
    art: "multispectral",
    img: "assets/img/mica2.png",
    name: "MicaSense RedEdge-MX",
    brand: "MicaSense / AgEagle",
    tagline: "Cámara multiespectral de 5 bandas",
    status: { label: "Operativo", level: "ok" },
    description:
      "Cámara multiespectral profesional de 5 bandas (azul, verde, rojo, red-edge e infrarrojo " +
      "cercano) para teledetección agrícola, cálculo de índices de vegetación y análisis de cultivos.",
    specs: [
      ["Bandas espectrales", "5 (B, G, R, RE, NIR)"],
      ["Resolución espacial", "8 cm/px a 120 m"],
      ["Sensor de irradiancia", "DLS 2 (calibración de reflectancia)"],
      ["Salida", "Imágenes calibradas por banda"],
    ],
    features: ["5 bandas", "NDVI / NDRE", "Agricultura"],
    doc: "https://ageagle.com/drone-sensors/rededge-p-high-resolution-multispectral-camera/",
  },
  {
    id: "rededgemxblue",
    type: "sensor",
    art: "multispectral",
    img: "assets/img/mica.png",
    name: "MicaSense RedEdge-MX Blue",
    brand: "MicaSense / AgEagle",
    tagline: "Bandas adicionales para sistema de 10 bandas",
    status: { label: "Operativo", level: "ok" },
    description:
      "Módulo complementario que añade bandas adicionales (incluida banda costera/azul). " +
      "Combinado con el RedEdge-MX conforma un sistema dual de 10 bandas para análisis " +
      "espectral avanzado.",
    specs: [
      ["Bandas espectrales", "5 adicionales (incl. costera/azul)"],
      ["Modo combinado", "Sistema dual de 10 bandas con RedEdge-MX"],
      ["Integración", "Sincronizable con el MX estándar"],
    ],
    features: ["5 bandas", "Dual 10 bandas"],
    doc: "https://ageagle.com/drone-sensors/",
  },
  {
    id: "nanohyperspec",
    type: "sensor",
    art: "hyperspectral",
    img: "assets/img/nano_hp.png",
    name: "Headwall Nano-Hyperspec VNIR",
    brand: "Headwall Photonics",
    tagline: "Cámara hiperespectral VNIR (400–1000 nm)",
    status: { label: "Operativo", level: "ok" },
    description:
      "Cámara hiperespectral compacta en el rango visible–infrarrojo cercano (VNIR). Captura " +
      "cientos de bandas espectrales contiguas para firmas espectrales detalladas de vegetación, " +
      "suelo y materiales. Se procesa con HyperSpec III.",
    specs: [
      ["Rango espectral", "400 – 1000 nm (VNIR)"],
      ["Bandas espectrales", "270 – 340 bandas contiguas"],
      ["Tipo", "Espectrómetro de barrido (pushbroom)"],
      ["Software", "HyperSpec III"],
    ],
    features: ["Hiperespectral", "340 bandas", "VNIR"],
    doc: "https://headwallphotonics.com/products/hyperspectral-imaging/",
  },
  {
    id: "fx10e",
    type: "sensor",
    art: "hyperspectral",
    img: "assets/img/fx10e.png",
    name: "Specim FX10e",
    brand: "Specim",
    tagline: "Cámara hiperespectral VNIR de laboratorio (400–1000 nm)",
    status: { label: "Operativo", level: "ok" },
    serial: "",
    poliza: "",
    description:
      "Cámara hiperespectral de laboratorio en el rango VNIR (400–1000 nm). Diseñada para " +
      "análisis en línea y control de calidad, captura 224 bandas espectrales con alta " +
      "velocidad de adquisición (hasta 330 fps). Interfaz GigE para integración flexible en " +
      "sistemas de adquisición de datos.",
    specs: [
      ["Rango espectral", "400 – 1000 nm (VNIR)"],
      ["Bandas espectrales", "224 bandas"],
      ["Píxeles espaciales", "1024 px"],
      ["Frame rate", "Hasta 330 fps"],
      ["Interfaz", "GigE Vision"],
      ["Tipo", "Pushbroom / barrido lineal"],
    ],
    features: ["Hiperespectral", "VNIR", "Laboratorio"],
    doc: "https://www.specim.com/products/specim-fx10/",
  },
  {
    id: "afx17",
    type: "sensor",
    art: "hyperspectral",
    img: "assets/img/afx17.png",
    name: "Specim AFX17",
    brand: "Specim",
    tagline: "Hiperespectral SWIR aerotransportada (900–1700 nm)",
    status: { label: "Nueva incorporación", level: "ok" },
    description:
      "Sistema hiperespectral aerotransportado en el infrarrojo de onda corta (SWIR), última " +
      "adquisición del grupo. Amplía la capacidad espectral más allá del VNIR para detección de " +
      "humedad, composición del suelo y materiales. Trabaja con el ecosistema SpatialExplorer.",
    specs: [
      ["Rango espectral", "900 – 1700 nm (SWIR)"],
      ["Bandas espectrales", "224 bandas"],
      ["Tipo", "Pushbroom aerotransportado"],
      ["Integración", "Plataforma LiDAR / SpatialExplorer"],
    ],
    features: ["Hiperespectral", "SWIR", "Nuevo"],
    doc: "https://www.specim.com/products/specim-afx17/",
  },
];

/* Software / herramientas de procesado asociadas al equipamiento */
const SOFTWARE = [
  { name:"Pix4D",             cat:"Fotogrametría",   desc:"Ortomosaicos y modelos 3D a partir de imágenes.",        color:"#0a84ff", url:"https://www.pix4d.com" },
  { name:"Agisoft Metashape", cat:"Fotogrametría",   desc:"Procesado fotogramétrico y nubes de puntos densas.",     color:"#e0532e", url:"https://www.agisoft.com" },
  { name:"UgCS",              cat:"Planificación",   desc:"Diseño y ejecución de planes de vuelo automatizados.",   color:"#16a36a", url:"https://www.sphengineering.com/flight-planning/ugcs" },
  { name:"ArcGIS",            cat:"SIG",             desc:"Sistema de información geográfica y análisis espacial.", color:"#2f7d3b", url:"https://www.arcgis.com" },
  { name:"NVI",               cat:"Análisis",        desc:"Cálculo de índices de vegetación (NDVI, NDRE…).",        color:"#7a57d1", url:"" },
  { name:"SpatialExplorer",   cat:"LiDAR",           desc:"Procesado de datos LiDAR e hiperespectral (Phoenix).",   color:"#0e8f8f", url:"https://www.phoenixlidar.com" },
  { name:"HyperSpec III",     cat:"Hiperespectral",  desc:"Procesado de imagen hiperespectral (Headwall).",         color:"#c2511f", url:"https://headwallphotonics.com" },
];

/* Galería promocional — vídeos de vuelos (en assets/video/promo/) */
const PROMO = [
  { file:"DJI_0028", title:"Inspección de infraestructuras", util:"Revisión de edificaciones, instalaciones y estructuras de difícil acceso con imagen RGB y térmica de alta resolución." },
  { file:"DJI_0251", title:"Agricultura de precisión",       util:"Seguimiento del estado de los cultivos mediante imagen multiespectral e índices de vegetación." },
  { file:"DJI_0166", title:"Conservación del patrimonio",    util:"Documentación y digitalización aérea de entornos y elementos de valor patrimonial." },
  { file:"DJI_0024", title:"Generación de modelos 3D",       util:"Reconstrucción fotogramétrica y modelos digitales de superficie a partir del vuelo." },
  { file:"DJI_0130", title:"Levantamiento topográfico",      util:"Mapeo de alta densidad con precisión centimétrica mediante posicionamiento RTK y LiDAR." },
  { file:"DJI_0342", title:"Gestión medioambiental",         util:"Seguimiento de cauces, vegetación, erosión y cambios del paisaje a lo largo del tiempo." },
  { file:"DJI_0107", title:"Monitorización ganadera",        util:"Localización y seguimiento de la cabaña ganadera en pastoreo extensivo." },
  { file:"DJI_0126", title:"Gestión de recursos",            util:"Inventario y planificación de recursos hídricos, agrícolas y energéticos del territorio." },
  { file:"DJI_0346", title:"Inspección de plantas solares",  util:"Revisión de instalaciones fotovoltaicas y seguimiento de su integración en el territorio." },
];

/* Resultados de vuelos — productos generados a partir de los datos capturados */
const RESULTS = [
  { img:"assets/img/results/sa_datafusion.jpg",        cat:"Fusión de datos",       title:"Fusión RGB + Multiespectral en nube 3D" },
  { img:"assets/img/results/sa_pipeline.jpg",          cat:"Inventario · IA",       title:"Del vuelo al inventario árbol a árbol" },
  { img:"assets/img/results/sa_seg_color.jpg",         cat:"Segmentación · IA",     title:"Detección individual de copas de olivar" },
  { img:"assets/img/results/sa_sustainability_crop.jpg",cat:"Sostenibilidad",        title:"Índice de sostenibilidad por árbol" },
  { img:"assets/img/results/sa_results_map.jpg",       cat:"Cartografía",           title:"Mapa de sostenibilidad del olivar" },
  { img:"assets/img/results/sa_graphabs.jpg",          cat:"Teledetección",         title:"Inventario multisensorial de precisión" },
];
