export type FacilityJobsHeaderProps = {
    handleAddJob: () => void;
    search: string;
    handleSearch: (text: string) => void;
    state: any;
    dispatch: React.Dispatch<any>;
    total: number;
}