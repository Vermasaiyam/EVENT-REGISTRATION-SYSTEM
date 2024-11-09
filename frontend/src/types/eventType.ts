export type Event = {
    _id: string;
    name: string;
    description: string;
    mode: "Online" | "Offline";
    registrationFee: number;
    registrationEndDate: Date;
    eventStartDate: Date;
    eventEndDate: Date;
    startTime: string;
    endTime: string;
    image: string;
    formLink: string;
    images: string[];
    clubName?: string;
}

export type EventState = {
    loading: boolean;
    event: null;
    allEvents: Event[] | null;
    createEvent: (formData: FormData) => Promise<void>;
    editEvent: (eventId: string, formData: FormData) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;
    fetchAllEvents: () => Promise<void>;
}