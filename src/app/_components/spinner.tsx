import particlesTexture from "./particles.png";
import particlesMaskTexture from "./particles_mask.png";

export default function Spinner() {
  return (
    <svg viewBox={`0 0 100 100`} style={{ width: 32 }}>
      {/* Masks */}
      <mask id="mask">
        {/* Switch to clip? */}
        <rect x={0} y={0} width={100} height={100} fill="black" />
        <circle cx={50} cy={50} r={50} fill="white" />
        <circle cx={50} cy={50} r={30} fill="black" />
      </mask>
      <mask id="glossMask">
        <rect x={0} y={0} width={100} height={100} fill="black" />
        <circle cx={50} cy={50} r={46} fill="white" />
        <circle cx={50} cy={50} r={34} fill="black" />
      </mask>
      <mask id="particlesMask">
        <g>
          <image href={particlesMaskTexture.src} width={100} height={100}/>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="1.5s"
            repeatCount="indefinite" />
        </g>
      </mask>
      {/* Gradients */}
      <linearGradient id="backgroundGradient" gradientTransform="rotate(90)">
        <stop offset="0%" stopColor="#660000" />
        <stop offset="100%" stopColor="#DD0000" />
      </linearGradient>
      <radialGradient id="glossGradient" cx="50%" cy="0%" r="100%">
        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.75)" />
        <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
      </radialGradient>
      <radialGradient id="radarTailGradient">
        <stop offset="60%" stopColor="red" />
        <stop offset="100%" stopColor="rgba(255, 0, 0, 0)" />
      </radialGradient>
      <radialGradient id="radarEdgeGradient">
        <stop offset="40%" stopColor="white" />
        <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
      </radialGradient>
      {/* Actual image :) */}
      <g mask="url(#mask)">
        <rect x={0} y={0} width={100} height={100} fill="url(#backgroundGradient)" />
        {/* Radar */}
        <g>
          <ellipse cx={31} cy={31} rx={50} ry={50} fill="url(#radarTailGradient)" />
          <ellipse cx={50} cy={10} rx={15} ry={10} fill="url(#radarEdgeGradient)" />
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="1.5s"
            repeatCount="indefinite" />
        </g>
        {/* Particles */}
        <g mask="url(#particlesMask)">
          <g>
            <image href={particlesTexture.src} width={100} height={100}/>
            <image href={particlesTexture.src} width={100} height={100} y={-100}/>
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              from="0,0"
              to="0,100"
              dur="1.5s"
              repeatCount="indefinite" />
          </g>
        </g>
        {/* Top gloss effect */}
        <rect mask="url(#glossMask)" x={0} y={0} width={100} height={100} fill="url(#glossGradient)" />
      </g>
    </svg>
  )
}
