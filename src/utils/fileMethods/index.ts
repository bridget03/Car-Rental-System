import fs from "fs";

export const readJsonFile = async (filePath: string) => {
  const data = await fs.promises.readFile(filePath, "utf8");
  return JSON.parse(data);
};

export const writeJsonFile = async (filePath: string, data: any) => {
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
};