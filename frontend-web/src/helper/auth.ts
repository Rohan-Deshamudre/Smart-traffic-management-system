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

    export function isEngineer(): boolean {
        if (getToken() && getToken().length > 0) {
            const decoded = jwt(getToken());
            return decoded.groups.map((x) => +x.id).includes(1);
        } else {
            return false;
        }
    }

    export function isOperator(): boolean {
        if (getToken() && getToken().length > 0) {
            const decoded = jwt(getToken());
            return decoded.groups.map((x) => +x.id).includes(2);
        } else {
            return false;
        }
    }

    export function getName(): string {
        if (getToken() && getToken().length > 0) {
            const decoded = jwt(getToken());
            return decoded.username;
        }
    }

    /**
     * Check if user is authenticated.
     */
    export function hasValidToken(): boolean {


        if (getToken() && getToken().length > 0) {
            const decoded = jwt(getToken());
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
