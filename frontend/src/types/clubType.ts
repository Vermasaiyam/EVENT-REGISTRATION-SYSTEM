
export type EventItem = {
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
}
export type Club = {
    _id: string;
    user: string;
    clubName: string;
    eventTypes: string[];
    coreTeam: string[];
    imageUrl: string;
    events: EventItem[];
}

export type SearchedClub = {
    data: Club[]
}

export type ClubState = {
    loading: boolean;
    club: Club | null;
    searchedClub: SearchedClub | null;
    allClubs: SearchedClub | null;
    appliedFilter: string[];
    singleClub: Club | null,
    // clubOrder: Orders[],
    createClub: (formData: FormData) => Promise<void>;
    getClub: () => Promise<void>;
    updateClub: (formData: FormData) => Promise<void>;
    searchClub: (searchText: string, searchQuery: string, selectedCuisines: any) => Promise<void>;
    addEventToClub: (event: EventItem) => void;
    updateEventToClub: (event: EventItem) => void;
    setAppliedFilter: (value: string) => void;
    resetAppliedFilter: () => void;
    getSingleClub: (clubId: string) => Promise<void>;
    // getClubOrders: () => Promise<void>;
    // updateClubOrder: (orderId: string, status: string) => Promise<void>;
    fetchAllClubs: () => Promise<void>;
}