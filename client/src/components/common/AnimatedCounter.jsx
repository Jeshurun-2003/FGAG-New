import React, { useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

const AnimatedCounter = ({ from = 0, to, duration = 1.2, suffix = '' }) => {
  const [count, setCount] = useState(from);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });

  useEffect(() => {
    if (!isInView) return;

    let start = from;
    const target = Number(to);
    if (isNaN(target)) {
      setCount(to);
      return;
    }

    const totalSteps = 40;
    const stepTime = (duration * 1000) / totalSteps;
    const increment = (target - from) / totalSteps;

    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
