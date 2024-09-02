interface ActivityType {
  Id: number;
  Type: string;
}

interface ActivityCategory {
  Id: number;
  Category: string;
}

interface FromUser {
  Id: number;
  FirstName: string;
  LastName: string;
}

export interface ProfessionalActivity {
  Id: number;
  Content: string;
  CreatedOn: string;
  FromEmail: string | null;
  ToEmail: string | null;
  Subject: string | null;
  ActivityType: ActivityType;
  ActivityCategory: ActivityCategory | null;
  FromUser: FromUser;
}
