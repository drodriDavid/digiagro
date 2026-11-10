/* Contenido editable de la web. Para añadir un proyecto, publicación o persona basta con añadir una línea. */

const SERVICIOS = [
  { t: "Agricultura de precisión", d: "Soluciones digitales para el olivar y asesoramiento para digitalizar explotaciones.", i: "M12 3v18M12 8c-3-3-6-3-8-2 0 4 3 6 8 6M12 12c3-3 6-3 8-2 0 4-3 6-8 6" },
  { t: "Monitorización remota", d: "Sistemas de seguimiento desplegados en campo y en almazaras.", i: "M5 12a7 7 0 0 1 14 0M8.5 12a3.5 3.5 0 0 1 7 0M12 12v9" },
  { t: "Gemelos digitales", d: "Réplicas de explotaciones oleícolas para simular y planificar.", i: "M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 12l8-4.5M12 12v9M12 12L4 7.5" },
  { t: "Formación especializada", d: "Capacitación en herramientas digitales aplicadas a la agricultura.", i: "M3 9l9-5 9 5-9 5-9-5zM7 11.5V16c3 2.5 7 2.5 10 0v-4.5" },
  { t: "Sostenibilidad", d: "Evaluación y diseño de estrategias de resiliencia agroambiental.", i: "M4 19c0-9 6-15 16-15 0 10-6 16-15 16M4 20c3-6 6-9 11-12" },
  { t: "Salud del suelo", d: "Diagnóstico de erosión, biodiversidad, estructura y retención de agua.", i: "M3 8h18M3 13c3-2 6 2 9 0s6 2 9 0M3 18c3-2 6 2 9 0s6 2 9 0M12 8V3" },
];

const LINEAS = [
  { t: "Teledetección para observar el territorio", d: "Observación, procesamiento y fusión de imágenes de satélite, drones, radar, sensores IoT y estaciones meteorológicas para conocer el estado de los cultivos y su entorno.", img: "assets/img/nube-olivar.jpg" },
  { t: "Modelado predictivo y simulación", d: "Inteligencia artificial para predecir escenarios de producción, riesgos climáticos y la respuesta del cultivo a distintas prácticas agrícolas.", img: "assets/img/ndvi.jpg" },
  { t: "Sistemas de apoyo a la decisión", d: "Plataformas que ayudan a agricultores y técnicos a elegir cómo manejar la finca a partir de datos geoespaciales y series temporales.", img: "assets/img/mapa.jpg" },
  { t: "Visualización avanzada y análisis geoespacial", d: "Visualización 4D, realidad aumentada y sistemas de información geográfica para representar el estado del olivar y sus proyecciones futuras.", img: "assets/img/multiespectral.jpg" },
  { t: "Impacto ambiental y resiliencia", d: "Estudio del efecto de las prácticas agrícolas en el suelo, el agua y la biodiversidad para diseñar estrategias frente al cambio climático.", img: "assets/img/mds.jpg" },
  { t: "Salud del suelo y servicios ecosistémicos", d: "Análisis de parámetros edáficos, biodiversidad y funciones ecológicas para regenerar el suelo, capturar carbono y equilibrar el agroecosistema.", img: "assets/video/f-erosion.jpg" },
];

const PROYECTOS = [
  { t: "LivingSoiLL", d: "Living Lab andaluz sobre salud del suelo en el olivar, dentro de la Misión Suelo de la Unión Europea.", m: "HORIZON-MISS-2023-SOIL-01-01", a: "europa", u: "https://livingsoill.eu/" },
  { t: "SOIL O-LIVE", d: "Suelos sanos en el olivar mediterráneo.", m: "2023–2027", a: "europa" },
  { t: "Digital Agriculture Technologies for Irrigation Efficiency", d: "Tecnologías digitales para mejorar la eficiencia del riego.", m: "PRIMA S2 2020, 2021–2024", a: "europa" },
  { t: "Harmonization of UAS techniques", d: "Armonización de técnicas con aeronaves no tripuladas para vigilar ecosistemas agrícolas y naturales.", m: "COST CA16219, 2017–2022", a: "europa" },
  { t: "Espacio de Datos Federado de Suelos", d: "Espacio de datos de suelos liderado por la Universidad de Jaén.", m: "TSI-100123-2024-72", a: "espana", u: "https://soildataspace.es/home" },
  { t: "SERGIoT", d: "Estrategia de gemelos digitales para gestionar invernaderos de forma eficiente.", m: "CPP2023-010458", a: "espana" },
  { t: "Digitalización multisensorial y modelado 3D", d: "Simulación del escenario actual y futuro de entornos naturales.", m: "PID2022-137938OA-I00", a: "espana" },
  { t: "El olivar y su gemelo digital", d: "Hacia una digitalización integral del olivar.", m: "Diputación de Jaén, 2021", a: "andalucia" },
  { t: "Predicción temprana de la cosecha del olivar", d: "Prototipo de sistema de predicción.", m: "GOPO-JA-20-0006", a: "andalucia" },
  { t: "GEU", d: "Integración, procesamiento y análisis de imágenes hiperespectrales y termográficas en entornos naturales.", m: "Inicio de la línea multisensor", a: "otros" },
];

const AMBITOS = [["todos", "Todos"], ["europa", "Europeos"], ["espana", "Nacionales"], ["andalucia", "Andaluces"]];

const PUBLICACIONES = [
  { a: "Latorre-Hortelano, P., Jurado-Rodríguez, D., Garrido Almonacid, A., Parras Rosa, M., Jurado, J. M.", y: 2026, t: "A multi-scale inventory for sustainable olive farming using remote sensing and data fusion", r: "Smart Agricultural Technology", doi: "10.1016/j.atech.2026.102230" },
  { a: "Guimarães, N., Fraga, H., Fonseca, A., et al.", y: 2026, t: "High-resolution soil surface moisture projections for European perennial crops", r: "Remote Sensing", doi: "10.3390/rs18121902" },
  { a: "López, A., Ogáyar, C. J., Jurado, J. M., Feito, F. R.", y: 2023, t: "Efficient generation of occlusion-aware multispectral and thermographic point clouds", r: "Computers and Electronics in Agriculture", doi: "10.1016/j.compag.2023.107712" },
  { a: "Cubillas, J. J., Ramos, M. I., Jurado, J. M., Feito, F. R.", y: 2022, t: "A machine learning model for early prediction of crop yield, nested in a web application in the cloud: a case study in an olive grove in southern Spain", r: "Agriculture", doi: "10.3390/agriculture12091345" },
  { a: "Jurado, J. M., López, A., Pádua, L., Sousa, J. J.", y: 2022, t: "Remote sensing image fusion on 3D scenarios: a review of applications for agriculture and forestry", r: "International Journal of Applied Earth Observation and Geoinformation", doi: "10.1016/j.jag.2022.102856" },
  { a: "López, A., Jurado, J. M., Jiménez-Pérez, J. R., Feito, F. R.", y: 2022, t: "Generation of hyperspectral point clouds: mapping, compression and rendering", r: "Computers & Graphics", doi: "10.1016/j.cag.2022.06.011" },
  { a: "Cárdenas, J. L., López, A., Ogáyar, C. J., Feito, F. R., Jurado, J. M.", y: 2022, t: "Reconstruction of tree branching structures from UAV-LiDAR data", r: "Frontiers in Environmental Science", doi: "10.3389/fenvs.2022.960083" },
  { a: "López, A., Ogáyar, C. J., Jurado, J. M., Feito, F. R.", y: 2022, t: "A GPU-accelerated framework for simulating LiDAR scanning", r: "IEEE Transactions on Geoscience and Remote Sensing", doi: "10.1109/tgrs.2022.3165746" },
];

const PERSONAS = [
  { n: "Juan Manuel Jurado Rodríguez", c: "Responsable de la unidad", d: true },
  { n: "Julio Antonio Calero González" }, { n: "Andressa De Sousa Cardoso" }, { n: "Juan José Cubillas Mercado" },
  { n: "Luis René Domínguez Fuentes" }, { n: "Carlos Enríquez Turiño" }, { n: "Francisco Ramón Feito Higueruela" },
  { n: "Juan Roberto Jiménez Pérez" }, { n: "David Jurado Rodríguez" }, { n: "Pablo Latorre Hortelano" },
  { n: "Juan Manuel Martín García" }, { n: "Lidia Ortega Alvarado" }, { n: "Gema Parra Cabrera" },
  { n: "Francisco Daniel Pérez Cano" }, { n: "María Isabel Ramos Galán" }, { n: "Antonio Miguel Ruiz Armenteros" },
  { n: "Gloria Paterna Sánchez", c: "Gestión de proyectos" },
];

const VUELOS = [
  { f: "DJI_0251", t: "Agricultura de precisión" },
  { f: "DJI_0024", t: "Generación de modelos 3D" },
  { f: "DJI_0130", t: "Levantamiento topográfico" },
  { f: "DJI_0342", t: "Gestión medioambiental" },
  { f: "DJI_0126", t: "Gestión de recursos" },
  { f: "DJI_0107", t: "Monitorización ganadera" },
];
