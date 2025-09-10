
export type AuditRecord<T = any> = {
  type: 'designSettings' | 'headerSettings';
  path: string;                 // fx 'designSettings/global'
  ts: string;                   // ISO
  by: string;                   // x-user header eller 'studio'
  ua?: string;                  // user-agent (kortet)
  version?: number;
  before?: Partial<T> | null;
  after?: Partial<T>;
  diff?: Record<string, { from: any; to: any }>;
  size?: number;                // bytes af after (JSON)
};
