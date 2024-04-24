import { PropertyType } from '@/pages/report';
import { createData, fetchData, updateData } from '.';

export const endpoints = {
  scrapper: '',
  reports: 'reports/list',

  formula: 'formula',

  file: 'data/report-generate.json',
};

export const generateLinks = (data: string[]) => createData(endpoints.scrapper, data);

type ReportParamsType = {
  offset: number;
  limit: number;
  orderColumn: number;
  orderDirection: 'DESC' | 'ASC';
  timezone: '+04:00';
  fromDate: string;
  toDate: string;
};

type ReportsResponse = {
  code: number;
  message: string;
  limit: number;
  offset: number;
  total: number;
  data: PropertyType[];
};

export const getReportData = (params?: ReportParamsType | {}) => createData<ReportsResponse>(endpoints.reports, params);
export const downloadFle = () => fetchData(endpoints.file, {});

/* --------------------------------- Formula -------------------------------- */
export type FormulaType = { name: string; formula: string; id: number };
export const getFormulaList = () => fetchData<{ code: number; message: string; data: FormulaType[] }>(endpoints.formula, {});

export const createFormula = (data: Omit<FormulaType, 'id'>) => createData(endpoints.formula, data);

export const updateFormula = (data: FormulaType) => updateData(endpoints.formula, data);

export const deleteFormula = (data: number[]) => createData(endpoints.formula, data);
