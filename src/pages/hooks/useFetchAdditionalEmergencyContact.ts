import { useState } from "react";
import { AdminEmergencyContactType } from "../../types/ProfessionalDocumentType";
import { useParams } from "react-router-dom";
import {
  fetchEmergencyContactList,
  getAdminGig,
} from "../../services/AdditionalDetails";
import useUpdateEffect from "./useUpdateEffect";
import { ActionType } from "../../types/ProfessionalAuth";

const useFetchAdditionalEmergencyContact = (
  fetch: boolean,
  dispatch: React.Dispatch<any>
) => {
  const [data, setData] = useState<AdminEmergencyContactType[]>([]);
  const params = useParams();
  const professionalId = Number(params?.Id);

  useUpdateEffect(() => {
    const fetchList = async () => {
      try {
        const response = await fetchEmergencyContactList(professionalId);
        const gigListResponse = await getAdminGig(professionalId);

        if (response.status === 200) {
          setData(response.data?.data);
        }

        if (gigListResponse.status === 200) {
          dispatch({
            type: ActionType.SetGigList,
            payload: gigListResponse?.data?.data[0],
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchList();
  }, [fetch]);

  return { data, setData };
};

export default useFetchAdditionalEmergencyContact;
