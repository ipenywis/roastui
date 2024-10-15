interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <svg
      width="156"
      height="35"
      viewBox="0 0 156 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        fill="white"
        xmlSpace="preserve"
        style={{ whiteSpace: 'pre' }}
        fontFamily="Inter"
        fontSize="25"
        fontWeight="800"
        letterSpacing="-0.005em"
      >
        <tspan x="-1" y="30.0909">
          RoastUI
        </tspan>
      </text>
      <path
        d="M135.374 20.9998C135.374 15.7758 139.828 11.4998 145.374 11.4998C150.92 11.4998 155.374 15.7758 155.374 20.9998C155.374 26.2238 150.92 30.4998 145.374 30.4998C139.828 30.4998 135.374 26.2238 135.374 20.9998Z"
        stroke="#53A5DF"
      />
      <path
        d="M129.621 1.35895L141.434 21.8204L117.808 21.8204L129.621 1.35895Z"
        stroke="#D7DB2B"
      />
      <rect
        x="121.468"
        y="30.3946"
        width="16.4147"
        height="16.4147"
        transform="rotate(-165 121.468 30.3946)"
        stroke="#0C9866"
      />
    </svg>
  );
}
