import "dotenv/config";

/**
 * Throws if the environment variable is not set, otherwise returns its value or `defaultValue`.
 *
 * This allows safe usage of environment variables, as they are guaranteed to never be null.
 * @param name The environment variable to get the value of
 * @param defaultValue The optional value to default to instead of throwing if the variable is not set
 * @returns the value of the environment variable (guaranteed to not be null)
 */
export default function requireEnvVar(
  name: string,
  defaultValue?: string
): string {
  const value = process.env[name] ?? defaultValue;

  if (value == null) throw new Error(`Missing environment variable ${name}.`);
  return value;
}
