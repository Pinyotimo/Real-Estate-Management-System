import API from '../api';

export const getProperty = async (id) => {
  const { data } = await API.get(`/properties/${id}`);
  return data.data;
};

export const updateProperty = async (id, payload) => {
  const { data } = await API.put(`/properties/${id}`, payload);
  return data.data;
};