import { ResponseAPI } from '../schema/types.js'

export async function handleResponse<T> (
  res : Response
) : Promise<ResponseAPI<T>> {
  try {
    // Unpack response object.
    const { ok, status, statusText } = res
    // If initial response fails:
    if (!ok) {
      // Return the response status as error.
      const err = `[${status}]: ${statusText}`
      return { ok, err }
    }
    // Unpack the json response.
    const { data, err } = await res.json()
    // If an err object is present:
    if (err !== undefined) {
      // Return the err as response.
      return { ok: false, data, err }
    }
    // Return the data as generic type.
    return { ok, data: data as T }
  } catch (err) {
    // Capture the exception message.
    const { message } = err as Error
    // Log the full error to console.
    console.log(err)
    // Return the error message as response.
    return { ok: false, err: message }
  }
}
