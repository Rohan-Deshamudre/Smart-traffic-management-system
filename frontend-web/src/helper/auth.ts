const jwt = require('jwt-decode');

export module Auth {

    export var role: string = '';

    export function saveToken(token) {
        sessionStorage.setItem('token', token)
    }

    export function getToken(): string {
        return sessionStorage.getItem('token')
    }

    export function eraseToken(): void {
        sessionStorage.removeItem('token')
    }

    export function setRoles(roles) {
        sessionStorage.setItem('roles', roles)
    }

    export function getName(): string {
        if (getToken() && getToken().length > 0) {
            const decoded = jwt(getToken());
            return decoded.name;
        }
    }

    /**
     * Check if user is authenticated.
     */
    export function hasValidToken(): boolean {


        if (getToken() && getToken().length > 0) {
            const decoded = jwt(getToken());
            console.log(decoded)
            const expiryDate = toDateTime(decoded.exp);
            return expiryDate > new Date();
        } else {
            return false;
        }
    }

    /**
     * Convert seconds to UTC date time.
     * @param secs
     */
    export function toDateTime(secs) {
        // Be careful.
        const t = new Date(Date.UTC(1970, 0, 1, 0, 50)); // Epoch
        t.setSeconds(secs);

        return t;
    }
}
