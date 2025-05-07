export type RenderToast = (params: {
    variant?: "default" | "success" | "error" | "warning"
    message: string
}) => void
