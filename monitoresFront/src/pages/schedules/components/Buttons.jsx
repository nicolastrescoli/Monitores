import { storeSchedule, updateSchedule, openSchedulePdf } from "../../../services/api.js";

export default function Buttons({ scheduleId, isEditing, setIsEditing, name, description, cellMap, onEditStart, onCancelEdit }) {

  async function handleStoreSchedule() {
    try {
      const res = await storeSchedule(name, description, cellMap);
      alert('Schedule creado correctamente.')
      const newId = res.schedule?.id;
      window.location.href = `/schedule/${newId}`;
    } catch (error) {
      console.log("Error al guardar", error);
    }
  }

  async function handleUpdateSchedule() {
    try {
      await updateSchedule(scheduleId, name, description, cellMap);
      setIsEditing(false)
    } catch (error) {
      console.log("Error al guardar", error);
    }
  }

  const handleExit = () => {
    window.location.href = "/profile";
  };

  return (
    <div className="d-flex gap-2">
        {!scheduleId && ( // CREANDO
        <>
          <button className="btn btn-dark" onClick={handleStoreSchedule}>
            Guardar nuevo
          </button>
          <button className="btn btn-dark" onClick={handleExit}>
            Salir
          </button>
        </>
      )}
        {scheduleId && !isEditing && ( // MOSTRANDO
        <>
          <button className="btn btn-dark" onClick={() => { onEditStart(); setIsEditing(true);}}>
            Editar
          </button>
          <button className="btn btn-dark" onClick={() => openSchedulePdf(scheduleId)}>
            Imprimir
          </button>
          <button className="btn btn-dark" onClick={handleExit}>
            Salir
          </button>
        </>
      )}
        {scheduleId && isEditing && ( // EDITANDO
        <>
          <button className="btn btn-dark" onClick={handleUpdateSchedule}>
            Guardar cambios
          </button>
          <button className="btn btn-dark" onClick={onCancelEdit}>
            Salir sin guardar
          </button>
        </>
      )}
    </div>
  );
}
