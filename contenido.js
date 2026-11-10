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
  { t: "Teledetección para observar el territorio", d: "Observación, procesamiento y fusión de imágenes de satélite, drones, radar, sensores IoT y estaciones meteorológicas para conocer el estado de los cultivos y su entorno.", img: "assets/lineas/teledeteccion.webp" },
  { t: "Modelado predictivo y simulación", d: "Inteligencia artificial para predecir escenarios de producción, riesgos climáticos y la respuesta del cultivo a distintas prácticas agrícolas.", img: "assets/lineas/modelado.webp" },
  { t: "Sistemas de apoyo a la decisión", d: "Plataformas que ayudan a agricultores y técnicos a elegir cómo manejar la finca a partir de datos geoespaciales y series temporales.", img: "assets/lineas/decision.webp" },
  { t: "Visualización avanzada y análisis geoespacial", d: "Visualización 4D, realidad aumentada y sistemas de información geográfica para representar el estado del olivar y sus proyecciones futuras.", img: "assets/lineas/visualizacion.webp" },
  { t: "Impacto ambiental y resiliencia", d: "Estudio del efecto de las prácticas agrícolas en el suelo, el agua y la biodiversidad para diseñar estrategias frente al cambio climático.", img: "assets/lineas/impacto.webp" },
  { t: "Salud del suelo y servicios ecosistémicos", d: "Análisis de parámetros edáficos, biodiversidad y funciones ecológicas para regenerar el suelo, capturar carbono y equilibrar el agroecosistema.", img: "assets/lineas/suelo.webp" },
];

const PROYECTOS = [
  { t: "LivingSoiLL", img: "assets/video/olivos-cenital.jpg", d: "Healthy soil to permanent crops living labs. Lideramos el Living Lab andaluz, centrado en la salud del suelo en el olivar.", m: "Horizonte Europa, 2024–2028", a: "europa", u: "https://livingsoill.eu/" },
  { t: "SOIL O-LIVE", img: "assets/video/cubierta.jpg", d: "Biodiversidad y funcionalidad del suelo en el olivar mediterráneo y su influencia en la calidad del aceite.", m: "Horizonte Europa 101091255, 2023–2027", a: "europa", u: "https://soilolive.eu/" },
  { t: "Soil DataSpace", img: "assets/video/balsa.jpg", d: "Espacio de Datos Federado de Suelos, liderado por la Universidad de Jaén.", m: "TSI-100123-2024-72, NextGeneration EU", a: "espana", u: "https://soildataspace.es/home" },
  { t: "Digital Agriculture Technologies for Irrigation Efficiency", d: "Tecnologías digitales para mejorar la eficiencia del riego.", m: "PRIMA S2 2020, 2021–2024", a: "europa" },
  { t: "Harmonization of UAS techniques", d: "Armonización de técnicas con aeronaves no tripuladas para vigilar ecosistemas agrícolas y naturales.", m: "COST CA16219, 2017–2022", a: "europa", u: "https://www.cost.eu/actions/CA16219/" },
  { t: "SERGIoT", d: "Estrategia de gemelos digitales para gestionar invernaderos de forma eficiente.", m: "CPP2023-010458, 2024–2027", a: "espana" },
  { t: "Digitalización 3D de entornos rurales", d: "A partir de datos multisensoriales y multiescala.", m: "TED2021-132120B-I00, 2022–2024", a: "espana" },
  { t: "Digitalización multisensorial, modelado 3D y simulación", d: "Escenario actual y futuro de entornos naturales.", m: "PID2022-137938OA-I00, 2023–2026", a: "espana" },
  { t: "Predicción temprana de la cosecha del olivar", d: "Prototipo de sistema de predicción.", m: "GOPO-JA-20-0006, 2021–2024", a: "andalucia" },
  { t: "El olivar y su gemelo digital", d: "Hacia una digitalización integral del olivar.", m: "Diputación de Jaén, EBM/IEG 2021", a: "andalucia" },
  { t: "GEU", d: "Integración, procesamiento y análisis de imágenes hiperespectrales y termográficas en entornos naturales.", m: "Junta de Andalucía 1381202, 2021–2023", a: "andalucia" },
];

const AMBITOS = [["todos", "Todos"], ["europa", "Europeos"], ["espana", "Nacionales"], ["andalucia", "Andaluces"]];

const PUBLICACIONES = [
 {
  "a": "Pablo Latorre-Hortelano, David Jurado-Rodríguez, Antonio Garrido Almonacid, Manuel Parras Rosa, Juan M. Jurado",
  "y": 2026,
  "t": "A multi-scale inventory for sustainable olive farming using remote sensing and data fusion",
  "r": "Smart Agricultural Technology",
  "doi": "10.1016/j.atech.2026.102230"
 },
 {
  "a": "Antonio J. Manzaneda, Tassos C. Kyriakides, Panos Panagos, Artemi Cerdà, Julio Calero, Blanca B. Landa et al.",
  "y": 2026,
  "t": "Building Climate-Resilient Mediterranean Olive Systems: Integrating Soil, Water, Carbon, Biodiversity, and Innovation for a Sustainable Future",
  "r": "npj Sustainable Agriculture",
  "doi": "10.1038/s44264-026-00183-4"
 },
 {
  "a": "Juan José Cubillas, M. Isabel Ramos, Ortega Alvarado María Lidia, Ruth M. Córdoba",
  "y": 2026,
  "t": "Evolutionary forecast of vineyard yield in a mediterranean climate: A multi-temporal machine learning approach in Cádiz, Spain",
  "r": "Precision Agriculture",
  "doi": "10.1007/s11119-026-10369-y"
 },
 {
  "a": "Nathalie Guimarães, Hélder Fraga, André Fonseca, Fernando António Leal Pacheco, Luís Filipe Sanches Fernandes, João Paulo Moura et al.",
  "y": 2026,
  "t": "High-Resolution Soil Surface Moisture Projections for European Perennial Crops: A Machine Learning Framework Integrating Sentinel-1 and CMIP6 Climate Scenarios",
  "r": "Remote Sensing",
  "doi": "10.3390/rs18121902"
 },
 {
  "a": "Víctor Valenzuela-Polo, Victoria Ochoa, Julio Calero, María Caridad Peñafiel‐Suarez, Vasileios Gkisakis, Ioanna Michail et al.",
  "y": 2026,
  "t": "Soil Organic Carbon Stocks and Saturation Deficit in Mediterranean Olive Groves: Effects of Intensification and Management Practices",
  "r": "European Journal of Soil Science",
  "doi": "10.1111/ejss.70414"
 },
 {
  "a": "Gema Parra, Diana Carrión-Santos, Patricio Bohorquez, Roberto García‐Ruiz",
  "y": 2026,
  "t": "Sustainable management of agricultural landscapes: lessons from participatory multicriteria decision-making processes",
  "r": "Environmental and Sustainability Indicators",
  "doi": "10.1016/j.indic.2026.101508"
 },
 {
  "a": "Ruth M. Córdoba-Ortega, Lidia Ortega, Juan José Cubillas, M. Isabel Ramos",
  "y": 2026,
  "t": "Towards a Digital Twin for Olive Orchards: A Modular Framework Based on Multi-Scale Integration and Predictive AI Capabilities",
  "r": "AgriEngineering",
  "doi": "10.3390/agriengineering8080303"
 },
 {
  "a": "Gustavo Ruiz-Cátedra, Julio Calero, Pablo Domouso, Roberto García‐Ruiz",
  "y": 2025,
  "t": "Do management practices which enhance nature-based processes improve soil health in olive groves?",
  "r": "Geoderma",
  "doi": "10.1016/j.geoderma.2025.117276"
 },
 {
  "a": "M. Isabel Ramos, Juan José Cubillas, Ruth M. Córdoba, Lidia Ortega",
  "y": 2025,
  "t": "Improving early prediction of crop yield in Spanish olive groves using satellite imagery and machine learning",
  "r": "PLoS ONE",
  "doi": "10.1371/journal.pone.0311530"
 },
 {
  "a": "M. Isabel Ramos, Juan José Cubillas, Ruth M. Córdoba, Lidia Ortega",
  "y": 2025,
  "t": "Olive oil price prediction with machine learning algorithms",
  "r": "New Medit",
  "doi": "10.30682/nm2505f"
 },
 {
  "a": "Fadoua Elhaddad, Hechmi Chehab, Julio Antonio Calero González, Abdelhamid Sifiane, Roberto García‐Ruiz",
  "y": 2024,
  "t": "Alternative Cover Crops and Soil Management Practices Modified the Macronutrients, Enzymes Activities, and Soil Microbial Diversity of Rainfed Olive Orchards (cv. Chetoui) under Mediterranean Conditions in Tunisia",
  "r": "Sustainability",
  "doi": "10.3390/su16135329"
 },
 {
  "a": "Pablo Domouso, Evangelina Pareja‐Sánchez, Julio Calero, Roberto García‐Ruiz",
  "y": 2024,
  "t": "Carbon and Nitrogen Mineralization of Common Organic Amendments in Olive Grove Soils",
  "r": "Agriculture",
  "doi": "10.3390/agriculture14111923"
 },
 {
  "a": "Evangelina Pareja‐Sánchez, Julio Calero, Roberto García‐Ruiz",
  "y": 2024,
  "t": "Does spontaneous cover crop increase the stocks of soil organic carbon and nitrogen in commercial olive orchard?",
  "r": "Soil and Tillage Research",
  "doi": "10.1016/j.still.2024.106237"
 },
 {
  "a": "Pablo Domouso, Julio Calero, Gustavo Ruiz-Cátedra, Roberto García‐Ruiz",
  "y": 2024,
  "t": "Nitrogen recycling across a spectrum of fertilization strategies: an assessment in olive groves",
  "r": "Agriculture Ecosystems & Environment",
  "doi": "10.1016/j.agee.2024.109096"
 },
 {
  "a": "Milagros Torrús-Castillo, Julio Calero, Roberto García‐Ruiz",
  "y": 2023,
  "t": "Does olive cultivation sequester carbon?: Carbon balance along a C input gradient",
  "r": "Agriculture Ecosystems & Environment",
  "doi": "10.1016/j.agee.2023.108707"
 },
 {
  "a": "Alfonso López, Carlos J. Ogáyar, Juan M. Jurado, Francisco R. Feito",
  "y": 2023,
  "t": "Efficient generation of occlusion-aware multispectral and thermographic point clouds",
  "r": "Computers and Electronics in Agriculture",
  "doi": "10.1016/j.compag.2023.107712"
 },
 {
  "a": "Antonio Tomás Mozas‐Calvache, Julio Calero, Theo Guerra Dug, Tomás Fernández",
  "y": 2023,
  "t": "Methodology for Determining Gully Widths in Multi-Temporal Studies in Olive Groves of Southern Spain",
  "r": "Land",
  "doi": "10.3390/land12061161"
 },
 {
  "a": "Patricio Bohorquez, Francisco José Pérez-Latorre, Inmaculada González-Planet, Raquel Jiménez‐Melero, Gema Parra",
  "y": 2023,
  "t": "Nature-Based Solutions for Flood Mitigation and Soil Conservation in a Steep-Slope Olive-Orchard Catchment (Arquillos, SE Spain)",
  "r": "Applied Sciences",
  "doi": "10.3390/app13052882"
 },
 {
  "a": "Juan José Cubillas, M. Isabel Ramos, Juan M. Jurado, Francisco R. Feito",
  "y": 2022,
  "t": "A Machine Learning Model for Early Prediction of Crop Yield, Nested in a Web Application in the Cloud: A Case Study in an Olive Grove in Southern Spain",
  "r": "Agriculture",
  "doi": "10.3390/agriculture12091345"
 },
 {
  "a": "Milagros Torrús-Castillo, Pablo Domouso, José M. Herrera-Rodríguez, Julio Calero, Roberto García‐Ruiz",
  "y": 2022,
  "t": "Aboveground Carbon Fixation and Nutrient Retention in Temporary Spontaneous Cover Crops in Olive Groves of Andalusia",
  "r": "Frontiers in Environmental Science",
  "doi": "10.3389/fenvs.2022.868410"
 },
 {
  "a": "Julio Calero, I. Plaza, A. Ontiveros‐Ortega, Víctor Aranda, Roberto García‐Ruiz",
  "y": 2022,
  "t": "Effects of Organic Agriculture in Structure and Organic Carbon Adsorption at Colloidal Scale in Marginal Olive Groves, Characterized by the Extended DLVO Model",
  "r": "Frontiers in Environmental Science",
  "doi": "10.3389/fenvs.2022.805668"
 },
 {
  "a": "Gema Parra, Luis Joaquín García López, Jose Antonio Piqueras, Roberto García‐Ruiz",
  "y": 2022,
  "t": "Identification of Farmers’ Barriers to Implement Sustainable Management Practices in Olive Groves",
  "r": "Sustainability",
  "doi": "10.3390/su14116451"
 },
 {
  "a": "Juan M. Jurado, Alfonso López, Luís Pádua, Joaquim J. Sousa",
  "y": 2022,
  "t": "Remote sensing image fusion on 3D scenarios: A review of applications for agriculture and forestry",
  "r": "International Journal of Applied Earth Observation and Geoinformation",
  "doi": "10.1016/j.jag.2022.102856"
 },
 {
  "a": "Julio Calero, Roberto García‐Ruiz, Milagros Torrús-Castillo, José Luis Vicente‐Vicente, Juan Manuel Martín‐García",
  "y": 2022,
  "t": "Role of Clay Mineralogy in the Stabilization of Soil Organic Carbon in Olive Groves under Contrasted Soil Management",
  "r": "Minerals",
  "doi": "10.3390/min13010060"
 },
 {
  "a": "Alfonso López, Juan M. Jurado, Carlos J. Ogáyar, Francisco R. Feito",
  "y": 2021,
  "t": "A framework for registering UAV-based imagery for crop-tracking in Precision Agriculture",
  "r": "International Journal of Applied Earth Observation and Geoinformation",
  "doi": "10.1016/j.jag.2020.102274"
 },
 {
  "a": "Tomás Fernández, José Miguel Gómez‐López, José Luís Pérez, J. Cardenal, Jorge Delgado García, E. Mata et al.",
  "y": 2020,
  "t": "ANALYSIS OF GULLY EROSION IN A CATCHMENT AREA IN OLIVE GROVES USING UAS PHOTOGRAMMETRY TECHNIQUES",
  "r": "The international archives of the photogrammetry, remote sensing and spatial information sciences/International archives of the photogrammetry, remote sensing and spatial information sciences",
  "doi": "10.5194/isprs-archives-xliii-b2-2020-1057-2020"
 },
 {
  "a": "Tomás Fernández, José Miguel Gómez‐López, José Luís Pérez, J. Cardenal, Jorge Delgado García, J. Tovar‐Pescador et al.",
  "y": 2020,
  "t": "ANALYSIS OF THE EVOLUTION OF GULLY EROSION IN OLIVE GROVES USING PHOTOGRAMMETRY TECHNIQUES. RELATIONSHIPS WITH RAINFALL REGIME",
  "r": "ISPRS annals of the photogrammetry, remote sensing and spatial information sciences",
  "doi": "10.5194/isprs-annals-vi-3-w1-2020-19-2020"
 },
 {
  "a": "Ma Selmira Garrido, M. Isabel Ramos, Maria Clara de Lacy, Sergio Blanca, Antonio J. Gil",
  "y": 2020,
  "t": "Is GNSS real-time positioning a reliable option to validate erosion studies at olive grove environments?",
  "r": "Spanish Journal of Agricultural Research",
  "doi": "10.5424/sjar/2020182-15752"
 },
 {
  "a": "Juan M. Jurado, Lidia Ortega, Juan José Cubillas, Francisco R. Feito",
  "y": 2020,
  "t": "Multispectral Mapping on 3D Models and Multi-Temporal Monitoring for Individual Characterization of Olive Trees",
  "r": "Remote Sensing",
  "doi": "10.3390/rs12071106"
 },
 {
  "a": "Tomás Fernández, José Luís Pérez, José Miguel Gómez‐López, J. Cardenal, Julio Calero, Mario Sánchez‐Gómez et al.",
  "y": 2020,
  "t": "Multitemporal Analysis of Gully Erosion in Olive Groves by Means of Digital Elevation Models Obtained with Aerial Photogrammetric and LiDAR Data",
  "r": "ISPRS International Journal of Geo-Information",
  "doi": "10.3390/ijgi9040260"
 },
 {
  "a": "Alfonso López, Juan M. Jurado, Carlos J. Ogáyar, Francisco R. Feito Higueruela",
  "y": 2019,
  "t": "Multispectral Registration, Undistortion and Tree Detection for Precision Agriculture",
  "r": "Eurographics",
  "doi": "10.2312/ceig.20191209"
 },
 {
  "a": "Julio Calero, Víctor Aranda, Arturo Montejo‐Ráez, Juan Manuel Martín‐García",
  "y": 2018,
  "t": "A new soil quality index based on morpho-pedological indicators as a site-specific web service applied to olive groves in the Province of Jaen (South Spain)",
  "r": "Computers and Electronics in Agriculture",
  "doi": "10.1016/j.compag.2018.01.016"
 },
 {
  "a": "Ma Selmira Garrido, Maria Clara de Lacy, M. Isabel Ramos, M.J. Borque, M. Susi",
  "y": 2018,
  "t": "Assessing the accuracy of NRTK altimetric positioning for precision agriculture: test results in an olive grove environment in Southeast Spain",
  "r": "Precision Agriculture",
  "doi": "10.1007/s11119-018-9591-4"
 }
];

const PERSONAS = [
  { n: "Juan Manuel Jurado Rodríguez", f: "assets/equipo/juan-manuel-jurado.webp", c: "Responsable de la unidad", d: true },
  { n: "Julio Antonio Calero González", f: "assets/equipo/julio-calero.webp" }, { n: "Andressa De Sousa Cardoso" }, { n: "Juan José Cubillas Mercado" },
  { n: "Luis René Domínguez Fuentes", f: "assets/equipo/luis-rene-dominguez.webp" }, { n: "Carlos Enríquez Turiño" }, { n: "Francisco Ramón Feito Higueruela", f: "assets/equipo/francisco-feito.webp" },
  { n: "Juan Roberto Jiménez Pérez", f: "assets/equipo/juan-roberto-jimenez.webp" }, { n: "David Jurado Rodríguez", f: "assets/equipo/david-jurado.webp" },
  { n: "Pablo Latorre Hortelano", f: "assets/equipo/pablo-latorre.webp" }, { n: "Juan Manuel Martín García", f: "assets/equipo/juan-manuel-martin.webp" }, { n: "Lidia Ortega Alvarado", f: "assets/equipo/lidia-ortega.webp" },
  { n: "Gema Parra Cabrera", f: "assets/equipo/gema-parra.webp" }, { n: "Francisco Daniel Pérez Cano", f: "assets/equipo/francisco-daniel-perez.webp" }, { n: "María Isabel Ramos Galán", f: "assets/equipo/maria-isabel-ramos.webp" },
  { n: "Antonio Miguel Ruiz Armenteros", f: "assets/equipo/antonio-miguel-ruiz.webp" },
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

const ENLACES = [
  { n: "INUO", d: "Instituto Universitario de Investigación en Olivar y Aceites de Oliva", u: "https://inuouja.com/" },
  { n: "Universidad de Jaén", d: "Institución de la unidad", u: "https://www.ujaen.es/" },
  { n: "LivingSoiLL", d: "Living Lab andaluz de salud del suelo", u: "https://livingsoill.eu/" },
  { n: "Soil DataSpace", d: "Espacio de Datos Federado de Suelos", u: "https://soildataspace.es/home" },
  { n: "SOIL O-LIVE", d: "Biodiversidad del suelo en el olivar", u: "https://soilolive.eu/" },
  { n: "SAVIA", d: "Análisis de vuelos multisensor", u: "https://savia.ujaen.es/" },
  { n: "AeroLab", d: "Inventario de drones y sensores", u: "https://drodridavid.github.io/aerolab/" },
  { n: "CEATIC", d: "Centro de Estudios Avanzados en TIC", u: "https://www.ujaen.es/centros/ceatic/" },
];
