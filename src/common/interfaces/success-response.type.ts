export type Response<T> = {
  status: 'success' | 'error';
  payload: T | null;
  message: string | null;
};
