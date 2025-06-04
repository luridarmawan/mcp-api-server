

export function formatToolPrompt(tools) {
  return `
You can use tools by responding with JSON only, like this:

{
  "name": "<tool_name>",
  "arguments": { ... }
}

Dont use markdown.

Available tools:
${tools.map(tool => {
    const paramDesc = extractParameters(tool);
    return `- ${tool.name}(${paramDesc}) → ${tool.description || ''}`;
  }).join("\n")}
`;
}

function extractParameters(tool) {
  if (!tool.parameters || !tool.parameters.properties) return "no parameters";

  const props = tool.parameters.properties;
  return Object.entries(props)
    .map(([key, val]) => `${key}: ${val.type || 'any'}`)
    .join(", ");
}
