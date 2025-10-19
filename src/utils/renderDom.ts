import type Block from '@/modules/block';

export function render(query: string, block: Block): Element | null {
  const root = document.querySelector(query);
  const content = block.getContent();

  if (!root || !content) return null;

  root.appendChild(content);
  block.dispatchComponentDidMount();

  return root;
}
