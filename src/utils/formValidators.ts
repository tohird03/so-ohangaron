export function notEmptyFieldRules() {
  return {
    validator(rules: any, value: string) {
      if (!value || value.trim().length === 0) {
        return Promise.reject(new Error('This input cannot be empty or just spaces'));
      }

      return Promise.resolve();
    },
  };
}
