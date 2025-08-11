import { Status } from "./types/status";
const store = new Map<string, Status>();

export const setStatus = (id: string, status: Status) => {
  store.set(id, status);
};

export const getStatus = (id: string) => store.get(id) || null;
