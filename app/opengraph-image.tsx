import { ImageResponse } from 'next/og';

export const alt = 'Favee - Premium Fashion & Style';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FBF8F6',
          backgroundImage: 'linear-gradient(45deg, #F4DCDC 0%, #F0E7DE 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #f9b8c3 0%, #6f5a4d 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '20px',
            }}
          >
            Favee
          </div>
          <div
            style={{
              fontSize: 32,
              color: '#6f5a4d',
              textAlign: 'center',
              marginBottom: '10px',
            }}
          >
            Premium Fashion & Style
          </div>
          <div
            style={{
              fontSize: 20,
              color: '#8A6F5C',
              textAlign: 'center',
              maxWidth: '600px',
            }}
          >
            Discover the finest collection of contemporary fashion and style
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
