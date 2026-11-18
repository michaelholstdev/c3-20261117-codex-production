import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? files(path) : entry.isFile() && path.endsWith('.test.mjs') ? [path] : []
  })
}
const tests = existsSync('test') ? files('test').sort() : []
if (!tests.length) {
  console.error('No product tests found under test/. Implement the approved scope and its tests first.')
  process.exit(1)
}
const result = spawnSync(process.execPath, ['--test', ...tests], { stdio: 'inherit' })
if (result.error) console.error(result.error.message)
process.exit(result.status ?? 1)
