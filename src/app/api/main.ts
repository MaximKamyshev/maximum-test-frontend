import type { AxiosInstance } from 'axios';
import { CarType, GroupedMarksType, MarkModelsType } from './types';
import { DefaultOptionType, LabeledValue } from 'antd/es/select';

export type MainApi = {
  getMarks(): Promise<GroupedMarksType[] | undefined>;
  getModelsMark(mark: string): Promise<MarkModelsType[] | undefined>;
  getFiltredRows(mark: string | DefaultOptionType[], models: string | DefaultOptionType[]): Promise<CarType[] | undefined>;
};

export class MainApiImpl implements MainApi {
  constructor(private readonly api: AxiosInstance) {}

  async getMarks(): Promise<GroupedMarksType[] | undefined> {
    const { data } = await this.api.get(`marks`);
    return data;
  }

  async getModelsMark(mark: string): Promise<MarkModelsType[] | undefined> {
    const { data } = await this.api.get(`models/${mark}`);
    return data;
  }

  async getFiltredRows(mark: string | DefaultOptionType[], models: string | DefaultOptionType[]): Promise<CarType[] | undefined> {
    const { data } = await this.api.get(`marks/${mark}?${models instanceof Array && models.map((value) => `filters[]=${value}`).join('&')}`);
    return data;
  }
}