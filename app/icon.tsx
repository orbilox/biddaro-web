import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f97316',
          borderRadius: '7px',
        }}
      >
        {/* Hardhat brim */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Dome */}
          <div
            style={{
              width: '18px',
              height: '10px',
              background: 'white',
              borderRadius: '10px 10px 0 0',
              marginBottom: '-1px',
            }}
          />
          {/* Brim */}
          <div
            style={{
              width: '24px',
              height: '3px',
              background: 'white',
              borderRadius: '2px',
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
