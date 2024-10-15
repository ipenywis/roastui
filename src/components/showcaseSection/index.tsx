import { cva } from 'class-variance-authority';

interface ShowcaseSectionProps {
  children: any | any[];
  title: string;
  description: string | React.ReactNode;
}

const container = cva(
  'flex flex-col items-center w-full max-w-screen-lg z-40 mt-10 md:mb-44'
);

const h2Title = cva(
  'text-5xl font-semibold -tracking-wide text-white text-center'
);

const sectionDescription = cva(
  'text-sm font-normal text-gray-400 mt-4 max-w-2xl text-center'
);

const content = cva('flex flex-col mt-20 w-full items-center');

export function ShowcaseSection(props: ShowcaseSectionProps) {
  const { children, title, description } = props;

  return (
    <div className={container()}>
      <h2 className={h2Title()}>{title}</h2>
      <p className={sectionDescription()}>{description}</p>
      <div className={content()}>{children}</div>
    </div>
  );
}
