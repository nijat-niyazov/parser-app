import { PropertyType } from '@/pages/report';
import { createData, deleteData, fetchData, updateData } from '.';

export const endpoints = {
  scrapper: 'scraper/fetch',
  reports_list: 'reports/list',
  reports: 'reports',
  formula: 'formula',
  generate_reports: 'reports/generate',
  rename_value: 'reports/rename',
};

export const generateLinks = (data: string[]) => createData<{ data: SuccessType }>(endpoints.scrapper, data);

type ReportParamsType = { [key: string]: string | null };
type ReportsResponse = { code: number; message: string; limit: number; offset: number; total: number; data: PropertyType[] };
type SuccessType = { code: number; message: string };
export type FormulaType = { name: string; formula: string; id: number };

export const getReportData = (payload: ReportParamsType) => createData<ReportsResponse>(endpoints.reports_list, payload);
export const addNewFields = (fields: { [key: string]: string | number | null }[]) => createData<SuccessType>(endpoints.reports, fields);
export const updateFields = (fields: { [key: string]: string | number | null }[]) => updateData<SuccessType>(endpoints.reports, fields);
export const deleteFields = (fieldIds: number[]) => deleteData<SuccessType>(endpoints.reports, fieldIds);

/* --------------------------------- Formula -------------------------------- */

export const getFormulaList = () => fetchData<SuccessType & { data: FormulaType[] }>(endpoints.formula, {});
export const createFormula = (data: Omit<FormulaType, 'id'> & { id?: number }) => createData<SuccessType>(endpoints.formula, data);
export const deleteFormula = (data: number[]) => deleteData<SuccessType>(endpoints.formula, data);
export const setFormulaToField = (data: { productIds: (number | string)[]; formulaId: string }) =>
  updateData<SuccessType>(`${endpoints.reports}/${endpoints.formula}`, data);

/* ----------------------------- Generate Excel ----------------------------- */
export const generateReports = (payload: ReportParamsType) =>
  createData<{ code: number; data: string; message: string }>(endpoints.generate_reports, payload);

/* ------------------------------ Rename Value ------------------------------ */
export const renameField = (payload: { [key: string]: string }) => updateData<SuccessType>(endpoints.rename_value, payload);
