import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve as resolvePath, relative, isAbsolute, basename, dirname, sep } from 'node:path'
import type { UserConfig } from 'tsdown'
import { transform } from 'lightningcss'

const PLUGIN_ID = '@hjbztlbr/dsh-client-ui-skin-verdandi'
const CSS_VIRTUAL_PREFIX = '\0dsh-css:'
const CSS_VIRTUAL_SUFFIX = '.mjs'
const ROOT = process.cwd()

const nodeConfig: UserConfig = {
  name: PLUGIN_ID,
  entry: ['src/index.ts'],
  outDir: 'lib',
  format: ['esm'],
  platform: 'node',
  target: 'es2022',
  fixedExtension: false,
  dts: false,
  clean: false,
  external: ['@deepseek-ai/cordis'],
}

const clientConfig: UserConfig = {
  name: `${PLUGIN_ID}/client`,
  entry: { client: 'src/client/index.ts' },
  outDir: 'lib',
  format: 'cjs',
  platform: 'browser',
  target: 'es2022',
  dts: false,
  sourcemap: true,
  clean: false,
  external: [],
  noExternal: () => true,
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production'),
    'import.meta.env.MODE': JSON.stringify(process.env.NODE_ENV ?? 'production'),
    'import.meta.env': JSON.stringify({ MODE: process.env.NODE_ENV ?? 'production' }),
  },
  plugins: [{
    name: 'dsh-css-modules-inline',
    resolveId(source: string, importer: string | undefined) {
      if (!source.endsWith('.module.css')) return null
      const abs = importer ? resolvePath(dirname(importer), source) : source
      return CSS_VIRTUAL_PREFIX + (isAbsolute(abs) ? relative(ROOT, abs).split(sep).join('/') : abs) + CSS_VIRTUAL_SUFFIX
    },
    async load(virtualId: string) {
      if (!virtualId.startsWith(CSS_VIRTUAL_PREFIX)) return null
      const fileId = virtualId.slice(CSS_VIRTUAL_PREFIX.length, -CSS_VIRTUAL_SUFFIX.length)
      const physical = isAbsolute(fileId) ? fileId : resolvePath(ROOT, fileId)
      this.addWatchFile(physical)
      const source = await readFile(physical)
      const { code, exports: cssExports } = transform({
        filename: relative(ROOT, physical).split(sep).join('/'),
        code: source,
        cssModules: { pattern: '[hash]_[local]' },
        minify: true,
      })
      const classMap: Record<string, string> = {}
      for (const [local, exp] of Object.entries(cssExports ?? {}).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)) {
        classMap[local] = exp.name
      }
      const tagId = `${PLUGIN_ID}/${basename(fileId)}`
      return [
        `const css = ${JSON.stringify(code.toString())};`,
        `const tagId = ${JSON.stringify(tagId)};`,
        `if (typeof document !== 'undefined' && document.querySelector('style[data-plugin-css=' + JSON.stringify(tagId) + ']') === null) {`,
        `  const tag = document.createElement('style');`,
        `  tag.dataset.plugin = ${JSON.stringify(PLUGIN_ID)};`,
        `  tag.dataset.pluginCss = tagId;`,
        `  tag.textContent = css;`,
        `  document.head.appendChild(tag);`,
        `}`,
        `export default ${JSON.stringify(classMap)};`,
      ].join('\n')
    },
  }],
  outputOptions: {
    entryFileNames: 'client.js',
    banner: 'var __verdandiClientFactory = (require) => {',
    footer: [
      'return module.exports; };',
      `window.__ModuleLoader__.load({ id: ${JSON.stringify(PLUGIN_ID)}, factory: __verdandiClientFactory });`,
    ].join('\n'),
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
}

export default [nodeConfig, clientConfig]
