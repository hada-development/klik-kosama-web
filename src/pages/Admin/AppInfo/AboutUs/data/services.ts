import { htmlToMarkdown } from '@/common/components/RichTextEditor/MdParser';
import { request } from 'umi';
import { AboutUsType } from '../../data/data';

const baseUrl = '/api/web/admin/info/about-us';

export async function getAboutUs(): Promise<AboutUsType> {
  try {
    const response = await request(baseUrl, {
      method: 'GET',
    });
    return response.data as AboutUsType;
  } catch (e: any) {
    throw e;
  }
}

export async function setAboutUs(data: AboutUsType): Promise<void> {
  const parsedData = {
    about_us: htmlToMarkdown(data.about_us),
    vission_mission: htmlToMarkdown(data.vission_mission),
    organization_structure_url: data.organization_structure_url,
  };
  await request(baseUrl, {
    method: 'PUT',
    data: parsedData,
  });
}
