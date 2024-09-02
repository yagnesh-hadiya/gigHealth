import { RightJobContentData } from "../../../../types/JobsTypes";
import NoRecordsMessage from "./NoRecordsMessage";
import RightJobCard from "./RightJobCard";

const RightJobContent = (data: any) => {
  return (
    <>
      {data?.data && data?.data?.length > 0 ? (
        data?.data?.map((card: RightJobContentData, index: number) => {
          return (
            <RightJobCard
              key={index}
              Id={card?.Id}
              ApplicantCount={card?.ApplicantCount}
              Title={card?.Title}
              Facility={card?.Facility}
              Location={card?.Location}
              JobProfession={card?.JobProfession}
              JobSpeciality={card?.JobSpeciality}
              ContractLength={card?.ContractLength}
              ContractStartDate={card?.ContractStartDate}
              NoOfOpenings={card?.NoOfOpenings}
              MinYearsExperience={card?.MinYearsExperience}
              TotalGrossPay={card?.TotalGrossPay}
              BillRate={card?.BillRate}
              ShiftStartTime={card?.ShiftStartTime}
              ShiftEndTime={card?.ShiftEndTime}
              HrsPerWeek={card?.HrsPerWeek}
              NoOfShifts={card?.NoOfShifts}
              Description={card?.Description}
              RegularHourlyRate={card?.RegularHourlyRate}
              HousingStipend={card?.HousingStipend}
              MealsAndIncidentals={card?.MealsAndIncidentals}
              HolidayRate={card?.HolidayRate}
              OnCallRate={card?.OnCallRate}
              TravelReimbursement={card?.TravelReimbursement}
              CreatedOn={card?.CreatedOn}
              CompChecklist={card?.CompChecklist}
              JobStatus={card?.JobStatus}
              JobShift={card?.JobShift}
              OvertimeRate={card?.OvertimeRate}
              CallBackRate={card?.CallBackRate}
              OvertimeHrsPerWeek={card?.OvertimeHrsPerWeek}
              DaysOnAssignment={card?.DaysOnAssignment}
              DoubleTimeRate={card?.DoubleTimeRate}
            />
          );
        })
      ) : (
        <NoRecordsMessage
          msg="No job data available at the moment"
          styles={{ marginTop: "18%" }}
        />
      )}
    </>
  );
};

export default RightJobContent;
