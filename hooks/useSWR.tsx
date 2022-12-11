import axios from "axios";
import useSWR, { SWRResponse } from "swr";

interface GetRequest {
  url: string;
}

const get = (url: string) => axios.get(url).then((res) => res.data);

export const useGetRequest = <Data, Error extends SWRResponse<Data, Error>>({
  url,
}: GetRequest) => {
  const result = useSWR(url, get);

  return result;
};
