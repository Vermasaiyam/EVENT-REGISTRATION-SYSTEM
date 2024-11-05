import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useClubStore } from "./useClubStore";

const API_END_POINT = "http://localhost:8000/api/event";
axios.defaults.withCredentials = true;

type EventState = {
    loading: boolean,
    event: null,
    createEvent: (formData: FormData) => Promise<void>;
    editEvent: (eventId: string, formData: FormData) => Promise<void>;
}

export const useEventStore = create<EventState>()(persist((set) => ({
    loading: false,
    event: null,
    createEvent: async (formData: FormData) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false, event: response.data.event });
            }
            // update club 
            useClubStore.getState().addEventToClub(response.data.event);
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    editEvent: async (eventId: string, formData: FormData) => {
        try {
            set({ loading: true });
            const response = await axios.put(`${API_END_POINT}/${eventId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false, event: response.data.event });
            }
            // update club event
            useClubStore.getState().updateEventToClub(response.data.event);
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
}), {
    name: "event-name",
    storage: createJSONStorage(() => localStorage)
}))