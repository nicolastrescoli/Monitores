import { useState } from "react";

export default function DeleteModal({buttonText, modalText, deleteMethod}) {
  const [show, setShow] = useState(false);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  // Evita que cerrar el modal al clicar dentro de la ventana
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <button className="btn btn-sm btn-danger ms-1" onClick={handleOpen}>
        {buttonText}
      </button>

      {show && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered" onClick={handleModalClick}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirma eliminación</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                {modalText}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={deleteMethod}>Eliminar</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {show && <div className="modal-backdrop fade show"></div>}
    </>
  );
}
