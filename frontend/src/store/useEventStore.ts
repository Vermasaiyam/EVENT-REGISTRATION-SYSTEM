import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useClubStore } from "./useClubStore";
import { EventState } from "@/types/eventType";

const API_END_POINT = "http://localhost:8000/api/event";
const END_POINT = "http://localhost:8000/api"
axios.defaults.withCredentials = true;


export const useEventStore = create<EventState>()(persist((set) => ({
    loading: false,
    event: null,
    allEvents: null,
    createEvent: async (formData: FormData) => {
        try {
            set({ loading: true });
            console.log("debugging");

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
    deleteEvent: async (id: string) => {
        try {
            set({ loading: true });
            const response = await axios.delete(`${API_END_POINT}/delete/${id}`);

            if (response.data.success) {
                toast.success(response.data.message);

                set((state) => ({
                    loading: false,
                    allEvents: state.allEvents ? state.allEvents.filter(event => event._id !== id) : null,
                }));

                // Remove event from club if needed
                useClubStore.getState().removeEventFromClub(id);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },

    fetchAllEvents: async () => {
        try {
            set({ loading: true });
            console.log("start");

            const response = await axios.get(`${END_POINT}/events`);
            // console.log("Response", response);
            console.log("Response data", response.data);

            if (response.data.success) {
                set({ loading: false, allEvents: response.data.event });
            }
        } catch (error: any) {
            console.log("Error", error);
            if (error.response && error.response.status === 404) {
                set({ allEvents: null });
            }
            set({ loading: false });
        }
    }
}), {
    name: "event-name",
    storage: createJSONStorage(() => localStorage)
}))