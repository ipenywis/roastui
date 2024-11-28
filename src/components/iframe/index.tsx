import { Suspense, useLayoutEffect, useRef, useState } from 'react';

type IFrameProps = React.ComponentPropsWithRef<'iframe'> & {
  fallback?: JSX.Element;
};

export function IFrame(props: IFrameProps) {
  const { fallback, ...rest } = props;

  return <iframe {...rest} />;

  return (
    <Suspense fallback={fallback || 'loading...'}>
      <IFrameImplementation {...rest} />
    </Suspense>
  );
}

function IFrameImplementation(props: React.ComponentPropsWithRef<'iframe'>) {
  const awaiter = useRef<null | {
    promise: null | Promise<void>;
    resolve: () => void;
    reject: () => void;
  }>(null);
  const [_, triggerLoad] = useState(false);
  if (awaiter.current?.promise) {
    throw awaiter.current.promise;
  }
  useLayoutEffect(() => {
    if (awaiter.current === null) {
      // @ts-ignore
      awaiter.current = {};
      // @ts-ignore
      awaiter.current.promise = new Promise<void>((resolve, reject) => {
        // @ts-ignore
        Object.assign(awaiter.current, { resolve, reject });
      });
      triggerLoad(true);
    }
  }, []);
  const { title } = props;
  return (
    <iframe
      {...props}
      title={title}
      onLoad={(e) => {
        // @ts-ignore
        awaiter.current.promise = null;
        awaiter.current?.resolve();
        props.onLoad?.(e);
      }}
      onError={(err) => {
        // @ts-ignore
        awaiter.current.promise = null;
        awaiter.current?.reject();
        props.onError?.(err);
      }}
    />
  );
}

export default IFrame;
