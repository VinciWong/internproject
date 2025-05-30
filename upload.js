import xlsx from "xlsx";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function uploadExcel() {
  const workbook = xlsx.readFile(path.join(__dirname, "tool_set.xlsx"));
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  const names = json.slice(3);
  const themes = json[0].slice(1);
  const subthemes = json[1].slice(1);
  const categories = json[2].slice(1);

  let entries = [];

  for (let row of names) {
    const name = row[0];
    for (let col = 1; col < row.length; col++) {
      if (row[col] === "x" || row[col] === "X") {
        entries.push({
          name,
          theme: themes[col - 1],
          subtheme: subthemes[col - 1],
          category: categories[col - 1],
        });
      }
    }
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false
    }
  });

  await connection.execute("DROP TABLE IF EXISTS names;");
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS names (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      theme VARCHAR(255),
      subtheme VARCHAR(255),
      category VARCHAR(255)
    )
  `);

  for (let entry of entries) {
    await connection.execute(
      "INSERT INTO names (name, theme, subtheme, category) VALUES (?, ?, ?, ?)",
      [entry.name, entry.theme, entry.subtheme, entry.category]
    );
  }

  console.log("Data Uploaded to MySQL！");
  await connection.end();
}
