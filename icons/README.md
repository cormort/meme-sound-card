# icons/

PWA／主畫面圖示（深色底＋黃色喇叭），由 Pillow 產生：

| 檔案 | 尺寸 | 用途 |
|---|---|---|
| `icon-192.png` / `icon-512.png` | 192／512 | manifest `purpose: any` |
| `icon-512-maskable.png` | 512 | manifest `purpose: maskable`（內容縮到 66% 留安全區） |
| `apple-touch-icon.png` | 180 | iOS 加到主畫面 |
| `favicon-32.png` / `favicon-16.png` | 32／16 | 瀏覽器分頁 |

換圖示時同步 `manifest.webmanifest` 的 `icons` 與 `index.html` 的 `<link>`，
並把 `sw.js` 的 `CACHE` 版本加一（圖示走 cache-first）。
