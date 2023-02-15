const url = `${process.env.REACT_APP_API_URL}`;

export const ApiFetch = {
    get: async <ResponseBody>(relativeUrl: string, additionalFetchOptions: RequestInit = {}): Promise<ResponseBody> => {
        try {
            const response = await fetch(`${url}${relativeUrl}`, {
                method: 'GET',
                credentials: 'include',
                ...additionalFetchOptions,
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json.message);
            }
            return json;
        } catch (e) {
            console.error(e);
            throw e;
        }
    },

    post: async <ResponseBody>(relativeUrl: string, requestBody: unknown = {}, additionalFetchOptions: RequestInit = {}): Promise<ResponseBody> => {
        try {
            const response = await fetch(`${url}${relativeUrl}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Note: Will need to change this to accept formdata eventually for file uploads
                },
                credentials: 'include',
                body: JSON.stringify(requestBody),
                ...additionalFetchOptions,
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json.message);
            }
            return json;
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
};

export default ApiFetch;
