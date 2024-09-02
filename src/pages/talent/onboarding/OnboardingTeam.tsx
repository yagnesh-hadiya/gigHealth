import { Col, Row } from "reactstrap";
import ProgramTeam from "./ProgramTeam";
import { getAuthDetails } from "../../../store/ProfessionalAuthStore";
import { useSelector } from "react-redux";

const OnboardingTeam = () => {
  const programTeam = useSelector(getAuthDetails);

  return (
    <>
      <Row>
        <Col md="6" className="mb-3">
          {programTeam && programTeam[0]?.ProgramManager && (
            <ProgramTeam team={programTeam[0]?.ProgramManager} manager={true} />
          )}
        </Col>
        <Col md="6" className="mb-3">
          {programTeam && programTeam[0]?.EmploymentExpert && (
            <ProgramTeam
              team={programTeam[0]?.EmploymentExpert}
              manager={false}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default OnboardingTeam;
