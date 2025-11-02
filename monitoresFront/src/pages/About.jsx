export default function About() {
  return (
    <div className="container py-5">
      <div className="card border-0 shadow">
        <div className="card-header bg-dark text-white">
          <h2>Sobre Nosotros</h2>
        </div>
        <div className="card-body bg-light text-dark">
          <p className="lead">
            Somos un equipo apasionado por el juego, la creatividad y la educación.
          </p>

          <p>
            Este proyecto nació con la idea de reunir las mejores actividades, juegos y dinámicas educativas para todas las edades. Queremos facilitar a educadores, familias y monitores una plataforma sencilla y útil.
          </p>

          <p>Nuestros valores:</p>
          <ul>
            <li><strong>Inclusividad:</strong> actividades adaptadas para todos</li>
            <li><strong>Diversión:</strong> fomentamos el aprendizaje a través del juego</li>
            <li><strong>Accesibilidad:</strong> recursos gratuitos y fáciles de usar</li>
          </ul>

          <p>Gracias por formar parte de esta comunidad.</p>
        </div>
      </div>
    </div>
  );
}
