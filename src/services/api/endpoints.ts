import { PropertyType } from '@/pages/report';
import { createData, deleteData, fetchData, updateData } from '.';

export const endpoints = {
  scrapper: 'scraper/fetch',
  reports_list: 'reports/list',
  reports: 'reports',

  formula: 'formula',

  // file: 'data/report-generate.json',
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

type SuccessType = { code: number; message: string };

// export const downloadFile = () => fetchData(endpoints.file, {});
export const getReportData = (params?: ReportParamsType | {}) => createData<ReportsResponse>(endpoints.reports_list, params);

export const addNewFields = (fields: { [key: string]: string | number | null }[]) => createData<SuccessType>(endpoints.reports, fields);

export const updateFields = (fields: { [key: string]: string | number | null }[]) => updateData<SuccessType>(endpoints.reports, fields);

export const deleteFields = (fieldIds: number[]) => deleteData<SuccessType>(endpoints.reports, fieldIds);

/* --------------------------------- Formula -------------------------------- */
export type FormulaType = { name: string; formula: string; id: number };
export const getFormulaList = () => fetchData<SuccessType & { data: FormulaType[] }>(endpoints.formula, {});

export const createFormula = (data: Omit<FormulaType, 'id'> & { id?: number }) => createData<SuccessType>(endpoints.formula, data);

export const deleteFormula = (data: number[]) => deleteData<SuccessType>(endpoints.formula, data);

export const setFormulaToField = (data: { productIds: (number | string)[]; formulaId: string }) =>
  updateData<SuccessType>(`${endpoints.reports}/${endpoints.formula}`, data);
