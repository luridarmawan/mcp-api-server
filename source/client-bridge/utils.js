const fs = require('fs').promises;
const path = require('path');
const color = require('ansi-colors');

export async function saveToFile(filename, content) {
  try {
    // Gunakan path.join untuk path yang cross-platform
    const filePath = path.join(__dirname, filename);
        await fs.writeFile(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    return false;
  }
}

export async function readFile(filename) {
  try {
    const filePath = path.join(__dirname, filename);
    const content = await fs.readFile(filePath, { encoding: 'utf-8' });
    return content;
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist
      return "";
    }
    console.error('Error reading file:', error.message);
    return "";
  }
}

export function cleanMarkdownCodeBlocks(text) {
  return text.replace(/```[a-z]*\n([\s\S]*?)\n```/g, '$1');
}

export function cleanMarkdownCodeBlocksNew(text) {
  $pattern = '/```[a-zA-Z0-9]*\s*([\s\S]*?)```/';
  if (preg_match($pattern, $text, $matches)) {
      return trim($matches[1]);
  }
  return null; // Jika tidak ditemukan
}


export function removeNestedThinkTags(text) {
  let result = text;
  while (result.includes('<think>')) {
    result = result.replace(/<think>[\s\S]*?<\/think>/g, '');
  }
  return result.trim();
}

export function think(text){
  console.log(color.cyan.italic(` - ${text}`))
}

export function log(text){
  console.log(text)
}
