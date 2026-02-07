import axios from "axios";

const API = axios.create({
  baseURL: "https://ra-backend-61n5.onrender.com/api", 
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --- Recipe App API Methods ---

// 1. Auth (Login/Register/Forgot Password)
export const signupAPI = (data) => API.post("/user/register", data);
export const loginAPI = (data) => API.post("/user/login", data);
export const forgotPasswordAPI = (data) => API.post("/user/forgot-password", data);
export const resetPasswordAPI = (id, token, data) => API.post(`/user/reset-password/${id}/${token}`, data);

// 2. Recipes
export const fetchAllRecipes = () => API.get("/recipes/get-all-recipes");
export const createRecipeAPI = (data) => API.post("/recipes/create-recipes", data);
export const getMyRecipes = (userId) => API.get(`/recipes/user/${userId}`);
export const deleteRecipeAPI = (id) => API.delete(`/recipes/delete-recipes/${id}`);
export const fetchRecipeById = (id) => API.get(`/recipes/get-recipes/${id}`);
export const updateRecipeAPI = (id, formData) => API.put(`/recipes/update-recipes/${id}`, formData);

// 3. Feedback
// export const sendFeedbackAPI = (data) => API.post("/user/send-feedback", data);
export const sendFeedbackAPI = (feedbackData) => API.post("/user/send-feedback", feedbackData);
export default API;