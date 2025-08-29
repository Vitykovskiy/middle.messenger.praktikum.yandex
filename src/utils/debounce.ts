type DebounceCallback<T> = (...args: T[]) => void;

export default function debounce<T, F extends DebounceCallback<T>>(callback: F, delay = 300) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: T[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}
