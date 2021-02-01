"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserTabComponent = void 0;
var core_1 = require("@angular/core");
var UserProfile_1 = require("src/app/model/classes/UserProfile");
var validation_service_1 = require("src/app/Service/validation.service");
var UserTabComponent = /** @class */ (function () {
    function UserTabComponent(_snackBar, authService, router, route, http) {
        var _this = this;
        this._snackBar = _snackBar;
        this.authService = authService;
        this.router = router;
        this.route = route;
        this.http = http;
        this.readonly = true;
        this.horizontalPosition = 'right';
        this.verticalPosition = 'bottom';
        this.fullNameErrorHandler = {
            isErrorState: function (control) { return validation_service_1.Validation.checkLimit(control, 5, 100); }
        };
        this.postalCodeErrorHandler = {
            isErrorState: function (control) { return validation_service_1.Validation.onlyDigit(control); }
        };
        this.addressErrorHandler = {
            isErrorState: function (control) { return validation_service_1.Validation.checkLimit(control, 20, 200); }
        };
        this.emailErrorHandler = {
            isErrorState: function (control) { return validation_service_1.Validation.checkEmail(control); }
        };
        this.UserProfile = new UserProfile_1.UserProfile();
        this.authService.profile.subscribe(function (profile) {
            if (profile[0]) {
                _this.UserProfile = profile[0];
            }
        });
    }
    UserTabComponent.prototype.ngOnInit = function () {
    };
    UserTabComponent.prototype.updateProfile = function () {
        this.authService.updateProfile(this.UserProfile);
        this.openSnackBar("your profile updated successfuly", false);
        this.onEditmode();
    };
    UserTabComponent.prototype.openSnackBar = function (title, isAdded) {
        if (isAdded === void 0) { isAdded = true; }
        var message = (isAdded) ? " added to card!" : "";
        this._snackBar.open(title + message, "ok", {
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition
        });
    };
    UserTabComponent.prototype.onEditmode = function () {
        this.readonly = !this.readonly;
    };
    UserTabComponent = __decorate([
        core_1.Component({
            selector: 'app-user-tab',
            templateUrl: './user-tab.component.html',
            styleUrls: ['./user-tab.component.css']
        })
    ], UserTabComponent);
    return UserTabComponent;
}());
exports.UserTabComponent = UserTabComponent;
