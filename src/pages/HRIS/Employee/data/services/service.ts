import { formatTableParams } from "@/common/utils/utils";
import { request } from "umi";


export async function getEmployee(
    params: any,
    options?: { [key: string]: any },
) {
    try {
        const formattedParams = formatTableParams(params);
        console.log(formattedParams);
        var response = await request('/api/web/hr/employee', {
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

export async function addEmployee(data?: { [key: string]: any }) {
    return request('/api/web/hr/employee', {
        method: 'POST',
        data: data
    });
}

export async function editEmployee(id?: number, data?: { [key: string]: any }) {
    return request(`/api/web/hr/employee/${id}`, {
        method: 'PUT',
        data: data
    });
}

export async function deleteEmployee(id?: number) {
    return request(`/api/web/hr/employee/${id}`, {
        method: 'DELETE'
    });
}