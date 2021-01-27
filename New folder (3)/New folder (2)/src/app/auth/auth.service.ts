import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Subject } from 'rxjs/internal/Subject';
import { loginModel, UserProfileModel } from '../model/appModel';
import { Observable } from 'rxjs/internal/Observable';



export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  appProfile = new Subject<UserProfileModel>();
  appProfileStatic: UserProfileModel;
  username = new BehaviorSubject<string>("");
  private tokenExpirationTimer: any;
  isAuthenticated = new Subject<any>();
  appUser: any;
  constructor(private http: HttpClient, private router: Router) {
    this.user.subscribe(
      (user) => {
        this.appUser = <User>user;
      }
    )
  }


  //because fiebase doesn't accept '.' in url so we must replac '.' with anoher char
  correctUserName(originalEmail: string, Replace: boolean = true) {
    let username = originalEmail.slice(0, originalEmail.indexOf('@'));
    if (Replace) {
      username = username.replace('.', '_');
    }
    return username;
  }

  signup(signup: loginModel, profile: UserProfileModel) {
    return this.http
      .post<AuthResponseData>
      (
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBQut5WyfLdoriudf89QvCo3t4ZzkGFMyk',
        {
          email: signup.email,
          password: signup.password,
          returnSecureToken: true
        }
      )
      .subscribe(
        (registerdata) => 
        {
          let username = this.correctUserName(signup.email);
          this.http.post('http://Users/' + username, profile).subscribe(
            (insertProfileData) => {
              let mappedProfile = <UserProfileModel>insertProfileData;
              this.appProfile.next(mappedProfile);
              this.loadProfile(registerdata.email).subscribe(
                (profile) => {
                  this.appProfile.next(profile);
                  this.appProfileStatic = profile;
                }
              );
            }
          );

          this.isAuthenticated.next(true);
          this.username.next(registerdata.email);
          this.handleAuthentication(
            registerdata.email,
            registerdata.localId,
            registerdata.idToken,
            +registerdata.expiresIn
          );
        }
      );
  }

  login(login: loginModel) {
    return this.http
      .post<AuthResponseData>(
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBQut5WyfLdoriudf89QvCo3t4ZzkGFMyk',
        {
          email: login.email,
          password: login.password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
          this.isAuthenticated.next(true);

          this.loadProfile(resData.email).subscribe(
            (profile) => {
              this.appProfile.next(profile);
              this.appProfileStatic = profile;
            }
          )
        })
      );
  }

  updateProfile() {
    let username = this.correctUserName((<User>this.appUser).email); 
    return this.http.delete('http://Users/' + username)
      .subscribe(
        () => {          
          this.http.post('http://Users/' + username, this.appProfileStatic).subscribe(
            (data) => {
              this.appProfile.next(this.appProfileStatic)              
            }
          )
        }
      );
  }


  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {

      return;
    }
    else {
      this.isAuthenticated.next(true);
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);


      this.loadProfile(loadedUser.email).subscribe(
        (profile) => {
          this.appProfile.next(profile);
          this.appProfileStatic = profile;
        }
      )
    }
  }

  public loadProfile(userName: string): Observable<any> {
    return this.http.get('http://Users/' + this.correctUserName(userName, true))
      .pipe(
        catchError(this.handleError),
        map(responseData => {
          const postsArray = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        },
        )
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.isAuthenticated.next(false);
    this.appProfile.next(null);
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 10000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 10000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
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
    }
    return throwError(errorMessage);
  }
}
