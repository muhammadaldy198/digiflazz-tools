# Digiflazz Tools

Personal Digiflazz seller manager running on Cloudflare Workers + D1.

## Features
- Encrypted Digiflazz browser-session connection (AES-GCM)
- Product/category sync
- Seller pool + scoring
- Manual seller switch
- Product lock
- Preferred / blocked sellers
- Price and seller change detection
- Scheduled monitoring
- Optional automatic failover
- Optional proactive cheaper-seller detection
- Switch history and change log
- Cloudflare Access protection

Secrets are stored only as Cloudflare Worker secrets and encrypted D1 data. Do not commit Digiflazz cookies, HAR files, cURL sessions, or API credentials.
