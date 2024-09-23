import { NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const xmlData = await response.text();
    const result = await parseStringPromise(xmlData);

    let urls: string[] = [];

    if (result.urlset && result.urlset.url) {
      urls = result.urlset.url.map((urlObj: any) => urlObj.loc[0]);
    } else if (result.sitemapindex && result.sitemapindex.sitemap) {
      urls = result.sitemapindex.sitemap.map(
        (sitemapObj: any) => sitemapObj.loc[0]
      );
    }

    return NextResponse.json(urls);
  } catch (error) {
    console.error("Error scraping sitemap:", error);
    return NextResponse.json(
      { error: "Failed to scrape sitemap" },
      { status: 500 }
    );
  }
}
