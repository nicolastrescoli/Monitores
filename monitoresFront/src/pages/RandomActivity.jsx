import { useState } from "react";
import ActivityCard2 from "./components/ActivityCard2";

export default function RandomActivity({buttonText, handleRandom}) {
  const [show, setShow] = useState(false);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  // Evita que cerrar el modal al clicar dentro de la ventana
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const activity = handleRandom();

  return (
    <>
      <button className="btn btn-outline-primary btn-lg" onClick={handleOpen}>
        {buttonText}
      </button>

      {show && (
        <div className="modal fade show" style={{ display: "block" }} onClick={handleClose}>
          <div className="modal-dialog modal-dialog-centered" onClick={handleModalClick}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Actividad Aleatoria</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <ActivityCard2 id={activity.id}/>
              </div>
            </div>
          </div>
        </div>
      )}

      {show && <div className="modal-backdrop fade show"></div>}
    </>
  );
}
