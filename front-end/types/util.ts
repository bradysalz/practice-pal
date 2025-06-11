export type NonNullableFields<T> = {
  [K in keyof T]: Exclude<T[K], null>;
};

export type NonNullableExcept<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? T[P] : Exclude<T[P], null>;
};
