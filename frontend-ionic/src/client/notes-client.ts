import axios, { AxiosResponse } from "axios";
import { INote } from "./interfaces";

const useProductionUrl = process.env.NODE_ENV === "production";

const API_URL = useProductionUrl
  ? `https://backend-api-m55qthxfka-ew.a.run.app/`
  : `http://localhost:5000/`;

export const getNoteById = async (id) => {
  console.log(`getNoteById(${id}) with id`, id);

  const { data } = await axios.get(API_URL + `notes/${id}`);
  return data;
};

export const updateNote = (id) => (note: Partial<INote>) => {
  console.log(`updateNote(${id}) with note`, note);

  return axios.patch(API_URL + `notes/${id}`, note);
};

export const createNote = (note: Partial<INote>) => {
  console.log(`createNote(note) where note=`, note);

  return axios.post(API_URL + `notes/`, note) as Promise<AxiosResponse<INote>>;
};
