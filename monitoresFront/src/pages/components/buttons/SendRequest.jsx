import { useDispatch } from "react-redux";
import { sendFriendRequest } from "../../../redux/features/communitySlice";

export function SendRequest({ otherUserId, setStatus, text="Enviar solicitud" }) {
  const dispatch = useDispatch();

  const handleSendRequest = async (otherUserId) => {
    dispatch(sendFriendRequest(otherUserId))
    setStatus("pending_sent");
  };

  return (
    <button
      className="btn btn-primary btn-sm"
      onClick={() => handleSendRequest(otherUserId)}
    >
      {text}
    </button>
  );
}
