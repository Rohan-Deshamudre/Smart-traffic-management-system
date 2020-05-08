export module Auth {
    var inMemToken;

    export function login(jwt_token) {
        inMemToken =
            jwt_token
            //TODO: store expiry
            ;
    }

    export function isLoggedIn() {
        if (!inMemToken) {
            return false
        }
        return inMemToken
    }
}