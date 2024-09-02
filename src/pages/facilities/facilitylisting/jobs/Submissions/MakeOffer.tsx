import { capitalize } from "../../../../../helpers";
import CustomMainCard from "../../../../../components/custom/CustomCard";
import { useCallback, useEffect, useState } from "react";

import { Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import ConfirmOfferDetails from "./ConfirmOfferDetails";
import { fetchSlots } from "../../../../../services/SubmissionServices";
import { SlotType } from "../../../../../types/ApplicantTypes";
import { RightJobContentData } from "../../../../../types/JobsTypes";
import JobApplicationHistoryModal from "./JobApplicationHistoryModal";
import { getStatusColor } from "../../../../../constant/StatusColors";

type MakeOfferProps = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  isOpen: boolean;
  toggle: () => void;
  job: RightJobContentData;
  status: string;
  fetchApplicants: () => void;
};

const MakeOffer = ({
  isOpen,
  toggle,
  facilityId,
  jobId,
  professionalId,
  jobApplicationId,
  job,
  status,
  fetchApplicants,
}: MakeOfferProps) => {
  const [data, setData] = useState<SlotType[]>([]);
  const [slot, setSlot] = useState<SlotType | null>(null);
  const [isConfirmOfferModalOpen, setConfirmOfferModalOpen] = useState(false);

  const toggleOfferDetailsModal = () => {
    setConfirmOfferModalOpen(!isConfirmOfferModalOpen);
  };

  const fetch = useCallback(async () => {
    try {
      const res = await fetchSlots({ facilityId: facilityId, jobId: jobId });
      setData(res.data.data);
    } catch (error) {
      console.error(error);
    }
  }, [facilityId, jobId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        size="xl"
        onClosed={toggle}
      >
        <ModalHeader toggle={toggle}>Make Offer - Placement</ModalHeader>
        <ModalBody
          className="viewProfile"
          style={{ maxHeight: "600px", overflow: "auto",borderRadius:'20px' }}>
          <CustomMainCard className="set-height-auto">
            <div className="facility-listing-loader">
              <h2 className="page-content-header">Openings</h2>
            </div>

            <div className="make-offer-table w-100">
              <Table className="w-100">
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Client Req ID</th>
                    <th>Professional Name</th>
                    <th>Application Status</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((slot: SlotType) =>
                    slot.JobApplication ? (
                      <tr>
                        <td>{`JID0${job.Id}-${slot.SlotNumber}`}</td>
                        <td>
                          {slot.JobAssignment && slot.JobAssignment.ReqId
                            ? slot.JobAssignment.ReqId.toUpperCase()
                            : slot.ReqId
                            ? slot.ReqId.toUpperCase()
                            : "--"}
                        </td>
                        <td>
                          <div className="table-username">
                            <p
                              style={{ marginRight: "5px" }}
                              className="name-logo"
                            >
                              {capitalize(
                                slot.JobApplication?.Professional.FirstName
                                  ? slot.JobApplication?.Professional
                                      .FirstName[0]
                                  : ""
                              )}
                              {capitalize(
                                slot.JobApplication?.Professional.LastName
                                  ? slot.JobApplication?.Professional
                                      .LastName[0]
                                  : ""
                              )}
                            </p>
                            <div>
                              <p className="center-align text-align d-block mb-0">
                                {capitalize(
                                  slot.JobApplication?.Professional.FirstName
                                    ? slot.JobApplication?.Professional
                                        .FirstName
                                    : ""
                                )}{" "}
                                {capitalize(
                                  slot.JobApplication?.Professional.LastName
                                    ? slot.JobApplication?.Professional.LastName
                                    : ""
                                )}
                              </p>
                              <span className="text-color">
                                {slot.JobApplication?.Professional.Email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="placement-select-btn purple">
                            <span
                              style={{
                                color: getStatusColor(
                                  slot.JobAssignment.AssignmentStatus
                                ),
                                fontWeight: "500",
                                marginLeft: "2rem",
                              }}
                            >
                              {slot.JobAssignment.AssignmentStatus
                                ? slot.JobAssignment.AssignmentStatus
                                : "-"}
                            </span>
                            {/* <CustomSelect
                              styles={optioncustomStyles}
                              id="addnew"
                              name="addnew"
                              options={AddNewOptions}
                              value={null}
                              onChange={handleOptionChange}
                              placeholder={
                                slot.JobSlotStatus.Status
                                  ? slot.JobSlotStatus.Status
                                  : "-"
                              }
                              isClearable={true}
                              isSearchable={false}
                              noOptionsMessage={() => "No options available"}
                            /> */}
                          </div>
                        </td>
                        <td>
                          {slot.JobAssignment.StartDate
                            ? slot.JobAssignment.StartDate
                            : "-"}
                        </td>
                        <td>
                          {slot.JobAssignment.EndDate
                            ? slot.JobAssignment.EndDate
                            : "-"}
                        </td>
                        <td>
                          <JobApplicationHistoryModal
                            professionalId={slot.JobApplication.Professional.Id}
                            jobId={jobId}
                            jobApplicationId={slot.JobApplication.Id}
                            facilityId={facilityId}
                            slotId={slot.Id}
                          />
                        </td>
                      </tr>
                    ) : (
                      <tr
                        style={{
                          pointerEvents:
                            slot.JobSlotStatus.Status === "Active"
                              ? "auto"
                              : "none",
                        }}
                        onClick={() => {
                          if (slot.JobSlotStatus.Status === "Active") {
                            setSlot(slot);
                            toggleOfferDetailsModal();
                          }
                        }}
                      >
                        <td>{`JID${jobId}-${slot.SlotNumber}`}</td>
                        <td>{slot.ReqId ? slot.ReqId.toUpperCase() : "-"}</td>
                        <td colSpan={4} className="text-center">
                          <p
                            className="text-show"
                            style={{
                              fontWeight: "500",
                            }}
                          >
                            Opening is{" "}
                            {slot.JobSlotStatus.Status === "Active"
                              ? "Vacant"
                              : slot.JobSlotStatus.Status}
                          </p>
                          {slot.JobSlotStatus.Status === "Active" ? (
                            <p className="text-hide">
                              Assign Professional to this Opening
                            </p>
                          ) : (
                            <p className="text-hide">
                              Opening is {slot.JobSlotStatus.Status}
                            </p>
                          )}
                        </td>
                        <td></td>
                      </tr>
                    )
                  )}
                </tbody>
              </Table>
            </div>
          </CustomMainCard>
        </ModalBody>
      </Modal>
      {isConfirmOfferModalOpen && slot && (
        <ConfirmOfferDetails
          status={status}
          isOpen={isConfirmOfferModalOpen}
          toggle={toggleOfferDetailsModal}
          professionalId={professionalId}
          jobId={jobId}
          jobApplicationId={jobApplicationId}
          facilityId={facilityId}
          slot={slot}
          fetch={fetch}
          toggleParent={toggle}
          fetchApplicants={fetchApplicants}
          job={job}
        />
      )}
    </>
  );
};

export default MakeOffer;
