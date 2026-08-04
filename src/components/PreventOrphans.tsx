import { Children, ReactNode, cloneElement, isValidElement } from 'react'

type TextLeaf = {
  path: number[]
  text: string
}

function isBreakableWhitespace(character: string) {
  return /\s/u.test(character) && character !== '\u00A0'
}

function isTextNode(node: ReactNode): node is string | number {
  return typeof node === 'string' || typeof node === 'number'
}

function restoreChildrenShape(
  originalChildren: ReactNode,
  nextChildren: ReactNode[],
) {
  if (Array.isArray(originalChildren)) return nextChildren
  if (nextChildren.length === 0) return null
  if (nextChildren.length === 1) return nextChildren[0]

  return nextChildren
}

function collectTextLeaves(node: ReactNode, path: number[] = []): TextLeaf[] {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return []
  }

  if (isTextNode(node)) {
    return [{ path, text: String(node) }]
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return collectTextLeaves(node.props.children, path)
  }

  return Children.toArray(node).flatMap((child, index) =>
    collectTextLeaves(child, [...path, index]),
  )
}

function replaceTextLeafAtPath(
  node: ReactNode,
  path: number[],
  replaceText: (text: string) => string,
): ReactNode {
  if (isTextNode(node)) {
    if (path.length > 0) return node

    return replaceText(String(node))
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    const nextChildren = replaceTextLeafAtPath(
      node.props.children,
      path,
      replaceText,
    )

    if (nextChildren === node.props.children) return node

    return cloneElement(node, undefined, nextChildren)
  }

  const children = Children.toArray(node)
  const [index, ...restPath] = path

  if (index === undefined || index < 0 || index >= children.length) {
    return node
  }

  const nextChild = replaceTextLeafAtPath(
    children[index],
    restPath,
    replaceText,
  )

  if (nextChild === children[index]) return node

  const nextChildren: ReactNode[] = [...children]
  nextChildren[index] = nextChild ?? null

  return restoreChildrenShape(node, nextChildren)
}

function findLastBreakableWhitespace(text: string) {
  let end = text.length - 1

  while (end >= 0 && /\s/u.test(text[end])) {
    end -= 1
  }

  if (end < 0) return null

  for (let index = end; index >= 0; index -= 1) {
    if (!isBreakableWhitespace(text[index])) continue
    if (!/\S/u.test(text.slice(0, index))) continue

    return { index }
  }

  return null
}

export function preventOrphans(children: ReactNode): ReactNode {
  const leaves = collectTextLeaves(children)

  if (leaves.length === 0) return children

  const fullText = leaves.map(leaf => leaf.text).join('')
  const replacement = findLastBreakableWhitespace(fullText)

  if (!replacement) return children

  let offset = replacement.index

  for (const leaf of leaves) {
    if (offset < leaf.text.length) {
      return replaceTextLeafAtPath(children, leaf.path, text => {
        if (offset < 0 || offset >= text.length) return text

        return `${text.slice(0, offset)}\u00A0${text.slice(offset + 1)}`
      })
    }

    offset -= leaf.text.length
  }

  return children
}

export function PreventOrphans({ children }: { children: ReactNode }) {
  return <>{preventOrphans(children)}</>
}
