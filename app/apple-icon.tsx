import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea6c07 100%)',
          borderRadius: '38px',
        }}
      >
        {/* Hardhat */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          {/* Dome */}
          <div
            style={{
              width: '90px',
              height: '52px',
              background: 'white',
              borderRadius: '50px 50px 0 0',
              marginBottom: '-3px',
            }}
          />
          {/* Brim */}
          <div
            style={{
              width: '118px',
              height: '14px',
              background: 'white',
              borderRadius: '8px',
            }}
          />
        </div>

        {/* Brand name */}
        <div
          style={{
            color: 'white',
            fontSize: '28px',
            fontWeight: '800',
            fontFamily: 'sans-serif',
            letterSpacing: '-0.5px',
          }}
        >
          Biddaro
        </div>
      </div>
    ),
    { ...size }
  );
}
