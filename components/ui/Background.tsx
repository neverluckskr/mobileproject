import { memo } from 'react'

const noiseTexture =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAArklEQVR4nO3QwQmAIBAEQXf//2s7hwdWJFNJvBnNbvnAgAAAAAAAAAAvj93PIBGx2HgNzAKaBNwa6BNwK6BNwG6hNwE6hNwC6hNwF6hNwD6BPYBN4G2ATcBuoTcBOoTcAurMX5n9XXuH/e3LF9+kL5Tz2sne9aZ14COYBN4G2ATcBtIGuA3cBugTcBOoTcAOoTcAuoTcBeozdwDXAboE3ATqE3AAAAAAAAAAD8fAk4AAE3/VwsAAAAASUVORK5CYII="

const orbConfigs = [
  {
    size: 520,
    top: '-10%',
    left: '5%',
    color: 'rgba(255,124,146,0.45)',
    duration: 36,
    delay: 0
  },
  {
    size: 460,
    top: '60%',
    left: '70%',
    color: 'rgba(110,231,255,0.45)',
    duration: 32,
    delay: -5
  },
  {
    size: 380,
    top: '20%',
    left: '65%',
    color: 'rgba(172,129,255,0.4)',
    duration: 44,
    delay: -8
  }
]

const particles = [
  { size: 10, top: '12%', left: '18%', duration: 24, delay: 0, opacity: 0.35 },
  { size: 14, top: '26%', left: '72%', duration: 22, delay: -2, opacity: 0.28 },
  { size: 8, top: '48%', left: '40%', duration: 26, delay: -4, opacity: 0.32 },
  { size: 12, top: '68%', left: '12%', duration: 28, delay: -6, opacity: 0.3 },
  { size: 16, top: '78%', left: '64%', duration: 30, delay: -8, opacity: 0.34 },
  { size: 9, top: '34%', left: '10%', duration: 24, delay: -10, opacity: 0.27 },
  { size: 11, top: '56%', left: '82%', duration: 26, delay: -12, opacity: 0.33 },
  { size: 7, top: '18%', left: '56%', duration: 23, delay: -14, opacity: 0.25 },
  { size: 13, top: '82%', left: '32%', duration: 25, delay: -16, opacity: 0.31 },
  { size: 9, top: '6%', left: '48%', duration: 29, delay: -18, opacity: 0.28 },
  { size: 15, top: '42%', left: '88%', duration: 27, delay: -20, opacity: 0.36 },
  { size: 8, top: '64%', left: '52%', duration: 24, delay: -22, opacity: 0.3 }
]

export const AnimatedBackground = memo(function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-40 overflow-hidden">
      <div className="absolute inset-0 bg-[#05030a]" />
      {orbConfigs.map((orb, index) => (
        <div
          key={`orb-${index}`}
          className="absolute blur-[180px]"
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            top: orb.top,
            left: orb.left,
            background: `radial-gradient(circle at center, ${orb.color}, transparent 65%)`,
            animation: `orbFloat ${orb.duration}s ease-in-out infinite alternate`,
            animationDelay: `${orb.delay}s`
          }}
        />
      ))}
    </div>
  )
})

export const ParticlesLayer = memo(function ParticlesLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-30">
      {particles.map((particle, index) => (
        <div
          key={`particle-${index}`}
          className="absolute rounded-full bg-white/40 blur-sm"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: particle.top,
            left: particle.left,
            opacity: particle.opacity,
            animation: `particleDrift ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}
    </div>
  )
})

export const NoiseOverlay = memo(function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 opacity-[0.05] mix-blend-soft-light"
      style={{
        backgroundImage: `url(${noiseTexture})`,
        backgroundSize: '280px 280px'
      }}
    />
  )
})

export function BackgroundLayers() {
  return (
    <>
      <AnimatedBackground />
      <ParticlesLayer />
      <NoiseOverlay />
    </>
  )
}
