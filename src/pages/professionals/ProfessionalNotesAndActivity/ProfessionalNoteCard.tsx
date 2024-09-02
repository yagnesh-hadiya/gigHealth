import { useState } from "react";
import CustomEyeBtn from "../../../components/custom/CustomEyeBtn";
import CustomEditBtn from "../../../components/custom/CustomEditBtn";
import CustomDeleteBtn from "../../../components/custom/CustomDeleteBtn";
import { ProfessionalActivity } from "../../../types/ProfessionalNotesTypes";
import moment from "moment";

import ProfessionalNotesServices from "../../../services/ProfessionalNotesServices";
import { showToast } from "../../../helpers";
import Loader from "../../../components/custom/CustomSpinner";
import ACL from "../../../components/custom/ACL";
import ProfessionalActivityModal from "./ProfessionalActivityModal";
import ProfessionalEmailModal from "./ProfessionalEmailModal";

type ProfessionalNoteCardProps = {
  professionalId: number;
  fetchNotes: () => void;
  activity: ProfessionalActivity;
};

const ProfessionalNoteCard = ({
  activity,
  professionalId,
  fetchNotes,
}: ProfessionalNoteCardProps) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [isEditActivityModalOpen, setEditActivityModalOpen] = useState(false);
  const [isReadOnlyActivityModalOpen, setReadOnlyActivityModalOpen] =
    useState(false);
  const [isEmailOpen, setEmailOpen] = useState(false);

  const handleEdit = () => {
    setEditActivityModalOpen(true);
  };

  const handleView = () => {
    if (activity.ActivityType?.Id === 1) {
      setReadOnlyActivityModalOpen(true);
    } else {
      setEmailOpen(true);
    }
  };

  const content = (
    <span dangerouslySetInnerHTML={{ __html: activity?.Content }} />
  );

  const idToClassName: { [key: number]: string } = {
    1: "activity",
    2: "email",
    3: "profile-activity",
  };

  const deleteNote = async () => {
    setLoading("loading");
    try {
      const res = await ProfessionalNotesServices.deleteActivity({
        professionalId,
        activityId: activity.Id,
      });
      if (res.status === 200) {
        showToast("success", "Activity deleted successfully");
        setLoading("idle");
        fetchNotes();
      }
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast("error", error.response.data.message || "Something went wrong");
    }
  };

  return (
    <>
      {loading === "loading" && <Loader />}
      <div
        className="job-template-wrapper note-wrapper w-100"
        style={{
          maxHeight: "16rem",
          overflowY: "hidden",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div className="activity-header">
            <span
              className={`note-header-input text-uppercase
                  ${idToClassName[activity.ActivityType?.Id] || "default"}
                  `}
            >
              {activity.ActivityType?.Type}
            </span>
          </div>
          <div className="activity-buttons">
            {activity.ActivityType?.Id === 1 && (
              <ACL
                submodule={"notes"}
                module={"professionals"}
                action={["GET", "PUT"]}
              >
                <CustomEditBtn onEdit={handleEdit} />
              </ACL>
            )}
            {activity.ActivityType?.Id === 1 ||
            activity.ActivityType?.Id === 2 ? (
              <ACL
                submodule={"notes"}
                module={"professionals"}
                action={["GET"]}
              >
                <CustomEyeBtn onEye={handleView} />
              </ACL>
            ) : null}

            {activity.ActivityType?.Id === 1 && (
              <ACL
                submodule={"notes"}
                module={"professionals"}
                action={["GET", "DELETE"]}
              >
                <CustomDeleteBtn onDelete={deleteNote} />
              </ACL>
            )}
          </div>
        </div>
        <div className="card-info">
          <div>
            <p className="card-details">
              <span className="card-date">
                {moment(activity.CreatedOn).format("MM/DD/YYYY hh:mm:ss A")}
              </span>
            </p>
            <p className="card-details">
              <span className="card-label">User:</span>
              <span className="card-value text-capitalize m-2">
                {activity.FromUser?.FirstName} {activity.FromUser?.LastName}
              </span>
            </p>
            {activity.ActivityCategory && (
              <p className="card-details">
                <span className="card-label">Category:</span>
                <span className="card-value m-2">
                  {activity.ActivityCategory?.Category
                    ? activity.ActivityCategory?.Category
                    : "-"}
                </span>
              </p>
            )}
            {activity.Subject && (
              <p className="card-details">
                <span className="card-label">Activity:</span>
                <span className="card-value m-2">
                  {activity.Subject ? activity.Subject : "-"}
                </span>
              </p>
            )}
            {activity.Content && (
              <p className="card-details">
                <span className="card-label">Notes:</span>
                <span className="card-value m-2">{content}</span>
              </p>
            )}

            {isEditActivityModalOpen && (
              <ProfessionalActivityModal
                activity={activity}
                editActivity={true}
                isOpen={isEditActivityModalOpen}
                toggle={function (): void {
                  setEditActivityModalOpen(false);
                }}
                professionalId={professionalId}
                fetchNotes={function (): void {
                  fetchNotes();
                }}
              />
            )}

            {isReadOnlyActivityModalOpen && (
              <ProfessionalActivityModal
                activity={activity}
                isReadOnly={true}
                isOpen={isReadOnlyActivityModalOpen}
                toggle={function (): void {
                  setReadOnlyActivityModalOpen(false);
                }}
                professionalId={professionalId}
                fetchNotes={function (): void {
                  throw new Error("Function not implemented.");
                }}
              />
            )}

            {isEmailOpen && (
              <ProfessionalEmailModal
                isOpen={isEmailOpen}
                toggle={function (): void {
                  setEmailOpen(false);
                }}
                fetchNotes={function (): void {
                  throw new Error("Function not implemented.");
                }}
                professionalId={professionalId}
                activity={activity}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default ProfessionalNoteCard;
