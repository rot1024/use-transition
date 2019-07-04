declare module "@rot1024/use-transition" {
  export type TransitionStatus = "entering" | "entered" | "exiting" | "exited" | "unmounted";
  
  export interface Option {
    timeout: number;
    initialOnOff?: boolean;
    mountOnEnter?: boolean;
    unmountOnExit?: boolean;
  }

  const useTransition: (opts: Option) => [TransitionStatus, boolean, (onoff: boolean) => void];
  
  export default useTransition;
}
