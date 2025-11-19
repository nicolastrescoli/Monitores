import axios from "axios";

const API_URL = "http://localhost:8000/api";

// // Routes for Users
// export const getUsers = async () => {
//   const response = await axios.get(API_URL + "/users");
//   return response.data;
// };

const getProfile = async () => {
  const response = await axios.get(API_URL + "/profile");
  return response.data;
};

// export const createUser = async (user) => {
//   const response = await axios.post(API_URL + "/users", user);
//   return response.data;
// };

// export const updateUser = async (id, user) => {
//   const response = await axios.put(`${API_URL + "/users"}/${id}`, user);
//   return response.data;
// };

// export const deleteUser = async (id) => {
//   await axios.delete(`${API_URL + "/users"}/${id}`);
// };

// Routes for Activities
const getActivities = async () => {
  const response = await axios.get(API_URL + "/activities");
  return response.data;
};

// export const createPost = async (post)  => {
//   const response = await axios.post(API_URL + "/posts", post);
//   return response.data;
// };

// export const updatePost = async (id, post)  => {
//   const response = await axios.put(`${API_URL + "/posts"}/${id}`, post);
//   return response.data;
// };

const deleteActivity = async (id) => {
  await axios.delete(`${API_URL + "/activities"}/${id}`);
};

const toggleFavorite = async (id)  => {
  const response = await axios.post(`${API_URL + "/activities/favorite"}/${id}`);
  return response.data;
};

// // Routes for Comments
// export const getComments = async () => {
//   const response = await axios.get(API_URL + "/comments");
//   return response.data;
// };

// export const createComment = async (comment) => {
//   const response = await axios.post(API_URL + "/comments", comment);
//   return response.data;
// };

// export const updateComment = async (id, comment) => {
//   const response = await axios.put(`${API_URL + "/comments"}/${id}`, comment);
//   return response.data;
// };

// export const deleteComment = async (id) => {
//   await axios.delete(`${API_URL + "/comments"}/${id}`);
// };

export { 
  getActivities,
  deleteActivity,
  toggleFavorite,
  getProfile
}