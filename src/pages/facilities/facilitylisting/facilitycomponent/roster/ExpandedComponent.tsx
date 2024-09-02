// import { CSSProperties, Key, useState } from "react";
// import DataTable, { TableColumn } from "react-data-table-component";
// import ArticleBtn from "../../../../../components/custom/ArticleBtn";
// import {
//   DropdownItem,
//   DropdownMenu,
//   DropdownToggle,
//   UncontrolledDropdown,
// } from "reactstrap";
// import {
//   RosterType,
//   UpcomingAssignment,
// } from "../../../../../types/RosterTypes";
// import { formatDateInDayMonthYear, showToast } from "../../../../../helpers";
// import RosterServices from "../../../../../services/RosterServices";
// import { useParams } from "react-router-dom";
// import Loader from "../../../../../components/custom/CustomSpinner";
// import ApproveExtensionModal from "./ApproveExtensionModal";
// import RosterTerminate from "./RosterTerminate";
// import { getStatusColor } from "../../../../../constant/StatusColors";
// import RosterViewAssignment from "./RosterViewAssignment";

// type ExpandedComponentProps = {
//   row: RosterType;
//   fetchRoster: () => void;
// };

// type MenuItem = {
//   [status: string]: {
//     label: string;
//     style?: CSSProperties;

//     onClick: (params: {
//       professionalId?: number;
//       currentApplicantId?: number;
//       jobId?: number;
//       currentAssignmentId?: number;
//       currentStatus?: string;
//     }) => void;
//   }[];
// }[];

// export const ExpandedComponent = ({
//   row,
//   fetchRoster,
// }: ExpandedComponentProps) => {
//   const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
//   const [terminateModal, setTerminateModal] = useState<boolean>(false);
//   const params = useParams<{ Id: string }>();
//   const [isDocumentHovered, setIsDocumentHovered] = useState<boolean>(false);
//   const handleDocumentMouseEnter = () => {
//     setIsDocumentHovered(true);
//   };

//   const handleDocumentMouseLeave = () => {
//     setIsDocumentHovered(false);
//   };
//   const [approveExtensionModal, setApproveExtensionModal] =
//     useState<boolean>(false);

//   const [currentAssignmentId, setCurrentAssignmentId] = useState<number | null>(
//     null
//   );
//   const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
//   const [currentStatus, setCurrentStatus] = useState<string | null>(null);
//   const [isProfileModalOpen, setProfileModalOpen] = useState<boolean>(false);

//   const toggleProfileModal = () => {
//     setProfileModalOpen(!isProfileModalOpen);
//   };

//   const decline = async ({
//     value,
//     professionalId,
//     currentApplicantId,
//     jobId,
//     currentAssignmentId,
//   }: {
//     value:
//       | "Declined by Gig"
//       | "Declined by Facility"
//       | "Declined by Professional";
//     professionalId: number;
//     currentApplicantId: number;
//     jobId: number;
//     currentAssignmentId: number;
//   }) => {
//     setLoading("loading");
//     try {
//       const res = await RosterServices.declineApplication({
//         facilityId: Number(params.Id),
//         jobId: jobId,
//         professionalId: professionalId,
//         currentApplicationId: currentApplicantId,
//         currentAssignmentId: currentAssignmentId,
//         value: value,
//       });

//       if (res.status === 200) {
//         fetchRoster();
//         setLoading("idle");
//       }
//     } catch (error: any) {
//       console.error("error", error);
//       setLoading("error");
//       showToast(
//         "error",
//         error?.response?.data?.message || "Something went wrong"
//       );
//     }
//   };

//   const extensionPlacement = async ({
//     facilityId,
//     professionalId,
//     jobApplicationId,
//     jobId,
//     jobAssignmentId,
//   }: {
//     facilityId: number;
//     professionalId: number;
//     jobApplicationId: number;
//     jobId: number;
//     jobAssignmentId: number;
//   }) => {
//     setLoading("loading");
//     try {
//       const res = await RosterServices.extensionPlacement({
//         facilityId: facilityId,
//         professionalId: professionalId,
//         jobApplicationId: jobApplicationId,
//         jobId: jobId,
//         jobAssignmentId: jobAssignmentId,
//       });

//       if (res.status === 200) {
//         fetchRoster();
//         setLoading("idle");
//       }
//     } catch (error: any) {
//       console.error("error", error);
//       setLoading("error");
//       showToast(
//         "error",
//         error?.response?.data?.message || "Something went wrong"
//       );
//     }
//   };

//   const menuItems: MenuItem = [
//     {
//       "Extension Placement": [
//         {
//           label: "Terminate",
//           style: { color: "red" },
//           onClick: ({
//             currentAssignmentId,
//           }: {
//             currentAssignmentId?: number;
//           }) => {
//             if (currentAssignmentId) {
//               setCurrentAssignmentId(currentAssignmentId);
//               setTerminateModal(true);
//             }
//           },
//         },
//       ],
//     },

//     {
//       "Extension Requested": [
//         {
//           label: "Approve",
//           style: { color: "green" },
//           onClick: ({
//             currentAssignmentId,
//             currentStatus,
//           }: {
//             currentAssignmentId?: number;
//             currentStatus?: string;
//           }) => {
//             if (currentAssignmentId && currentStatus) {
//               setCurrentAssignmentId(currentAssignmentId);
//               setCurrentStatus(currentStatus);
//               setApproveExtensionModal(true);
//             }
//           },
//         },
//         {
//           label: "Decline By Gig",
//           onClick: ({
//             professionalId,
//             currentApplicantId,
//             jobId,
//             currentAssignmentId,
//           }: {
//             professionalId?: number;
//             currentApplicantId?: number;
//             jobId?: number;
//             currentAssignmentId?: number;
//           }) => {
//             if (
//               professionalId &&
//               currentApplicantId &&
//               jobId &&
//               currentAssignmentId
//             ) {
//               decline({
//                 value: "Declined by Gig",
//                 professionalId: professionalId,
//                 currentApplicantId: currentApplicantId,
//                 jobId: jobId,
//                 currentAssignmentId: currentAssignmentId,
//               });
//             }
//           },
//         },
//         {
//           label: "Decline By Client",
//           onClick: ({
//             professionalId,
//             currentApplicantId,
//             jobId,
//             currentAssignmentId,
//           }: {
//             professionalId?: number;
//             currentApplicantId?: number;
//             jobId?: number;
//             currentAssignmentId?: number;
//           }) => {
//             if (
//               professionalId &&
//               currentApplicantId &&
//               jobId &&
//               currentAssignmentId
//             ) {
//               decline({
//                 value: "Declined by Facility",
//                 professionalId: professionalId,
//                 currentApplicantId: currentApplicantId,
//                 jobId: jobId,
//                 currentAssignmentId: currentAssignmentId,
//               });
//             }
//           },
//         },
//         {
//           label: "Decline By Professional",
//           onClick: ({
//             professionalId,
//             currentApplicantId,
//             jobId,
//             currentAssignmentId,
//           }: {
//             professionalId?: number;
//             currentApplicantId?: number;
//             jobId?: number;
//             currentAssignmentId?: number;
//           }) => {
//             if (
//               professionalId &&
//               currentApplicantId &&
//               jobId &&
//               currentAssignmentId
//             ) {
//               decline({
//                 value: "Declined by Professional",
//                 professionalId: professionalId,
//                 currentApplicantId: currentApplicantId,
//                 jobId: jobId,
//                 currentAssignmentId: currentAssignmentId,
//               });
//             }
//           },
//         },
//       ],
//     },

//     {
//       "Extension Offered": [
//         {
//           label: "Extension Placement",
//           style: { color: "green" },
//           onClick: ({
//             professionalId,
//             currentApplicantId,
//             jobId,
//             currentAssignmentId,
//           }: {
//             professionalId?: number;
//             currentApplicantId?: number;
//             jobId?: number;
//             currentAssignmentId?: number;
//           }) => {
//             if (
//               professionalId &&
//               currentApplicantId &&
//               jobId &&
//               currentAssignmentId
//             ) {
//               extensionPlacement({
//                 facilityId: Number(params.Id),
//                 professionalId: professionalId,
//                 jobApplicationId: currentApplicantId,
//                 jobId: jobId,
//                 jobAssignmentId: currentAssignmentId,
//               });
//             }
//           },
//         },
//         {
//           label: "Decline By Gig",
//           onClick: ({
//             professionalId,
//             currentApplicantId,
//             jobId,
//             currentAssignmentId,
//           }: {
//             professionalId?: number;
//             currentApplicantId?: number;
//             jobId?: number;
//             currentAssignmentId?: number;
//           }) => {
//             if (
//               professionalId &&
//               currentApplicantId &&
//               jobId &&
//               currentAssignmentId
//             ) {
//               decline({
//                 value: "Declined by Gig",
//                 professionalId: professionalId,
//                 currentApplicantId: currentApplicantId,
//                 jobId: jobId,
//                 currentAssignmentId: currentAssignmentId,
//               });
//             }
//           },
//         },
//         {
//           label: "Decline By Client",
//           onClick: ({
//             professionalId,
//             currentApplicantId,
//             jobId,
//             currentAssignmentId,
//           }: {
//             professionalId?: number;
//             currentApplicantId?: number;
//             jobId?: number;
//             currentAssignmentId?: number;
//           }) => {
//             if (
//               professionalId &&
//               currentApplicantId &&
//               jobId &&
//               currentAssignmentId
//             ) {
//               decline({
//                 value: "Declined by Facility",
//                 professionalId: professionalId,
//                 currentApplicantId: currentApplicantId,
//                 jobId: jobId,
//                 currentAssignmentId: currentAssignmentId,
//               });
//             }
//           },
//         },
//         {
//           label: "Decline By Professional",
//           onClick: ({
//             professionalId,
//             currentApplicantId,
//             jobId,
//             currentAssignmentId,
//           }: {
//             professionalId?: number;
//             currentApplicantId?: number;
//             jobId?: number;
//             currentAssignmentId?: number;
//           }) => {
//             if (
//               professionalId &&
//               currentApplicantId &&
//               jobId &&
//               currentAssignmentId
//             ) {
//               decline({
//                 value: "Declined by Professional",
//                 professionalId: professionalId,
//                 currentApplicantId: currentApplicantId,
//                 jobId: jobId,
//                 currentAssignmentId: currentAssignmentId,
//               });
//             }
//           },
//         },
//       ],
//     },

//     {
//       "Pending Updated Extension Placement": [
//         {
//           label: "Extension Placement",
//           style: { color: "green" },
//           onClick: ({
//             professionalId,
//             currentApplicantId,
//             jobId,
//             currentAssignmentId,
//           }: {
//             professionalId?: number;
//             currentApplicantId?: number;
//             jobId?: number;
//             currentAssignmentId?: number;
//           }) => {
//             if (
//               professionalId &&
//               currentApplicantId &&
//               jobId &&
//               currentAssignmentId
//             ) {
//               extensionPlacement({
//                 facilityId: Number(params.Id),
//                 professionalId: professionalId,
//                 jobApplicationId: currentApplicantId,
//                 jobId: jobId,
//                 jobAssignmentId: currentAssignmentId,
//               });
//             }
//           },
//         },
//         {
//           label: "Terminate",
//           style: { color: "red" },
//           onClick: ({
//             currentAssignmentId,
//           }: {
//             currentAssignmentId?: number;
//           }) => {
//             if (currentAssignmentId) {
//               setCurrentAssignmentId(currentAssignmentId);
//               setTerminateModal(true);
//             }
//           },
//         },
//       ],
//     },
//   ];

//   const Column: TableColumn<UpcomingAssignment>[] = [
//     {
//       name: "",
//       cell: () => <></>,
//       width: "10%",
//     },
//     {
//       name: "",
//       cell: () => <></>,
//       width: "10%",
//     },
//     {
//       name: "",
//       width: "20%",
//       cell: (row: UpcomingAssignment) => (
//         <>
//           <span>{row.ReqId ? row.ReqId.toUpperCase() : "-"}</span>
//         </>
//       ),
//     },
//     {
//       name: "",
//       width: "232px",
//       // width:"16%",
//       cell: (row: UpcomingAssignment) => (
//         <div className="">
//           {row.StartDate
//             ? formatDateInDayMonthYear(row.StartDate).replace(/-/g, "/")
//             : "-"}
//           -{" "}
//           {row?.EndDate
//             ? formatDateInDayMonthYear(row?.EndDate).replace(/-/g, "/")
//             : "-"}
//         </div>
//       ),
//     },
//     {
//       name: "",
//       width: "105px",
//       // width:"8%",
//       cell: () => (
//         <div className="">
//           {row?.JobApplication.JobAssignments[0].JobProfession.Profession}
//         </div>
//       ),
//     },
//     {
//       name: "",
//       width: "70px",
//       // width:'6%',
//       cell: (row: UpcomingAssignment) => (
//         <div className="center-align">{row.Unit}</div>
//       ),
//     },

//     {
//       name: "Application Status",
//       width: "204px",
//       // width:"12%",
//       cell: (cell: UpcomingAssignment) => (
//         <div className="opening-assignment-select">
//           <UncontrolledDropdown>
//             <DropdownToggle
//               caret
//               style={{
//                 color: getStatusColor(cell.JobApplicationStatus.Status),
//               }}
//             >
//               {cell.JobApplicationStatus.Status
//                 ? cell.JobApplicationStatus.Status
//                 : "Submitted"}
//             </DropdownToggle>
//             <DropdownMenu>
//               {menuItems
//                 .find((item) => item[cell.JobApplicationStatus.Status])
//                 ?.[cell.JobApplicationStatus.Status]?.map(
//                   (
//                     item: {
//                       label: string;
//                       style?: CSSProperties;
//                       onClick: (params: {
//                         professionalId: number;
//                         currentApplicantId: number;
//                         jobId: number;
//                         currentAssignmentId: number;
//                         currentStatus: string;
//                       }) => void;
//                     },
//                     index: Key | null | undefined
//                   ) => (
//                     <DropdownItem
//                       key={index}
//                       style={item.style}
//                       onClick={() => {
//                         item.onClick({
//                           professionalId: row.JobApplication.Professional.Id,
//                           currentApplicantId: row.JobApplicationId,
//                           jobId: row.JobId,
//                           currentAssignmentId: cell.Id,
//                           currentStatus: cell.JobApplicationStatus.Status,
//                         });
//                       }}
//                     >
//                       {item.label}
//                     </DropdownItem>
//                   )
//                 )}
//             </DropdownMenu>
//           </UncontrolledDropdown>
//         </div>
//       ),
//     },
//     {
//       name: "",
//       // width: "230px",
//       width: "15%",
//       cell: (row: UpcomingAssignment) => (
//         <div
//           className="d-flex center-align custom-article-btn justify-content-center py-3"
//           style={{ gap: "3px" }}
//         >
//           <ArticleBtn
//             onEye={() => {
//               setCurrentAssignmentId(row.Id);
//               setCurrentRequestId(row.ReqId);
//               setCurrentStatus(row.JobApplicationStatus.Status);
//               setProfileModalOpen(true);
//             }}
//           />

//           <div className=" note-wrapper">
//             <button
//               className={`note-right-button  document-btn roster-btn`}
//               onMouseEnter={handleDocumentMouseEnter}
//               onMouseLeave={handleDocumentMouseLeave}
//               color={isDocumentHovered ? "#FFF" : ""}
//               onClick={() => {
//                 setCurrentAssignmentId(row.Id);
//                 setCurrentRequestId(row.ReqId);
//                 setCurrentStatus(row.JobApplicationStatus.Status);
//                 setApproveExtensionModal(true);
//               }}
//               style={{
//                 pointerEvents:
//                   row.JobApplicationStatus.Status === "Extension Requested" ||
//                   row.JobApplicationStatus.Status === "Extension Offered" ||
//                   row.JobApplicationStatus.Status === "Extension Placement" ||
//                   (new Date(row.StartDate) <= new Date() &&
//                     new Date(row.EndDate) >= new Date())
//                     ? "none"
//                     : "auto",
//                 opacity:
//                   row.JobApplicationStatus.Status === "Extension Requested" ||
//                   row.JobApplicationStatus.Status === "Extension Offered" ||
//                   row.JobApplicationStatus.Status === "Extension Placement" ||
//                   (new Date(row.StartDate) <= new Date() &&
//                     new Date(row.EndDate) >= new Date())
//                     ? 0.5
//                     : 1,
//               }}
//               disabled={
//                 row.JobApplicationStatus.Status === "Extension Requested" ||
//                 row.JobApplicationStatus.Status === "Extension Offered" ||
//                 row.JobApplicationStatus.Status === "Extension Placement" ||
//                 (new Date(row.StartDate) <= new Date() &&
//                   new Date(row.EndDate) >= new Date())
//                   ? false
//                   : true
//               }
//             >
//               Extension Request
//             </button>
//           </div>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <>
//       {loading === "loading" && <Loader />}
//       <DataTable
//         columns={Column}
//         data={row.UpcomingAssignments}
//         className="nested-datatable-roster"
//       />
//       {approveExtensionModal && currentAssignmentId && currentStatus && (
//         <ApproveExtensionModal
//           row={row}
//           fetchRosterData={fetchRoster}
//           isOpen={approveExtensionModal}
//           toggle={() => {
//             setApproveExtensionModal(false);
//           }}
//           facilityId={Number(params.Id)}
//           professionalId={row.JobApplication.Professional.Id}
//           jobId={row.JobId}
//           jobApplicationId={row.JobApplicationId}
//           jobAssignmentId={currentAssignmentId}
//           currentStatus={currentStatus}
//           isReadOnly={false}
//         />
//       )}

//       {isProfileModalOpen &&
//         currentAssignmentId &&
//         currentStatus &&
//         currentRequestId && (
//           <RosterViewAssignment
//             row={row}
//             fetchRoster={fetchRoster}
//             isOpen={isProfileModalOpen}
//             toggle={toggleProfileModal}
//             professionalId={row.JobApplication.Professional.Id}
//             jobApplicationId={row.JobApplicationId}
//             jobAssignmentId={currentAssignmentId}
//             reqId={currentRequestId}
//           />
//         )}

//       {terminateModal && currentAssignmentId && (
//         <RosterTerminate
//           jobId={row.JobId}
//           professionalId={row.JobApplication.Professional.Id}
//           facilityId={Number(params.Id)}
//           jobApplicationId={row.JobApplicationId}
//           jobAssignmentId={currentAssignmentId}
//           isOpen={terminateModal}
//           toggle={() => setTerminateModal(false)}
//           fetchRoster={fetchRoster}
//         />
//       )}
//     </>
//   );
// };
