import axios from "axios";

// Use environment variable
const BASE_URL = import.meta.env.REACT_APP_API_URL;

export const createCompany = (data) =>
  axios.post(`${BASE_URL}/companies/`, data);

export const updateCompany = (id, data) =>
  axios.patch(`${BASE_URL}/companies/${id}/`, data);

export const getCompany = (id) => axios.get(`${BASE_URL}/companies/${id}/`);

export const addShareholders = (companyId, data) =>
  axios.post(`${BASE_URL}/companies/${companyId}/shareholders/`, data);

export const getAllCompanies = () => axios.get(`${BASE_URL}/companies/`);
