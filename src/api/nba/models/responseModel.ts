interface ApiResponse<T> {
    status: string;
    data?: T;
    message?: string;
    error?: string;
    code?: string;
}

export const successResponse = <T>(
    data: T,
    message?: string
): ApiResponse<T> => ({
    status: "Success",
    data,
    message,
});

export const errorResponse = (
    message: string,
    code?: string
): ApiResponse<null> => ({
    status: "Error",
    error: message,
    code,
});
