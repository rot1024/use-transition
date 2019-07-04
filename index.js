import { useCallback, useEffect, useState, useRef } from "react";

export const useTransition = (isActive, timeout, opts) => {
  const [state, setState] = useState(
    isActive ? "entered" : opts && opts.mountOnEnter ? "unmounted" : "exited"
  );
  const timeoutRef = useRef();
  const willFinishAt = useRef();

  const timeout1 = useCallback(() => {
    setState(
      isActive ? "entered" : opts && opts.unmountOnExit ? "unmounted" : "exited"
    );
    willFinishAt.current = undefined;
  }, [isActive, !!opts && opts.unmountOnExit, willFinishAt]);

  const timeout2 = useCallback(() => {
    setState("entered");
    willFinishAt.current = undefined;
  }, [willFinishAt]);

  const timeout3 = useCallback(() => {
    setState(
      isActive ? "entered" : opts && opts.unmountOnExit ? "unmounted" : "exited"
    );
    willFinishAt.current = undefined;
  }, [isActive, !!opts && opts.unmountOnExit, willFinishAt]);

  const timeout4 = useCallback(() => {
    setState(isActive ? "entering" : "exiting");
    timeoutRef.current = setTimeout(timeout3, timeout);
    willFinishAt.current = Date.now() + timeout;
  }, [isActive, timeout, timeout3, timeoutRef, willFinishAt]);

  useEffect(() => {
    if (
      isActive
        ? state === "entered"
        : state === "exited" || state === "unmounted"
    ) {
      willFinishAt.current = undefined;
      return undefined;
    }

    const now = Date.now();
    const duration =
      typeof willFinishAt.current === "undefined"
        ? timeout
        : timeout - (willFinishAt.current - now);

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

    willFinishAt.current = now + duration;

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [isActive]);

  return state;
};

export default useTransition;
