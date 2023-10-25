import { request } from 'umi';
import { OrganizationPersonType, OrganizationStructureType } from '../../data/data';

const baseUrl = '/api/web/admin/info/organization-structure';

export async function getOrganizationStructure(): Promise<OrganizationStructureType> {
  try {
    const response = await request(baseUrl, {
      method: 'GET',
    });
    return response.data as OrganizationStructureType;
  } catch (e: any) {
    throw e;
  }
}

export async function setOrganizationStructure(data: any): Promise<void> {
  const formdata = generateFormData(data);
  console.log(formdata);
  // return;
  await request(baseUrl, {
    method: 'POST',
    data: formdata,
  });
}

function generateFormData(values: any): FormData {
  const formData = new FormData();
  values.management.forEach((person: any) => {
    parsePerson(formData, 'management', person);
  });
  values.coach.forEach((person: any) => {
    parsePerson(formData, 'coach', person);
  });
  values.supervisor.forEach((person: any) => {
    parsePerson(formData, 'supervisor', person);
  });
  formData.append('_method', 'PUT');
  formData.append('management_title', values.management_title);
  formData.append('supervisor_title', values.supervisor_title);
  formData.append('coach_title', values.coach_title);

  return formData;
}

function parsePerson(
  formData: FormData,
  type: keyof OrganizationStructureType,
  person: OrganizationPersonType & { image?: any },
) {
  console.log(person.name);
  formData.append(`${type}[${person.order}][order]`, person.order.toString());
  formData.append(`${type}[${person.order}][name]`, person.name);
  formData.append(`${type}[${person.order}][title]`, person.title);
  formData.append(`${type}[${person.order}][image_url]`, person.image_url);
  if (person.image) {
    formData.append(`${type}[${person.order}][image]`, person.image.file.originFileObj);
  }
}
