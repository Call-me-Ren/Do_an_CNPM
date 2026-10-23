import axios from 'axios';
import { MuseumData } from '../types';

const isProduction = import.meta.env.PROD;
const basePath = isProduction ? '/Test_CNPM' : '';

export const museumApi = {
  getMuseumData: async (): Promise<MuseumData> => {
    const res = await axios.get<MuseumData>(`${basePath}/mock/museum_data.json`);
    return res.data;
  },
};
