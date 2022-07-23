import { ILocation } from 'selenium-webdriver';

export interface IOrder {
  id?: string;
  location: ILocation;
  beverageId: string;
  status: string;
  robotId?: string;
}
