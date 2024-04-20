import { createData, fetchData } from ".";

export const endpoints = {
  scrapper: "aj",
  reports: "data/report.json",
  formula: "data/formula.json",
  file: "data/report-generate.json",
};

export const generateLinks = (data: string[]) =>
  createData(endpoints.scrapper, data);

type ReportParamsType = {
  offset: number;
  limit: number;
  orderColumn: number;
  orderDirection: "DESC" | "ASC";
  timezone: "+04:00";
  fromDate: string;
  toDate: string;
};

export const getReportData = (params?: ReportParamsType | {}) =>
  fetchData(endpoints.reports, params);

export const getFormulaList = () => fetchData(endpoints.formula, {});

export const createFormula = (data: { name: string; formula: string }) =>
  createData(endpoints.formula, data);

export const updateFormula = (data: {
  name: string;
  formula: string;
  id: number;
}) => createData(endpoints.formula, data);

export const downloadFle = () => fetchData(endpoints.file, {});
