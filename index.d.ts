declare module "@rot1024/use-transition" {
  export type TransitionStatus = "entering" | "entered" | "exiting" | "exited" | "unmounted";
  
  export interface Option {
    mountOnEnter?: boolean;
    unmountOnExit?: boolean;
  }

  export const useTransition: (isActive: boolean, timeout: number, opts?: Option) => TransitionStatus;
  
  export default useTransition;
}
