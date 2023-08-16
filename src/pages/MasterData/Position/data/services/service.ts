import { formatTableParams } from "@/common/utils/utils";
import { request } from "umi";


export async function getPosition(
    params: any,
    options?: { [key: string]: any },
) {
    try {
        const formattedParams = formatTableParams(params);
        var response = await request('/api/web/hr/position', {
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

export async function addPosition(data?: { [key: string]: any }) {
    return request('/api/web/hr/position', {
        method: 'POST',
        data: data
    });
}

export async function editPosition(id?: number, data?: { [key: string]: any }) {
    return request(`/api/web/hr/position/${id}`, {
        method: 'PUT',
        data: data
    });
}

export async function deletePosition(id?: number) {
    return request(`/api/web/hr/position/${id}`, {
        method: 'DELETE'
    });
}