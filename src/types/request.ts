export default interface HTTPResponseInterface<D = unknown> {
  success: boolean
  data: D
  message?: string
}
