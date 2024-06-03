import moment from "moment";

import { createStore } from "zustand";
import { ScheduleStoreState, ScheduleStoreProps } from "./interfaces";

const initialData = {
  modalPatients: null,
  selectedDate: moment().toDate(),
  createSchedulingArgs: null,
  selectPatientsFilters: null,
  listCancelledEvents: true,
};

export const scheduleStore = (_?: Partial<ScheduleStoreProps>) => {

  return createStore<ScheduleStoreState>()((set) => ({
    ...initialData,
    setRemovedCancelledEvents: (listCancelledEvents) => set(state => ({...state, listCancelledEvents })),
    
    setOpportunities: (oppotunities) => set(state => ({...state, oppotunities })),

    setPatientsFilters: (patientsFilters) => set((state) => ({ ...state, patientsFilters })),

    changeDate: (date) => set((state) => ({ ...state, selectedDate: typeof date === "string" ? moment(date).toDate() : date })),

    setCreateSchedulingArgs: (createSchedulingArgs) => set((state) => ({ ...state, createSchedulingArgs })),

    setModalPatients: (params) => {
      set((state) => ({ ...state, modalPatients: params }));
    },
  }));
};
