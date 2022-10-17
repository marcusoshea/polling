import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

const AUTH_API = 'http://localhost:3000';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, public activatedRoute: ActivatedRoute) {}

  login(email: string, password: string, polling_order_id: string): Observable<any> {
    return this.http.post(
      AUTH_API + '/member/login',
      {
        "email": email,
        "password": password,
        "polling_order_id": polling_order_id
      },        
      httpOptions
    );
  }

  register(memberName: string, email: string, password: string, polling_order_id: string): Observable<any> {
     const today = new Date();
    /*const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const created = year + '-' + month + '-' + day; */

    const created = today.toISOString().split('T')[0];

    return this.http.post(
      AUTH_API + '/member/create',
      { "name": memberName,
        "email": email,
        "password": password, 
        "polling_order_id": polling_order_id,
        "pom_created_at": created,
      },
      httpOptions
    );
  }
  
  getPasswordToken(email: string, polling_order_id: string): Observable<any> {
    return this.http.post(
      AUTH_API + '/member/passwordToken',
      {
        "email": email,
        "polling_order_id": polling_order_id
      },        
      httpOptions
    );
  }

  async resetPassword(email: string, password: string): Promise<Observable<any>> {
   const token = this.activatedRoute.snapshot.queryParamMap.get("token");
    return await this.http.post(
      AUTH_API + '/member/verify/'+token,
      {
        "email": email,
        "password": password
      }       
    );  
  }

  updatePassword(email: string, password: string, newPassword: string, pollingOrderId: string, accessToken: string): Observable<any> {
    var reqHeader = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
   });
     
    return this.http.put(
      AUTH_API + '/member/changePassword',
      {
        "email":email,
        "password": password,
        "newPassword": newPassword,
        "pollingOrderId": pollingOrderId
      }, { headers: reqHeader }
    );
  }

}
