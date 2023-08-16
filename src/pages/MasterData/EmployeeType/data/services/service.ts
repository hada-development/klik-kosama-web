import { request } from "umi";


export async function getEmployeeType(
    params: any,
    options?: { [key: string]: any },
) {
    try {
        var params = { ...params };
        if (params.name) {
            params = {
                ...params,
                "search[name]": params.name
            }
        }
        var response = await request('/api/web/hr/employee-type', {
            method: 'GET',
            params: {
                ...params,
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

export async function addEmployeeType(data?: { [key: string]: any }) {
    return request('/api/web/hr/employee-type', {
        method: 'POST',
        data: data
    });
}

export async function editEmployeeType(id?: number, data?: { [key: string]: any }) {
    return request(`/api/web/hr/employee-type/${id}`, {
        method: 'PUT',
        data: data
    });
}

export async function deleteEmployeeType(id?: number) {
    return request(`/api/web/hr/employee-type/${id}`, {
        method: 'DELETE'
    });
}