import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

type IFrameProps = React.ComponentPropsWithRef<'iframe'> & {
  fallback?: JSX.Element;
};

export function IFrame(props: IFrameProps) {
  const { fallback, ...rest } = props;

  return (
    <Suspense fallback={fallback || 'loading...'}>
      <IFrameImplementation {...rest} />
    </Suspense>
  );
}

function IFrameImplementation(props: React.ComponentPropsWithRef<'iframe'>) {
  const { src, onLoad: onLoadProp, onError: onErrorProp } = props;

  const awaiter = useRef<null | {
    promise: null | Promise<void>;
    resolve: () => void;
    reject: () => void;
  }>(null);
  const [_, triggerLoad] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  const onLoad = useCallback(
    (e: Event) => {
      // @ts-ignore
      awaiter.current.promise = null;
      awaiter.current?.resolve();
      onLoadProp?.(e as any);
    },
    [onLoadProp]
  );

  const onError = useCallback(
    (e: Event) => {
      // @ts-ignore
      awaiter.current.promise = null;
      awaiter.current?.reject();
      onErrorProp?.(e as any);
    },
    [onErrorProp]
  );

  //This is hack to make onLoad and onError work on iframe
  useEffect(() => {
    const currentIframeRef = iframeRef.current;
    if (currentIframeRef && src) {
      currentIframeRef.src = src;
    }
    currentIframeRef?.addEventListener('load', onLoad);
    currentIframeRef?.addEventListener('error', onError);

    return () => {
      currentIframeRef?.removeEventListener('load', onLoad);
      currentIframeRef?.removeEventListener('error', onError);
    };
  }, [onLoad, onError, src]);

  return <iframe {...props} ref={iframeRef} title={title} />;
}

export default IFrame;
