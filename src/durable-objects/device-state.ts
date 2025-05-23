import { DurableObject } from 'cloudflare:workers'

export class DeviceStateDurableObject extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)

    ctx.blockConcurrencyWhile(async () => {
      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS DeviceState (
          machine TEXT(64) NOT NULL,
          device TEXT(16) NOT NULL,
          state INTEGER NOT NULL,
          CONSTRAINT DeviceState_PK PRIMARY KEY (machine, device)
        )
      `)

      const row = this.ctx.storage.sql
        .exec(`SELECT 1 as value FROM pragma_table_info('DeviceState') WHERE name = 'updatedAt'`)
        .toArray()
      if (row.length !== 1) {
        this.ctx.storage.sql.exec(`ALTER TABLE DeviceState ADD COLUMN updatedAt INTEGER DEFAULT 0`)
        this.ctx.storage.sql.exec(`UPDATE DeviceState SET updatedAt = ?`, Date.now())
      }
    })
  }

  public async getAll(): Promise<
    { machine: string; device: string; state: boolean; updatedAt: number }[]
  > {
    const rows = this.ctx.storage.sql.exec('SELECT * FROM DeviceState').toArray()
    return rows.map((row) => ({
      machine: String(row.machine),
      device: String(row.device),
      state: Boolean(row.state),
      updatedAt: Number(row.updatedAt),
    }))
  }

  public async getDeviceState(): Promise<{ state: boolean; updatedAt: number }> {
    const row = this.ctx.storage.sql
      .exec(
        'SELECT COALESCE(SUM(state),0) AS count, COALESCE(MAX(updatedAt),0) AS updatedAt FROM DeviceState;',
      )
      .one()
    return { state: Boolean(row.count), updatedAt: Number(row.updatedAt) }
  }

  public async setDeviceState(
    machine: string,
    device: 'camera' | 'microphone',
    state: boolean,
  ): Promise<{ state: boolean; updatedAt: number }> {
    return this.ctx.storage.transaction(async () => {
      this.ctx.storage.sql.exec(
        `
        INSERT INTO DeviceState (machine, device, state, updatedAt) 
        VALUES (?, ?, ?, ?)
        ON CONFLICT (machine, device) DO UPDATE SET state = ?, updatedAt = ?
        `,
        machine,
        device,
        state ? 1 : 0,
        Date.now(),
        state ? 1 : 0,
        Date.now(),
      )
      return this.getDeviceState()
    })
  }

  public async deleteAll(): Promise<void> {
    this.ctx.storage.deleteAll()
  }
}
