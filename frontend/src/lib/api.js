import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  timeout: 120000,
});

// Session id for chat/progress continuity
export const getSessionId = () => {
  let id = localStorage.getItem("relaunch_session_id");
  if (!id) {
    id = `rl-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
    localStorage.setItem("relaunch_session_id", id);
  }
  return id;
};

export const getUserName = () => localStorage.getItem("relaunch_user_name") || "";
export const setUserName = (name) => localStorage.setItem("relaunch_user_name", name);
