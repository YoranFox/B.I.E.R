import { Injectable } from '@angular/core';
import { Code, CreateCodeDto, UpdateCodeDto } from 'src/app/_sdk/models';
import { CodesApiService } from 'src/app/_sdk/services';
import { SessionsService } from './sessions.service';

@Injectable({
  providedIn: 'root'
})
export class CodesService {


  private currentCode: Code | undefined;

  constructor(private codesApi: CodesApiService, private sessionService: SessionsService) { }

  async getCurrentCreatorCodes(): Promise<Code[]> {
    if(this.sessionService.creator) {
      return await this.codesApi.codesControllerFindByCurrentCreator().toPromise();
    }
    return [];
  }

  async getCode(codeId: string): Promise<Code> {
    return await this.codesApi.codesControllerFindOne({id: codeId}).toPromise();
  }

  async createCode(code: CreateCodeDto) {
    return await this.codesApi.codesControllerCreate({body: code}).toPromise();
  }

  async updateCode(id: string, code: UpdateCodeDto) {
    return await this.codesApi.codesControllerUpdate({id, body: code}).toPromise()
  }

}
