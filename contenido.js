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
  { t: "Teledetección para observar el territorio", d: "Observación, procesamiento y fusión de imágenes de satélite, drones, radar, sensores IoT y estaciones meteorológicas para conocer el estado de los cultivos y su entorno.", img: "assets/video/olivos-cenital.mp4" },
  { t: "Modelado predictivo y simulación", d: "Inteligencia artificial para predecir escenarios de producción, riesgos climáticos y la respuesta del cultivo a distintas prácticas agrícolas.", img: "assets/video/parcelas.mp4" },
  { t: "Sistemas de apoyo a la decisión", d: "Plataformas que ayudan a agricultores y técnicos a elegir cómo manejar la finca a partir de datos geoespaciales y series temporales.", img: "assets/video/explotacion.mp4" },
  { t: "Visualización avanzada y análisis geoespacial", d: "Visualización 4D, realidad aumentada y sistemas de información geográfica para representar el estado del olivar y sus proyecciones futuras.", img: "assets/video/infraestructura.mp4" },
  { t: "Impacto ambiental y resiliencia", d: "Estudio del efecto de las prácticas agrícolas en el suelo, el agua y la biodiversidad para diseñar estrategias frente al cambio climático.", img: "assets/video/balsa.mp4" },
  { t: "Salud del suelo y servicios ecosistémicos", d: "Análisis de parámetros edáficos, biodiversidad y funciones ecológicas para regenerar el suelo, capturar carbono y equilibrar el agroecosistema.", img: "assets/video/cubierta.mp4" },
];

const PROYECTOS = [
  { t: "LivingSoiLL", img: "assets/video/olivos-cenital.jpg", d: "Healthy soil to permanent crops living labs. Lideramos el Living Lab andaluz, centrado en la salud del suelo en el olivar.", m: "Horizonte Europa, 2024–2028", a: "europa", u: "https://livingsoill.eu/" },
  { t: "SOIL O-LIVE", img: "assets/video/cubierta.jpg", d: "Biodiversidad y funcionalidad del suelo en el olivar mediterráneo y su influencia en la calidad del aceite.", m: "Horizonte Europa 101091255, 2023–2027", a: "europa" },
  { t: "Espacio de Datos Federado de Suelos", img: "assets/video/balsa.jpg", d: "Espacio de datos de suelos liderado por la Universidad de Jaén.", m: "TSI-100123-2024-72, NextGeneration EU", a: "espana", u: "https://soildataspace.es/home" },
  { t: "Digital Agriculture Technologies for Irrigation Efficiency", d: "Tecnologías digitales para mejorar la eficiencia del riego.", m: "PRIMA S2 2020, 2021–2024", a: "europa" },
  { t: "Harmonization of UAS techniques", d: "Armonización de técnicas con aeronaves no tripuladas para vigilar ecosistemas agrícolas y naturales.", m: "COST CA16219, 2017–2022", a: "europa" },
  { t: "SERGIoT", d: "Estrategia de gemelos digitales para gestionar invernaderos de forma eficiente.", m: "CPP2023-010458, 2024–2027", a: "espana" },
  { t: "Digitalización multisensorial, modelado 3D y simulación", d: "Escenario actual y futuro de entornos naturales.", m: "PID2022-137938OA-I00, 2023–2026", a: "espana" },
  { t: "Digitalización 3D de entornos rurales", d: "A partir de datos multisensoriales y multiescala.", m: "TED2021-132120B-I00, 2022–2024", a: "espana" },
  { t: "Copernicus para la auscultación de presas", d: "Vigilancia terrestre y radar satelital para medir movimientos de presas, grandes balsas y áreas adyacentes.", m: "Proyectos I+D+i 2021", a: "espana" },
  { t: "NaturEYE", d: "", m: "Programa Estatal de Retos", a: "espana" },
  { t: "RURAL-ENGINE", d: "", m: "Financiación nacional", a: "espana" },
  { t: "Informática gráfica para datos 3D y 4D", d: "Realidad virtual y aumentada aplicadas a infraestructuras urbanas y arqueología.", m: "TIN2017-84968-R, 2018–2021", a: "espana" },
  { t: "Hacia un SIG 3D del subsuelo", d: "Aportaciones para las ciudades inteligentes.", m: "TIN2014-58218-R, 2015–2018", a: "espana" },
  { t: "Predicción temprana de la cosecha del olivar", d: "Prototipo de sistema de predicción.", m: "GOPO-JA-20-0006, 2021–2024", a: "andalucia" },
  { t: "GEU", d: "Integración, procesamiento y análisis de imágenes hiperespectrales y termográficas en entornos naturales.", m: "Junta de Andalucía 1381202, 2021–2023", a: "andalucia" },
  { t: "Herramientas 3D para la red de agua en alta", d: "El caso del pantano del Rumblar.", m: "PYC20 RE 005 UJA, 2021–2023", a: "andalucia" },
  { t: "Predic I", d: "", m: "Financiación regional", a: "andalucia" },
  { t: "El olivar y su gemelo digital", d: "Hacia una digitalización integral del olivar.", m: "Diputación de Jaén, EBM/IEG 2021", a: "andalucia" },
  { t: "PDental", d: "Inteligencia artificial y geometría computacional para el ámbito clínico dental.", m: "Contrato con Medicalfit", a: "otros", u: "https://3hs.medicalfit.com/" },
  { t: "Evaluación interactiva de videojuegos", d: "Herramienta parametrizable para evaluar la jugabilidad.", m: "Innovación docente UJA, 2022–2023", a: "otros" },
];

const AMBITOS = [["todos", "Todos"], ["europa", "Europeos"], ["espana", "Nacionales"], ["andalucia", "Andaluces"], ["otros", "Otros"]];

const PUBLICACIONES = [
 {
  "a": "Elena Carmona Vallecillo, David Jurado-Rodríguez, J. R. Jiménez Pérez, Juan M. Jurado",
  "y": 2026,
  "t": "A computational pipeline for geometric reconstruction and scanbody alignment from dental CBCT data",
  "r": "Eurographics",
  "doi": "10.2312/ceig.20261000",
  "tema": "otros"
 },
 {
  "a": "Pablo Latorre-Hortelano, David Jurado-Rodríguez, Antonio Garrido Almonacid, Manuel Parras Rosa, Juan M. Jurado",
  "y": 2026,
  "t": "A multi-scale inventory for sustainable olive farming using remote sensing and data fusion",
  "r": "Smart Agricultural Technology",
  "doi": "10.1016/j.atech.2026.102230",
  "tema": "olivar"
 },
 {
  "a": "Andressa Cardoso, Patrícia Lustosa Brito, M. Isabel Ramos, Juan M. Jurado, Francisco R. Feito",
  "y": 2026,
  "t": "An open-access decision-support tool for rooftop PV potential assessment in informal settlements",
  "r": "Applied Energy",
  "doi": "10.1016/j.apenergy.2026.128302",
  "tema": "teledeteccion"
 },
 {
  "a": "David Jurado-Rodríguez, Antonio Garrido Almonacid, Francisco R. Feito, Juan M. Jurado",
  "y": 2026,
  "t": "Generation of synthetic labeled datasets for anomaly detection in heritage architecture",
  "r": "Graphical Models",
  "doi": "10.1016/j.gmod.2026.101325",
  "tema": "patrimonio"
 },
 {
  "a": "Elena Carmona Vallecillo, David Jurado-Rodríguez, J. Roberto Jiménez-Perez, Juan M. Jurado",
  "y": 2026,
  "t": "Geometric CBCT reconstruction and scanbody pose estimation for automated dental implant planning",
  "r": "Graphical Models",
  "doi": "10.1016/j.gmod.2026.101342",
  "tema": "otros"
 },
 {
  "a": "Nathalie Guimarães, Hélder Fraga, André Fonseca, Fernando António Leal Pacheco, Luís Filipe Sanches Fernandes, João Paulo Moura et al.",
  "y": 2026,
  "t": "High-Resolution Soil Surface Moisture Projections for European Perennial Crops: A Machine Learning Framework Integrating Sentinel-1 and CMIP6 Climate Scenarios",
  "r": "Remote Sensing",
  "doi": "10.3390/rs18121902",
  "tema": "olivar"
 },
 {
  "a": "Antonio Miguel Ruiz-Armenteros, Miguel Marchamalo, Francisco Lamas‐Fernández, Álvaro Hernández-Cabezudo, Alfredo Fernández-Landa, José Manuel Delgado Blasco et al.",
  "y": 2025,
  "t": "Integrated monitoring of dams and large ponds: the role of satellite radar interferometry and the European ground motion service",
  "r": "Applied Geomatics",
  "doi": "10.1007/s12518-025-00624-8",
  "tema": "teledeteccion"
 },
 {
  "a": "Andressa Cardoso, David Jurado-Rodríguez, Alfonso López, M. Isabel Ramos, Juan M. Jurado",
  "y": 2024,
  "t": "Automated detection and tracking of photovoltaic modules from 3D remote sensing data",
  "r": "Applied Energy",
  "doi": "10.1016/j.apenergy.2024.123242",
  "tema": "teledeteccion"
 },
 {
  "a": "Jesús Moreno, Alfonso López, J. Roberto Jiménez-Perez, José Enrique Callejas-Aguilera, Juan M. Jurado",
  "y": 2024,
  "t": "Eye-tracking on virtual reality: a survey",
  "r": "Virtual Reality",
  "doi": "10.1007/s10055-023-00903-y",
  "tema": "otros"
 },
 {
  "a": "Carolina Collaro, Carmen Enríquez-Muñoz, Alfonso López, Carlos Enríquez Turiño, Juan M. Jurado",
  "y": 2023,
  "t": "Detection of landscape features with visible and thermal imaging at the Castle of Puerta Arenas",
  "r": "Archaeological and Anthropological Sciences",
  "doi": "10.1007/s12520-023-01831-3",
  "tema": "patrimonio"
 },
 {
  "a": "Alfonso López, Carlos J. Ogáyar, Juan M. Jurado, Francisco R. Feito",
  "y": 2023,
  "t": "Efficient generation of occlusion-aware multispectral and thermographic point clouds",
  "r": "Computers and Electronics in Agriculture",
  "doi": "10.1016/j.compag.2023.107712",
  "tema": "olivar"
 },
 {
  "a": "Alfonso López, Juan M. Jurado, Antonio Garrido Almonacid, Ramón Lopez, Ana I. López, Francisco R. Feito",
  "y": 2022,
  "t": "3D tools for building and infrastructures inspection from thermal UAS data: first steps",
  "r": "Procedia Structural Integrity",
  "doi": "10.1016/j.prostr.2022.12.143",
  "tema": "teledeteccion"
 },
 {
  "a": "Alfonso López, Carlos J. Ogáyar, Juan M. Jurado, Francisco R. Feito",
  "y": 2022,
  "t": "A GPU-Accelerated Framework for Simulating LiDAR Scanning",
  "r": "IEEE Transactions on Geoscience and Remote Sensing",
  "doi": "10.1109/tgrs.2022.3165746",
  "tema": "teledeteccion"
 },
 {
  "a": "Juan José Cubillas, M. Isabel Ramos, Juan M. Jurado, Francisco R. Feito",
  "y": 2022,
  "t": "A Machine Learning Model for Early Prediction of Crop Yield, Nested in a Web Application in the Cloud: A Case Study in an Olive Grove in Southern Spain",
  "r": "Agriculture",
  "doi": "10.3390/agriculture12091345",
  "tema": "olivar"
 },
 {
  "a": "Juan M. Jurado, Emilio J. Padrón, J. Roberto Jiménez-Perez, Lidia Ortega",
  "y": 2022,
  "t": "An out-of-core method for GPU image mapping on large 3D scenarios of the real world",
  "r": "Future Generation Computer Systems",
  "doi": "10.1016/j.future.2022.03.022",
  "tema": "teledeteccion"
 },
 {
  "a": "Alfonso López, Juan M. Jurado, J. Roberto Jiménez-Perez, Francisco R. Feito",
  "y": 2022,
  "t": "Generation of hyperspectral point clouds: Mapping, compression and rendering",
  "r": "Computers & Graphics",
  "doi": "10.1016/j.cag.2022.06.011",
  "tema": "teledeteccion"
 },
 {
  "a": "Lidia Ortega, A. García, Francisco Conde-Rodríguez, Juan M. Jurado",
  "y": 2022,
  "t": "Integrated and interactive 4D system for archaeological stratigraphy",
  "r": "Archaeological and Anthropological Sciences",
  "doi": "10.1007/s12520-022-01667-3",
  "tema": "patrimonio"
 },
 {
  "a": "Alfonso López, Carlos J. Ogáyar, Juan M. Jurado, Francisco R. Feito",
  "y": 2022,
  "t": "Metaheuristics for the optimization of Terrestrial LiDAR set-up",
  "r": "Automation in Construction",
  "doi": "10.1016/j.autcon.2022.104675",
  "tema": "teledeteccion"
 },
 {
  "a": "José L. Cárdenas, Carlos J. Ogáyar, Francisco R. Feito, Juan M. Jurado",
  "y": 2022,
  "t": "Modeling of the 3D Tree Skeleton Using Real-World Data: A Survey",
  "r": "IEEE Transactions on Visualization and Computer Graphics",
  "doi": "10.1109/tvcg.2022.3193018",
  "tema": "teledeteccion"
 },
 {
  "a": "José L. Cárdenas, Alfonso López, Carlos J. Ogáyar, Francisco R. Feito, Juan M. Jurado",
  "y": 2022,
  "t": "Reconstruction of tree branching structures from UAV-LiDAR data",
  "r": "Frontiers in Environmental Science",
  "doi": "10.3389/fenvs.2022.960083",
  "tema": "teledeteccion"
 },
 {
  "a": "Juan M. Jurado, Alfonso López, Luís Pádua, Joaquim J. Sousa",
  "y": 2022,
  "t": "Remote sensing image fusion on 3D scenarios: A review of applications for agriculture and forestry",
  "r": "International Journal of Applied Earth Observation and Geoinformation",
  "doi": "10.1016/j.jag.2022.102856",
  "tema": "olivar"
 },
 {
  "a": "David Jurado-Rodríguez, Juan M. Jurado, Luís Pádua, Alexandre Neto, Rafael Muñoz‐Salinas, Joaquim J. Sousa",
  "y": 2022,
  "t": "Semantic segmentation of 3D car parts using UAV-based images",
  "r": "Computers & Graphics",
  "doi": "10.1016/j.cag.2022.07.008",
  "tema": "otros"
 },
 {
  "a": "Francisco Arias de Haro, Carlos Enríquez Turiño, Juan M. Jurado, Lidia Ortega, Antonio Romero-Manchado, Juan José Cubillas",
  "y": 2022,
  "t": "Use of 3D models as a didactic resource in archaeology. A case study analysis",
  "r": "Heritage Science",
  "doi": "10.1186/s40494-022-00738-x",
  "tema": "patrimonio"
 }
];

const TEMAS = [["todos", "Todas"], ["olivar", "Olivar y agricultura"], ["teledeteccion", "Teledetección y 3D"], ["patrimonio", "Patrimonio"], ["otros", "Otras"]];

const PERSONAS = [
  { n: "Juan Manuel Jurado Rodríguez", f: "assets/equipo/juan-manuel-jurado.webp", c: "Responsable de la unidad", d: true },
  { n: "Julio Antonio Calero González" }, { n: "Andressa De Sousa Cardoso" }, { n: "Juan José Cubillas Mercado" },
  { n: "Luis René Domínguez Fuentes", f: "assets/equipo/luis-rene-dominguez.webp" }, { n: "Carlos Enríquez Turiño" }, { n: "Francisco Ramón Feito Higueruela" },
  { n: "Juan Roberto Jiménez Pérez" }, { n: "David Jurado Rodríguez", f: "assets/equipo/david-jurado.webp" },
  { n: "Pablo Latorre Hortelano", f: "assets/equipo/pablo-latorre.webp" }, { n: "Juan Manuel Martín García", f: "assets/equipo/juan-manuel-martin.webp" }, { n: "Lidia Ortega Alvarado" },
  { n: "Gema Parra Cabrera", f: "assets/equipo/gema-parra.webp" }, { n: "Francisco Daniel Pérez Cano", f: "assets/equipo/francisco-daniel-perez.webp" }, { n: "María Isabel Ramos Galán" },
  { n: "Antonio Miguel Ruiz Armenteros" },
  { n: "Sinia Belamri", c: "Doctoranda" }, { n: "Nelly Chávez Rincón", c: "Doctoranda" },
  { n: "Gloria Paterna Sánchez", f: "assets/equipo/gloria-paterna.webp", c: "Gestión de proyectos" },
];

const SOFTWARE = [
  { n: "Agisoft Metashape", c: "Fotogrametría", d: "Procesado fotogramétrico y nubes de puntos densas.", u: "https://www.agisoft.com" },
  { n: "Pix4D", c: "Fotogrametría", d: "Ortomosaicos y modelos a partir de imágenes.", u: "https://www.pix4d.com" },
  { n: "UgCS", c: "Planificación", d: "Diseño y ejecución de planes de vuelo automatizados.", u: "https://www.sphengineering.com/flight-planning/ugcs" },
  { n: "ArcGIS", c: "SIG", d: "Sistema de información geográfica y análisis espacial.", u: "https://www.arcgis.com" },
  { n: "SpatialExplorer", c: "LiDAR", d: "Procesado de datos LiDAR e hiperespectrales.", u: "https://www.phoenixlidar.com" },
  { n: "HyperSpec III", c: "Hiperespectral", d: "Procesado de imagen hiperespectral.", u: "https://headwallphotonics.com" },
  { n: "NVI", c: "Análisis", d: "Cálculo de índices de vegetación como NDVI y NDRE." },
];

const VUELOS = [
  { f: "DJI_0251", t: "Agricultura de precisión" },
  { f: "DJI_0130", t: "Levantamiento topográfico" },
  { f: "DJI_0024", t: "Generación de modelos 3D" },
  { f: "DJI_0342", t: "Gestión medioambiental" },
  { f: "DJI_0126", t: "Gestión de recursos" },
  { f: "DJI_0346", t: "Plantas solares" },
  { f: "DJI_0028", t: "Inspección de infraestructuras" },
  { f: "DJI_0166", t: "Conservación del patrimonio" },
  { f: "DJI_0107", t: "Monitorización ganadera" },
];
