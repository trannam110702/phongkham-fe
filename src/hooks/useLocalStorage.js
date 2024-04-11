const useLocalStorage = (keyName, defaultValue = null) => {
  let value;
  const rawValue = window.localStorage.getItem(keyName);
  value = JSON.parse(rawValue);
  const setValue = (newValue) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {}
  };
  return [value, setValue];
};
export default useLocalStorage;
