# use-transition

React Hooks for transition animation like Transition component in react-transition-group

```sh
npm install --dev @rot1024/use-transition
# or
yarn add @rot1024/use-transition
```

## Usage

```jsx
import { useState } from "react";
import { styled } from "styled-components";
import useTransition from "@rot1024/use-transition";

const StyledDiv = styled.div`
  transition: ${({ state }) => state === "entering" || state === "exiting" ? "all 1s ease" : ""};
  opacity: ${({ state }) => state === "entering" || state === "entered" ? 1 : 0};
`;

const Component = () => {
  const [state, onoff, toggle] = useTransition({
    timeout: 1000,       // ms
    initialOnOff: false, // optional
    mountOnEnter: true,  // optional
    unmountOnExit: true  // optional
  });
  // state is "entering", "entered", "exiting", "exited", or "unmounted"
  // onoff is boolean
  // toggle is (boolean) => void

  const handleClick = useCallback(() => {
    toggle(!onoff);
  }, [onoff, toggle])

  return (
    <div>
      <button onClick={handleClick}>Toggle</button>
      {state === "unmounted" ? null : <StyledDiv state={state}>Transition</StyledDiv>}
    </div>
  );
};
```

## License

MIT License
