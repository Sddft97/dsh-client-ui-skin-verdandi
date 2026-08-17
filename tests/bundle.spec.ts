import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const pluginId = '@hjbztlbr/dsh-client-ui-skin-verdandi'
const legacyPluginId = '@verdandi/dsh-client-ui-skin-verdandi'

describe('client bundle loader contract', () => {
  it('registers exactly once under the installed package id', () => {
    const bundle = readFileSync(resolve('lib/client.js'), 'utf8')

    expect(bundle).toContain(`id: "${pluginId}"`)
    expect(bundle).not.toContain(legacyPluginId)
    expect(bundle.match(/__ModuleLoader__\.load\(/g)).toHaveLength(1)
  })
})
