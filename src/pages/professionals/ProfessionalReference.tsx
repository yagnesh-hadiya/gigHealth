import { useCallback, useEffect, useState } from "react";
import ReferenceCard from "./Reference/ReferenceCard";
import CreateReference from "./Reference/CreateReference";
import CustomButton from "../../components/custom/CustomBtn";
import { useParams } from "react-router-dom";
import { ListWorkReferences } from "../../services/ProfessionalServices";
import { WorkReferenceType } from "../../types/WorkReferenceTypes";
import Loader from "../../components/custom/CustomSpinner";
import ACL from "../../components/custom/ACL";

const ProfessionalReference = () => {
  const [isCreateReference, setCreateReference] = useState(false);
  const [references, setReferences] = useState<WorkReferenceType[]>([]);
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
  const params = useParams();

  const togglecCreateRefModal = () =>
    setCreateReference((prevModal) => !prevModal);

  const fetch = useCallback(async () => {
    setLoading("loading");
    try {
      const res = await ListWorkReferences(Number(params?.Id));
      console.error(res.data);
      if (res.status === 200) {
        setReferences(res.data.data);
        setLoading("idle");
      }
    } catch (error) {
      console.error(error);
    }
  }, [params]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <>
      {loading === "loading" && <Loader />}
      <div
        className="facility-header-wrap  mt-3"
        style={{ padding: "10px 10px" }}
      >
        <div
          className="details-header section-header"
          style={{ padding: "10px 21px" }}
        >
          References
        </div>

        {references.map((reference) => (
          <ReferenceCard
            workReference={reference}
            fetch={fetch}
            id={Number(params?.Id)}
          />
        ))}

        <div className="right-buttons text-start justify-content-start ms-3 mb-2">
          <ACL
            submodule={"details"}
            module={"professionals"}
            action={["GET", "POST"]}
          >
            <CustomButton
              className="professional-button add-more"
              onClick={togglecCreateRefModal}
            >
              Add More
            </CustomButton>
          </ACL>
        </div>
      </div>

      {isCreateReference && (
        <CreateReference
          isOpen={isCreateReference}
          toggle={() => setCreateReference(false)}
          fetch={fetch}
        />
      )}
    </>
  );
};

export default ProfessionalReference;
