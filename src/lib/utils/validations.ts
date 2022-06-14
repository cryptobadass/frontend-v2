import i18n from '@/plugins/i18n';
import { bnum } from '.';
import numeral from 'numeral';
import { isAddress } from '@ethersproject/address';
import { isURL as _isURL } from 'validator';

export function isRequired(field = '') {
  const _field = field ? `${field} ` : 'Input ';
  return v => !!v || `${_field}${i18n.global.t('isRequired')}`;
}

export function minChar(minLength: number, field = '') {
  const _field = field ? `${field} ` : '';
  return v =>
    !v ||
    v.length >= minLength ||
    `${_field}${i18n.global.t('mustBeAtLeast', [minLength])}`;
}

export function isPositiveCheck(number: number | string) {
  return bnum(number).isGreaterThanOrEqualTo(0);
}
export function isPositive() {
  return v =>
    !v ||
    isPositiveCheck(numeral(v).value() || 0) ||
    i18n.global.t('mustBePositive');
}

export function isLessThanOrEqualTo(max: number | string, msg = '') {
  return v =>
    !v ||
    bnum(v).isLessThanOrEqualTo(max) ||
    (msg ? msg : i18n.global.t('mustBeLessThan', [max]));
}

export const isEmailCheck = email => {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
};

export function isEmail() {
  return v => !v || isEmailCheck(v) || i18n.global.t('mustBeValidEmail');
}

export function isValidAddress() {
  return v => !v || isAddress(v) || i18n.global.t('mustBeValidAddress');
}

export function isGreaterThan(min: number | string, msg = '') {
  return v =>
    !v ||
    bnum(v).isGreaterThan(min) ||
    (msg ? msg : i18n.global.t('mustBeMoreThan', [min]));
}
export const isImageUrlCheck = image => {
  const regex = /^(https:\/\/).*.(png|jpg|gif|jpeg|webp)$/;
  return regex.test(String(image).toLowerCase());
};
export function isImageUrl() {
  return v =>
    !v ||
    isImageUrlCheck(v) ||
    'starting with "https://" and ending in ".jpeg", ".jpg", or ".png".';
}
export const isHttpStartCheck = url => {
  const regex = /^(http(s?):\/\/)/;
  return regex.test(String(url).toLowerCase());
};
export function isHttpStart() {
  return v =>
    !v || isHttpStartCheck(v) || 'starts with "http://" or "https://"';
}
export const isURLCheck = url => {
  return _isURL(url);
};
export function isURL() {
  return v => !v || isURLCheck(v) || 'must be right URL';
}
