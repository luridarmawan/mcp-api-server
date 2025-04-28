import { describe, expect, it } from 'bun:test'
import app from './index'

describe('MCP Server', () => {
  it('GET /prayer/schedule', async () => {
    const res = await app.handle(
      new Request('http://localhost:3000/prayer/schedule?city=Jakarta')
    ).then(r => r.json())
    
    expect(res).toHaveProperty('success')
    expect(res.success).toBeBoolean()
  })

  it('POST /registration', async () => {
    const res = await app.handle(
      new Request('http://localhost:3000/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "Test User",
          phone: "08123456789",
          email: "test@example.com"
        })
      })
    ).then(r => r.json())
    
    expect(res).toHaveProperty('success')
  })
})
