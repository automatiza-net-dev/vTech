import { createContext, useRef, useContext } from "react";

import { useStore } from "zustand";
import { scheduleStore } from "./store";

import { ModalSetPatients, ModalCreateScheduling } from "./components";

import {
  ScheduleStoreType,
  ScheduleStoreProps,
  ScheduleStoreState,
} from "./interfaces";
import { ModalOpportunitie } from "./components/modal-opportunitie";

type ScheduleProviderProps = React.PropsWithChildren<ScheduleStoreProps>;

export const ConfigurationsEcommerceContext =
  createContext<ScheduleStoreType | null>(null);

function SchedulingContextProvider({
  children,
  ...props
}: ScheduleProviderProps) {
  const storeRef = useRef<ScheduleStoreType>(null);

  if (!storeRef.current) {
    storeRef.current = scheduleStore(props);
  }

  return (
    <ConfigurationsEcommerceContext.Provider value={storeRef.current}>
      {children}

      <ModalCreateScheduling />

      <ModalSetPatients />

      <ModalOpportunitie />
    </ConfigurationsEcommerceContext.Provider>
  );
}

function useScheduling<T>(selector: (state: ScheduleStoreState) => T): T {
  const store = useContext(ConfigurationsEcommerceContext);
  
  if (!store)
    return {} as T;

  return useStore(store, selector);
}

export { SchedulingContextProvider, useScheduling };
