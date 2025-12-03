import { useDispatch } from "react-redux";
import { removeFriendAction } from "../../../redux/features/communitySlice";

export function RemoveFriend({ otherUserId, setStatus, text="Eliminar amistad" }) {
  const dispatch = useDispatch();

  const handleCancelRequest = async (otherUserId) => {
    dispatch(removeFriendAction(otherUserId))
    setStatus("none");
  };

  return (
    <button
      className="btn btn-danger btn-sm"
      onClick={() => handleCancelRequest(otherUserId)}
    >
      {text}
    </button>
  );
}

