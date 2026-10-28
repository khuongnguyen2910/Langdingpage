// Bảng giá cho trang: lấy từ tab "Bảng giá" trong Google Sheet qua Apps Script,
// CDN của Vercel giữ 60 giây để trang mở nhanh và không gọi Apps Script mỗi lượt xem.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const site = require('../content/site.json');
const ENDPOINT = process.env.ORDER_ENDPOINT || site.order.endpoint || '';

export default async function handler(req, res) {
  if (!ENDPOINT) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({ ok: false });
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 9000);
  try {
    const r = await fetch(`${ENDPOINT}?action=prices`, { redirect: 'follow', signal: ctrl.signal });
    const data = await r.json();
    if (!data || !data.ok || !data.prices) throw new Error('Apps Script chưa trả bảng giá');
    const prices = {};
    for (const [sku, q] of Object.entries(data.prices)) {
      const list = Math.round(Number(q && q.list) || 0);
      const sale = Math.round(Number(q && q.sale) || 0);
      if (list > 0) prices[sku] = { list, sale: sale > 0 && sale < list ? sale : null };
    }
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=600');
    return res.status(200).json({ ok: true, prices, updatedAt: data.updatedAt || null });
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ ok: false });
  } finally {
    clearTimeout(timer);
  }
}
