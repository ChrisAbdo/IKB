import { remark } from "remark";
import strip from "strip-markdown";

export async function convertMarkdownToTxt(markdown: string): Promise<string> {
  const result = await remark().use(strip).process(markdown);
  return result.toString();
}
