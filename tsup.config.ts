import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: { 'connect-pause': 'src/connect-pause.ts' },
  format: ['esm', 'cjs'],
  platform: 'node',
  target: 'es2020',
  outDir: 'dist',
  dts: true,
  clean: true,
  splitting: false,
  treeshake: true,
  minify: true,
  onSuccess() {
    const cjsFile = join('dist', 'connect-pause.cjs')
    const cjsPatch = ';{const h=module.exports.default||module.exports.pause;if(typeof h==="function"){h.pause=h;module.exports=h;}}'
    const cjs = readFileSync(cjsFile, 'utf8')
    if (!cjs.endsWith(cjsPatch)) {
      writeFileSync(cjsFile, cjs + cjsPatch)
    }
  },
  outExtension({ format }) {
    if (format === 'cjs') {
      return { js: '.cjs' }
    }
    return { js: '.js' }
  },
})
