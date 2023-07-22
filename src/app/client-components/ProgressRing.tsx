import { ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ProgressRingProps extends Omit<ComponentProps<"div">, "children"> {
  progress: number /* 0-100 */;
  variant?: keyof typeof progressRingVariants;
}

const progressRingVariants = {
  md: {
    classNamesForLabel: twMerge(`
      text-xl
      font-bold
    `),
    radius: 50,
    width: 10,
  },
  lg: {
    classNamesForLabel: twMerge(`
      text-5xl
      font-bold
      text-appForegroundColor/50
      dark:text-appForegroundColorInDarkMode/50
    `),
    radius: 100,
    width: 20,
  },
};

const ProgressRing = forwardRef<HTMLDivElement, ProgressRingProps>(
  ({ className, progress, variant = "md", ...otherProps }, ref) => {
    const { classNamesForLabel, radius, width } = progressRingVariants[variant];
    const circumference = 2 * Math.PI * radius;
    const offset = radius + width;
    const canvasSize = radius * 2 + width * 2;

    return (
      <div className={twMerge(className)} ref={ref} {...otherProps}>
        <div
          className="
            flex
            animate-pulse
            items-center
            justify-center
            overflow-hidden
            rounded-full
            text-brandColor
          "
        >
          <svg height={canvasSize} width={canvasSize}>
            <circle
              className="
                text-shadedColor
                dark:text-shadedColorInDarkMode
              "
              strokeWidth={width}
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx={offset}
              cy={offset}
            />

            <circle
              className="transition-all duration-500 ease-out"
              strokeWidth={width - 10}
              strokeDasharray={circumference}
              strokeDashoffset={
                circumference - (progress / 100) * circumference
              }
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx={offset}
              cy={offset}
            />
          </svg>

          <span className={twMerge("absolute", classNamesForLabel)}>
            {progress}%
          </span>
        </div>
      </div>
    );
  }
);

ProgressRing.displayName = "ProgressRing";

export { ProgressRing };
