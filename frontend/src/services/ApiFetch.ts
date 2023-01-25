const url = `${process.env.REACT_APP_API_URL}`;

export const ApiFetch = {
    get: async function <ResponseBody>(relativeUrl: string) {
        return fetch(`${url}${relativeUrl}`, {
            method: 'GET',
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json() as Promise<ResponseBody>;
        }).catch(e => {
            console.error(e);
        });
    },
    post: async function <ResponseBody>(relativeUrl: string, requestBody: Record<string, unknown> = {}) {
        return fetch(`${url}${relativeUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Note: Will need to change this to accept formdata eventually for file uploads
            },
            body: JSON.stringify(requestBody),
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json() as Promise<ResponseBody>;
        }).catch(e => {
            console.error(e);
        });
    },
};

export default ApiFetch;
