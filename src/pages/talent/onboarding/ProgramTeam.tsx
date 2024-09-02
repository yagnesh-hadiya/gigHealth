import { formatPhoneNumber } from "../../../helpers";
import {
  ProfessionalEmploymentExpert,
  ProfessionalProgramManager,
} from "../../../types/StoreInitialTypes";

const ProgramTeam = ({
  team,
  manager,
}: {
  team: ProfessionalProgramManager | ProfessionalEmploymentExpert;
  manager: boolean;
}) => {
  return (
    <div className="team-details-wr">
      <p className="purple-text mb-2">
        {manager ? "Program Manager" : "Employment Expert"}
      </p>
      <div className="d-flex">
        <div className="icon-wr filled-icon me-2">
          <span className="material-symbols-outlined">person</span>
        </div>
        <div className="info-wr">
          <h3 style={{ marginBottom: "2px" }} className="text-capitalize">
            {team?.FirstName ? team?.FirstName : "-"}{" "}
            {team?.LastName ? team?.LastName : "-"}
          </h3>
          <div className="d-flex flex-wrap gap-0-16 mb-1">
            <p style={{ marginBottom: "2px" }}>
              Phone:{" "}
              <span className="fw-400">
                {team?.Phone ? formatPhoneNumber(team?.Phone) : "-"}
              </span>
            </p>
            <p style={{ marginBottom: "2px" }}>
              Email:{" "}
              <span className="fw-400">{team?.Email ? team?.Email : "-"}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramTeam;
