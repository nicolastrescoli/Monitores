import { sendRequest } from "../../../services/api.js";

function SendRequest({ otherUserId, setStatus, text="Enviar solicitud" }) {
  const handleSendRequest = async (otherUserId) => {
    try {
      await sendRequest(otherUserId);
      if (setStatus) setStatus("pending_sent");
    } catch (err) {
      console.error(err);
      alert("Error al enviar solicitud");
    }
  };

  return (
    <button
      className="btn btn-sm btn-primary"
      onClick={() => handleSendRequest(otherUserId)}
    >
      {text}
    </button>
  );
}

export { SendRequest };
