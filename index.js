import { useCallback, useEffect, useState, useRef } from "react";

export const useTransition = (isActive, timeout, opts) => {
  const [state, setState] = useState(
    isActive ? "entered" : opts && opts.mountOnEnter ? "unmounted" : "exited"
  );
  const timeoutRef = useRef();
  const startedAt = useRef();

  const timeout1 = useCallback(() => {
    setState(
      isActive ? "entered" : opts && opts.unmountOnExit ? "unmounted" : "exited"
    );
    startedAt.current = undefined;
  }, [isActive, startedAt.current]);

  const timeout2 = useCallback(() => {
    setState("entered");
    startedAt.current = undefined;
  }, [startedAt.current]);

  const timeout3 = useCallback(() => {
    setState(
      isActive ? "entered" : opts && opts.unmountOnExit ? "unmounted" : "exited"
    );
    startedAt.current = undefined;
  }, [isActive, !!opts && opts.unmountOnExit]);

  const timeout4 = useCallback(() => {
    setState(isActive ? "entering" : "exiting");
    timeoutRef.current = setTimeout(timeout3, timeout);
    startedAt.current = Date.now();
  }, [isActive, timeout, timeout3]);

  useEffect(() => {
    if (
      isActive
        ? state === "entered"
        : state === "exited" || state === "unmounted"
    ) {
      startedAt.current = undefined;
      return undefined;
    }

    const now = Date.now();
    const duration =
      typeof startedAt.current === "undefined"
        ? timeout
        : Math.max(0, now - startedAt.current);

    if (!isActive && (state === "entered" || state === "entering")) {
      setState("exiting");
      timeoutRef.current = setTimeout(timeout1, duration);
    } else if (isActive && (state === "exited" || state === "exiting")) {
      setState("entering");
      timeoutRef.current = setTimeout(timeout2, duration);
    } else {
      setState(isActive ? "exited" : "entered");
      timeoutRef.current = setTimeout(timeout4, 30);
    }
    startedAt.current = now;

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [isActive]);

  return state;
};

export default useTransition;
