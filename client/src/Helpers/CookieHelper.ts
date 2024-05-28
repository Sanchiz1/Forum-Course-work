export type setCookieParamas = {
    name: string,
    value: string,
    expires_second?: number,
    path?: string,
    domain?: string,
    secure?: boolean
}

export function getCookie(name: string) {
    name = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            try {
                return JSON.parse(decodeURIComponent(c.substring(name.length, c.length)));
            }
            catch {
                return null;
            }
        }
    }
    return null;
}

export function setCookie(cookieParams: setCookieParamas) {
    let s = cookieParams.name + '=' + encodeURIComponent(cookieParams.value) + ';';
    if (cookieParams.expires_second) {
        let d = new Date();
        const offset = d.getTimezoneOffset() * 60;
        cookieParams.expires_second -= offset;
        d.setTime(d.getTime() + cookieParams.expires_second * 1000);
        s += ' expires=' + d.toUTCString() + ';';
    }
    if (cookieParams.path) s += ' path=' + cookieParams.path + ';';
    if (cookieParams.domain) s += ' domain=' + cookieParams.domain + ';';
    if (cookieParams.secure) s += ' secure;';
    document.cookie = s;
}

export function deleteCookie(name: string) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
}