// import { Orders } from "@/types/orderType";
import { EventItem, ClubState } from "@/types/clubType";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT = "http://localhost:8000/api/club"
axios.defaults.withCredentials = true;

export const useClubStore = create<ClubState>()(persist((set) => ({
    loading: false,
    club: null,
    searchedClub: null,
    allClubs: null,
    appliedFilter: [],
    singleClub: null,
    // clubOrder: [],
    createClub: async (formData: FormData) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false });
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    getClub: async () => {
        try {
            set({ loading: true });
            const response = await axios.get(`${API_END_POINT}/`);
            if (response.data.success) {
                set({ loading: false, club: response.data.club });
            }
        } catch (error: any) {
            if (error.response.status === 404) {
                set({ club: null });
            }
            set({ loading: false });
        }
    },
    updateClub: async (formData: FormData) => {
        try {
            set({ loading: true });
            const response = await axios.put(`${API_END_POINT}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false });
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    searchClub: async (searchText: string, searchQuery: string, selectedEvents: any) => {
        try {
            set({ loading: true });

            const params = new URLSearchParams();
            params.set("searchQuery", searchQuery);
            params.set("selectedEvents", selectedEvents.join(","));

            const response = await axios.get(`${API_END_POINT}/search/${searchText}?${params.toString()}`);
            if (response.data.success) {
                set({ loading: false, searchedClub: response.data });
            }
        } catch (error) {
            set({ loading: false });
        }
    },
    addEventToClub: (event: EventItem) => {
        set((state: any) => ({
            club: state.club ? { ...state.club, events: [...state.club.events, event] } : null,
        }))
    },
    updateEventToClub: (updatedEvent: EventItem) => {
        set((state: any) => {

            if (state.club) {
                const updatedEventList = state.club.events.map((event: any) => event._id === updatedEvent._id ? updatedEvent : event);
                return {
                    club: {
                        ...state.club,
                        events: updatedEventList
                    }
                }
            }
            // if state.club is undefined then return state
            return state;
        })
    },
    setAppliedFilter: (value: string) => {
        set((state) => {
            const isAlreadyApplied = state.appliedFilter.includes(value);
            const updatedFilter = isAlreadyApplied ? state.appliedFilter.filter((item) => item !== value) : [...state.appliedFilter, value];
            return { appliedFilter: updatedFilter }
        })
    },
    resetAppliedFilter: () => {
        set({ appliedFilter: [] })
    },
    getSingleClub: async (clubId: string) => {
        try {
            const response = await axios.get(`${API_END_POINT}/${clubId}`);
            if (response.data.success) {
                set({ singleClub: response.data.club })
            }
        } catch (error) {
            console.log(error);
        }
    },
    // getClubOrders: async () => {
    //     try {
    //         const response = await axios.get(`${API_END_POINT}/order`);
    //         if (response.data.success) {
    //             set({ clubOrder: response.data.orders });
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // },
    // updateClubOrder: async (orderId: string, status: string) => {
    //     try {
    //         const response = await axios.put(`${API_END_POINT}/order/${orderId}/status`, { status }, {
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         if (response.data.success) {
    //             const updatedOrder = get().clubOrder.map((order: Orders) => {
    //                 return order._id === orderId ? { ...order, status: response.data.status } : order;
    //             })
    //             set({ clubOrder: updatedOrder });
    //             toast.success(response.data.message);
    //         }
    //     } catch (error: any) {
    //         toast.error(error.response.data.message);
    //     }
    // },
    fetchAllClubs: async () => {
        try {
            set({ loading: true });
            // console.log("start");
            
            const response = await axios.get(`http://localhost:8000/api/clubs`);
            // console.log("Response", response);
            // console.log("Response data", response.data);

            if (response.data.success) {
                set({ loading: false, allClubs: response.data.club });
            }
        } catch (error: any) {
            console.log("Error", error);
            if (error.response && error.response.status === 404) {
                set({ allClubs: null });
            }
            set({ loading: false });
        }
    }
}), {
    name: 'club-name',
    storage: createJSONStorage(() => localStorage)
}))