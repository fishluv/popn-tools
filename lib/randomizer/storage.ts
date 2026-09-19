const KEY_PREFIX = "randomizer:"

function getStorageItem<T>(
  key: string,
  defaultValue: T,
  convertFunc: (value: string | null) => T,
): T {
  const item = localStorage.getItem(KEY_PREFIX + key)
  return item === null ? defaultValue : convertFunc(item)
}

export function getStorageString(key: string, defaultValue = ""): string {
  return getStorageItem<string>(key, defaultValue, String)
}

export function getStorageNumber(key: string, defaultValue = 0): number {
  return getStorageItem<number>(key, defaultValue, Number)
}

export function getStorageBoolean(key: string, defaultValue = false): boolean {
  return getStorageItem<boolean>(key, defaultValue, (val) => val === "true")
}

export function setStorageItem(key: string, value: string | number | boolean) {
  localStorage.setItem(KEY_PREFIX + key, String(value))
}

export function setStorageItemIfNull(key: string, value: string | number | boolean) {
  if (localStorage.getItem(KEY_PREFIX + key) === null) {
    setStorageItem(key, value)
  }
}
