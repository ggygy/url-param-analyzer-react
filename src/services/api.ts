export interface ApiResponse {
    data: object | null;
    error?: string;
}

export const fetchData = async (params: object, url: string, method: 'GET' | 'POST' = 'POST', token = ''): Promise<ApiResponse> => {
    try {
        let fetchUrl = url;
        const fetchOptions: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        };

        if (method === 'GET') {
            const queryParams = new URLSearchParams(params as Record<string, string>).toString();
            fetchUrl = `${url}?${queryParams}`;
        } else {
            fetchOptions.body = JSON.stringify(params);
        }

        const response = await fetch(fetchUrl, fetchOptions);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        return { data: await response.json() };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};