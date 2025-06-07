import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "./store"

// Sử dụng try-catch để bắt lỗi khi Redux store chưa sẵn sàng
export const useAppDispatch = () => {
  return useDispatch<AppDispatch>()
}

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
