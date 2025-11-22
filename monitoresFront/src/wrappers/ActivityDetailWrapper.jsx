import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ActivityDetail from "../pages/ActivityDetail";
import { showActivity } from "../services/api";

export default function ActivityDetailWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [creator, setCreator] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [risks, setRisks] = useState([]);

  useEffect(() => {
    async function fetchActivity() {
      const res = await showActivity(id)
        setActivity(res.activity);
        setCreator(res.creator);
        setMaterials(res.materials);
        setRisks(res.risks);
    }
    fetchActivity();
  }, [id]);

  if (!activity) return <p>Cargando...</p>;

  return (
    <ActivityDetail
      activity={activity}
      creator={creator}
      materials={materials}
      risks={risks}
      onBack={() => navigate(-1)}
    />
  );
}
