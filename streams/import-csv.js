import fs from 'node:fs';
import { parse } from 'csv-parse';

const csvFilePath = new URL('./tasks.csv', import.meta.url);
const stream = fs.createReadStream(csvFilePath);

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2 // skip header
});

async function executeImport() {
  const linesParse = stream.pipe(csvParse);

  for await (const line of linesParse) {
    const [title, description] = line;

    await fetch('http://localhost:3334/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      })
    })
  }

}

executeImport()