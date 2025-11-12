// utils/handleError.js
export function handleError(err) {
  const data = {
    success: false,
    message: 'Something went wrong'
  };

  if (err?.response?.data) {
    data.success = err.response.data.success ?? false;
    data.message = err.response.data.message ?? 'An error occurred';
  } else if (err?.message) {
    data.message = err.message;
  }

  return data;
}
