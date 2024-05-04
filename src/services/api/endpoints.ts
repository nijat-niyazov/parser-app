import { PropertyType } from '@/pages/report';
import {
  DetailedErrorResponse,
  ErrorResponse,
  ServerErrorResponse,
  SuccessReponse,
  createData,
  deleteData,
  fetchData,
  updateData,
} from '.';

export const endpoints = {
  scrapper: 'scraper/fetch',
  reports_list: 'reports/list',
  reports: 'reports',
  formula: 'formula',
  generate_reports: 'reports/generate',
  rename_value: 'reports/rename',
  check_stock: 'scraper/check-stock',
};

type SuccessType = { code: number; message: string };

export const generateLinks = (data: string[]) =>
  createData<
    SuccessReponse<200, SuccessType> | DetailedErrorResponse<{ message: string }> | ServerErrorResponse<{ error: { message: string } }>
  >(endpoints.scrapper, data);

type ReportParamsType = { [key: string]: string | null };

type ReportsResponse = {
  code: number;
  message: string;
  limit: number;
  offset: number;
  total: number;
  data: PropertyType[];
};

export type FormulaType = { name: string; formula: string; id: number };

export const getReportData = (payload: ReportParamsType) =>
  createData<
    SuccessReponse<200, ReportsResponse> | DetailedErrorResponse<{ message: string }> | ServerErrorResponse<{ error: { message: string } }>
  >(endpoints.reports_list, payload);

export const addNewFields = (fields: { [key: string]: string | number | null }[]) =>
  createData<
    SuccessReponse<202, SuccessType> | DetailedErrorResponse<{ message: string }> | ServerErrorResponse<{ error: { message: string } }>
  >(endpoints.reports, fields);

export const updateFields = (fields: { [key: string]: string | number | null }[]) =>
  updateData<
    SuccessReponse<200, SuccessType> | DetailedErrorResponse<{ message: string }> | ServerErrorResponse<{ error: { message: string } }>
  >(endpoints.reports, fields);
export const deleteFields = (fieldIds: number[]) =>
  deleteData<
    SuccessReponse<200, SuccessType> | DetailedErrorResponse<{ message: string }> | ServerErrorResponse<{ error: { message: string } }>
  >(endpoints.reports, fieldIds);

/* --------------------------------- Formula -------------------------------- */

export const getFormulaList = () => fetchData<SuccessReponse<200, SuccessType & { data: FormulaType[] }>>(endpoints.formula, {});
export const createFormula = (data: Omit<FormulaType, 'id'> & { id?: number }) =>
  createData<
    SuccessReponse<200, SuccessType> | DetailedErrorResponse<{ message: string }> | ServerErrorResponse<{ error: { message: string } }>
  >(endpoints.formula, data);
export const deleteFormula = (data: number[]) =>
  deleteData<
    SuccessReponse<200, SuccessType> | DetailedErrorResponse<{ message: string }> | ServerErrorResponse<{ error: { message: string } }>
  >(endpoints.formula, data);

export const setFormulaToField = (data: { productIds: (number | string)[]; formulaId: string }) =>
  updateData<
    SuccessReponse<200, SuccessType> | DetailedErrorResponse<{ message: string }> | ServerErrorResponse<{ error: { message: string } }>
  >(`${endpoints.reports}/${endpoints.formula}`, data);

/* ----------------------------- Generate Excel ----------------------------- */
export const generateReports = (payload: ReportParamsType) =>
  createData<SuccessReponse<200, SuccessType & { data: string }> | ErrorResponse<{ error: { detail: string } }>>(
    endpoints.generate_reports,
    payload
  );

/* ------------------------------ Rename Value ------------------------------ */
export const renameField = (payload: { [key: string]: string }) =>
  updateData<
    SuccessReponse<200, SuccessType> | DetailedErrorResponse<{ message: string }> | ServerErrorResponse<{ error: { message: string } }>
  >(endpoints.rename_value, payload);

/* ------------------------------- Check Stock ------------------------------ */

export const checkStocksOfFields = (fieldIds: number[]) =>
  updateData<
    SuccessReponse<200, SuccessType> | DetailedErrorResponse<{ message: string }> | ServerErrorResponse<{ error: { message: string } }>
  >(endpoints.check_stock, fieldIds);
