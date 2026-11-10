/* Contenido editable de la web. Para añadir un proyecto, publicación o persona basta con añadir una línea. */

const LINEAS = [
  { t: "Teledetección multisensor y fusión de datos", d: "Integración de datos LiDAR, multiespectrales, hiperespectrales, térmicos y satelitales para la caracterización del olivar, la detección temprana de estrés y la estimación de la incertidumbre asociada a cada fuente.", img: "assets/savia/fusion.jpg" },
  { t: "Gemelos digitales y modelado 3D/4D de cultivos leñosos", d: "Reconstrucción tridimensional y multitemporal a escala de individuo para el análisis estructural, la dasometría y la simulación de escenarios de manejo y cambio climático.", img: "assets/savia/olivar-3d.jpg" },
  { t: "Inteligencia artificial y aprendizaje automático robusto", d: "Modelos de aprendizaje profundo para clasificación, segmentación y predicción, con cuantificación de la incertidumbre y capacidad de generalización entre parcelas, campañas y sensores.", img: "assets/video/f-daso.jpg" },
  { t: "Espacios de datos federados e interoperabilidad", d: "Arquitecturas para el intercambio soberano de datos agroambientales, basadas en estándares abiertos, principios FAIR y agentes de IA para la consulta y el análisis de información distribuida.", img: "assets/video/balsa.jpg" },
  { t: "Sistemas aéreos no tripulados y computación ubicua", d: "Planificación de vuelos, integración de sensores y procesamiento embarcado en plataformas UAV y redes de sensores IoT para la monitorización agronómica a escala de finca y territorio.", img: "assets/video/olivos-cenital.jpg" },
  { t: "Salud del suelo, erosión y balance de carbono", d: "Cartografía de indicadores de calidad del suelo, modelización de la erosión hídrica y estimación del secuestro de carbono para la evaluación de la sostenibilidad del olivar.", img: "assets/savia/erosion-mapa.jpg" },
];

const PROYECTOS = [
  { t: "LivingSoiLL", logo: "assets/proyectos/livingsoill.png", d: "Healthy soil to permanent crops living labs. Lideramos el Living Lab andaluz, centrado en la salud del suelo en el olivar.", m: "Horizonte Europa, 2024–2028", a: "europa", u: "https://livingsoill.eu/" },
  { t: "Espacio de Datos Federado de Suelos", logo: "assets/proyectos/soil-dataspace.png", d: "Soil Data Space: infraestructura federada para compartir datos de suelo de forma soberana, liderada por la Universidad de Jaén.", m: "TSI-100123-2024-72, NextGeneration EU", a: "espana", u: "https://soildataspace.es/home" },
];


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
  {"n": "Juan Manuel Jurado Rodríguez", "f": "assets/equipo/juan-manuel-jurado.webp", "c": "Responsable de la unidad · Profesor Titular", "a": "Lenguajes y Sistemas Informáticos", "d": true},
  {"n": "Julio Antonio Calero González", "f": "assets/equipo/julio-calero.webp", "c": "Profesor Titular", "a": "Edafología y Química Agrícola"},
  {"n": "Andressa De Sousa Cardoso", "c": "Investigadora predoctoral", "a": "Ingeniería Cartográfica, Geodésica y Fotogrametría"},
  {"n": "Juan José Cubillas Mercado", "c": "Profesor", "a": "Lenguajes y Sistemas Informáticos"},
  {"n": "Luis René Domínguez Fuentes", "f": "assets/equipo/luis-rene-dominguez.webp", "c": "Estudiante de doctorado", "a": "Lenguajes y Sistemas Informáticos"},
  {"n": "Carlos Enríquez Turiño", "f": "assets/equipo/carlos-enriquez.webp", "c": "Profesor Titular", "a": "Ingeniería Cartográfica, Geodésica y Fotogrametría"},
  {"n": "Francisco Ramón Feito Higueruela", "f": "assets/equipo/francisco-feito.webp", "c": "Catedrático de Universidad", "a": "Lenguajes y Sistemas Informáticos"},
  {"n": "Juan Roberto Jiménez Pérez", "f": "assets/equipo/juan-roberto-jimenez.webp", "c": "Profesor Titular", "a": "Lenguajes y Sistemas Informáticos"},
  {"n": "David Jurado Rodríguez", "f": "assets/equipo/david-jurado.webp", "c": "Investigador doctor", "a": "Lenguajes y Sistemas Informáticos"},
  {"n": "Pablo Latorre Hortelano", "f": "assets/equipo/pablo-latorre.webp", "c": "Estudiante de doctorado", "a": "Informática"},
  {"n": "Juan Manuel Martín García", "f": "assets/equipo/juan-manuel-martin.webp", "c": "Profesor Titular", "a": "Edafología y Química Agrícola"},
  {"n": "Lidia Ortega Alvarado", "f": "assets/equipo/lidia-ortega.webp", "c": "Profesora Titular", "a": "Lenguajes y Sistemas Informáticos"},
  {"n": "Gema Parra Cabrera", "f": "assets/equipo/gema-parra.webp", "c": "Profesora Ayudante Doctora", "a": "Informática · Universidad Politécnica de Madrid"},
  {"n": "Francisco Daniel Pérez Cano", "f": "assets/equipo/francisco-daniel-perez.webp", "c": "Profesor Ayudante Doctor", "a": "Lenguajes y Sistemas Informáticos"},
  {"n": "María Isabel Ramos Galán", "f": "assets/equipo/maria-isabel-ramos.webp", "c": "Profesora Titular", "a": "Ingeniería Cartográfica, Geodésica y Fotogrametría"},
  {"n": "Antonio Miguel Ruiz Armenteros", "f": "assets/equipo/antonio-miguel-ruiz.webp", "c": "Catedrático de Universidad", "a": "Ingeniería Cartográfica, Geodésica y Fotogrametría"},
  {"n": "Elena Carmona Vallecillo", "c": "Estudiante de doctorado", "a": "Informática"},
  {"n": "Rubén Sanabria Díaz", "c": "Estudiante de doctorado", "a": "Informática"},
  {"n": "Gloria Paterna Sánchez", "f": "assets/equipo/gloria-paterna.webp", "c": "Gestión de proyectos", "a": "Sociología"},
];

const ENLACES = [
  { n: "INUO", l: "assets/logos/inuo.svg", u: "https://inuouja.com/" },
  { n: "Universidad de Jaén", l: "assets/logos/uja_h.png", u: "https://www.ujaen.es/" },
  { n: "LivingSoiLL", l: "assets/proyectos/livingsoill.png", u: "https://livingsoill.eu/" },
  { n: "Espacio de Datos Federado de Suelos", l: "assets/proyectos/soil-dataspace.png", u: "https://soildataspace.es/home" },
  { n: "SAVIA", l: "assets/logos/savia-logo-vertical.png", u: "https://savia.ujaen.es/" },
  { n: "AeroLab", l: "assets/logos/aerolab.svg", u: "https://drodridavid.github.io/aerolab/" },
  { n: "CEATIC", l: "assets/logos/ceatic.png", u: "https://www.ujaen.es/centros/ceatic/" },
];

const PASOS = [
  { t: "Capturamos", d: "Drones, satélites, sensores IoT y estaciones meteorológicas.", i: "M4 8h6M14 8h6M7 8v3l5 3 5-3V8M12 14v3M9 21l3-4 3 4" },
  { t: "Integramos", d: "Fusionamos cada capa de información sobre la misma geometría.", i: "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5" },
  { t: "Analizamos", d: "Inteligencia artificial y modelos predictivos para cada explotación.", i: "M4 19V5M4 19h16M8 15l3-4 3 2 5-7" },
  { t: "Decidimos", d: "Recomendaciones claras para quien gestiona la finca.", i: "M9 12l2 2 4-4M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
];

const SELLOS = [
  ["assets/logos/inuo.svg", "INUO"], ["assets/logos/uja_h.png", "Universidad de Jaén"], ["assets/proyectos/comision-europea.svg", "Comisión Europea"],
  ["assets/proyectos/livingsoill.png", "LivingSoiLL"], ["assets/proyectos/soil-dataspace.png", "Espacio de Datos Federado de Suelos"],
  ["assets/proyectos/prima.png", "PRIMA"], ["assets/proyectos/cost.svg", "COST"], ["assets/proyectos/aei.svg", "Agencia Estatal de Investigación"], ["assets/proyectos/diputacion-jaen.jpg", "Diputación de Jaén"],
];
