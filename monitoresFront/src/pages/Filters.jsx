import { useState } from "react";

export default function Filters({ activities, typeNames }) {
  const [filters, setFilters] = useState({
    title: "",
    type_id: "",
    edadMin: 0,
    edadMax: 99,
    participantes: "",
    ordenarPor: "",
  });