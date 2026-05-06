const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("sl_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || data.message || "Something went wrong");
  }

  return data;
}

export const api = {
  post: (endpoint, body) =>
    request(endpoint, { method: "POST", body: JSON.stringify(body) }),
  get: (endpoint) => request(endpoint, { method: "GET" }),
  put: (endpoint, body) =>
    request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  patch: (endpoint, body) =>
    request(endpoint, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};

export const authAPI = {
  login: (credentials) => api.post("/auth/login/", credentials),
  signup: (data) => api.post("/auth/register/", data),
  verifyOTP: (data) => api.post("/auth/verify-otp/", data),
  resendOTP: (data) => api.post("/auth/resend-otp/", data),
  setNickname: (data) => api.post("/auth/set-nickname/", data),
  forgotPassword: (data) => api.post("/auth/forgot-password/", data),
};

export const userAPI = {
  getProfile: () => api.get("/users/profile/"),
  updateProfile: (data) => api.patch("/users/profile/", data),
  getProgress: () => api.get("/users/progress/"),
  getBadges: () => api.get("/users/badges/"),
};

export const lessonAPI = {
  getAll: () => api.get("/lessons/"),
  getById: (id) => api.get(`/lessons/${id}/`),
  markComplete: (id) => api.post(`/lessons/${id}/complete/`),
};

export const quizAPI = {
  getByLesson: (lessonId) => api.get(`/quiz/${lessonId}/`),
  submitAnswer: (data) => api.post("/quiz/submit/", data),
  submitResult: (data) => api.post("/quiz/result/", data),
};
