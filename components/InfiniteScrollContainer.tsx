import React from "react";
import { useInView } from "react-intersection-observer";

interface InfinateScrollContainerProps extends React.PropsWithChildren {
  classname?: string;
  onBottomReached: () => void;
}

export default function InfiniteScrollContainer({
  children,
  classname,
  onBottomReached,
}: InfinateScrollContainerProps) {
  // The useInView hook gives a ref and adding this ref to a container helps us to monitor that container
  // we give the rootMargin to 200px because once we reach withing the 200px of the viewport of that container the onChange fn gets executed
  // the inView value becomes true inside the onChange fn and then it triggers the desired code we want to execute on reaching that section
  const { ref } = useInView({
    rootMargin: "200px",
    onChange(inView) {
      if (inView) {
        onBottomReached();
      }
    },
  });
  return (
    <div className={classname}>
      {children}

      {/* It is this div we are going to monitor */}
      <div ref={ref} />
    </div>
  );
}
