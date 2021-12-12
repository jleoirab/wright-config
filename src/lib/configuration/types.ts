export interface ConfigGetter<T> {
  (): T | undefined;
}

export interface ConfigOrElseGetter<T> {
  (orElseVal: T): T;
}

export interface Config<T> {
  get: ConfigGetter<T>;
  getOrElse: ConfigOrElseGetter<T>;
}

export interface ConfigFactory<T> {
  (key: string): Config<T>;
}

/**
 * Creates an anonymous function that gets the string value from the source
 * @param key The config key/name
 * @returns The anonymous function that gets the value from the source
 */
const getStringConfigValue = (key: string) => {
  return () => process.env[key];
};

/**
 * The anonymous function that gets the boolean value from the source
 * @param key The config key/name
 * @returns The anonymous function that gets the value from the source
 */
const getBooleanConfigValue = (key: string) => {
  return () => {
    const val = process.env[key];

    if (val === undefined) {
      return val;
    }

    return JSON.parse(val);
  };
};

/**
 * The anonymous function that gets the boolean value from the source or returns a default
 * @param key The config key/name
 * @returns The anonymous function
 */
const getConfigValueOrElse = <T>(getter: ConfigGetter<T>) => {
  return (orElseVal: T) => {
    const val = getter();
    return val === undefined ? orElseVal : val;
  };
};

export const stringConfig: ConfigFactory<string> = (configKey: string) => {
  const getter = getStringConfigValue(configKey);

  return {
    get: getter,
    getOrElse: getConfigValueOrElse(getter),
  };
};

export const booleanConfig: ConfigFactory<boolean> = (configKey: string) => {
  const getter = getBooleanConfigValue(configKey);

  return {
    get: getter,
    getOrElse: getConfigValueOrElse(getter),
  };
};
