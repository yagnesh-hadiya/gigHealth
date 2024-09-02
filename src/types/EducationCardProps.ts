export type EducationCardProps = {
    Id: number;
    Degree: string;
    School: string;
    Location: string;
    DateStarted: string | Date;
    GraduationDate: null | Date | string;
    IsCurrentlyAttending?: boolean;
    setFetchData: React.Dispatch<React.SetStateAction<boolean>>;
}