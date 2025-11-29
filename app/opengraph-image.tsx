import { ImageResponse } from 'next/og';

export const alt = 'Favee - Premium Indian Fashion & Designer Wear for Women';
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
          position: 'relative',
          backgroundColor: '#FBF8F6',
          backgroundImage: 'linear-gradient(135deg, #F4DCDC 0%, #F0E7DE 50%, #FBF8F6 100%)',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            opacity: '0.1',
            backgroundImage: 'radial-gradient(circle at 25% 25%, #f4b7c7 2px, transparent 2px), radial-gradient(circle at 75% 75%, #6f5a4d 2px, transparent 2px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '60px',
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              fontSize: 84,
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #f4b7c7 0%, #6f5a4d 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: '24px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            FAVEE
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 36,
              color: '#6f5a4d',
              textAlign: 'center',
              marginBottom: '16px',
              fontWeight: '600',
            }}
          >
            Premium Indian Fashion
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 22,
              color: '#8A6F5C',
              textAlign: 'center',
              marginBottom: '32px',
              maxWidth: '700px',
              lineHeight: 1.4,
            }}
          >
            Designer Sarees • Elegant Kurtas • Western Wear • Bridal Collections
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(244, 183, 199, 0.2)',
                padding: '12px 20px',
                borderRadius: '25px',
                fontSize: '16px',
                color: '#6f5a4d',
                fontWeight: '500',
              }}
            >
              ✨ Premium Quality
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(244, 183, 199, 0.2)',
                padding: '12px 20px',
                borderRadius: '25px',
                fontSize: '16px',
                color: '#6f5a4d',
                fontWeight: '500',
              }}
            >
              🚚 Free Shipping
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(244, 183, 199, 0.2)',
                padding: '12px 20px',
                borderRadius: '25px',
                fontSize: '16px',
                color: '#6f5a4d',
                fontWeight: '500',
              }}
            >
              💳 COD Available
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #f4b7c7, #F4DCDC)',
            opacity: '0.3',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #6f5a4d, #8A6F5C)',
            opacity: '0.2',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
