import { appendFileSync } from 'node:fs';

const payloadRaw = process.env.INPUT_PAYLOAD;
const outputPath = process.env.GITHUB_OUTPUT;

function fail(message) {
  throw new Error(message);
}

let parsed;
try {
  parsed = JSON.parse(payloadRaw);
} catch {
  fail('Invalid INPUT_PAYLOAD JSON');
}

if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
  fail('payload must be an object');
}

if (!Object.prototype.hasOwnProperty.call(parsed, 'values')) {
  fail('payload.values is required');
}

const values = parsed.values;

if (!Array.isArray(values) || values.length === 0) {
  fail('payload.values must be a non-empty array');
}

let count = values.length;
let min = Infinity;
let max = -Infinity;
let sum = 0;

for (let i = 0; i < values.length; i++) {
  const n = values[i];
  if (typeof n !== 'number' || !Number.isFinite(n)) {
    fail('payload.values must contain only finite numbers');
  }
  if (n < min) min = n;
  if (n > max) max = n;
  sum += n;
}

const mean = sum / count;
const result = { count, min, max, sum, mean };
appendFileSync(outputPath, `result=${JSON.stringify(result)}\n`);