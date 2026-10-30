// ============================================================
//  GET /api/file/<key>   从 R2 取附件
//
//  安全要点：
//   - 除图片外的类型一律 attachment 强制下载，避免 HTML/SVG 在站内执行
//   - 统一加 nosniff 和严格 CSP，图片内联预览也安全
// ============================================================

export const onRequestGet = async ({ env, params }) => {
  // [[key]] 是 catch-all 路由，params.key 可能是数组，也可能是字符串
  const rawKey = Array.isArray(params.key) ? params.key.join('/') : String(params.key || '');

  // URL 里的中文文件名会被百分号编码，R2 里存的是原始名字，必须解码回来
  let key = rawKey;
  try {
    key = decodeURIComponent(rawKey);
  } catch {
    key = rawKey;   // 编码不合法就用原样
  }

  if (!key || key.includes('..')) {
    return new Response('Not found', { status: 404 });
  }

  if (!env.FILES) {
    return new Response('本站未启用附件存储', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const obj = await env.FILES.get(key);
  if (!obj) {
    return new Response('文件不存在或已被删除', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const contentType = obj.httpMetadata?.contentType || 'application/octet-stream';
  const isImage = /^image\/(png|jpe?g|gif|webp|avif)$/i.test(contentType);

  // 从 key 里还原原始文件名（key 形如 uploads/<uuid>-<名字>）
  const raw = key.split('/').pop() || 'file';
  const displayName = raw.replace(/^[0-9a-f-]{36}-/, '') || 'file';

  const headers = new Headers();
  headers.set('Content-Type', isImage ? contentType : 'application/octet-stream');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Content-Security-Policy', "default-src 'none'; img-src 'self'; sandbox");
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');

  if (!isImage) {
    // RFC 5987，兼容中文文件名
    const encoded = encodeURIComponent(displayName);
    headers.set(
      'Content-Disposition',
      `attachment; filename="${encoded}"; filename*=UTF-8''${encoded}`
    );
  }

  return new Response(obj.body, { headers });
};
