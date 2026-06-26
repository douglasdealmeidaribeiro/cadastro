export function notFoundHandler(_req, res) {
  return res.status(404).json({
    success: false,
    message: 'Rota nao encontrada.',
    error: 'Not Found'
  });
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
  const isProduction = process.env.NODE_ENV === 'production';

  const validationMessage = error.name === 'ValidationError'
    ? Object.values(error.errors).map((item) => item.message).join(' ')
    : null;

  return res.status(statusCode).json({
    success: false,
    message: validationMessage || error.message || 'Erro interno do servidor.',
    error: isProduction && statusCode === 500 ? 'Internal Server Error' : error.name
  });
}
