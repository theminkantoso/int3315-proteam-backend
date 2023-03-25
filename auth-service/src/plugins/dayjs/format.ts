import { PluginFunc } from 'dayjs';

declare module 'dayjs' {
  interface Dayjs {
    fmYYYYMMDD(separator?: string): string;
    fmYYYYMMDDJp(separator?: string): string;
    fmYYYYMMDDHHmmJp(separator?: string): string;
    fmMMDDJp(separator?: string): string;
    fmYYYYMMJp(separator?: string): string;
    fmYYYYMMDDHHmmss(separator?: string): string;
    fmYYYYMMDDHHmm(separator?: string): string;
    fmHHmm(separator?: string): string;
    fmHHmmss(separator?: string): string;
    fmDayOfWeek(): string;
    fmYYYYMM(): string;
  }
}

export const displayPlugin: PluginFunc = (option, dayjsClass, dayjsFactory) => {
  dayjsClass.prototype.fmYYYYMMDD = function (separator = '-') {
    return this.format(`YYYY${separator}MM${separator}DD`);
  };

  dayjsClass.prototype.fmYYYYMMDDHHmmss = function (separator = '-') {
    return this.format(`YYYY${separator}MM${separator}DD HH:mm:ss`);
  };

  dayjsClass.prototype.fmYYYYMMDDHHmm = function (separator = '-') {
    return this.format(`YYYY${separator}MM${separator}DD HH:mm`);
  };

  dayjsClass.prototype.fmHHmm = function (separator = ':') {
    return this.format(`HH${separator}mm`);
  };
  dayjsClass.prototype.fmHHmmss = function (separator = ':') {
    return this.format(`HH${separator}mm${separator}ss`);
  };
  dayjsClass.prototype.fmYYYYMMDDJp = function (separator = '') {
    return this.format(`YYYY年${separator}MM月${separator}DD日`);
  };
  dayjsClass.prototype.fmYYYYMMJp = function (separator = '') {
    return this.format(`YYYY年${separator}MM月`);
  };
  dayjsClass.prototype.fmYYYYMMDDHHmmJp = function (separator = '') {
    return this.format(`YYYY年${separator}MM月${separator}DD日 HH:mm`);
  };
  dayjsClass.prototype.fmMMDDJp = function (separator = '') {
    return this.format(`MM月${separator}DD日`);
  };
  dayjsClass.prototype.fmDayOfWeek = function () {
    return this.format(`dd`);
  };
  dayjsClass.prototype.fmYYYYMM = function () {
    return this.format(`YYYY-MM`);
  };
};
