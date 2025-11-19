import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Routes for Users
const getUsers = async () => {
  const response = await axios.get(API_URL + "/users");
  return response.data;
};

const getProfile = async (userId = null) => {
  const url = userId
    ? `${API_URL}/profile/${userId}`
    : `${API_URL}/profile`;

  const response = await axios.get(url)
  return response.data;
};

const register = async (user) => {
  const response = await axios.post(API_URL + "/register", {
    name: user.name,
    email: user.email,
    password: user.password,
    password_confirmation: user.passwordConfirmation,
    role: user.role,
  });
  return response.data;
};

// export const updateUser = async (id, user) => {
//   const response = await axios.put(`${API_URL + "/users"}/${id}`, user);
//   return response.data;
// };

// export const deleteUser = async (id) => {
//   await axios.delete(`${API_URL + "/users"}/${id}`);
// };

// Friend request
const sendRequest = async (id) => {
  await axios.post(`${API_URL + "/friends/request"}/${id}`);
};

const acceptRequest = async (id) => {
  await axios.post(`${API_URL + "/friends/accept"}/${id}`);
};

const rejectRequest = async (id) => {
  await axios.delete(`${API_URL + "/friends/reject"}/${id}`);
};

const cancelRequest = async (id) => {
  await axios.delete(`${API_URL + "/friends/cancel"}/${id}`);
};

export const removeFriend = async (id) => {
  await axios.delete(`${API_URL + "/friends/remove"}/${id}`);
};


// Routes for Activities
const getActivities = async () => {
  const response = await axios.get(API_URL + "/activities");
  return response.data;
};

const deleteActivity = async (id) => {
  await axios.delete(`${API_URL + "/activities"}/${id}`);
};

const toggleFavorite = async (id) => {
  const response = await axios.post(`${API_URL + "/activities/favorite"}/${id}`);
  return response.data;
};

// Publicación de actividades
const submitPublic = async (id)  => {
  const response = await axios.put(API_URL + `/activities/submit/${id}`);
  return response.data;
};

const cancelSubmission = async (id)  => {
  const response = await axios.put(API_URL + `/activities/unsubmit/${id}`);
  return response.data;
};

const getPending = async () => {
  const response = await axios.get(API_URL + "/admin/activities/pending");
  return response.data;
};

const approveActivity = async (id) => {
  const response = await axios.put(API_URL + `/activities/approve/${id}`);
  return response.data;
};

const rejectActivity = async (id) => {
  const response = await axios.put(API_URL + `/activities/reject/${id}`);
  return response.data;
};


// Schedulres

const deleteSchedule = async (id) => {
  await axios.delete(`${API_URL + "/schedule"}/${id}`);
};


export { getActivities, deleteActivity, toggleFavorite, getUsers, getProfile, register, sendRequest, acceptRequest, rejectRequest, cancelRequest, submitPublic, cancelSubmission, getPending, approveActivity, rejectActivity, deleteSchedule };
