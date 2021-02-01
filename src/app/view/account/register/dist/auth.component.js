"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthComponent = void 0;
var core_1 = require("@angular/core");
var core_2 = require("@angular/core");
var validation_service_1 = require("src/app/validation/validation.service");
var UserProfile_1 = require("src/app/Model/UserProfile");
var Login_1 = require("src/app/Model/Login");
var AuthComponent = /** @class */ (function () {
    function AuthComponent(authService, router, route, http) {
        var _this = this;
        this.authService = authService;
        this.router = router;
        this.route = route;
        this.http = http;
        this.error = null;
        this.hide = true;
        this.isLoading = false;
        this.fullNameErrorHandler = {
            isErrorState: function (control) { return validation_service_1.Validation.checkLimit(control, 5, 100); }
        };
        this.postalCodeErrorHandler = {
            isErrorState: function (control) { return validation_service_1.Validation.onlyDigit(control); }
        };
        this.addressErrorHandler = {
            isErrorState: function (control) { return validation_service_1.Validation.checkLimit(control, 20, 200); }
        };
        this.confirmPasswordErrorHandler = {
            isErrorState: function (control) { return validation_service_1.Validation.confirmPassword(control, _this.signup.password); }
        };
        this.emailErrorHandler = {
            isErrorState: function (control) { return validation_service_1.Validation.checkEmail(control); }
        };
        this.passwordErrorHandler = {
            isErrorState: function (control) { return validation_service_1.Validation.checkPassword(control); }
        };
        this.login = new Login_1.Login();
        this.signup = new Login_1.Login();
        this.UserProfile = new UserProfile_1.UserProfile();
    }
    AuthComponent.prototype.onResetLoglin = function () {
        this.login = new Login_1.Login();
    };
    AuthComponent.prototype.onResetSignUp = function () {
        this.UserProfile = new UserProfile_1.UserProfile();
    };
    AuthComponent.prototype.onLogin = function (form) {
        var _this = this;
        if (!form.valid) {
            return;
        }
        var authObs;
        authObs = this.authService.login(this.login);
        authObs.subscribe(function (resData) {
            _this.router.navigate(['/']);
        }, function (errorMessage) {
            _this.error = errorMessage;
        });
        form.reset();
    };
    AuthComponent.prototype.onSignUp = function (form) {
        if (!form.valid) {
            return;
        }
        this.UserProfile.originalName = this.authService.correctUserName(this.signup.email, false);
        var authObs = this.authService.signup(this.signup, this.UserProfile);
        this.router.navigate(['/'], { relativeTo: this.route });
    };
    __decorate([
        core_2.ViewChild('signUpForm')
    ], AuthComponent.prototype, "signUpForm");
    AuthComponent = __decorate([
        core_1.Component({
            selector: 'app-auth',
            templateUrl: './auth.component.html',
            styleUrls: ['./auth.component.css']
        })
    ], AuthComponent);
    return AuthComponent;
}());
exports.AuthComponent = AuthComponent;
