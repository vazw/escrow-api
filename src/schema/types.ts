interface PassResponse<T> {
  ok   : true
  data : T
}

interface FailResponse {
  ok    : false
  data ?: any
  err   : string
}

export type ResponseAPI<T = any> = PassResponse<T> | FailResponse
