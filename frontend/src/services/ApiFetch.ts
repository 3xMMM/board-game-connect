const url = `${process.env.REACT_APP_API_URL}`;

export const ApiFetch = {
    post: async function <ResponseBody>(relativeUrl: string, requestBody: Record<string, unknown> = {}) {
        const response = await fetch(`${url}${relativeUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Note: Will need to change this to accept formdata eventually for file uploads
            },
            body: JSON.stringify(requestBody),
        });
        return await (await response.json() as Promise<ResponseBody>);
    },
};

export default ApiFetch;
