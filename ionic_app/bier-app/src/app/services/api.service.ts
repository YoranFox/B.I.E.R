import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRobot } from '../models/robot';
import { ROBOT_ENDPOINT } from './endpoints';
import { IOrder } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected url = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  public fetchRobots(): Observable<IRobot[]> {
    return this.http.get<IRobot[]>(`${this.url}${ROBOT_ENDPOINT}`);
  }

  public createOrder(robotId: string, order: IOrder): Observable<number> {
    return this.http.post<number>(
      `${this.url}${ROBOT_ENDPOINT}/${robotId}/order`,
      order
    );
  }

  public activateRobot(robotId: string): Observable<Object> {
    return this.http.post(`${this.url}${ROBOT_ENDPOINT}/activate`, {
      robot_id: robotId,
    });
  }

  public shutdownRobot(robotId: string): Observable<Object> {
    return this.http.post(`${this.url}${ROBOT_ENDPOINT}/shutdown`, {
      robot_id: robotId,
    });
  }
}
