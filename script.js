/* --- Variables CSS para colores y fuentes - Facilitan la personalización --- */
:root {
    --primary-color: #FFD700; /* Dorado brillante */
    --secondary-color: #007BFF; /* Azul para botones/enlaces */
    --dark-background: #1a1a2e; /* Fondo oscuro principal */
    --light-background: #232946; /* Fondo oscuro secundario */
    --text-color: #e0e0e0; /* Color de texto claro */
    --heading-color: #FFFFFF; /* Color de encabezados */
    --accent-color: #FF6B6B; /* Color de acento para detalles */
    --white: #ffffff;
    --black: #000000;

    --font-poppins: 'Poppins', sans-serif;
    --font-roboto: 'Roboto', sans-serif;
}

/* Reset Básico y Estilos Generales */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: var(--font-roboto);
    background-color: var(--dark-background);
    color: var(--text-color);
    line-height: 1.6;
    overflow-x: hidden; /* Evita el scroll horizontal */
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.section-padding {
    padding: 80px 0;
}

.bg-light {
    background-color: var(--light-background);
}

h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-poppins);
    color: var(--heading-color);
    margin-bottom: 20px;
    font-weight: 700;
}

h1 { font-size: 3.5em; font-weight: 800; }
h2 { font-size: 2.8em; }
h3 { font-size: 2.2em; }
h4 { font-size: 1.8em; }

p {
    margin-bottom: 15px;
}

.subtitle {
    font-size: 1.3em;
    color: var(--primary-color);
    margin-bottom: 40px;
    font-weight: 500;
}

a {
    color: var(--secondary-color);
    text-decoration: none;
    transition: color 0.3s ease;
}

a:hover {
    color: var(--primary-color);
}

/* Estilos de Botones */
.btn {
    display: inline-block;
    padding: 12px 25px;
    border-radius: 5px;
    font-weight: 600;
    text-transform: uppercase;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    cursor: pointer;
    font-size: 0.95em;
}

.btn-primary {
    background-color: var(--primary-color);
    color: var(--dark-background);
    border-color: var(--primary-color);
}

.btn-primary:hover {
    background-color: var(--text-color);
    color: var(--dark-background);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
}

.btn-secondary {
    background-color: transparent;
    color: var(--secondary-color);
    border-color: var(--secondary-color);
}

.btn-secondary:hover {
    background-color: var(--secondary-color);
    color: var(--white);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
}

.btn-tertiary { /* Botones para documentos */
    background-color: var(--accent-color);
    color: var(--white);
    border-color: var(--accent-color);
    padding: 8px 15px;
    font-size: 0.85em;
}

.btn-tertiary:hover {
    background-color: var(--text-color);
    color: var(--accent-color);
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgba(255, 107, 107, 0.3);
}


/* --- Header --- */
.header {
    background-color: rgba(26, 26, 46, 0.95); /* Fondo oscuro semitransparente */
    padding: 15px 0;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap; /* Permite que los elementos se envuelvan en pantallas pequeñas */
}

.logo img {
    height: 50px; /* Tamaño del logo */
    vertical-align: middle;
    animation: pulse 2s infinite alternate; /* Animación de pulso */
}

@keyframes pulse {
    from {
        transform: scale(1);
    }
    to {
        transform: scale(1.05);
    }
}

.nav-menu ul {
    list-style: none;
    display: flex;
}

.nav-menu ul li {
    margin-left: 30px;
}

.nav-menu ul li a {
    color: var(--white);
    font-weight: 500;
    font-size: 1.05em;
    padding: 5px 0;
    position: relative;
    transition: color 0.3s ease, transform 0.3s ease; /* Añadimos transición al transform */
}

.nav-menu ul li a::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    background-color: var(--primary-color);
    bottom: 0;
    left: 0;
    transition: width 0.3s ease-in-out;
}

.nav-menu ul li a:hover {
    color: var(--primary-color);
    transform: translateY(-2px); /* Ligeramente hacia arriba al hacer hover */
}

.nav-menu ul li a:hover::after {
    width: 100%;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 15px; /* Espacio entre los botones de acción */
    flex-wrap: wrap; /* Permite que los botones salten de línea */
    justify-content: flex-end; /* Alinea los botones a la derecha si no hay espacio */
}

/* Estilo para el botón cuando está conectado (puede aplicarse a ambos) */
.btn.connected {
    background-color: var(--secondary-color); /* Un azul para indicar conexión */
    color: var(--white);
    border: 2px solid var(--secondary-color); 
    cursor: default; /* No permitir clic una vez conectado si no hay funcionalidad de desconexión */
}

.btn.connected:hover {
    background-color: var(--secondary-color); /* Mantener el mismo color al hover */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Sombra más sutil */
    transform: none; /* Sin efecto de elevación al hover */
}

/* Ocultar el botón del Portal de Inversionistas por defecto */
.investor-portal-btn {
    display: none; 
}

/* Estilo para los contenedores de los botones para que los saldos queden debajo */
.header-actions > div {
    display: flex;
    flex-direction: column;
    align-items: center; /* Centra el botón y el texto de saldo */
    gap: 5px; /* Pequeño espacio entre el botón y el saldo */
}

/* Estilo para los textos de balance */
.balance-display {
    color: var(--text-color); /* Color claro para el texto de balance */
    font-size: 0.85em; /* Un poco más pequeño */
    text-align: center;
    margin-top: 5px; /* Espacio extra debajo del botón */
    line-height: 1.3;
    min-height: 40px; /* Asegura un espacio para el saldo incluso si está vacío */
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.balance-display strong {
    color: var(--primary-color); /* Color dorado para el valor del saldo */
    font-weight: 700;
}


/* --- Hero Section --- */
.hero-section {
    background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('background-hero.jpg') no-repeat center center/cover;
    /* Asegúrate de tener una imagen background-hero.jpg */
    min-height: 80vh;
    display: flex;
    flex-direction: column; /* Asegura que el contenido y la mascota se organicen en columna */
    align-items: center;
    justify-content: center;
    text-align: center;
    padding-top: 80px; /* Para dejar espacio al header fijo */
    position: relative; /* Importante para posicionar la mascota absoluta */
    overflow: hidden; /* Evita que la mascota se salga del hero si está muy al borde */
}

.hero-section h1 {
    font-size: 4.5em;
    color: var(--white);
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5); /* Sombra para mejor lectura */
    line-height: 1.1;
    margin-bottom: 25px;
}

.hero-section p {
    font-size: 1.5em;
    color: var(--text-color);
    max-width: 800px;
    margin: 0 auto 40px auto;
}

.hero-ctas .btn {
    margin: 0 15px;
    min-width: 180px;
}

/* --- Estilos para el Fénix --- */

/* Fénix en la Hero Section */
.hero-mascot {
    position: absolute;
    bottom: 20px; /* Distancia desde abajo */
    right: 50px; /* Distancia desde la derecha */
    width: 250px; /* Tamaño de la imagen del fénix */
    height: auto;
    z-index: 1; /* Asegura que esté por encima del fondo */
}

.hero-mascot img {
    max-width: 100%;
    height: auto;
    display: block;
    animation: 
        fenixFloat 4s ease-in-out infinite alternate, /* Animación de flotar y ascender */
        fenixGlow 2s ease-in-out infinite alternate; /* Animación de brillo sutil */
    filter: drop-shadow(0 5px 20px rgba(255, 165, 0, 0.6)); /* Sombra para un efecto de brillo */
}

/* Animación de flotar y ascender para el fénix */
@keyframes fenixFloat {
    0% {
        transform: translateY(0px) rotate(0deg);
    }
    50% {
        transform: translateY(-15px) rotate(2deg); /* Ligeramente más alto y rotado */
    }
    100% {
        transform: translateY(0px) rotate(0deg);
    }
}

/* Animación de brillo sutil para el fénix */
@keyframes fenixGlow {
    0% {
        filter: drop-shadow(0 5px 20px rgba(255, 165, 0, 0.6));
    }
    50% {
        filter: drop-shadow(0 8px 25px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 10px rgba(255, 100, 0, 0.5));
    }
    100% {
        filter: drop-shadow(0 5px 20px rgba(255, 165, 0, 0.6));
    }
}


/* Mini fénix al lado del logo principal */
.mascot-logo-mini {
    display: inline-block;
    width: 35px; /* Tamaño de la mini mascota */
    height: 35px;
    margin-left: 10px;
    vertical-align: middle;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    /* La URL de la imagen se establece directamente en el HTML ahora */
    animation: fenixMiniPulse 3s linear infinite; /* Animación de pulso y rotación */
}

/* Animación para la mini mascota fénix */
@keyframes fenixMiniPulse {
    0% {
        transform: scale(1) rotate(0deg);
        filter: brightness(1);
    }
    25% {
        transform: scale(1.05) rotate(5deg);
        filter: brightness(1.2);
    }
    50% {
        transform: scale(1) rotate(0deg);
        filter: brightness(1);
    }
    75% {
        transform: scale(1.05) rotate(-5deg);
        filter: brightness(1.2);
    }
    100% {
        transform: scale(1) rotate(0deg);
        filter: brightness(1);
    }
}


/* --- About Section --- */
.about-section h2, .about-section .subtitle {
    text-align: center;
}

.about-section .about-content,
.team-grid .team-member {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

.about-section.visible .about-content,
.team-grid.visible .team-member {
    opacity: 1;
    transform: translateY(0);
}

.about-content {
    max-width: 900px;
    margin: 40px auto;
    text-align: center;
    font-size: 1.1em;
}

.team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    margin-top: 50px;
    text-align: center;
}

.team-member {
    background-color: var(--light-background);
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;
}

.team-member:hover {
    transform: translateY(-10px);
}

.team-member img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 15px;
    border: 4px solid var(--primary-color);
}

.team-member h4 {
    margin-bottom: 5px;
    color: var(--heading-color);
}

.team-member p {
    color: var(--text-color);
    font-size: 0.95em;
    margin-bottom: 10px;
}

/* --- Investment Section (Tokenomics) --- */
.investment-section h2, .investment-section .subtitle {
    text-align: center;
}

.investment-content {
    max-width: 900px;
    margin: 40px auto;
    font-size: 1.1em;
    text-align: justify; /* Justifica el texto principal */
}

.investment-content h3 {
    text-align: center;
    margin-top: 50px;
    margin-bottom: 30px;
}

.tokenomics-info p {
    background-color: rgba(0, 0, 0, 0.2);
    padding: 10px 15px;
    border-radius: 5px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tokenomics-info p strong {
    color: var(--primary-color);
}

.tokenomics-info code {
    background-color: var(--dark-background);
    padding: 3px 8px;
    border-radius: 4px;
    font-family: 'Roboto Mono', monospace; /* Fuente monoespaciada para código */
    font-size: 0.9em;
    color: var(--accent-color);
    white-space: nowrap; /* Evita que la dirección se rompa en varias líneas */
    overflow-x: auto; /* Permite scroll horizontal si la dirección es muy larga */
    cursor: copy; /* Indicador de que se puede copiar */
    display: block; /* Ocupa su propia línea */
    margin-left: 10px;
    max-width: 70%;
}

.tokenomics-info code::-webkit-scrollbar {
    height: 4px;
}

.tokenomics-info code::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 2px;
}

.token-distribution-chart {
    text-align: center;
    margin: 40px 0;
}

.token-distribution-chart img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

/* --- Docs Section --- */
.docs-section h2, .docs-section .subtitle {
    text-align: center;
}

.docs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    margin-top: 50px;
}

.doc-item {
    background-color: var(--light-background);
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Empuja el botón al final */
    min-height: 220px; /* Asegura altura mínima para uniformidad */
}

.doc-item h4 {
    color: var(--primary-color);
    margin-bottom: 10px;
}

.doc-item p {
    color: var(--text-color);
    font-size: 0.95em;
    flex-grow: 1; /* Permite que el párrafo crezca para ocupar espacio */
    margin-bottom: 20px;
}

.doc-item .btn {
    margin-top: auto; /* Empuja el botón hacia abajo */
}

/* --- Roadmap Section --- */
.roadmap-section h2, .roadmap-section .subtitle {
    text-align: center;
}

.roadmap-timeline {
    position: relative;
    max-width: 900px;
    margin: 50px auto;
    padding: 20px 0;
}

.roadmap-timeline::before {
    content: '';
    position: absolute;
    width: 4px;
    background-color: var(--primary-color);
    top: 0;
    bottom: 0;
    left: 50%;
    margin-left: -2px;
}

.timeline-item {
    padding: 10px 0;
    position: relative;
    width: 50%;
    left: 0;
    box-sizing: border-box;
}

.timeline-item:nth-child(odd) {
    left: 0;
    padding-right: 40px;
    text-align: right;
}

.timeline-item:nth-child(even) {
    left: 50%;
    padding-left: 40px;
    text-align: left;
}

.timeline-icon {
    width: 50px;
    height: 50px;
    background-color: var(--accent-color);
    border-radius: 50%;
    position: absolute;
    top: 15px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    font-weight: bold;
    font-size: 1.1em;
    box-shadow: 0 0 0 5px var(--light-background);
}

.timeline-item:nth-child(odd) .timeline-icon {
    right: -25px;
}

.timeline-item:nth-child(even) .timeline-icon {
    left: -25px;
}

.timeline-content {
    background-color: var(--dark-background);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.timeline-content h3 {
    color: var(--primary-color);
    margin-top: 0;
    font-size: 1.6em;
}

.timeline-content p {
    font-size: 0.95em;
    margin-bottom: 0;
}

/* --- News Section --- */
.news-section h2, .news-section .subtitle {
    text-align: center;
}

.news-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-top: 50px;
}

.news-item {
    background-color: var(--light-background);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;
}

.news-item:hover {
    transform: translateY(-10px);
}

.news-item img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
}

.news-item h3 {
    padding: 20px 20px 0;
    margin-bottom: 10px;
    color: var(--primary-color);
    font-size: 1.4em;
}

.news-item p {
    padding: 0 20px 20px;
    font-size: 0.95em;
    color: var(--text-color);
    margin-bottom: 0;
}

.news-section .btn {
    display: block;
    margin: 50px auto 0;
    width: fit-content;
}

/* --- FAQ Section --- */
.faq-section h2, .faq-section .subtitle {
    text-align: center;
}

.faq-container {
    max-width: 900px;
    margin: 50px auto;
}

.faq-item {
    background-color: var(--dark-background);
    margin-bottom: 15px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

.faq-item h4 {
    margin: 0;
    padding: 20px 25px;
    color: var(--primary-color);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.3s ease;
}

.faq-item h4::after {
    content: '+';
    font-size: 1.5em;
    color: var(--secondary-color);
    transition: transform 0.3s ease;
}

.faq-item.active h4 {
    background-color: var(--light-background);
}

.faq-item.active h4::after {
    content: '-';
    transform: rotate(180deg);
}

.faq-answer {
    padding: 0 25px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease-in-out, padding 0.4s ease-in-out;
}

.faq-item.active .faq-answer {
    max-height: 200px; /* Ajusta según la altura máxima esperada del contenido */
    padding: 15px 25px 25px;
}

.faq-answer p {
    margin-bottom: 0;
    color: var(--text-color);
}

/* --- Contact Section --- */
.contact-section h2, .contact-section .subtitle {
    text-align: center;
}

.contact-content {
    max-width: 700px;
    margin: 50px auto;
    text-align: center;
}

.contact-content ul {
    list-style: none;
    padding: 0;
    margin-bottom: 30px;
}

.contact-content ul li {
    margin-bottom: 10px;
    font-size: 1.1em;
}

.contact-content .social-links {
    margin-top: 15px;
    display: flex;
    justify-content: center;
    gap: 20px;
}

.contact-content .social-links img {
    height: 35px;
    width: 35px;
    transition: transform 0.2s ease;
}

.contact-content .social-links img:hover {
    transform: scale(1.1);
}

.contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.contact-form input,
.contact-form textarea {
    padding: 15px;
    border: 1px solid var(--light-background);
    border-radius: 8px;
    background-color: var(--dark-background);
    color: var(--text-color);
    font-size: 1em;
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.contact-form input:focus,
.contact-form textarea:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3);
}

.contact-form textarea {
    resize: vertical; /* Permite redimensionar verticalmente */
    min-height: 120px;
}

.contact-form .btn-primary {
    width: fit-content;
    align-self: center; /* Centra el botón en el formulario */
}

/* --- Disclaimer Section --- */
.disclaimer-section {
    font-size: 0.9em;
    color: #b0b0b0;
    text-align: justify;
    padding-top: 40px; /* Reduce un poco el padding superior */
    padding-bottom: 40px; /* Reduce un poco el padding inferior */
}

.disclaimer-section h2 {
    text-align: center;
    font-size: 2em; /* Un poco más pequeño que otros H2 */
    margin-bottom: 30px;
    color: var(--primary-color);
}

/* --- Footer --- */
.footer {
    background-color: var(--dark-background);
    color: var(--text-color);
    text-align: center;
    padding: 30px 0;
    border-top: 1px solid rgba(255, 215, 0, 0.1);
    font-size: 0.9em;
}

.footer-links {
    margin-top: 10px;
}

.footer-links a {
    color: var(--primary-color);
    margin: 0 10px;
}

.footer-links a:hover {
    text-decoration: underline;
}

/* --- Media Queries para Responsividad --- */
@media (max-width: 992px) {
    h1 { font-size: 3em; }
    h2 { font-size: 2.4em; }
    h3 { font-size: 2em; }
    h4 { font-size: 1.6em; }
    .subtitle { font-size: 1.1em; }

    .nav-menu ul li {
        margin-left: 20px;
    }

    .hero-section h1 {
        font-size: 3.5em;
    }
    .hero-section p {
        font-size: 1.3em;
    }
    .hero-ctas .btn {
        margin: 0 10px; /* Ajusta el margen para botones en tabletas */
    }

    /* Ajuste de mascota para tablets */
    .hero-mascot {
        width: 180px; /* Reduce el tamaño en tablets */
        right: 30px;
        bottom: 15px;
    }
    .mascot-logo-mini {
        width: 30px;
        height: 30px;
    }
}

@media (max-width: 768px) {
    .header .container {
        flex-direction: column;
        align-items: center;
    }

    .logo {
        margin-bottom: 15px;
    }
    .mascot-logo-mini {
        /* Puedes ocultar la mini mascota en este tamaño si el espacio es muy limitado */
        display: none;
    }

    .nav-menu ul {
        flex-direction: column;
        width: 100%;
        text-align: center;
        margin-bottom: 20px;
    }

    .nav-menu ul li {
        margin: 10px 0;
    }
    
    .header-actions {
        flex-direction: column; /* Apila los botones verticalmente en móviles */
        width: 100%;
        gap: 10px;
        align-items: stretch; /* Estira los botones para que ocupen todo el ancho */
    }
    .header-actions > div {
        width: 100%; /* Asegura que cada contenedor de botón/saldo ocupe todo el ancho */
    }
    .header-actions .btn {
        width: 100%; /* Asegura que los botones ocupen todo el ancho disponible */
        text-align: center;
    }

    .hero-section {
        min-height: 90vh;
        padding-top: 100px;
    }
    .hero-section h1 {
        font-size: 2.5em;
    }
    .hero-section p {
        font-size: 1.1em;
    }
    .hero-ctas .btn {
        display: block;
        margin: 10px auto;
    }

    .roadmap-timeline::before {
        left: 20px;
    }
    .timeline-item {
        width: 100%;
        left: 0 !important;
        padding-left: 60px; /* Espacio para el icono */
        padding-right: 20px;
        text-align: left !important;
    }
    .timeline-item:nth-child(odd) .timeline-icon {
        left: 0px;
        right: auto;
    }
    .timeline-item:nth-child(even) .timeline-icon {
        left: 0px;
    }
    .timeline-icon {
        top: 0px; /* Ajusta la posición vertical del icono */
    }

    /* Ajuste de mascota para móviles */
    .hero-mascot {
        width: 130px; /* Reduce aún más en móviles */
        right: 15px;
        bottom: 10px;
    }
}

@media (max-width: 480px) {
    h1 { font-size: 2.2em; }
    h2 { font-size: 2em; }
    h3 { font-size: 1.7em; }
    h4 { font-size: 1.4em; }

    .section-padding {
        padding: 50px 0;
    }

    .hero-section h1 {
        font-size: 2em;
    }
    .hero-section p {
        font-size: 1em;
    }

    .team-member img {
        width: 100px;
        height: 100px;
    }
    
    .tokenomics-info p {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
    }
    .tokenomics-info code {
        max-width: 100%; /* Ocupa todo el ancho disponible */
        margin-left: 0;
    }

    .hero-mascot {
        width: 100px; /* Tamaño muy pequeño en los teléfonos más pequeños */
        right: 10px;
        bottom: 5px; /* Puede que necesites ocultarlo o reposicionarlo completamente en algunos diseños */
    }
}
