export type FacilityDocumentType = {
  name: string;
  description: string;
};

export type ValidFileType = {
  document: string[];
};

export type AddNewDocumentsProps = {
  setIsOffCanvasOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOffCanvasOpen: boolean;
  fetchFacilityDocuments: () => void;
  selectedDocumentForEdit: DocumentDataType | null | undefined;
  setSelectedDocumentForEdit: (document: DocumentDataType | null) => void;
  search: string;
  setSearch: (text: string) => void;
};

export type DocumentDataType = {
  Id: number;
  Name: string;
  Description: string;
  CreatedOn: string;
  FileName: string;
};

export type DocumentParamsType = {
  name: string;
  description: string;
  document: File | undefined;
};

export type DownloadButtonProp = {
  onDownload: () => void;
  allow?: boolean;
  id?: string;
  title?: string;
  onClick?: () => void;
  disabled?: boolean;
};
