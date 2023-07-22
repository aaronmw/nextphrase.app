import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { useEffect, useRef, useState } from "react";

const useDateModified = (date: Date) => {
  const [formattedDateModified, setFormattedDateModified] = useState<
    string | null
  >(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (date) {
      const updateDateModified = () => {
        const newFormattedDateModified = formatDistanceToNowStrict(date, {
          addSuffix: true,
        });

        setFormattedDateModified(newFormattedDateModified);

        timerRef.current = setTimeout(updateDateModified, 10000);
      };

      updateDateModified();

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [date]);

  return formattedDateModified;
};

export { useDateModified };
