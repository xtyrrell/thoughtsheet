import axios, { AxiosResponse } from "axios";
import { INote } from "./interfaces";

export const getNoteById = async (id) => {
  const { data } = await axios.get(
    // `https://backend-api-m55qthxfka-ew.a.run.app/notes/${id}`
    `http://localhost:5000/notes/${id}`
  );
  return data;
};

export const updateNote = (id) => (note: Partial<INote>) => {
  console.log(`updateNote(${id}) with note`, note);
  return axios.patch(
    // `https://backend-api-m55qthxfka-ew.a.run.app/notes/${id}`,
    `http://localhost:5000/notes/${id}`,
    note
  );
};

export const createNote = (note: Partial<INote>) => {
  console.log(`createNote(note) where note=`, note);

  return axios.post(
    // `https://backend-api-m55qthxfka-ew.a.run.app/notes/${id}`,
    `http://localhost:5000/notes`,
    note
  ) as Promise<AxiosResponse<INote>>;
};
