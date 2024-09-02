import { Card, CardBody } from "reactstrap";
import MyTeamAvatar from "../../../../src/assets/images/my_team_avt.png";
import { authDetails } from "../../../types/StoreInitialTypes";
import { formatPhoneNumber } from "../../../helpers";

const TeamCard = ({ ProgramManager, EmploymentExpert }: authDetails) => {
  return (
    <div>
      {ProgramManager && (
        <Card className="team-card">
          <CardBody className="team-card-body">
            <h2 className="team-main-title mb-3">Program Manager</h2>
            <div className="d-flex mb-3">
              <div className="team-avatar-wr">
                <img src={MyTeamAvatar} alt="logo" className="img-logo" />
              </div>
              <div>
                <h3 className="mb-1 text-capitalize">
                  {ProgramManager ? ProgramManager?.FirstName : "-"}{" "}
                  {ProgramManager ? ProgramManager?.LastName : "-"}
                </h3>
                <p className="mb-1">
                  Phone:
                  <span className="fw-400">
                    {" "}
                    {ProgramManager
                      ? formatPhoneNumber(ProgramManager?.Phone)
                      : "-"}
                  </span>
                </p>
                <p className="mb-1">
                  Email:
                  <span className="fw-400">
                    {" "}
                    {ProgramManager ? ProgramManager?.Email : "-"}
                  </span>
                </p>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <div className="filled-icon me-1">
                <span className="material-symbols-outlined green-call">
                  call
                </span>
              </div>
              <p className="fw-400 mb-1">
                Contact me if you need any assistance with your current
                assignment!
              </p>
            </div>
          </CardBody>
        </Card>
      )}
      {EmploymentExpert && (
        <Card className="team-card">
          <CardBody className="team-card-body">
            <h2 className="team-main-title mb-3">Employment Expert</h2>
            <div className="d-flex mb-3">
              <div className="team-avatar-wr">
                <img src={MyTeamAvatar} alt="logo" className="img-logo" />
              </div>
              <div>
                <h3 className="mb-1 text-capitalize">
                  {EmploymentExpert ? EmploymentExpert?.FirstName : "-"}{" "}
                  {EmploymentExpert ? EmploymentExpert?.LastName : "-"}
                </h3>
                <p className="mb-1">
                  Phone:
                  <span className="fw-400">
                    {" "}
                    {EmploymentExpert
                      ? formatPhoneNumber(EmploymentExpert?.Phone)
                      : "-"}
                  </span>
                </p>
                <p className="mb-1">
                  Email:
                  <span className="fw-400">
                    {" "}
                    {EmploymentExpert ? EmploymentExpert?.Email : "-"}
                  </span>
                </p>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <div className="filled-icon me-1">
                <span className="material-symbols-outlined green-call">
                  call
                </span>
              </div>
              <p className="fw-400 mb-1">
                Contact me if you need any assistance with your current
                assignment!
              </p>
            </div>
          </CardBody>
        </Card>
      )}
      {!ProgramManager &&
        !EmploymentExpert &&
        "There are no records to display"}
    </div>
  );
};

export default TeamCard;
