
interface SearchJobList {
    Id: number;
    Title: string;
    HrsPerWeek: number;
    NoOfOpenings: number;
    TotalGrossPay: number;
    JobType: string;
    CreatedOn: string;
    JobProfession: {
        Id: number;
        Profession: string;
    };
    JobSpeciality: {
        Id: number;
        Speciality: string;
    };
    JobStatus: {
        Id: number;
        Status: string;
    };
    Facility: {
        Id: number;
        State: {
            Id: number;
            State: string;
        };
    };
}