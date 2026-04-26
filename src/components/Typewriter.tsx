import { useEffect, useState } from "react";

export function Typewriter({
  text,
  speed = 15,
  startDelay = 0,
  onDone,
  className,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  onDone?: () => void;
  className?: string;
}) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setOut("");
    setDone(false);
    let i = 0;
    let tId: number;
    const start = window.setTimeout(() => {
      const tick = () => {
        i++;
        setOut(text.slice(0, i));
        if (i < text.length) {
          tId = window.setTimeout(tick, speed);
        } else {
          setDone(true);
          onDone?.();
        }
      };
      tick();
    }, startDelay);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(tId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, startDelay]);

  return (
    <span className={className}>
      {out}
      {!done && <span className="caret" />}
    </span>
  );
}
