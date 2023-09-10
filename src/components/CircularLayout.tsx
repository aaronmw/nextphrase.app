import { ComponentPropsWithoutRef, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export { CircularLayout }
export type { CircularLayoutProps }

interface CircularLayoutProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  diameter: number | string
  items: ReactNode[]
  itemSize: number | string
}

const CircularLayout = ({
  className,
  diameter,
  items,
  itemSize,
  ...otherProps
}: CircularLayoutProps) => {
  const angleBetweenItems = 360 / items.length

  const circleSize = typeof diameter === "string" ? diameter : `${diameter}px`

  const itemSizeString =
    typeof itemSize === "string" ? itemSize : `${itemSize}px`

  return (
    <div
      className={twMerge(
        `
          relative
          rounded-full
          p-0
        `,
        className,
      )}
      style={{
        height: circleSize,
        width: circleSize,
      }}
      {...otherProps}
    >
      {items.map((item, index) => {
        const angle = angleBetweenItems * index

        return (
          <div
            className={`
              absolute
              left-1/2
              top-1/2
              block
            `}
            key={index}
            style={{
              height: itemSizeString,
              margin: `calc(${itemSizeString} / -2)`,
              transform: [
                `rotate(${angle}deg)`,
                `translateX(calc((${circleSize} - ${itemSizeString}) / 2))`,
                `rotate(-${angle}deg)`,
              ].join(" "),
              width: itemSizeString,
            }}
          >
            {item}
          </div>
        )
      })}
    </div>
  )
}
