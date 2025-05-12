import { PublicationType } from "@/types/PublicationType";
import { AxiosResponse } from "axios";
import { api } from "@/lib/axios";

type ResponseType<T = unknown> = Promise<AxiosResponse<T>>;

export type FilterType = {
  data_inicial?: Date | string;
  data_final?: Date | string;
  search?: string;
};

type ServiceType = {
  getAllPublications: (filter?: FilterType) => ResponseType<PublicationType[]>;
  updatePublicationStatus: (
    id: string,
    data: Pick<PublicationType, "status">
  ) => ResponseType;
};

export const publicationService: ServiceType = {
  getAllPublications: async (filter) => {
    return api({
      method: "GET",
      url: "/publications",
      params: filter,
    });
  },
  updatePublicationStatus: async (id, data) => {
    return api({
      method: "PATCH",
      url: `/publications/${id}`,
      data,
    });
  },
};
