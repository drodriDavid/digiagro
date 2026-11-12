# Equipamiento de Drones y Sensores — IntellFoo (Universidad de Jaén)

Catálogo web **interactivo** del parque de drones y sensores de teledetección del grupo de
investigación IntellFoo / GGGJ (Computer Graphics and Geomatics Group) de la Universidad de Jaén.

🔗 Web del grupo: <https://intellfoo.ujaen.es/?page_id=402>

## ¿Qué incluye?

- **Catálogo visual** de drones y sensores con ilustraciones distintivas por tipo.
- **Buscador** por nombre, marca, sensor o característica.
- **Filtros** por categoría: Drones · Sensores · Software.
- **Ficha técnica** de cada equipo: características, número de serie, estado y póliza.
- **Enlaces a la documentación técnica** oficial de cada fabricante (DJI, MicaSense,
  Headwall, Phoenix LiDAR, Specim…).

## Equipamiento catalogado

**Drones:** DJI Matrice 300 RTK · Matrice 400 · Matrice 210 · Phantom 4 RTK ·
Mavic 3M (multiespectral) · Mavic 3T (térmico) · Mavic Pro · Mini 4 Pro ·
Dron LiDAR FX II (Aeromedia).

**Sensores:** Zenmuse P1 · Zenmuse XT2 · Phoenix Scout-Ultra (LiDAR) ·
MicaSense RedEdge-MX y MX-Blue · Headwall Nano-Hyperspec VNIR · Specim AFX17 (SWIR).

**Software:** Pix4D · Agisoft MetaShape · UgCS · ArcGIS · NVI · SpatialExplorer · HyperSpec III.

## Uso

Es un sitio estático sin dependencias. Basta con abrir `index.html` en el navegador, o
servirlo (por ejemplo con GitHub Pages).

```
index.html   → estructura y estilos
data.js      → inventario y características técnicas (editable)
app.js       → render, filtros, buscador y ficha técnica
```

### Publicar con GitHub Pages

`Settings → Pages → Deploy from branch → main / root`.

## Fuentes de datos

Inventario interno, tabla de pólizas (LivingSoiLL / CEATIC) y la web del grupo IntellFoo.
Las características técnicas detalladas se enlazan a la documentación oficial de cada fabricante.

---
Para añadir o editar equipos, modifica el array `EQUIPAMIENTO` en [`data.js`](data.js).
