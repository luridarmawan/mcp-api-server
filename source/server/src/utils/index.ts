import * as path from 'path'
import * as fs from 'fs'
import chalk from 'chalk'
import { decode } from 'he';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

// USAGE
//   await utils._sleep(milisecond).then()
export async function _sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
  
// USAGE
//   await utils.sleep(milisecond);
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
  
  
export const ReadFile = (filename: string): string => {
  try {
    const fileContent = fs.readFileSync(filename, 'utf-8');
    return fileContent;
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error);
    // throw error; // Lempar error jika terjadi kesalahan
    return "";
  }
};

export const WriteFile = (filename: string, content: string): void => {
  try {
    fs.writeFileSync(filename, content, 'utf-8');
  } catch (error) {
    console.error(`Error writing file ${filename}:`, error);
    throw error; // Lempar error jika terjadi kesalahan
  }
};

export const DeleteFile = (filename: string): void => {
  if (fs.existsSync(filename)) {
    fs.unlink(filename, (err) => {});
  }
}

  