import { produce } from "immer";
import { create } from "zustand";
import { devtools } from "zustand/middleware";


const ACTION_TYPES = {
 SET_FLOW: "setFlow",
 SET_ITINERARY: "setItinerary"  
};

interface GlobalStore {
  flow: string;
  itineraryId: string;
}

const initialState: GlobalStore = {
  flow: "welcome",
  itineraryId:''
};

const store = (set: Function, get: Function) => {
  const actions = {
    
    setFlow: (payload: { flow: any }) =>
      set(
        produce((draft: GlobalStore) => {
          draft.flow = payload.flow;
        }),
        false,
        {
          type: ACTION_TYPES.SET_FLOW,
          payload,
        }
      ),
    setItinerary: (payload: { itineraryId: any }) =>
      set(
        produce((draft: GlobalStore) => {
          draft.itineraryId = payload.itineraryId;
        }),
        false,
        {
          type: ACTION_TYPES.SET_ITINERARY,
          payload,
        }
      )
  };

  return {
    ...initialState,
    ...actions,
  };
};

const devStore = devtools(store, { anonymousActionType: "globalActionType" });

const useGlobalStore = create(devStore);

export default useGlobalStore;
