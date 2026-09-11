// Vercel Serverless Function: /api/visitors
// Acts as a server-side proxy to fetch + parse the real visitor count from visitorbadge.io
// Since this runs on the server, there are zero CORS issues.

export default async function handler(req, res) {
  // Allow cross-origin requests from our own frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'no-store, max-age=0'); // Always get fresh count

  // Use a unique path - change this path to effectively "reset" to 0
  const badgeUrl = 'https://api.visitorbadge.io/api/visitors?path=rithyajayaram_portfolio_v1';

  try {
    const response = await fetch(badgeUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioCounter/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Badge API responded with status ${response.status}`);
    }

    const svg = await response.text();

    // Parse all text elements from the SVG
    const matches = svg.match(/<text[^>]*>([0-9,]+)<\/text>/g);

    if (matches && matches.length >= 2) {
      // The second text element is typically the count value
      const countStr = matches[1].replace(/<[^>]+>/g, '').replace(/,/g, '');
      const count = parseInt(countStr, 10);
      return res.status(200).json({ count, source: 'visitorbadge' });
    }

    // If parsing fails, return error so frontend can use fallback gracefully
    return res.status(500).json({ error: 'Could not parse count from SVG' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
