import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../Model/User';
import { UserProfile } from '../Model/UserProfile';
import { Login } from '../Model/Login';
import { AuthResponseData } from '../Interface/AuthResponseData';


@Injectable({ providedIn: 'root' })
export class AuthService {

  user = new BehaviorSubject<User>(null);
  profile = new BehaviorSubject<UserProfile>(null); 
  username = new BehaviorSubject<string>("");
  usernameSubject=new Subject<any>();
  private tokenExpirationTimer: any;
  isAuthenticated = new Subject<any>();
  appUser: any;
  

  constructor(private http: HttpClient, private router: Router) {
    this.user.subscribe(
      (user) => {
        if(user !=null)
        {
          this.appUser = <User>user;
        }                
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

  signup(signup: Login, profile: UserProfile) {
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
        (registerdata) => {
          let username = this.correctUserName(signup.email);
          this.http.post('http://Users/' + username, profile).subscribe(
            (insertProfileData) => {
              let mappedProfile = <UserProfile>insertProfileData;
              this.profile.next(mappedProfile);
              this.loadProfile(registerdata.email).subscribe(
                (profile) => {
                  this.profile.next(profile);
                  //this.appProfileStatic = profile;
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

  login(login: Login) {
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
              this.profile.next(profile);
              //this.appProfileStatic = profile;
            }
          )
        })
      );
  }

  updateProfile(userProfile:UserProfile) {
    let username = this.correctUserName((<User>this.appUser).email);
    return this.http.delete('http://Users/' + username)
      .subscribe(
        () => {
          this.http.post('http://Users/' + username, userProfile).subscribe(
            (data) => {
              this.profile.next(userProfile);
             // this.appProfile.next(this.appProfile);
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
     this.logout();
     return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.loadProfile(loadedUser.email)
      .subscribe(
        (profile) => 
        {    
          console.log("profile loaded");      
          this.profile.next(profile);console.log(profile);
          this.usernameSubject.next(loadedUser.email);
          this.user.next(loadedUser);
          this.appUser=loadedUser;
          const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
          this.autoLogout(expirationDuration);
          this.isAuthenticated.next(true);
        },
        errorMessage => 
        {
          this.logout();
          this.isAuthenticated.next(false);
          this.profile.next(null);
          return;
        }
      )
    }
  }

  public loadProfile(userName: string): Observable<any> {
    let username = this.correctUserName(userName);
    return this.http
    .get('https://digibugloos-default-rtdb.europe-west1.firebasedatabase.app/Users/'+username+".json")
    .pipe(
        catchError(this.handleError)
        ,
        map(responseData => {
            const postsArray = [];
            for (const key in responseData) {
                if (responseData.hasOwnProperty(key)) {
                        postsArray.push({ ...responseData[key], id: key });                         
                }
            }
            return postsArray;
        })
    );

  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.isAuthenticated.next(false);
    this.profile.next(null);
    this.appUser=null;
    this.username.next("");
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

  public handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
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
    return throwError(errorMessage);
  }
}
