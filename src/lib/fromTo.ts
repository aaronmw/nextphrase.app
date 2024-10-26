export function fromTo(transitions: {
  [propertyName in keyof gsap.TweenVars]: [
    gsap.TweenVars[propertyName],
    gsap.TweenVars[propertyName],
    gsap.TweenVars?,
  ]
}) {
  return Object.entries(transitions).reduce(
    (acc, [key, [from, to, options = {}]]) => {
      return {
        ...acc,
        from: {
          ...acc.from,
          [key]: from,
        },
        to: {
          ...acc.to,
          [key]: to,
          ...options,
        },
      }
    },
    { from: {}, to: {} },
  )
}
