import axios from "axios";

export function handleAxiosError(error: unknown, action: string) {
  if (axios.isAxiosError(error)) {
    throw new Error(
      `Failed to ${action}: ${error.response?.status} - ${
        error.response?.data?.message || error.message
      }`
    );
  }
  throw new Error(`Failed to ${action}`);
}
