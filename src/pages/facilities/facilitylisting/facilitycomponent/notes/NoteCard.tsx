import CustomEyeBtn from "../../../../../components/custom/CustomEyeBtn";
import CustomEditBtn from "../../../../../components/custom/CustomEditBtn";
import CustomDeleteBtn from "../../../../../components/custom/CustomDeleteBtn";
import { showToast } from "../../../../../helpers";
import { useState } from "react";
import { deleteCard } from "../../../../../services/NotesServices";
import Loader from "../../../../../components/custom/CustomSpinner";
import NotesActivityModal from "./NotesActivityModal";
import { useSelector } from "react-redux";
import { getNotes } from "../../../../../store/NotesSlice";
import { Note } from "../../../../../types/StoreInitialTypes";
import NotesEmailModal from "./NotesEmailModal";
import NotesMessageModal from "./NotesMessageModal";
import ReactQuill from "react-quill";
import ACL from "../../../../../components/custom/ACL";
import { Button } from "reactstrap";

type NoteCardProp = {
  facId: number;
  fetchNotes: () => void;
  data: Note;
};

const NoteCard = ({ facId, fetchNotes, data }: NoteCardProp) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isAcitivityModalOpen, setAcitivityModalOpen] = useState(false);
  const [editData, setEditData] = useState<Note>();
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const store: Note[] = useSelector(getNotes);

  const getCategoryClass = (activity: string) => {
    switch (activity) {
      case "Profile Activity":
        return "profile-activity";
      case "Manual Activity":
        return "activity";
      case "Emails Log":
        return "email";
      case "SMS Log":
        return "sms";
      default:
        return "";
    }
  };

  const formatDateByString = (date: string) => {
    const dateObject = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };

    return new Intl.DateTimeFormat("en-US", options).format(dateObject);
  };

  const handleDelete = async (Id: number) => {
    try {
      const response = await deleteCard(facId, Id);
      showToast(
        "success",
        "Activity deleted successfully" || response.data?.message
      );
      fetchNotes();
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (Id: number) => {
    const notes: Note | undefined = store?.find(
      (item: Note): boolean => item?.Id === Id
    );
    setAcitivityModalOpen(true);
    setReadOnly(false);
    setEditData(notes);
  };

  const handleView = (Id: number) => {
    const notes: Note | undefined = store?.find(
      (item: Note): boolean => item?.Id === Id
    );
    setAcitivityModalOpen(true);
    setReadOnly(true);
    setEditData(notes);
  };

  const categoryClass = getCategoryClass(data?.ActivityType?.Type);

  return (
    <>
      {loading && <Loader />}
      {data && Object.keys(data).length > 0 && (
        <div className={`job-template-wrapper note-wrapper w-100 new-card-css`}>
          <div className="d-flex justify-content-between" style={{ gap: '20px' }}>
            <div className="w-100">
              <div className="d-flex justify-content-between align-items-center">
                <div className="activity-header">
                  <span
                    className={`note-header-input text-capitalize ${categoryClass}`}
                  >
                    {categoryClass}
                  </span>
                </div>
                <div className="activity-buttons">
                  {data.ActivityType?.Type !== "Profile Activity" && (
                    <ACL
                      module="facilities"
                      submodule="notes"
                      action={["GET", "GET"]}
                    >
                      <CustomEyeBtn onEye={() => handleView(data?.Id)} />
                    </ACL>
                  )}

                  {data && data?.ActivityType?.Type === "Manual Activity" && (
                    <ACL
                      module="facilities"
                      submodule="notes"
                      action={["GET", "PUT"]}
                    >
                      <CustomEditBtn onEdit={() => handleEdit(data?.Id)} />
                    </ACL>
                  )}
                  {data && data?.ActivityType?.Type === "Manual Activity" && (
                    <ACL
                      module="facilities"
                      submodule="notes"
                      action={["GET", "DELETE"]}
                    >
                      <CustomDeleteBtn onDelete={() => handleDelete(data?.Id)} />
                    </ACL>
                  )}
                </div>
              </div>
              <div className="card-info">
                {data && data?.ActivityType?.Type === "Manual Activity" && (
                  <>
                    <p className="card-details">
                      <span className="card-date">
                        {formatDateByString(data?.CreatedOn)}
                      </span>
                    </p>
                    <p className="card-details">
                      <span className="card-label">User:</span>
                      <span className="card-value text-capitalize m-2">{`${data?.FromUser?.FirstName} ${data?.FromUser?.LastName}`}</span>
                    </p>
                    <p className="card-details">
                      <span className="card-label">Category:</span>
                      <span className="card-value m-2">
                        {data?.ActivityCategory?.Category}
                      </span>
                    </p>
                    <p className="card-details">
                      <span className="card-label">Activity:</span>
                      <span className="card-value m-2">
                        {data?.ActivityType?.Type}
                      </span>
                    </p>
                    <p className="card-details">
                      <span className="card-label">Notes:</span>
                      <span className="card-value m-2">{data?.Content}</span>
                    </p>
                    {editData && (
                      <NotesActivityModal
                        isOpen={isAcitivityModalOpen}
                        toggle={() => setAcitivityModalOpen(false)}
                        facilityId={facId}
                        editData={editData}
                        readOnly={readOnly}
                        fetchNotes={fetchNotes}
                      />
                    )}
                  </>
                )}
                {data && data?.ActivityType?.Type === "Profile Activity" && (
                  <>
                    <p className="card-details">
                      <span className="card-date">
                        {formatDateByString(data?.CreatedOn)}
                      </span>
                    </p>
                    <p className="card-details">
                      <span className="card-label">User:</span>
                      <span className="card-value text-capitalize m-2">{`${data?.FromUser?.FirstName} ${data?.FromUser?.LastName}`}</span>
                    </p>
                    <p className="card-details">
                      <span className="card-label">Notes:</span>
                      <span className="card-value m-2">{data?.Content}</span>
                    </p>
                  </>
                )}
                {data && data?.ActivityType?.Type === "Emails Log" && (
                  <>
                    <p className="card-details">
                      <span className="card-date">
                        {formatDateByString(data?.CreatedOn)}
                      </span>
                    </p>
                    <p className="card-details">
                      <span className="card-label">From:</span>
                      <span className="card-value m-2">{data?.FromEmail}</span>
                    </p>
                    <p className="card-details">
                      <span className="card-label">To:</span>
                      <span className="card-value m-2">{data?.ToEmail}</span>
                    </p>
                    <p className="card-details">
                      <span className="card-label">Subject:</span>
                      <span className="card-value text-capitalize m-2">
                        {data?.Subject}
                      </span>
                    </p>
                    {/* <p className="card-details"><span className="card-label" ></span><span id="email-content" className="card-value">{content}</span></p>  */}
                    <div className="react-quill-wr">
                      <ReactQuill
                        value={data?.Content}
                        modules={{ toolbar: [] }}
                        readOnly
                        theme="snow"
                      />
                    </div>
                    {editData && (
                      <NotesEmailModal
                        isOpen={isAcitivityModalOpen}
                        toggle={() => setAcitivityModalOpen(false)}
                        facilityId={facId}
                        editData={editData}
                        readOnly={readOnly}
                      />
                    )}
                  </>
                )}
                {data && data?.ActivityType?.Type === "SMS Log" && (
                  <>
                    <p className="card-details">
                      <span className="card-date">
                        {formatDateByString(data?.CreatedOn)}
                      </span>
                    </p>
                    <p className="card-details">
                      <span className="card-label">From:</span>
                      <span className="card-value m-2">{data?.FromMobile}</span>
                    </p>
                    <p className="card-details">
                      <span className="card-label">To:</span>
                      <span className="card-value m-2">{data?.ToMobile}</span>
                    </p>
                    <p className="card-details">
                      <span className="card-label">Message:</span>
                      <span className="card-value text-capitalize m-2">
                        {data?.Subject}
                      </span>
                    </p>
                    {editData && (
                      <NotesMessageModal
                        isOpen={isAcitivityModalOpen}
                        toggle={() => setAcitivityModalOpen(false)}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="d-flex right-btn-wr" style={{ gap: '10px' }}>
              <Button outline className="dt-action-cr-btn">
                <span className="material-symbols-outlined">edit</span>
              </Button>
              <Button outline className="dt-action-cr-btn filled-icon">
                <span className="material-symbols-outlined">visibility</span>
              </Button>
              <Button outline className="dt-action-cr-btn">
                <span className="material-symbols-outlined">delete</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NoteCard;
