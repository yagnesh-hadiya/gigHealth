export type VerifiedByUserType = {
  Id: number;
  FirstName: string;
  LastName: string;
};

export type WorkReferenceType = {
  Id: number;
  FacilityName: string;
  ReferenceName: string;
  Title: string;
  Email: string;
  Phone: string;
  CanContact: boolean;
  ShowOnSubmission: boolean;
  IsVerified: boolean;
  VerifiedOn: string;
  VerifiedByUser: VerifiedByUserType;
};

export type RatingLevelType = {
  Id: number;
  Rating: string;
};

export type RatingParameterType = {
  Id: number;
  Parameter: string;
};

type ReferenceRating = {
  Id: number;
  RatingParameter: RatingParameterType;
  RatingLevel: RatingLevelType;
};

export type VerifyWorkReferenceType = {
  Id: number;
  FacilityName: string;
  ReferenceName: string;
  Title: string;
  Email: string;
  Phone: string;
  CanContact: boolean;
  ShowOnSubmission: boolean;
  IsVerified: boolean;
  VerifiedOn: string;
  WouldHireAgain: boolean;
  AdditionalFeedback: null | string;
  ReferenceRatings: ReferenceRating[];
};

export enum WorkReferenceEnums {
  SetSelectedListing = "SetSelectedListing",
  SetSelectedRating = "SetSelectedRating",
}

export type WorkReferenceState = {
  selectedListing: RatingLevelType[] | null;
  selectedRating: RatingParameterType[] | null;
};
