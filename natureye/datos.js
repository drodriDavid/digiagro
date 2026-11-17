/* Catálogo de conjuntos de datos de NATUREYE.
   Para publicar una descarga, copia el fichero en natureye/datos/ del servidor y pon su ruta en "url"
   (por ejemplo "datos/DEM_PuertoLaMata_08-04-2024.tif"). Sin "url" la web muestra «Bajo petición». */
const DATOS = [
  { tipo: "MDE", titulo: "Modelo digital de elevación", desc: "DEM_PuertoLaMata_08-04-2024.tif", zona: "Puerto de la Mata", fecha: "08/04/2024", sensor: "UAV", formato: "GeoTIFF", mb: 8.9 },
  { tipo: "MDE", titulo: "Modelo digital de elevación", desc: "DEM_PuertoLaMata_13-02-2025.tif", zona: "Puerto de la Mata", fecha: "13/02/2025", sensor: "UAV", formato: "GeoTIFF", mb: 7.7 },
  { tipo: "RGB", titulo: "Ortomosaico RGB", desc: "RGB_Puerto_de_la_Mata_DJI3M_240408_transparent_mosaic_group1.tif", zona: "Puerto de la Mata", fecha: "08/04/2024", sensor: "DJI Mavic 3M", formato: "GeoTIFF", mb: 1650 },
  { tipo: "RGB", titulo: "Ortomosaico RGB de alta resolución", desc: "DJIM_ResoluciónAlta_13_02_2025_Ortomosaico.tif", zona: "Puerto de la Mata", fecha: "13/02/2025", sensor: "DJI Mavic 3M", formato: "GeoTIFF", mb: 8745 },
  { tipo: "Multiespectral", titulo: "Multiespectral de 4 bandas (verde, rojo, borde rojo, NIR)", desc: "Puerto_de_la_Mata_4Bandas_Multiespectral.tif", zona: "Puerto de la Mata", fecha: "08/04/2024", sensor: "DJI Mavic 3M", formato: "GeoTIFF", mb: 1239 },
  { tipo: "Multiespectral", titulo: "Bandas multiespectrales por separado", desc: "Verde, rojo, borde rojo y NIR, un GeoTIFF por banda", zona: "Puerto de la Mata", fecha: "08/04/2024", sensor: "DJI Mavic 3M", formato: "GeoTIFF ×4", mb: 3526 },
  { tipo: "Hiperespectral", titulo: "Ortomosaico hiperespectral", desc: "Reflectancia ortorrectificada, 400–1000 nm", zona: "Puerto de la Mata", fecha: "08/04/2024", sensor: "Headwall Nano-Hyperspec", formato: "GeoTIFF", mb: 30587 },
  { tipo: "Hiperespectral", titulo: "Líneas de vuelo hiperespectrales", desc: "Tres líneas en reflectancia, ortorrectificadas", zona: "Puerto de la Mata", fecha: "08/04/2024", sensor: "Headwall Nano-Hyperspec", formato: "ENVI (.hdr + binario)", mb: 24371 },
  { tipo: "Nube de puntos", titulo: "Nube de puntos normalizada", desc: "PuertoLaMata_NubeDePuntos_exportada_normalizada.las", zona: "Puerto de la Mata", fecha: "08/04/2024", sensor: "UAV", formato: "LAS 1.4", mb: 2755 },
  { tipo: "Nube de puntos", titulo: "Nube de puntos normalizada, área ampliada", desc: "PuertoLaMata_08-04-24_grande_normalizada.laz", zona: "Puerto de la Mata", fecha: "08/04/2024", sensor: "UAV", formato: "LAZ", mb: 640 },
  { tipo: "Nube de puntos", titulo: "Nube LiDAR filtrada con atributos multiespectrales", desc: "PuertoLaMata_NubeDePuntosRecortada_exportada_conFiltro.las", zona: "Puerto de la Mata", fecha: "08/04/2024", sensor: "LiDAR + Mavic 3M", formato: "LAS 1.4", mb: 2683 },
  { tipo: "Nube de puntos", titulo: "Nube de puntos normalizada", desc: "PuertoLaMata_13-02-2025_normalizado.las", zona: "Puerto de la Mata", fecha: "13/02/2025", sensor: "UAV", formato: "LAS 1.4", mb: 6052 },
  { tipo: "Modelo GEU", titulo: "Modelo fusionado para GEU", desc: "Nube con capas de posición, RGB y multiespectral (.GEUCloud)", zona: "Puerto de la Mata", fecha: "08/04/2024", sensor: "Fusión", formato: "GEUCloud", mb: 3082 },
  { tipo: "Especies", titulo: "Fotografías de referencia de especies", desc: "50 fotos de campo etiquetadas: encina, quejigo, majuelo, muérdago, agracejo, esparto, pino carrasco y otras", zona: "Puerto de la Mata", fecha: "", sensor: "Cámara réflex", formato: "JPEG", mb: 842 },
];
