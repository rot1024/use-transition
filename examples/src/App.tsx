import useTransition, { type TransitionStatus } from '@rot1024/use-transition';
import useTransition2 from 'use-transition';
import { type ReactNode, useState } from 'react';

function Component({transition, children}: { transition?: TransitionStatus, children?: ReactNode }) {
  return (
    <div style={{
      display: "inline-block"
    }}>
      {transition !== "unmounted" ? (
        <div style={{
          background: "red",
          padding: "20px",
          opacity: transition === "entering" || transition === "entered" ? "1" : "0",
          transition: transition === "entering" || transition === "exiting" ? "all ease 1s" : undefined,
        }}>
          {children}
        </div>
      ) : (
        "Unmounted"
      )}
    </div>
  )
}

function App() {
  const [isActive, setActive] = useState(false);
  const transition = useTransition(isActive, 1000, {
    mountOnEnter: true,
    unmountOnExit: true
  })
  const transition2 = useTransition2(isActive, 1000, {
    unmountOnExited: true,
  })

  return (
    <div className="App">
      <p><button onClick={() => setActive(a => !a)}>Toggle</button></p>
      {/* <Component transition={transition}>
        @rot1024/use-transition
      </Component> */}
      <Component transition={transition2}>
        use-transition
      </Component>
      <Component transition={transition}>
        @rot1024/use-transition
      </Component>
    </div>
  );
}

export default App;
