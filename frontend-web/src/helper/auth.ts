const jwt = require('jwt-decode');

export module Auth {

    export function saveToken(token) {
        sessionStorage.setItem('token', token)
    }

    export function saveRefreshToken(token) {
        sessionStorage.setItem('refresh_token', token)
    }

    export function getToken(): string {
        return sessionStorage.getItem('token')
    }

    export function eraseToken(): void {
        sessionStorage.removeItem('token');
    }

    /**
     * Check if user is authenticated.
     */
    export function isLoggedIn(): boolean {

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
        const t = new Date(Date.UTC(1970, 0, 1, 0, 59)); // Epoch
        t.setSeconds(secs);

        return t;
    }
}
