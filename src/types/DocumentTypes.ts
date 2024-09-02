export interface DocumentMasterFormProps {
  setIsOffCanvasOpen: (value: boolean) => void;
  isOffCanvasOpen: boolean;
  setDocumentMasterList: (list: DocumentMasterListType[]) => void;
  selectedDocumentForEdit: DocumentMasterListType | null;
  setSelectedDocumentForEdit: (document: DocumentMasterListType | null) => void;
  fetchData: () => void;
}
export type DocumentFormDataType = {
  name: string;
  description: string;
};

export type DocumentMasterListType = {
  srNo: number;
  Id: number;
  Type: string;
  Description: string;
  IsCoreCompliance: boolean;
};
