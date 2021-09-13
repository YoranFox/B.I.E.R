import { Injectable } from '@angular/core';
import { Session } from '../../_sdk/models';
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

  get session() {
    return this.currentSession;
  }

  get role() {
    return this.currentSession?.code.role;
  }

  get user() {
    return this.currentSession?.user;
  }
}
