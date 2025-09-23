import { Validator } from '../app.js';

test('isNonEmpty works correctly', ()=>{
  expect(Validator.isNonEmpty("123")).toBe(true);
  expect(Validator.isNonEmpty("")).toBe(false);
});

test('isNumeric works correctly', ()=>{
  expect(Validator.isNumeric("123")).toBe(true);
  expect(Validator.isNumeric("12a")).toBe(false);
});

test('isValidStatus works correctly', ()=>{
  expect(Validator.isValidStatus("Pending")).toBe(true);
  expect(Validator.isValidStatus("Unknown")).toBe(false);
});
