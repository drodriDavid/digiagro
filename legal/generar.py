# Genera las cuatro páginas legales de DIGIAGRO con la misma cabecera y pie.
# uso: python -I legal/generar.py   (desde la raíz del repo). Editar los textos aquí y volver a generar.
import io, os

AQUI = os.path.dirname(os.path.abspath(__file__))
FECHA = '12 de noviembre de 2026'
CONTACTO = '<a href="mailto:inuouja@ujaen.es">inuouja@ujaen.es</a>'

PAGINAS = [
    ('aviso-legal', 'Aviso legal', 'Titular, finalidad y condiciones de uso de la web de DIGIAGRO.', f'''
<h2>Titular del sitio</h2>
<dl>
  <dt>Titular</dt><dd>Universidad de Jaén (CIF Q7350006H)</dd>
  <dt>Dirección</dt><dd>Campus Las Lagunillas, s/n, 23071 Jaén</dd>
  <dt>Responsable del contenido</dt><dd>Unidad de Transformación Digital e Inteligencia Artificial (DIGIAGRO) del Instituto Universitario de Investigación en Olivar y Aceites de Oliva (INUO)</dd>
  <dt>Contacto</dt><dd>{CONTACTO}</dd>
</dl>

<h2>Finalidad</h2>
<p>Esta web presenta la unidad DIGIAGRO: sus líneas de investigación, sus plataformas SAVIA y AeroLab, sus proyectos, publicaciones y equipo. Es un sitio informativo: no vende productos, no presta servicios en línea y no pide registro.</p>

<h2>Propiedad intelectual e industrial</h2>
<p>Los textos, fotografías, vídeos, diseños y la marca DIGIAGRO pertenecen a la Universidad de Jaén o a sus autores. Los logotipos de la Universidad de Jaén, del INUO, de los proyectos y de las entidades colaboradoras pertenecen a sus titulares y se muestran solo para identificarlos.</p>
<p>Se pueden citar y enlazar los contenidos indicando su procedencia. Para cualquier otra reproducción, distribución o transformación hace falta autorización previa.</p>

<h2>Enlaces a otros sitios</h2>
<p>La web enlaza a páginas de terceros (proyectos, publicaciones, fabricantes de equipos). La Universidad de Jaén no controla esos sitios ni responde de su contenido o de sus políticas.</p>

<h2>Responsabilidad</h2>
<p>La información se revisa con cuidado, pero puede cambiar sin previo aviso o contener errores. La Universidad de Jaén no responde de las decisiones que se tomen solo a partir de ella.</p>

<h2>Legislación aplicable</h2>
<p>Este aviso se rige por la legislación española, en particular por la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE).</p>
'''),
    ('privacidad', 'Política de privacidad', 'Qué datos se tratan al visitar esta web y cómo ejercer tus derechos.', f'''
<h2>Responsable del tratamiento</h2>
<dl>
  <dt>Responsable</dt><dd>Universidad de Jaén, Campus Las Lagunillas, s/n, 23071 Jaén</dd>
  <dt>Delegado de Protección de Datos</dt><dd><a href="mailto:dpo@ujaen.es">dpo@ujaen.es</a></dd>
  <dt>Contacto de la unidad</dt><dd>{CONTACTO}</dd>
</dl>

<h2>Datos que se tratan</h2>
<p>Esta web no tiene formularios, no pide registro y no usa herramientas de analítica ni de publicidad. Tampoco usa cookies (ver la <a href="cookies.html">política de cookies</a>).</p>
<p>Todo se sirve desde el servidor de la Universidad de Jaén: textos, imágenes, vídeos y tipografías. Al navegar por ella no se envía ningún dato a terceros.</p>

<h2>Registros técnicos del servidor</h2>
<p>Como cualquier servidor web, el de la Universidad anota cada petición que recibe: dirección IP, fecha y hora, página pedida y navegador. Esos registros se usan solo para garantizar la seguridad y el funcionamiento del servicio. No se usan para identificar ni perfilar a nadie, no se ceden a terceros y se conservan el tiempo imprescindible para esos fines.</p>
<p>La base jurídica es el cumplimiento de una misión de interés público y la seguridad de los sistemas de la Universidad (artículo 6.1.e del Reglamento General de Protección de Datos).</p>

<h2>Si nos escribes</h2>
<p>Si escribes a una de las direcciones de correo de la web, tu nombre, tu dirección y lo que nos cuentes se usarán solo para responderte y no se cederán a terceros.</p>

<h2>Tus derechos</h2>
<p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad ante la Universidad de Jaén, escribiendo a <a href="mailto:dpo@ujaen.es">dpo@ujaen.es</a>. Si consideras que no se han atendido, puedes presentar una reclamación ante el Consejo de Transparencia y Protección de Datos de Andalucía.</p>
'''),
    ('cookies', 'Política de cookies', 'Esta web no usa cookies.', '''
<h2>¿Usa cookies esta web?</h2>
<p>No. La web de DIGIAGRO no instala cookies propias ni de terceros: ni de análisis, ni de publicidad, ni de redes sociales. Por eso no muestra ningún aviso para aceptarlas.</p>

<h2>Lo único que se guarda en tu navegador</h2>
<p>Si cambias el idioma de la web entre español e inglés, el navegador recuerda tu elección en su almacenamiento local, con el nombre <code>idioma</code>. Es un dato técnico que no sale de tu equipo, no te identifica y no se usa para nada más. Por eso está exento de consentimiento (artículo 22.2 de la LSSI-CE).</p>

<h2>Servicios de terceros</h2>
<p>Ninguno. Las tipografías, imágenes y vídeos se sirven desde el propio servidor de la Universidad de Jaén, sin conexiones a Google ni a otras empresas.</p>

<h2>Cómo borrarlo</h2>
<p>Puedes borrar ese dato desde las opciones de tu navegador, con «Borrar datos de sitios» o equivalente. La web volverá a mostrarse en español.</p>
'''),
    ('accesibilidad', 'Declaración de accesibilidad', 'Situación de cumplimiento de la web de DIGIAGRO.', f'''
<h2>Compromiso</h2>
<p>La Universidad de Jaén se compromete a hacer accesible esta web conforme al Real Decreto 1112/2018, sobre accesibilidad de los sitios web y aplicaciones para dispositivos móviles del sector público, y a la norma UNE-EN 301 549, equivalente a las pautas WCAG 2.1 en sus niveles A y AA.</p>
<p>Esta declaración se aplica a la web de DIGIAGRO, incluida su sección de AeroLab.</p>

<h2>Situación de cumplimiento</h2>
<p>La web es <strong>parcialmente conforme</strong> con el Real Decreto 1112/2018, por los aspectos que se indican más abajo. Ya incorpora:</p>
<ul>
  <li>Idioma de la página declarado, con versión en inglés.</li>
  <li>Enlace para saltar al contenido principal y navegación completa con teclado, con el foco siempre visible.</li>
  <li>Textos alternativos en las imágenes con información; las decorativas se ocultan a los lectores de pantalla.</li>
  <li>Contraste suficiente entre texto y fondo, y diseño que se adapta a cualquier tamaño de pantalla y al aumento del texto.</li>
  <li>Respeto de la preferencia del sistema de reducir el movimiento: con ella activada se detienen las animaciones.</li>
</ul>

<h2>Contenido no accesible</h2>
<ul>
  <li>Los vídeos de presentación de SAVIA y de los proyectos tienen sonido y todavía no llevan subtítulos ni transcripción. Lo esencial de su contenido aparece también en el texto de la página.</li>
  <li>Los vídeos de fondo y de la portada son mudos y decorativos, y no llevan audiodescripción.</li>
  <li>Algunos logotipos de entidades colaboradoras son imágenes con texto.</li>
</ul>
<p>Estas limitaciones se irán corrigiendo en las próximas revisiones.</p>

<h2>Preparación de esta declaración</h2>
<p>Declaración preparada el {FECHA} mediante una autoevaluación de la propia unidad.</p>

<h2>Contacto y quejas</h2>
<p>Si encuentras alguna barrera de acceso o quieres pedir la información en otro formato, escríbenos a {CONTACTO}. Te responderemos en un plazo máximo de 20 días hábiles.</p>
<p>Si la respuesta no es satisfactoria, puedes presentar una reclamación ante la Universidad de Jaén, conforme al artículo 13 del Real Decreto 1112/2018.</p>
'''),
]

PLANTILLA = '''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titulo} | DIGIAGRO</title>
<meta name="description" content="{descripcion}">
<meta name="color-scheme" content="light">
<meta name="theme-color" content="#007336">
<link rel="icon" type="image/svg+xml" href="../assets/marca/digiagro-simbolo.svg">
<link rel="stylesheet" href="../assets/fuentes/lato.css">
<link rel="stylesheet" href="legal.css?v=1">
</head>
<body>
<a class="saltar" href="#contenido">Saltar al contenido</a>
<div class="franja" aria-hidden="true"></div>
<header class="cabecera">
  <div class="dentro">
    <a href="../"><img src="../assets/marca/digiagro-principal.svg" alt="DIGIAGRO, página principal" width="4508" height="886"></a>
    <a class="volver" href="../">Volver a la web</a>
  </div>
</header>
<main id="contenido">
  <h1>{titulo}</h1>
  <p class="fecha">Última actualización: {fecha}</p>
{cuerpo}
</main>
<footer class="pie">
  <div class="dentro">
    <nav aria-label="Información legal">
      <ul>
{enlaces}
      </ul>
    </nav>
    <p>Unidad de Transformación Digital e Inteligencia Artificial del INUO. Universidad de Jaén.</p>
  </div>
</footer>
</body>
</html>
'''

for slug, titulo, desc, cuerpo in PAGINAS:
    enlaces = '\n'.join(
        f'        <li><a href="{s}.html"{" aria-current=\"page\"" if s == slug else ""}>{t}</a></li>'
        for s, t, _, _ in PAGINAS)
    html = PLANTILLA.format(titulo=titulo, descripcion=desc, fecha=FECHA, cuerpo=cuerpo.strip('\n'), enlaces=enlaces)
    io.open(os.path.join(AQUI, slug + '.html'), 'w', encoding='utf-8', newline='\n').write(html)
    print('escrita', slug + '.html')
