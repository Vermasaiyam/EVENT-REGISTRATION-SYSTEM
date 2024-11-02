import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

export type FilterOptionsState = {
    id: string;
    label: string;
};

const filterOptions: FilterOptionsState[] = [
    { id: "hackathon", label: "Hackathon" },
    { id: "quiz", label: "Quiz" },
    { id: "nukkad", label: "Nukkad" },
    { id: "workshop", label: "Workshop" },
    { id: "seminar", label: "Seminar" },
    { id: "webinar", label: "Webinar" },
    { id: "tech_talk", label: "Tech Talk" },
    { id: "coding_contest", label: "Coding Contest" },
    { id: "debate_competition", label: "Debate Competition" },
    { id: "networking_event", label: "Networking Event" },
];

const FilterPage = () => {
    // const { setAppliedFilter, appliedFilter, resetAppliedFilter } = useClubStore();
    const appliedFilterHandler = (value: string) => {
        // setAppliedFilter(value);
    };
    return (
        <div className="md:w-72 mx-2">
            <div className="flex items-center justify-between">
                <h1 className="font-medium text-lg">Filter by Types of Events</h1>
                <Button variant={"link"}>Reset</Button>
            </div>
            {filterOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 my-5">
                    <Checkbox
                        id={option.id}
                        // checked={appliedFilter.includes(option.label)}
                        onClick={() => appliedFilterHandler(option.label)}
                    />
                    <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {option.label}
                    </Label>
                </div>
            ))}
        </div>
    )
}

export default FilterPage