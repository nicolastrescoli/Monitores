import { useDispatch } from "react-redux";
import DeleteModal from "../DeleteModal";
import { removeFriend } from "../../../services/api";
import { fetchLoggedUser } from "../../../redux/features/authSlice";

export function RemoveFriend({
  otherUserId,
  text = "Eliminar amistad",
}) {
  const dispatch = useDispatch();

  async function handleRemoveFriend(userId) {
    try {
      await dispatch(removeFriend(userId)).unwrap();
      await dispatch(fetchLoggedUser()).unwrap();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar contacto");
    }
  }

  return (
    <DeleteModal
      buttonText={text}
      modalText={"¿Seguro que deseas eliminar esta amistad?"}
      deleteMethod={() => {
        handleRemoveFriend(otherUserId);
      }}
    />
  );
}
