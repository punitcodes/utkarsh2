import axios, { AxiosResponse } from "axios";

export const axiosPost = <A, B>(
  url: string,
  { arg }: { arg: A }
): Promise<AxiosResponse<B, any>> => axios.post(url, arg);
