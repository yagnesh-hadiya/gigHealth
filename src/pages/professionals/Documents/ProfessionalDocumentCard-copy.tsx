// import { useParams } from "react-router-dom";
// import File from "../../../assets/images/file.svg";
// import CustomDeleteBtn from "../../../components/custom/CustomDeleteBtn";
// import CustomEditBtn from "../../../components/custom/CustomEditBtn";
// import ProfessionalDocumentServices from "../../../services/ProfessionalDocumentServices";
// import { ProfessionalDocument } from "../../../types/ProfessionalDocumentType";
// import { capitalize, showToast } from "../../../helpers";
// import { useState } from "react";
// import Loader from "../../../components/custom/CustomSpinner";
// import moment from "moment";
// import round from "../../../assets/images/round-check.svg";
// import cancel from "../../../assets/images/cancel.svg";
// import EditProfessionalDocument from "./EditProfessionalDocument";

// type ProfessionalDocumentCardProps = {
//   doc: ProfessionalDocument;
//   fetchDocuments: () => void;
// };

// const ProfessionalDocumentCard = ({
//   doc,
//   fetchDocuments,
// }: ProfessionalDocumentCardProps) => {
//   const params = useParams<{ Id: string }>();
//   const [loading, setLoading] = useState<boolean>(false);
//   const [isOffCanvasOpen, setIsOffCanvasOpen] = useState<boolean>(false);

//   const downloadDocument = async (documentId: number, fileName: string) => {
//     setLoading(true);
//     try {
//       const res =
//         await ProfessionalDocumentServices.downloadProfessionalDocument({
//           professionalId: Number(params.Id),
//           documentId: documentId,
//         });
//       if (res.status === 200) {
//         const url = window.URL.createObjectURL(new Blob([res.data]));
//         const link = document.createElement("a");
//         link.href = url;
//         link.setAttribute("download", fileName || "file");
//         document.body.appendChild(link);
//         link.click();
//         setLoading(false);
//       }
//     } catch (error: any) {
//       console.error("Error downloading document", error);
//       showToast(
//         "error",
//         error.response.data.message || "Error downloading file"
//       );
//     }
//   };

//   const deleteDocument = async (documentId: number) => {
//     setLoading(true);
//     try {
//       const res = await ProfessionalDocumentServices.deleteProfessionalDocument(
//         {
//           professionalId: Number(params.Id),
//           documentId: documentId,
//         }
//       );
//       if (res.status === 200) {
//         fetchDocuments();
//         setLoading(false);
//         showToast("success", "Document deleted successfully");
//       }
//     } catch (error: any) {
//       setLoading(false);
//       showToast("error", error.response.data.message || "Error deleting file");
//       console.log(error);
//     }
//   };

//   const isExpired = () => {
//     if (doc.JobComplianceDocument?.ExpiryDate) {
//       const expiryDate = moment(doc.JobComplianceDocument?.ExpiryDate);
//       const currentDate = moment();
//       return expiryDate.isSameOrBefore(currentDate, "day");
//     }

//     if (
//       !doc.JobComplianceDocument &&
//       doc.JobComplianceRejectedDocument?.RejectedOn
//     ) {
//       return true;
//     }
//     return false;
//   };

//   return (
//     <>
//       {loading && <Loader />}
//       <div
//         className={`view-file-wrapper mb-3 ${
//           isExpired() ? "bg-red" : "bgwhite"
//         }`}
//       >
//         <div className="d-flex align-items-center justify-content-between view-file-info-section pb-3 pt-3">
//           <div className="d-flex align-items-center">
//             <div
//               className="file-img d-flex align-items-center"
//               onClick={() => downloadDocument(doc.Id, doc.FileName)}
//             >
//               <img src={File} />
//             </div>
//             <div>
//               <div className="d-flex align-items-center">
//                 {doc.JobComplianceDocument ? (
//                   <p
//                     className="file-name mt-0"
//                     style={{ marginBottom: "0px", marginRight: "10px" }}
//                   >
//                     {capitalize(doc.JobComplianceDocument.DocumentMaster?.Type)}
//                   </p>
//                 ) : doc.JobComplianceRejectedDocument ? (
//                   <p
//                     className="file-name mt-0"
//                     style={{ marginBottom: "0px", marginRight: "10px" }}
//                   >
//                     {capitalize(
//                       doc.JobComplianceRejectedDocument.DocumentMaster?.Type
//                     )}
//                   </p>
//                 ) : doc.AdditionalDocument ? (
//                   <p
//                     className="file-name mt-0"
//                     style={{ marginBottom: "0px", marginRight: "10px" }}
//                   >
//                     {capitalize(doc.AdditionalDocument.DocumentMaster.Type)}
//                   </p>
//                 ) : (
//                   <p
//                     className="file-name mt-0"
//                     style={{ marginBottom: "0px", marginRight: "10px" }}
//                   >
//                     {capitalize(doc.FileName)}
//                   </p>
//                 )}
//               </div>
//               <div className="file-content d-flex align-items-center flex-wrap">
//                 {doc.JobComplianceDocument ? (
//                   <>
//                     {doc.JobComplianceDocument.CreatedOn && (
//                       <p style={{ marginBottom: "0px" }} className="me-2">
//                         <span className="onboard-title">Uploaded On:</span>
//                         <span className="onboard-info-content ms-2">
//                           {moment(doc.JobComplianceDocument.CreatedOn).format(
//                             "MM/DD/YYYY HH:mm:ss"
//                           )}
//                         </span>
//                       </p>
//                     )}
//                     {doc.JobComplianceDocument.EffectiveDate && (
//                       <p style={{ marginBottom: "0px" }} className="me-2">
//                         <span className="onboard-title">Effective Date:</span>
//                         <span className="onboard-info-content ms-2">
//                           {moment(
//                             doc.JobComplianceDocument.EffectiveDate
//                           ).format("MM/DD/YYYY")}
//                         </span>
//                       </p>
//                     )}
//                     {doc.JobComplianceDocument.ExpiryDate && (
//                       <p style={{ marginBottom: "0px" }} className="me-2">
//                         <span
//                           className="onboard-title"
//                           style={{
//                             color: isExpired() ? "#FF0000" : "#717B9E",
//                           }}
//                         >
//                           Expiry Date:
//                         </span>
//                         <span
//                           className="onboard-info-content ms-2"
//                           style={{
//                             color: isExpired() ? "#FF0000" : "#717B9E",
//                           }}
//                         >
//                           {moment(doc.JobComplianceDocument.ExpiryDate).format(
//                             "MM/DD/YYYY"
//                           )}
//                         </span>
//                       </p>
//                     )}
//                   </>
//                 ) : doc.JobComplianceRejectedDocument ? (
//                   <>
//                     {doc.CreatedOn && (
//                       <p style={{ marginBottom: "0px" }} className="me-2">
//                         <span className="onboard-title">Uploaded On:</span>
//                         <span className="onboard-info-content ms-2">
//                           {moment(doc.CreatedOn).format("MM/DD/YYYY HH:mm:ss")}
//                         </span>
//                       </p>
//                     )}
//                   </>
//                 ) : doc.AdditionalDocument ? (
//                   <>
//                     {doc.AdditionalDocument.CreatedOn && (
//                       <p style={{ marginBottom: "0px" }} className="me-2">
//                         <span className="onboard-title">Uploaded On:</span>
//                         <span className="onboard-info-content ms-2">
//                           {moment(doc.AdditionalDocument.CreatedOn).format(
//                             "MM/DD/YYYY HH:mm:ss"
//                           )}
//                         </span>
//                       </p>
//                     )}
//                   </>
//                 ) : (
//                   <p style={{ marginBottom: "0px" }} className="me-2">
//                     <span className="onboard-title">Uploaded On:</span>
//                     <span className="onboard-info-content ms-2">
//                       {moment(doc.CreatedOn).format("MM/DD/YYYY HH:mm:ss")}
//                     </span>
//                   </p>
//                 )}
//               </div>
//               <div className="file-content d-flex align-items-center flex-wrap">
//                 {doc.JobComplianceDocument ? (
//                   <div
//                     style={{ marginBottom: "0px" }}
//                     className="d-flex flex-wrap"
//                   >
//                     {doc.JobComplianceDocument.ApprovedByUser && (
//                       <div className="me-2">
//                         <span className="onboard-title">
//                           <img src={round} /> Approved By:{" "}
//                         </span>
//                         <span className="onboard-info-content">
//                           {capitalize(
//                             doc.JobComplianceDocument.ApprovedByUser.FirstName
//                           )}{" "}
//                           {capitalize(
//                             doc.JobComplianceDocument.ApprovedByUser.LastName
//                           )}
//                         </span>
//                       </div>
//                     )}
//                     {doc.JobComplianceDocument.IsApproved && (
//                       <div className="me-2">
//                         <span className="onboard-title">Approved On: </span>
//                         <span
//                           className="onboard-info-content"
//                           style={{ marginRight: "15px" }}
//                         >
//                           {moment(doc.JobComplianceDocument.ApprovedOn).format(
//                             "MM/DD/YYYY HH:mm:ss"
//                           )}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 ) : doc.JobComplianceRejectedDocument ? (
//                   <div
//                     style={{ marginBottom: "0px" }}
//                     className="d-flex flex-wrap"
//                   >
//                     {doc.JobComplianceRejectedDocument.RejectedByUser && (
//                       <div className="me-2">
//                         <span className="onboard-title">
//                           <img src={cancel} /> Rejected By:{" "}
//                         </span>
//                         <span className="onboard-info-content">
//                           {capitalize(
//                             doc.JobComplianceRejectedDocument.RejectedByUser
//                               .FirstName
//                           )}{" "}
//                           {capitalize(
//                             doc.JobComplianceRejectedDocument.RejectedByUser
//                               .LastName
//                           )}
//                         </span>
//                       </div>
//                     )}
//                     {doc.JobComplianceRejectedDocument.RejectedOn && (
//                       <div className="me-2">
//                         <span className="onboard-title">Rejected On: </span>
//                         <span
//                           className="onboard-info-content"
//                           style={{ marginRight: "15px" }}
//                         >
//                           {moment(
//                             doc.JobComplianceRejectedDocument.RejectedOn
//                           ).format("MM/DD/YYYY HH:mm:ss")}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 ) : null}
//               </div>
//             </div>
//           </div>
//           <div className="d-flex">
//             {doc.AdditionalDocument &&
//               doc.JobComplianceDocument === null &&
//               doc.JobComplianceRejectedDocument === null && (
//                 <>
//                   <CustomEditBtn
//                     onEdit={() => {
//                       setIsOffCanvasOpen(true);
//                     }}
//                   />
//                   <CustomDeleteBtn onDelete={() => deleteDocument(doc.Id)} />
//                 </>
//               )}
//             {doc.AdditionalDocument === null &&
//               doc.JobComplianceRejectedDocument && (
//                 <CustomDeleteBtn onDelete={() => deleteDocument(doc.Id)} />
//               )}
//             {!doc.AdditionalDocument &&
//               !doc.JobComplianceRejectedDocument &&
//               !doc.JobComplianceDocument && (
//                 <CustomDeleteBtn onDelete={() => deleteDocument(doc.Id)} />
//               )}
//           </div>
//         </div>
//       </div>

//       {isOffCanvasOpen && doc.AdditionalDocument?.DocumentMaster && (
//         <EditProfessionalDocument
//           setIsOffCanvasOpen={setIsOffCanvasOpen}
//           isOffCanvasOpen={isOffCanvasOpen}
//           fetchDocuments={fetchDocuments}
//           documentToEdit={{
//             documentId: doc.Id,
//             documentMaster: doc.AdditionalDocument?.DocumentMaster,
//             documentName: doc.FileName,
//             createdAt: doc.CreatedOn,
//           }}
//         />
//       )}
//     </>
//   );
// };

// export default ProfessionalDocumentCard;
