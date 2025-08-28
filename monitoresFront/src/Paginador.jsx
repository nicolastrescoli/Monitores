function Paginador({ days, page, endIndex, daysSlice, setPage }) {

  // si hay menos de 7 días, rellenamos con null
  if (daysSlice.length < 7) {
    const placeholders = Array(7 - daysSlice.length).fill(null);
    daysSlice = [...daysSlice, ...placeholders];
  }

  const totalPages = Math.ceil(days.length / 7);

  return (
    <>
      {/* Paginación estilo Bootstrap */}
      <nav className="mt-3">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
            >
              ◀ Anterior
            </button>
          </li>

          {[...Array(totalPages)].map((_, i) => (
            <li key={i} className={`page-item ${i === page ? "active" : ""}`}>
              <button className="page-link" onClick={() => setPage(i)}>
                {i + 1}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${endIndex >= days.length ? "disabled" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
              disabled={endIndex >= days.length}
            >
              Siguiente ▶
            </button>
          </li>
        </ul>
      </nav>
      </>
  );
}
export default Paginador;
