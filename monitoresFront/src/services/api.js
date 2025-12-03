import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Routes for Users
export const getUsers = async () => {
  const response = await axios.get(API_URL + "/users");
  return response.data;
};

export const getProfile = async (userId = null) => {
  const url = userId
    ? `${API_URL}/profile/${userId}`
    : `${API_URL}/profile`;

  const response = await axios.get(url)
  return response.data;
};

export const register = async (user) => {
  const response = await axios.post(API_URL + "/register", {
    name: user.name,
    email: user.email,
    password: user.password,
    password_confirmation: user.passwordConfirmation,
    role: user.role,
  });
  return response.data;
};

export const updateUser = async (id, name, description, email, password, password_confirmation, url_image) => {
    const payload = { name, description, email, url_image };

    if (password && password_confirmation) {
        payload.password = password;
        payload.password_confirmation = password_confirmation;
    }

    const response = await axios.put(`${API_URL}/user/${id}`, payload);
    return response.data;
};

export const deleteUser = async (id) => {
  await axios.delete(`${API_URL + "/user"}/${id}`);
};

// Friend request
export const sendRequest = async (id) => {
  await axios.post(`${API_URL + "/friends/request"}/${id}`);
};

export const acceptRequest = async (id) => {
  await axios.post(`${API_URL + "/friends/accept"}/${id}`);
};

export const rejectRequest = async (id) => {
  await axios.delete(`${API_URL + "/friends/reject"}/${id}`);
};

export const cancelRequest = async (id) => {
  await axios.delete(`${API_URL + "/friends/cancel"}/${id}`);
};

export const removeFriend = async (id) => {
  await axios.delete(`${API_URL + "/friends/remove"}/${id}`);
};

// Activity formData
export const getFormData = async () => {
  const response = await axios.get(API_URL + "/activities/formData");
  return response.data;
};


// Routes for Activities
export const getActivities = async () => {
  const response = await axios.get(API_URL + "/activities");
  return response.data;
};

export const showActivity = async (activityId) => {
  const response = await axios.get(API_URL + `/activities/${activityId}`);
  return response.data;
};

export const storeActivity = async (formData) => {
  const response = await axios.post(API_URL + "/activities/store", formData);
  return response.data;
};

export const updateActivity = async (activityId, formData) => {
  const response = await axios.put(API_URL + `/activities/${activityId}`, formData);
  return response.data;
};


export const deleteActivity = async (id) => {
  await axios.delete(`${API_URL + "/activities"}/${id}`);
};

export const toggleFavorite = async (id) => {
  const response = await axios.post(`${API_URL + "/activities/favorite"}/${id}`);
  return response.data;
};

// Publicación de actividades
export const submitPublic = async (id)  => {
  const response = await axios.put(API_URL + `/activities/submit/${id}`);
  return response.data;
};

export const cancelSubmission = async (id)  => {
  const response = await axios.put(API_URL + `/activities/unsubmit/${id}`);
  return response.data;
};

export const getPending = async () => {
  const response = await axios.get(API_URL + "/admin/activities/pending");
  return response.data;
};

export const approveActivity = async (id) => {
  const response = await axios.put(API_URL + `/admin/approve/${id}`);
  return response.data;
};

export const rejectActivity = async (id) => {
  const response = await axios.put(API_URL + `/admin/reject/${id}`);
  return response.data;
};

export const getTopFavoriteActivities = async () => {
  const response = await axios.get(`${API_URL}/activities/top-favorites`);
  return response.data.top_favorites;
};


// Schedules
export const getSchedule = async (id) => {
  const response = await axios.get(`${API_URL + "/schedule"}/${id}`);
  return response.data;
};

export const storeSchedule = async (name, description, cellMap ) => {
  const cell_map = JSON.parse(JSON.stringify(cellMap))
  const response = await axios.post(API_URL + "/schedule/store", {name, description, cell_map});
  return response.data;
};

export const updateSchedule = async (id, name, description, cellMap) => {
  const cell_map = JSON.parse(JSON.stringify(cellMap))
  const response = await axios.put(`${API_URL}/schedule/${id}`, {name, description, cell_map});
  return response.data;
};

export const deleteSchedule = async (id) => {
  await axios.delete(`${API_URL + "/schedule"}/${id}`);
};

// Imprimir en PDF
export const printActivity = async (id) => {
  const response = await axios.get(`${API_URL}/pdf/activity/${id}`, {
    responseType: "blob",
  });
  return response.data; // solo devuelve el PDF
};

export const openActivityPdf = async (id) => {
  const pdfData = await printActivity(id); // aquí sí lo usamos
  const url = window.URL.createObjectURL(
    new Blob([pdfData], { type: "application/pdf" })
  );
  window.open(url);
};

// Imprimir en PDF
export const openSchedulePdf = async (id) => {
  const response = await axios.get(`${API_URL}/pdf/schedule/${id}`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(response.data);
  window.open(url);
};

// Get types
export const getTypes = async () => {
  const response = await axios.get(API_URL + "/types");
  return response.data;
};
