export const Cookie = {
    setCookie: (cookieName: string, cookieValue: string, daysToExpire: number) => {
        const d = new Date();
        d.setTime(d.getTime() + (daysToExpire*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
    },
    deleteCookie: (cookieName: string) => {
        let expires = "expires="+ new Date(0).toUTCString();
        document.cookie = cookieName + "=;" + expires + ";path=/";
    },
    getCookie: (cookieName: string) => {
        let name = cookieName + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
};

export default Cookie;
