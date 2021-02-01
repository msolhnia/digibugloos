"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.authService = void 0;
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var Subject_1 = require("rxjs/internal/Subject");
var User_1 = require("../Model/User");
var authService = /** @class */ (function () {
    function authService(http, router) {
        var _this = this;
        this.http = http;
        this.router = router;
        this.user = new rxjs_1.BehaviorSubject(null);
        this.profile = new rxjs_1.BehaviorSubject(null);
        this.username = new rxjs_1.BehaviorSubject("");
        this.usernameSubject = new Subject_1.Subject();
        this.isAuthenticated = new Subject_1.Subject();
        this.user.subscribe(function (user) {
            if (user != null) {
                _this.appUser = user;
            }
        });
    }
    //because fiebase doesn't accept '.' in url so we must replac '.' with anoher char
    authService.prototype.correctUserName = function (originalEmail, Replace) {
        if (Replace === void 0) { Replace = true; }
        var username = originalEmail.slice(0, originalEmail.indexOf('@'));
        if (Replace) {
            username = username.replace('.', '_');
        }
        return username;
    };
    authService.prototype.signup = function (signup, profile) {
        var _this = this;
        return this.http
            .post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBQut5WyfLdoriudf89QvCo3t4ZzkGFMyk', {
            email: signup.email,
            password: signup.password,
            returnSecureToken: true
        })
            .subscribe(function (registerdata) {
            var username = _this.correctUserName(signup.email);
            _this.http.post('http://Users/' + username, profile).subscribe(function (insertProfileData) {
                var mappedProfile = insertProfileData;
                _this.profile.next(mappedProfile);
                _this.loadProfile(registerdata.email).subscribe(function (profile) {
                    _this.profile.next(profile);
                    //this.appProfileStatic = profile;
                });
            });
            _this.isAuthenticated.next(true);
            _this.username.next(registerdata.email);
            _this.handleAuthentication(registerdata.email, registerdata.localId, registerdata.idToken, +registerdata.expiresIn);
        });
    };
    authService.prototype.login = function (login) {
        var _this = this;
        return this.http
            .post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBQut5WyfLdoriudf89QvCo3t4ZzkGFMyk', {
            email: login.email,
            password: login.password,
            returnSecureToken: true
        })
            .pipe(operators_1.catchError(this.handleError), operators_1.tap(function (resData) {
            _this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
            _this.isAuthenticated.next(true);
            _this.loadProfile(resData.email).subscribe(function (profile) {
                _this.profile.next(profile);
            });
        }));
    };
    authService.prototype.updateProfile = function (userProfile) {
        var _this = this;
        var username = this.correctUserName(this.appUser.email);
        return this.http["delete"]('http://Users/' + username)
            .subscribe(function () {
            _this.http.post('http://Users/' + username, userProfile).subscribe(function (data) {
                _this.profile.next(userProfile);
            });
        });
    };
    authService.prototype.autoLogin = function () {
        var _this = this;
        var userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            this.logout();
            return;
        }
        var loadedUser = new User_1.User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        if (loadedUser.token) {
            this.loadProfile(loadedUser.email)
                .subscribe(function (profile) {
                _this.profile.next(profile);
                _this.usernameSubject.next(loadedUser.email);
                _this.user.next(loadedUser);
                _this.appUser = loadedUser;
                var expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                _this.autoLogout(expirationDuration);
                _this.isAuthenticated.next(true);
            }, function (errorMessage) {
                _this.logout();
                _this.isAuthenticated.next(false);
                _this.profile.next(null);
                return;
            });
        }
    };
    authService.prototype.loadProfile = function (userName) {
        var username = this.correctUserName(userName);
        return this.http
            .get('https://digibugloos-default-rtdb.europe-west1.firebasedatabase.app/Users/' + username + ".json")
            .pipe(operators_1.catchError(this.handleError), operators_1.map(function (responseData) {
            var postsArray = [];
            for (var key in responseData) {
                if (responseData.hasOwnProperty(key)) {
                    postsArray.push(__assign(__assign({}, responseData[key]), { id: key }));
                }
            }
            return postsArray;
        }));
    };
    authService.prototype.logout = function () {
        this.user.next(null);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
        this.isAuthenticated.next(false);
        this.profile.next(null);
        this.appUser = null;
        this.username.next("");
    };
    authService.prototype.autoLogout = function (expirationDuration) {
        var _this = this;
        this.tokenExpirationTimer = setTimeout(function () {
            _this.logout();
        }, expirationDuration);
    };
    authService.prototype.handleAuthentication = function (email, userId, token, expiresIn) {
        var expirationDate = new Date(new Date().getTime() + expiresIn * 10000);
        var user = new User_1.User(email, userId, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 10000);
        localStorage.setItem('userData', JSON.stringify(user));
    };
    authService.prototype.handleError = function (errorRes) {
        var errorMessage = 'An unknown error occurred!';
        if (!errorRes.error || !errorRes.error.error) {
            return rxjs_1.throwError(errorMessage);
        }
        switch (errorRes.error.error) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct.';
                break;
            case 'unauthorized':
                errorMessage = 'This login unauthorized';
                break;
            case 'Auth token is expired':
                errorMessage = 'please login again';
                break;
        }
        return rxjs_1.throwError(errorMessage);
    };
    authService = __decorate([
        core_1.Injectable({ providedIn: 'root' })
    ], authService);
    return authService;
}());
exports.authService = authService;
