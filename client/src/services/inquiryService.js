import api from "./api";

export const createInquiry = (data) => api.post("/inquiries", data);
export const getInquiries = () => api.get("/inquiries");
