import { Col, Row } from "reactstrap";
import LeftJobContent from "./LeftJobContent";
import RightJobContent from "./RightJobContent";
import {
  JobContentProps,
  RightJobContentData,
} from "../../../../types/JobsTypes";
import { useEffect, useState } from "react";
import { showToast } from "../../../../helpers";
import { getJobDetails } from "../../../../services/JobsServices";

const JobContent = ({
  search,
  jobStatus,
  selectedJobStatus,
  startDate,
  endDate,
}: // searchByDate,
JobContentProps) => {
  const [ids, setIds] = useState<{
    facilityId: number | string;
    templateId: string | number;
  }>({ facilityId: "", templateId: "" });
  const [data, setData] = useState<RightJobContentData[]>([]);
  const [fetchRightJobCard, setFetchRightJobCard] = useState<boolean>(false);

  const fetchJobDetails = () => {
    getJobDetails(ids.facilityId, ids.templateId)
      .then((response) => {
        setData(response.data?.data);
      })
      .catch((error) => {
        console.error(error);
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      });
  };

  useEffect(() => {
    if (ids.facilityId && ids.templateId) {
      fetchJobDetails();
    } else {
      setData([]);
    }
  }, [ids, fetchRightJobCard]);

  return (
    <div className="mt-3">
      <Row>
        <Col md="12" lg="6" className="pe-0">
          <LeftJobContent
            search={search}
            jobStatus={jobStatus}
            selectedJobStatus={selectedJobStatus}
            startDate={startDate}
            endDate={endDate}
            setIds={setIds}
            // searchByDate={searchByDate}
            setFetchRightJobCard={setFetchRightJobCard}
          />
        </Col>
        <Col md="12" lg="6">
          {data && data.length > 0 && <RightJobContent data={data} />}
        </Col>
      </Row>
    </div>
  );
};

export default JobContent;
