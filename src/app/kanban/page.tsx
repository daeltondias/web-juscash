"use client";

import { CollisionPriority, UniqueIdentifier } from "@dnd-kit/abstract";
import { FilterType, publicationService } from "@/services/publicationService";
import { PublicationType } from "@/types/PublicationType";
import React, { useState, useEffect, memo } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { useSortable } from "@dnd-kit/react/sortable";
import { Icon, IconifyIcon } from "@iconify/react";
import { timeSince } from "@/utils/timeSince";
import { DivProps } from "@/types/props";
import { twMerge } from "tailwind-merge";
import { move } from "@dnd-kit/helpers";
import {
  DragOverlay,
  useDroppable,
  DragDropEvents,
  DragDropProvider,
} from "@dnd-kit/react";
import { formatDate } from "@/utils/formatDate";

type ItemType = PublicationType & { id: UniqueIdentifier };

type DetailsModalProps = {
  item: ItemType;
  open: boolean;
  onClose: () => void;
};

const DetailsModal: React.FC<DetailsModalProps> = memo(
  ({ open, onClose, item }) => {
    if (!open) return;
    return (
      <div
        className="absolute bg-black/5 backdrop-blur-xs inset-0 flex-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white w-2xl space-y-3 p-8 rounded-md shadow-md max-h-4/5 overflow-y-auto text-wrap"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start gap-x-3">
            <h1 className="text-secondary font-semibold text-lg flex-1">
              Publicação - {item.numero_processo}
            </h1>
            <button className="pressable-opacity -mr-3" onClick={onClose}>
              <Icon icon="material-symbols-light:close-rounded" fontSize={24} />
            </button>
          </div>
          <div>
            <p>Data de publicação do DJE:</p>
            <p>{formatDate(item.data_disponibilizacao)}</p>
          </div>
          <div>
            <p>Autor(es):</p>
            {item.autores ? (
              <ul className="list-disc pl-5">
                {item.autores.split(",").map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>--</p>
            )}
          </div>
          <div>
            <p>Réu:</p>
            <ul className="list-disc pl-5">
              <li>{item.reu}</li>
            </ul>
          </div>
          <div>
            <p>Advogado(os):</p>
            {item.advogados ? (
              <ul className="list-disc pl-5">
                {item.advogados.split(",").map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>--</p>
            )}
          </div>
          {/* prettier-ignore */}
          <div>
            <p>Valor principal bruto / líquido</p>
            {item.valor_bruto !== null && <p>{formatCurrency(item.valor_bruto)} (bruto)</p>}
            {item.valor_liquido !== null && <p>{formatCurrency(item.valor_liquido)} (líquido)</p>}
            {item.valor_bruto === null && item.valor_liquido === null && <p>--</p>}
          </div>
          <div>
            <p>Valor dos juros moratórios</p>
            <p>{formatCurrency(item.valor_juros)}</p>
          </div>
          <div>
            <p>Valor dos honorários advocatícios</p>
            <p>{formatCurrency(item.honorarios)}</p>
          </div>
          <div className="space-y-2">
            <p>Conteúdo da Publicação</p>
            <p className="text-sm text-gray-600">{item.conteudo}</p>
          </div>
        </div>
      </div>
    );
  }
);

type CardProps = {
  data: ItemType;
  isOverlay?: boolean;
  isDragging?: boolean;
  isDragSource?: boolean;
  onClick?: () => void;
};

const Card: React.FC<CardProps> = memo(
  ({ data, isDragging, isDragSource, isOverlay, onClick }) => {
    if (isDragging || isDragSource) {
      return (
        <div className="h-[4rem] bg-black/10 rounded-sm text-gray-600 flex-center border border-dashed border-black/20">
          Solte aqui
        </div>
      );
    }
    return (
      <div
        onClick={onClick}
        className={twMerge(
          "h-[4rem] bg-white shadow-md px-3 py-2 rounded-sm text-gray-600 space-y-1.5 cursor-pointer select-none border border-white hover:border-secondary outline-none",
          isOverlay && "border-secondary"
        )}
      >
        <div>{data.numero_processo}</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-1.5">
            <Icon icon="mdi:clock-time-four-outline" />
            <span className="text-xs">
              {timeSince(data.data_disponibilizacao)}
            </span>
          </div>
          <div className="flex items-center gap-x-1.5">
            <Icon icon="mdi:calendar-blank-outline" />
            <span className="text-xs">
              {formatDate(data.data_disponibilizacao)}
            </span>
          </div>
          <div></div>
        </div>
      </div>
    );
  }
);

type SortableProps = {
  id: UniqueIdentifier;
  index: number;
  column: string;
  item: ItemType;
  disabled?: boolean;
};

const Sortable: React.FC<SortableProps> = memo(
  ({ id, index, column, item, disabled }) => {
    const [detalsOpened, setDetalsOpened] = useState(false);
    const { ref, isDragging, isDragSource } = useSortable({
      id,
      index,
      type: "item",
      accept: "item",
      group: column,
      data: { column, item },
      disabled,
    });
    return (
      <>
        <div ref={ref}>
          <Card
            data={item} //
            isDragging={isDragging}
            isDragSource={isDragSource}
            onClick={() => setDetalsOpened(true)}
          />
        </div>
        <DetailsModal
          item={item}
          open={detalsOpened}
          onClose={() => setDetalsOpened(false)}
        />
      </>
    );
  }
);

type ColumnProps = {
  children: DivProps["children"];
  id: UniqueIdentifier;
  disabled?: boolean;
  items: ItemType[];
  loading?: boolean;
  header: {
    icon?: IconifyIcon | string;
    done?: boolean;
    title: string;
  };
};

const Column: React.FC<ColumnProps> = memo(
  ({ id, items, header, disabled, loading, children }) => {
    const { ref } = useDroppable({
      id,
      type: "column",
      accept: "item",
      collisionPriority: CollisionPriority.Low,
      data: { column: id },
      disabled,
    });
    return (
      <div className="bg-neutral-1 flex-1 flex flex-col">
        <div
          className={twMerge(
            "border border-gray-300 p-4 text-secondary font-medium flex items-center gap-x-4",
            header.done && "text-primary"
          )}
        >
          <div className="flex items-center gap-x-1.5">
            {header.icon && <Icon icon={header.icon} />}
            {header.title}
          </div>
          <small className="text-gray-500">{items.length}</small>
        </div>
        <div
          className="p-3 space-y-3 flex-1 overflow-y-auto scrollbar-thin"
          ref={ref}
        >
          {loading ? (
            <div className="flex-center my-4">
              <Icon
                icon="line-md:loading-twotone-loop"
                className="text-secondary text-3xl"
              />
            </div>
          ) : (
            <>
              {children}
              {!items.length && (
                <div className="text-center text-gray-500 mt-4">
                  Nenhum card encontrado
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
);

export default function PageScreen() {
  const [filter, setFilter] = useState<FilterType>();
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  const [overlayItem, setOverlayItem] = useState<ItemType>();

  const [items, setItems] = useState<Record<string, ItemType[]>>({
    container1: [],
    container2: [],
    container3: [],
    container4: [],
  });

  const headders: Record<string, ColumnProps["header"]> = {
    container1: { title: "Publicações Novas" },
    container2: { title: "Publicações Lidas" },
    container3: { title: "Publicações Enviadas para ADV" },
    container4: { title: "Concluídas", icon: "pajamas:todo-done", done: true },
  };

  const status: Record<string, ItemType["status"]> = {
    container1: "nova",
    container2: "lida",
    container3: "processada",
    container4: "concluida",
  };

  const setLoadingData = (value: boolean, searching?: boolean) => {
    if (searching) setSearching(value);
    else setLoading(value);
  };

  const getData = async (searching?: boolean) => {
    try {
      setLoadingData(true, searching);
      const response = await publicationService.getAllPublications(filter);
      const data = response.data as ItemType[];
      data.map((item) => {
        item.id = item._id;
      });
      setItems({
        container1: data.filter((item) => item.status === "nova"),
        container2: data.filter((item) => item.status === "lida"),
        container3: data.filter((item) => item.status === "processada"),
        container4: data.filter((item) => item.status === "concluida"),
      });
    } finally {
      setLoadingData(false, searching);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const updatePublicationStatus = (id: string, column: string) => {
    const newStatus = status[column];
    setItems((items) => {
      items[column].map((item) => {
        if (item._id === id) {
          item.status = newStatus;
        }
      });
      return { ...items };
    });
    publicationService.updatePublicationStatus(id, {
      status: newStatus,
    });
  };

  const onDragStart: DragDropEvents["dragstart"] = (event) => {
    setOverlayItem(event.operation.target?.data?.item as ItemType);
  };

  const onDragOver: DragDropEvents["dragover"] = (event) => {
    setItems((items) => move(items, event));
  };

  const onDragEnd: DragDropEvents["dragend"] = (event) => {
    const item = event.operation.source?.data?.item as ItemType;
    const column = event.operation.target?.data?.column as string;
    if (item && column && item.status !== status[column]) {
      updatePublicationStatus(item._id, column);
    }
  };

  // const disabled = (column: string) => {
  //   if (
  //     (overlayItem?.status === "lida" ||
  //       overlayItem?.status === "processada") &&
  //     column === "container1"
  //   ) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  return (
    <div className="h-screen flex flex-col">
      <header className="shadow flex items-center justify-between px-6 py-4">
        <div className="flex-center gap-x-1">
          <Icon
            icon="tabler:clock-dollar"
            className="text-3xl max-sm:text-2xl text-primary translate-y-0.5"
          />
          <span className="text-secondary font-bold text-4xl max-sm:text-3xl">
            JusCash
          </span>
        </div>
        <button className="flex-center text-secondary pressable-opacity gap-x-1.5 text-base font-medium">
          <Icon icon="mdi:logout-variant" fontSize={24} />
          Sair
        </button>
      </header>
      <main className="flex-1 flex flex-col overflow-y-hidden">
        <div
          className={twMerge(
            "flex items-center gap-x-6 gap-y-3 py-6 mt-8 max-sm:mt-0 w-full max-w-7xl mx-auto transition-all duration-300",
            "max-[75rem]:flex-col max-[75rem]:items-start max-[83rem]:px-6"
          )}
        >
          <div className="flex-1">
            <div className="text-secondary font-medium text-4xl max-sm:text-3xl flex items-center">
              <Icon icon="healthicons:justice-outline" />
              Publicações
            </div>
          </div>
          <div className="flex items-center gap-x-6 gap-y-3 max-[60rem]:flex-col max-[60rem]:items-start max-[75rem]:w-full">
            <div className="w-[31.25rem] max-w-[31.25rem] max-[75rem]:w-full">
              <div className="text-secondary font-medium max-sm:text-sm">
                Pesquisar
              </div>
              <input
                type="text"
                className="input w-full text-sm !px-1 !h-auto"
                placeholder="Digite o número do processo ou o nome das partes envolvidas"
                onChange={(event) => {
                  setFilter((prev) => ({
                    ...prev,
                    search: event.target.value,
                  }));
                }}
              />
            </div>
            <div>
              <div className="text-secondary font-medium">Data do diário</div>
              <div className="flex items-center gap-x-3 max-[26.563rem]:gap-x-2.5 max-[24.813rem]:gap-x-1.5">
                <label>De:</label>
                <input
                  type="date"
                  className="input text-sm !px-1 !h-auto max-[26.563rem]:max-w-[7.5rem]"
                  onChange={(event) => {
                    setFilter((prev) => ({
                      ...prev,
                      data_inicial: event.target.value,
                    }));
                  }}
                />
                <label>Até:</label>
                <input
                  type="date"
                  className="input text-sm !px-1 !h-auto max-[26.563rem]:max-w-[7.5rem]"
                  onChange={(event) => {
                    setFilter((prev) => ({
                      ...prev,
                      data_final: event.target.value,
                    }));
                  }}
                />
                <button
                  type="button"
                  className="button !h-[1.375rem] !w-[1.375rem] !p-0"
                  onClick={() => getData(true)}
                >
                  <Icon
                    icon={searching ? "eos-icons:loading" : "mdi:search"}
                    className={twMerge(searching && "text-sm", "text-base")}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <DragDropProvider
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <div className="flex-1 flex flex-col overflow-x-auto scrollbar-thin">
            <div className="flex-1 flex w-7xl mx-auto gap-x-2 overflow-y-hidden">
              {Object.entries(items).map(([column, items]) => (
                <Column
                  id={column}
                  key={column}
                  items={items}
                  header={headders[column]}
                  loading={loading}
                  // disabled={disabled(column)}
                >
                  {items.map((item, index) => (
                    <Sortable
                      id={item.id}
                      key={item.id}
                      index={index}
                      column={column}
                      item={item}
                      // disabled={disabled(column)}
                    />
                  ))}
                </Column>
              ))}
              <DragOverlay>
                {overlayItem && <Card data={overlayItem} isOverlay />}
              </DragOverlay>
            </div>
          </div>
        </DragDropProvider>
      </main>
    </div>
  );
}
