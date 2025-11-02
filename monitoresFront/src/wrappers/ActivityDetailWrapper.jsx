import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ActivityDetail from "../pages/ActivityDetail";

export default function ActivityDetailWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [creator, setCreator] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [risks, setRisks] = useState([]);

  useEffect(() => {
    axios.get(`/api/activities/${id}`)
      .then(res => {
        setActivity(res.data.activity);
        setCreator(res.data.creator);
        setMaterials(res.data.materials);
        setRisks(res.data.risks);
      })
      .catch(err => console.error(err));
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
