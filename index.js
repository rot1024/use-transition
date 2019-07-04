import { useCallback, useEffect, useState, useRef } from "react";

const useTransition = opts => {
  const [onoff, toggleOnOff] = useState(!!opts.initialOnOff);
  const [state, setState] = useState(
    onoff ? "entered" : opts.mountOnEnter ? "unmounted" : "exited"
  );
  const timeout = useRef();
  const startedAt = useRef();

  const timeout1 = useCallback(() => {
    setState(onoff ? "entered" : opts.unmountOnExit ? "unmounted" : "exited");
    startedAt.current = undefined;
  }, [onoff, startedAt.current]);

  const timeout2 = useCallback(() => {
    setState("entered");
    startedAt.current = undefined;
  }, [startedAt.current]);

  const timeout3 = useCallback(() => {
    setState(onoff ? "entered" : opts.unmountOnExit ? "unmounted" : "exited");
    startedAt.current = undefined;
  }, [onoff, opts.unmountOnExit]);

  const timeout4 = useCallback(() => {
    setState(onoff ? "entering" : "exiting");
    timeout.current = setTimeout(timeout3, opts.timeout);
    startedAt.current = Date.now();
  }, [onoff, opts.timeout, timeout3]);

  useEffect(() => {
    if (
      onoff ? state === "entered" : state === "exited" || state === "unmounted"
    ) {
      startedAt.current = undefined;
      return undefined;
    }

    const timeout =
      typeof startedAt.current === "undefined"
        ? opts.timeout
        : Math.max(0, Date.now() - startedAt.current);
    const now = Date.now();

    if (!onoff && (state === "entered" || state === "entering")) {
      setState("exiting");
      timeout.current = setTimeout(timeout1, timeout);
      startedAt.current = now;
    } else if (onoff && (state === "exited" || state === "exiting")) {
      setState("entering");
      timeout.current = setTimeout(timeout2, timeout);
      startedAt.current = now;
    } else {
      setState(onoff ? "exited" : "entered");
      timeout.current = setTimeout(timeout4, 30);
      startedAt.current = undefined;
    }
    return () => {
      clearTimeout(timeout.current);
    };
  }, [onoff]);

  return [state, onoff, toggleOnOff];
};

export default useTransition;
