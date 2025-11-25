import { useState } from "react";

export default function DescriptionModal({description, setDescription}) {
  const [show, setShow] = useState(false);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <>
      {/* Botón para abrir modal */}
      <button type="button" className="btn btn-primary" onClick={handleOpen}>
        Modifica la descripción...
      </button>

      {/* Modal */}
      {show && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden={!show}
          onClick={(e) => e.stopPropagation()} // evitar cerrar al click fuera
        >
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()} // evitar cerrar al click dentro
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  Modifica la descripción
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleClose}
                />
              </div>
              <div className="modal-body">
                <textarea
                    style={{width: '100%', height: '500px'}}
                    value={description}
                    placeholder="Descripción..."
                    onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" 
                  onClick={handleClose}>
                  Hecho
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fondo oscuro */}
      {show && <div className="modal-backdrop fade show"></div>}
    </>
  );
}
