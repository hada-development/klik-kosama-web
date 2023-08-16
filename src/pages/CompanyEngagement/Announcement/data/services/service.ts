import { formatTableParams } from "@/common/utils/utils";
import { request } from "umi";


export async function getAnnouncement(
    params: any,
    options?: { [key: string]: any },
) {
    try {
        const formattedParams = formatTableParams(params);
        var response = await request('/api/web/hr/announcement', {
            method: 'GET',
            params: {
                ...formattedParams,
            },
            ...(options || {}),
        });
        return {
            current_page: response.current_page,
            data: response.data,
            total: response.data.length
        };
    } catch (e) {
        throw e;
    }

}

export async function addAnnouncement(data?: { [key: string]: any }) {
    const formData = generateFormData(data);
    return request('/api/web/hr/announcement', {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        method: 'POST',
        data: formData
    });
}

export async function editAnnouncement(id?: number, data?: { [key: string]: any }) {
    const formData = generateFormData(data);
    formData.append('_method', "PUT");
    return request(`/api/web/hr/announcement/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: formData
    });
}

export async function deleteAnnouncement(id?: number) {
    return request(`/api/web/hr/announcement/${id}`, {
        method: 'DELETE'
    });
}

function generateFormData(values: any): FormData {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('status', values.status);
    if (values.image?.file) {
        formData.append('image', values.image.file.originFileObj);
    }
    return formData;
}