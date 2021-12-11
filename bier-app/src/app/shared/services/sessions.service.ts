import { Injectable } from '@angular/core';
import { Creator, User, Session } from 'src/app/_sdk/models';
import { SessionsApiService } from '../../_sdk/services';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {
  private currentSession: Session | undefined;

  constructor(private sessionApi: SessionsApiService) { }

  async setSessionUser(userId: string) {
    this.currentSession = await this.sessionApi.sessionsControllerSelectUserForSession({userId}).toPromise();
  }

  public async updateLocalSession(): Promise<void> {
    try {
      const session = await this.sessionApi.sessionsControllerGetCurrentSession().toPromise();  
      this.currentSession = session;
    }
    catch(err) {
      delete this.currentSession;
    }

  }

  get session(): Session | undefined {
    return this.currentSession;
  }

  get role() {
    let role = null;
    if(this.currentSession?.code) {
      role = 'Member';
    }
    if(this.currentSession?.user){
      role = 'User';
    }
    if(this.currentSession?.creator) {
      role = 'Creator';
    }
    return role;
  }

  get user(): User | undefined {
    return this.currentSession?.user;
  }

  get creator(): Creator | undefined {
    return this.currentSession?.creator;
  }
}
