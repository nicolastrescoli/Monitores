import { useState, useEffect } from "react";

export default function Paginator2({ dates, pageSize = 7, onChange }) {
  const [page, setPage] = useState(0);

  // Cada vez que cambian las fechas → volver a página 0
  useEffect(() => {
    setPage(0);
  }, [dates]);

  // Calcular las fechas visibles
  const visibleDates = dates.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  // Notificar al padre cuando cambian
  useEffect(() => {
    onChange?.(visibleDates);
  }, [visibleDates]);

  const maxPage = Math.ceil(dates.length / pageSize) - 1;

  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
      <button
        disabled={page === 0}
        onClick={() => setPage((p) => Math.max(0, p - 1))}
      >
        ⬅️ Anterior
      </button>

      <button
        disabled={page >= maxPage}
        onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
      >
        Siguiente ➡️
      </button>
    </div>
  );
}
