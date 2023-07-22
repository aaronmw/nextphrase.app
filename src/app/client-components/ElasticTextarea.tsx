import { inputClassNames } from "@/app/client-components/Input";
import { useMultipleRefs } from "@/hooks/useMultipleRefs";
import {
  ChangeEvent,
  ComponentPropsWithRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

interface ElasticTextareaProps extends ComponentPropsWithRef<"textarea"> {}

const ElasticTextarea = forwardRef<HTMLTextAreaElement, ElasticTextareaProps>(
  ({ className, defaultValue, onChange, ...otherProps }, ref) => {
    const [value, setValue] = useState(defaultValue ?? "");

    const textareaElementRef = useRef<HTMLTextAreaElement>(null);

    const ghostElementRef = useRef<HTMLDivElement>(null);

    const refs = useMultipleRefs(ref, textareaElementRef);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;

      setValue(newValue);

      onChange?.(event);
    };

    useEffect(() => {
      const ghostElement = ghostElementRef.current;

      const textareaElement = textareaElementRef.current;

      if (ghostElement && textareaElement) {
        const { width, height } = ghostElement?.getBoundingClientRect();

        textareaElement.style.height = `${height}px`;
        textareaElement.style.width = `${width}px`;
      }
    }, [value]);

    return (
      <div className="relative [font-size:0]">
        <textarea
          className={twMerge(inputClassNames, "text-base", className)}
          ref={refs}
          rows={1}
          value={value}
          onChange={handleChange}
          {...otherProps}
        />

        <div
          className={twMerge(
            inputClassNames,
            `
              absolute
              left-0
              top-0
              whitespace-pre-wrap
              text-base
              opacity-50
            `
          )}
          ref={ghostElementRef}
        >
          {value}{" "}
        </div>
      </div>
    );
  }
);

ElasticTextarea.displayName = "ElasticTextarea";

export { ElasticTextarea };
