export default function errorHandler(error, req, res, next) {
  //const status = error.code ?? 500;
  const status = error.status ?? error.code ?? 500; // 왼쪽부터 있으면 status에 할당
  console.error(error);
  return res.status(status).json({
    path: req.path,
    method: req.method,
    message: error.message ?? "Internal Server Error",
    data: error.data ?? undefined,
    date: new Date(),
  });
}
