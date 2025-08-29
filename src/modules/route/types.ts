export type MetaData = Record<string, unknown>; // Кастомные свойства роута

export type RouteProps = {
  rootQuery: string;
  name?: string;
};

export type RouteGuard = () => Promise<boolean>;
