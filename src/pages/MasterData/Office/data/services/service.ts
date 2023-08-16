import { formatTableParams } from "@/common/utils/utils";
import { request } from "umi";


export async function getOffice(
    params: { [key: string]: any },
    options?: { [key: string]: any },
) {
    try {
        const formattedParams = formatTableParams(params);
        console.log(formattedParams);
        var response = await request('/api/web/hr/office', {
            method: 'GET',
            params: {
                ...formattedParams
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

export async function addOffice(data?: { [key: string]: any }) {
    return request('/api/web/hr/office', {
        method: 'POST',
        data: data
    });
}

export async function editOffice(id?: number, data?: { [key: string]: any }) {
    return request(`/api/web/hr/office/${id}`, {
        method: 'PUT',
        data: data
    });
}

export async function deleteOffice(id?: number) {
    return request(`/api/web/hr/office/${id}`, {
        method: 'DELETE'
    });
}