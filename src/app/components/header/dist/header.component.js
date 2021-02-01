"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HeaderComponent = void 0;
var core_1 = require("@angular/core");
var UserProfile_1 = require("src/app/model/classes/UserProfile");
var HeaderComponent = /** @class */ (function () {
    function HeaderComponent(fetchData, orderSrv, route, router, authService) {
        this.fetchData = fetchData;
        this.orderSrv = orderSrv;
        this.route = route;
        this.router = router;
        this.authService = authService;
        this.badgeHidden = true;
        this.isAuthenticated = false;
        this.getCategory();
        this.profile = new UserProfile_1.UserProfile();
    }
    HeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.orderSrv.basketChanged.subscribe(function (basket) {
            if (basket != null && basket.items != null && basket.items.length > 0) {
                _this.badgeCount = basket.items.length;
                _this.badgeHidden = false;
            }
            else {
                _this.badgeHidden = true;
            }
        });
        this.userSub = this.authService.user.subscribe(function (user) {
            _this.isAuthenticated = !!user;
            console.log("fire");
            console.log(_this.isAuthenticated);
            if (!_this.isAuthenticated) {
                _this.profile = null;
                console.log("this appProfile is null");
            }
        });
        this.authService.isAuthenticated.subscribe(function (a) {
            _this.isAuthenticated = a;
            if (!_this.isAuthenticated) {
                _this.profile = null;
                console.log("this appProfile is null");
            }
        });
        this.profileSub = this.authService.profile.subscribe(function (profile) {
            if (profile != null) {
                if (!profile[0]) {
                    _this.profile = profile;
                }
                else {
                    _this.profile = profile[0];
                }
            }
        });
        this.authService.username.subscribe(function (username) {
            if (username.length) {
                _this.profileSub = _this.authService.loadProfile(username).subscribe(function (appProfile) {
                    _this.profile = appProfile[0];
                });
            }
        });
    };
    HeaderComponent.prototype.ngOnDestroy = function () {
        this.userSub.unsubscribe();
        this.profileSub.unsubscribe();
    };
    HeaderComponent.prototype.getCategory = function () {
        var _this = this;
        this.fetchData.allCategory.subscribe(function (Categories) {
            _this.cetegoryList = Categories;
        });
    };
    HeaderComponent.prototype.onMenuClick = function (id) {
        this.router.navigate(['/list', id], { relativeTo: this.route });
    };
    HeaderComponent.prototype.openProfile = function () {
        //this.router.navigate(['/profile'], { relativeTo: this.route });
        this.redirectTo('/profile');
    };
    HeaderComponent.prototype.redirectTo = function (uri) {
        var _this = this;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(function () {
            return _this.router.navigate([uri]);
        });
    };
    HeaderComponent.prototype.logout = function () {
        this.authService.logout();
        this.userSub.unsubscribe();
        this.router.navigate(['/'], { relativeTo: this.route });
    };
    HeaderComponent.prototype.prepareLogIn = function () {
        this.router.navigate(['/auth'], { relativeTo: this.route });
    };
    HeaderComponent.prototype.goHome = function () {
        this.router.navigate(['/'], { relativeTo: this.route });
    };
    HeaderComponent = __decorate([
        core_1.Component({
            selector: 'app-header',
            templateUrl: './header.component.html',
            styleUrls: ['./header.component.css']
        })
    ], HeaderComponent);
    return HeaderComponent;
}());
exports.HeaderComponent = HeaderComponent;
