export default function corsMiddleware(origin, callback) {
  const origins = process.env.ALLOWED_ORIGINS || '';
  const allowedOrigins = origins.split(',').map((origin) => {
    return new RegExp(origin);
  });

  // If allowedOrigins is not defined, allow all origins
  if (!origin || !allowedOrigins || origins === '*') {
    return callback(null, true);
  }

  // Check if the provided origin is allowed
  const originIsAllowed = allowedOrigins.some((o) => o.test(origin));

  // If the origin is allowed, execute the callback with no error
  if (originIsAllowed) {
    return callback(null, true);
  }

  // If the origin is not allowed, execute the callback with an error
  return callback(new Error('Not allowed by CORS'), false);
}
