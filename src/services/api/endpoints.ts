import { createData, fetchData } from ".";

export const endpoints = {
  scrapper: "scrapper/fetch",
  reports: "reports/list",
  formula: "formula/price",
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

export const getReportData = (params: ReportParamsType) =>
  fetchData(endpoints.reports, params);

export const getFormulaList = () => fetchData(endpoints.formula, {});

export const createFormula = (data: { name: string; formula: string }) =>
  createData(endpoints.formula, data);

export const updateFormula = (data: {
  name: string;
  formula: string;
  id: number;
}) => createData(endpoints.formula, data);
