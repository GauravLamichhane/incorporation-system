import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

export const createCompany = (data) =>
  axios.post(`${BASE_URL}/companies/`, data);

export const updateCompany = (id, data) =>
  axios.patch(`${BASE_URL}/companies/${id}/`, data);

export const getCompany = (id) => axios.get(`${BASE_URL}/companies/${id}/`);

export const addShareholders = (companyId, data) =>
  axios.post(`${BASE_URL}/companies/${companyId}/shareholders/`, data);

export const getAllCompanies = () => axios.get(`${BASE_URL}/companies/`);
