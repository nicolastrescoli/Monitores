import { removeFriend } from "../../../services/api.js";

function RemoveFriend({otherUserId, setStatus, text="Eliminar amistad"}) {
  const handleRemoveFriend = async (otherUserId) => {
    try {
      await removeFriend(otherUserId);
      if (setStatus) setStatus("none");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar amistad");
    }
  };

  return (
    <button
      className="btn btn-sm btn-danger"
      onClick={() => handleRemoveFriend(otherUserId)}
    >
      {text}
    </button>
  );
}

export { RemoveFriend };
