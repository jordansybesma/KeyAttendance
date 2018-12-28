import decode from 'jwt-decode';

export default class AuthService {
    constructor() {
        this.domain = 'http://127.0.0.1:8000'
        this.fetch = this.fetch.bind(this)
        this.login = this.login.bind(this)
        this.getProfile = this.getProfile.bind(this)
    }

    login(username, password) {
        return this.fetch(`${this.domain}/api-token-auth/`, 'POST', {
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then(res => {
            this.setToken(res.token)
            return Promise.resolve(res);
        })
    }

    loggedIn() {
        const token = this.getToken()
        return !!token && !this.isTokenExpired(token)
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    }

    setToken(idToken) {
        localStorage.setItem('token', idToken)
    }

    getToken() {
        return localStorage.getItem('token')
    }

    logout() {
        localStorage.removeItem('token');
    }

    getProfile() {
        return decode(this.getToken());
    }


    fetch(url, method, options) {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        if (this.loggedIn()) {
            headers['Authorization'] = 'JWT ' + this.getToken()
        }

        return fetch(url, {
            method: method,
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
}