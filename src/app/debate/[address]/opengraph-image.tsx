import { ImageResponse } from 'next/og';
import { getDebateInfo, getOdds, getTimeRemaining } from '@/lib/debate-server';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 800 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;

  try {
    const info = await getDebateInfo(address as `0x${string}`);
    const { pctA, pctB } = getOdds(info.totalSideA, info.totalSideB);
    const totalPool = Number(info.totalSideA + info.totalSideB + info.totalBounty) / 1e6;
    const poolStr = totalPool >= 1 ? `$${Math.floor(totalPool).toLocaleString()}` : `$${totalPool.toFixed(2)}`;
    const timeStr = getTimeRemaining(info.endDate);
    const statement =
      info.statement.length > 90
        ? info.statement.slice(0, 87) + '...'
        : info.statement;

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#0a0a0a',
            padding: '60px',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '36px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '36px', fontWeight: 700, color: '#10b981' }}>
                argue.fun
              </div>
              <div
                style={{
                  fontSize: '20px',
                  color: '#a1a1aa',
                  backgroundColor: '#27272a',
                  padding: '6px 16px',
                  borderRadius: '20px',
                }}
              >
                {info.isResolved ? 'Resolved' : timeStr}
              </div>
            </div>
            <div style={{ fontSize: '28px', color: '#a1a1aa' }}>
              {poolStr} USDC
            </div>
          </div>

          {/* Question */}
          <div
            style={{
              fontSize: '52px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.25,
              marginBottom: '50px',
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {statement}
          </div>

          {/* Odds bar */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '100px',
              borderRadius: '16px',
              overflow: 'hidden',
              gap: '4px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: Math.max(pctA, 10),
                backgroundColor: '#059669',
                padding: '8px',
              }}
            >
              <div style={{ fontSize: '22px', fontWeight: 600, color: '#fff' }}>
                {info.sideAName}
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff' }}>
                {pctA}%
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: Math.max(pctB, 10),
                backgroundColor: '#7c3aed',
                padding: '8px',
              }}
            >
              <div style={{ fontSize: '22px', fontWeight: 600, color: '#fff' }}>
                {info.sideBName}
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff' }}>
                {pctB}%
              </div>
            </div>
          </div>
        </div>
      ),
      { ...size },
    );
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#0a0a0a',
          }}
        >
          <div style={{ fontSize: '56px', fontWeight: 700, color: '#10b981' }}>
            argue.fun
          </div>
        </div>
      ),
      { ...size },
    );
  }
}
