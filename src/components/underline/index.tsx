import { cva } from 'class-variance-authority';

interface UnderlineProps {
  lineNode: React.ReactNode;
  children: any | any[];
}

const container = cva('inline-flex flex-col justify-center');

const line = cva('flex -mt-2');

export function Underline(props: UnderlineProps) {
  const { children, lineNode } = props;

  return (
    <div className={container()}>
      {children}
      <span className={line()}>{lineNode}</span>
    </div>
  );
}
