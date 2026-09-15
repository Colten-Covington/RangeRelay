import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function GET() {
  const specification = await readFile(join(process.cwd(), "openapi.yaml"), "utf8");
  return new Response(specification, {
    headers: {
      "content-type": "application/yaml; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=3600",
      "content-disposition": "inline; filename=RangeRelay-openapi.yaml",
    },
  });
}
