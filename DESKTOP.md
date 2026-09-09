# Beyond the Bastions — desktop build

The game runs in the browser as-is. To make a downloadable desktop version, run
these two commands on your own machine (they need a full Electron download, so
they are not run here):

```bash
npm install --save-dev electron @electron/packager

npx vite build && npx @electron/packager . "BeyondTheBastions" \
  --platform=linux --arch=x64 --out=electron-release --overwrite \
  --ignore='node_modules' --ignore='^/src' --ignore='^/public' --ignore='^/electron-release'
```

Swap `--platform=win32` or `--platform=darwin` for Windows or macOS builds.

Then archive the folder to hand out:

```bash
tar czf BeyondTheBastions-linux-x64.tar.gz -C electron-release BeyondTheBastions-linux-x64
```

Run it by opening the `BeyondTheBastions` executable inside the extracted folder.

Notes:
- `electron/main.cjs` is the desktop window; `"main": "electron/main.cjs"` is already
  set in `package.json`.
- The desktop build needs Vite's `base: './'` so files load from disk — set it in
  `vite.config.ts` before packaging (the browser preview works with either).
- All progress is saved on the local machine, so the desktop build works offline.
