import { copyFileSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// The API generates its TypeScript client on build (TransactionDisputePortal.API.Client); copy it into src/codegen.
const __dirname = dirname(fileURLToPath(import.meta.url));

const source = resolve(__dirname, '../../TransactionDisputePortal/TransactionDisputePortal.API.Client/Typescript/api-client.ts');
const target = resolve(__dirname, '../src/codegen/api-client.ts');

if (!existsSync(source)) {
  console.error(`API client not found: ${source}\nBuild the TransactionDisputePortal solution first.`);
  process.exit(1);
}

copyFileSync(source, target);
console.log(`Copied ${source}\n    -> ${target}`);
