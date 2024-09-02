export type ComplianceDocument = {
    documentname: string,
    description: string,
    priority: number,
    expiryDays: number,
    id: number,
    internalUse: boolean
}

export type  Document ={
  documentMasterId: number;
  isInternalUse: boolean;
  expiryDurationDays: number;
}
export type ChecklistType = {
  categoryId: number;
  documents: Document[];
}
export type DocumentMaster = {
  Description: string;
  Type: string;
  Id: number;
}
export type DocumentCategory = {
   Id: number,
  Category: string
}
export type AddNewComplianceProps = {
  modal: boolean;
  toggle: () => void;
  setListData: (data:any) => void;
}

export type complianceList= {
  Id: number
  Name: string;
}
export type SelectedItem ={
  value: string; 
  label: string;
  description?: string; 
}
export type EditComplianceProps ={
  modal: boolean;
  toggle: () => void; 
  checklistId: number;
  setListData: (data: any) => void; 
}
export type DocumentDetail = {
  DocumentCategory: DocumentCategory;
  DocumentMaster: DocumentMaster;
  ExpiryDurationDays: number;
  IsInternalUse: boolean;
  Priority: number;
};

export type ViewComplianceProps= {
  modal: boolean;
  toggle: () => void; 
  checklistId: number;
  onEdit: (checklistId: number) => void; 
}