export type ContactType = {
  email: string;
  whatsapp: string;
  telephone: string;
};

export type AboutUsType = {
  about_us: string;
  vission_mission: string;
  organization_structure_url: string;
};

export type FaqType = {
  id: number;
  key: string;
  title: string;
  content: string;
};

export interface OrganizationStructureType {
  management_title: string;
  supervisor_title: string;
  coach_title: string;
  coach: OrganizationPersonType[];
  management: OrganizationPersonType[];
  supervisor: OrganizationPersonType[];
}

export interface OrganizationPersonType {
  name: string;
  order: number;
  title: string;
  image_url: string;
}
