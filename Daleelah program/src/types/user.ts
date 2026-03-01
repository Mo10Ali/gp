export type UserRole = 'tourist' | 'guide' | 'company' | 'ministry' | 'admin';

export type User = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
};

export type Tourist = User & {
  role: 'tourist';
  preferences?: {
    interests: string[];
    budget?: number;
  };
};

export type GuideUser = User & {
  role: 'guide';
  guideId: string; // Reference to Guide profile
};

export type CompanyUser = User & {
  role: 'company';
  companyName: string;
  license: string;
};

export type MinistryUser = User & {
  role: 'ministry';
  department: string;
};

export type AdminUser = User & {
  role: 'admin';
  permissions: string[];
};
