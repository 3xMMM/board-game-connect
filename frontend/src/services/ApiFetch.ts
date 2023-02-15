const url = `${process.env.REACT_APP_API_URL}`;

export const ApiFetch = {
    get: function <ResponseBody>(relativeUrl: string, additionalFetchOptions: RequestInit = {}) {
        return fetch(`${url}${relativeUrl}`, {
            method: 'GET',
            credentials: 'include',
            ...additionalFetchOptions,
        }).then(response => {
            return response.json().then(json => {
                if (!response.ok) {
                    throw new Error(json.message);
                }
                return json as Promise<ResponseBody>;
            });
        }).catch(e => {
            console.error(e);
            throw e;
        });
    },

    post: function <ResponseBody>(relativeUrl: string, requestBody: unknown = {}, additionalFetchOptions: RequestInit = {}) {
        return fetch(`${url}${relativeUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Note: Will need to change this to accept formdata eventually for file uploads
            },
            credentials: 'include',
            body: JSON.stringify(requestBody),
            ...additionalFetchOptions,
        }).then(response => {
            return response.json().then(json => {
                if (!response.ok) {
                    throw new Error(json.message);
                }
                return json as Promise<ResponseBody>;
            });
        }).catch(e => {
            console.error(e);
            throw e;
        });
    },
};

export default ApiFetch;
