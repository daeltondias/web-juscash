import { TimestampsType } from "./TimestampsType";

export type PublicationType = {
  _id: string;
  numero_processo: string;
  data_disponibilizacao: string;
  autores: string;
  advogados: string;
  conteudo: string;
  valor_bruto: number;
  valor_liquido: number;
  valor_juros: number;
  honorarios: number;
  status: "nova" | "lida" | "processada" | "concluida";
  reu: string;
} & TimestampsType;
