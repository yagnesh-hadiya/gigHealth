import { useCallback, useEffect, useState } from "react";
import { WorkReferenceType } from "../../../types/WorkReferenceTypes";
import { ListProfessionalWorkReferences } from "../../../services/ProfessionalMyProfile";
import ProfessionalCreateReference from "./modals/ProfessionalCreateReference";
import { Button } from "reactstrap";
import { showToast } from "../../../helpers";
import Loader from "../../../components/custom/CustomSpinner";
import ProfessionalReferenceCard from "./Cards/ProfessionalReferenceCard";
import { ProfileInformationCardProps } from "../../../types/ProfessionalDetails";

const ReferenceForm = ({ setFetchDetails }: ProfileInformationCardProps) => {
  const [isCreateReference, setCreateReference] = useState<boolean>(false);
  const [references, setReferences] = useState<WorkReferenceType[]>([]);
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");

  const togglecCreateRefModal = () =>
    setCreateReference((prevModal) => !prevModal);

  const fetchReference = useCallback(async () => {
    try {
      setLoading("loading");
      const res = await ListProfessionalWorkReferences();
      if (res.status === 200) {
        setReferences(res.data.data);
        setLoading("idle");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Something went wrong");
    }
  }, [references.length < 0]);

  useEffect(() => {
    fetchReference();
  }, [fetchReference]);

  return (
    <>
      {loading === "loading" && <Loader />}
      <div className="d-flex align-items-center justify-content-between flex-wrap">
        <h3 className="scroll-title mb-2">Reference</h3>
        <Button
          outline
          className="purple-outline-btn mb-2 min-width-146"
          onClick={togglecCreateRefModal}
        >
          Add Reference
        </Button>
      </div>

      {references &&
        references.length > 0 &&
        references?.map((item, index) => {
          return (
            <ProfessionalReferenceCard
              {...item}
              key={item.Id}
              index={index + 1}
              fetch={fetchReference}
              setFetchDetails={setFetchDetails}
            />
          );
        })}
      {isCreateReference && (
        <ProfessionalCreateReference
          isOpen={isCreateReference}
          toggle={() => togglecCreateRefModal()}
          fetch={fetchReference}
          setFetchDetails={setFetchDetails}
        />
      )}
    </>
  );
};

export default ReferenceForm;
