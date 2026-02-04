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
    const totalPool =
      Number(info.totalSideA + info.totalSideB + info.totalBounty) / 1e6;
    const poolStr =
      totalPool >= 1
        ? `$${Math.floor(totalPool).toLocaleString()}`
        : `$${totalPool.toFixed(2)}`;
    const timeStr = info.isResolved ? 'Resolved' : getTimeRemaining(info.endDate);
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
            backgroundColor: '#1B1A1A',
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '36px', fontWeight: 700, color: '#D4A017' }}>
                argue
              </span>
              <span style={{ fontSize: '36px', fontWeight: 700, color: '#8A8A8A' }}>
                .fun
              </span>
              <span
                style={{
                  fontSize: '20px',
                  color: '#a1a1aa',
                  backgroundColor: '#2A2929',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  border: '1px solid rgba(138,138,138,0.2)',
                }}
              >
                {timeStr}
              </span>
            </div>
            <span style={{ fontSize: '28px', color: '#a1a1aa', fontFamily: 'monospace' }}>
              {poolStr} USDC
            </span>
          </div>

          {/* Question */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '52px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.25,
              marginBottom: '50px',
              flexGrow: 1,
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
                background: 'linear-gradient(135deg, #D4A017, #B8860B)',
                padding: '8px',
              }}
            >
              <span style={{ fontSize: '22px', fontWeight: 600, color: '#fff' }}>
                {info.sideAName}
              </span>
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#fff' }}>
                {pctA}%
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: Math.max(pctB, 10),
                background: 'linear-gradient(135deg, #7C3AED, #6025C0)',
                padding: '8px',
              }}
            >
              <span style={{ fontSize: '22px', fontWeight: 600, color: '#fff' }}>
                {info.sideBName}
              </span>
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#fff' }}>
                {pctB}%
              </span>
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
            backgroundColor: '#1B1A1A',
          }}
        >
          <span style={{ fontSize: '56px', fontWeight: 700, color: '#D4A017' }}>
            argue
          </span>
          <span style={{ fontSize: '56px', fontWeight: 700, color: '#8A8A8A' }}>
            .fun
          </span>
        </div>
      ),
      { ...size },
    );
  }
}
