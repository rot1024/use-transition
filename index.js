import { useCallback, useEffect, useState, useRef } from "react";

export const useTransition = (isActive, timeout, opts) => {
  const [state, setState] = useState(
    isActive ? "entered" : opts && opts.mountOnEnter ? "unmounted" : "exited"
  );
  const timeoutRef = useRef();
  const startedAt = useRef();
  const startedAt2 = useRef();

  const timeout1 = useCallback(() => {
    setState(
      isActive ? "entered" : opts && opts.unmountOnExit ? "unmounted" : "exited"
    );
    startedAt.current = undefined;
    startedAt2.current = undefined;
  }, [isActive]);

  const timeout2 = useCallback(() => {
    setState("entered");
    startedAt.current = undefined;
    startedAt2.current = undefined;
  }, []);

  const timeout3 = useCallback(() => {
    setState(
      isActive ? "entered" : opts && opts.unmountOnExit ? "unmounted" : "exited"
    );
    startedAt.current = undefined;
    startedAt2.current = undefined;
  }, [isActive, !!opts && opts.unmountOnExit]);

  const timeout4 = useCallback(() => {
    setState(isActive ? "entering" : "exiting");
    timeoutRef.current = setTimeout(timeout3, timeout);
    startedAt2.current = startedAt.current;
    startedAt.current = Date.now();
  }, [isActive, timeout, timeout3, startedAt.current]);

  useEffect(() => {
    if (
      isActive
        ? state === "entered"
        : state === "exited" || state === "unmounted"
    ) {
      startedAt.current = undefined;
      startedAt2.current = undefined;
      return undefined;
    }

    const now = Date.now();
    const duration =
      typeof startedAt.current === "undefined"
        ? timeout
        : typeof startedAt2.current === "undefined"
        ? Math.max(0, now - startedAt.current)
        : Math.max(0, timeout - startedAt.current + now);

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

    startedAt2.current = startedAt.current;
    startedAt.current = now;

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [isActive]);

  return state;
};

export default useTransition;
