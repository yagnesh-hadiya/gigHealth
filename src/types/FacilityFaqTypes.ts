
export type FaqPayload = {
    Faq: {
        question: string;
        answer: string;
        isInternalUse: boolean;
        typeId: number;
    }[];
};
export interface FaqItem  {
    question: string;
    answer: string;
    isInternalUse: boolean;
    typeId: number;
};

export type ViewFaqProps = {
  isOpen: boolean,
  toggleViewModal: () => void
  selectedViewFaq: Faqs | null
}
export type EditFaqProps = {
  isOpen: boolean,
  toggleEditModal: () => void
  fetchFaqs: () => void
  selectedEditFaq: Faqs | null

}
export type AddFaqProps = {
    isOpen: boolean,
    toggle: () => void
    fetchFaqs: () => void
}
export type FaqType = {
    Id: number;
    Type: string;
};
 export type AddQuestion = {
    question?: string|undefined ,
    answer?: string|undefined
 }[]

export type AddQuestionForEdit = {
    question: string ,
    answer: string
 }
 export type Faqs = {
    Id: number;
    Question: string;
    Answer: string;
    CreatedOn: string;
    FaqType: FaqType;
}