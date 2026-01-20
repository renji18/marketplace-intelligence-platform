import type { UserInterface } from "@/interfaces/user.interface"

export const initialState: {
  loading: boolean
  error: string | null
  message: string | null
  user?: UserInterface
} = {
  loading: true,
  error: null,
  message: null,
}
