import { useDispatch } from "react-redux";
import { cancelFriendRequest } from "../../../redux/features/communitySlice";

export function CancelRequest({ otherUserId, setStatus, text="Cancelar solicitud", }) {
  const dispatch = useDispatch();

  const handleCancelRequest = async (otherUserId) => {
    dispatch(cancelFriendRequest(otherUserId))
    setStatus("none");
  };

  return (
    <button
      className="btn btn-secondary btn-sm"
      onClick={() => handleCancelRequest(otherUserId)}
    >
      {text}
    </button>
  );
}
