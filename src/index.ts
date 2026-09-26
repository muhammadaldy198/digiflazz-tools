export interface Env {
  DB: D1Database;
}

const page = `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Digiflazz Tools</title>
  <style>
    body{font-family:system-ui,sans-serif;background:#0b1020;color:#fff;margin:0;display:grid;place-items:center;min-height:100vh}
    .card{max-width:560px;padding:32px;border:1px solid #26314f;border-radius:18px;background:#11182b}
    h1{margin:0 0 10px}
    p{color:#aeb9d3;line-height:1.6}
    .ok{color:#6ee7b7;font-weight:700}
  </style>
</head>
<body>
  <main class="card">
    <h1>Digiflazz Tools</h1>
    <p class="ok">Project aktif.</p>
    <p>Dashboard seller, monitoring, scoring, dan switching akan dibangun di sini.</p>
  </main>
</body>
</html>`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json(
        { ok: true, service: "digiflazz-tools", database: Boolean(env.DB) },
        { headers: { "cache-control": "no-store" } },
      );
    }

    return new Response(page, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  },
} satisfies ExportedHandler<Env>;
