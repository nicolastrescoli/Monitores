import { cancelRequest } from "../../../services/api.js";

function CancelRequest({
  otherUserId,
  setStatus,
  text = "Cancelar solicitud",
}) {
  const handleCancelRequest = async (otherUserId) => {
    try {
      await cancelRequest(otherUserId);
      if (setStatus) setStatus("none");
    } catch (err) {
      console.error(err);
      alert("Error al cancelar solicitud");
    }
  };

  return (
    <button
      className="btn btn-sm btn-secondary"
      onClick={() => handleCancelRequest(otherUserId)}
    >
      {text}
    </button>
  );
}

export { CancelRequest };
