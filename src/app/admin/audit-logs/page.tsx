'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  ShieldCheck, 
  ArrowLeft, 
  Filter, 
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { dbStore } from '@/lib/db/store';
import { AuditLog } from '@/types';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>(dbStore.getAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filtered = logs.filter(log => {
    if (actionFilter !== 'ALL' && !log.action.includes(actionFilter)) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchActor = log.actorName.toLowerCase().includes(q);
      const matchAction = log.action.toLowerCase().includes(q);
      const matchDetails = log.details.toLowerCase().includes(q);
      if (!matchActor && !matchAction && !matchDetails) return false;
    }
    return true;
  });

  return (
    <div className="container-custom" style={{ padding: '40px 20px 80px 20px' }}>
      <a
        href="/admin"
        className="btn-ghost"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px', textDecoration: 'none' }}
      >
        <ArrowLeft size={16} /> Back to Admin Overview
      </a>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          gap: '16px',
        }}
      >
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>
            System Integrity &amp; Compliance
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Immutable Platform Audit Logs</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Chronological, non-repudiable ledger of moderator decisions, approval events, and security status mutations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            style={{
              background: '#0d121d',
              color: '#fff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 12px',
              fontSize: '0.84rem',
            }}
          >
            <option value="ALL">All Actions</option>
            <option value="APPROVE">Approvals</option>
            <option value="REJECT">Rejections</option>
            <option value="USER">User Role / Suspension</option>
            <option value="SUBMISSION">Submissions</option>
          </select>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 12px',
            }}
          >
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.86rem',
                width: '180px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="glass-card" style={{ padding: '8px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <th style={{ padding: '16px 20px' }}>TIMESTAMP (UTC)</th>
              <th style={{ padding: '16px' }}>ACTOR</th>
              <th style={{ padding: '16px' }}>ACTION</th>
              <th style={{ padding: '16px' }}>TARGET</th>
              <th style={{ padding: '16px 20px' }}>DETAILS</th>
              <th style={{ padding: '16px 20px' }}>IP / DEVICE</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.84rem' }}>
                <td style={{ padding: '16px 20px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {log.timestamp}
                </td>

                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{log.actorName}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Role: {log.actorRole}</div>
                </td>

                <td style={{ padding: '16px' }}>
                  <span
                    className={`badge ${log.action.includes('APPROVE') ? 'badge-emerald' : log.action.includes('REJECT') || log.action.includes('SUSPEND') ? 'badge-rose' : 'badge-indigo'}`}
                    style={{ fontSize: '0.72rem', fontWeight: 700 }}
                  >
                    {log.action}
                  </span>
                </td>

                <td style={{ padding: '16px', textTransform: 'capitalize', color: 'var(--accent-cyan)' }}>
                  {log.targetType}
                </td>

                <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', maxWidth: '340px' }}>
                  {log.details}
                </td>

                <td style={{ padding: '16px 20px', fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  {log.ipAddress || '192.168.1.100'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
