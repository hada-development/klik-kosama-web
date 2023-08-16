import { request, AxiosError } from "umi";
import { ApiResponse } from "../types/apiTypes";

const TOKEN_KEY = 'authToken';

/** GET /api/web/me */
export async function currentUser(options?: { [key: string]: any }) {
    return request<{
        data: Auth.CurrentUser;
    }>('/api/web/me', {
        method: 'GET',
        ...(options || {}),
    });
}

/** POST /api/web/login */
export async function login(body: Auth.LoginParams, options?: { [key: string]: any }) {
    try {
        let apiResponse = await request<ApiResponse<Auth.LoginResult>>('/api/web/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: body,
            ...(options || {}),
        });
        if(!apiResponse.data.roles?.includes('admin')){
            return {
                'status': "not-admin"
            };
        }
        return apiResponse.data;
    } catch (error: any) {
        if (error.name === 'AxiosError' && error.response?.status == 403) {
            return {
                'status': "error"
            };
        }
        throw error;
    }
}

export async function outLogin(options?: { [key: string]: any }) {
    setAuthToken(null);
}

export function setAuthToken(token: string | null) {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        localStorage.removeItem(TOKEN_KEY);
    }
}

export function getAuthToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}