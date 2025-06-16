import { ZodError } from 'zod';

/**
 * Express middleware to validate request data against Zod schemas.
 * @param {Object} schemas - { body, query, params }
 */
const validate = (schemas) => (req, res, next) => {
  const issues = {};

  if (schemas.body) {
    const result = schemas.body.safeParse(req.body);
    if (!result.success) issues.body = result.error.issues;
  }

  if (schemas.query) {
    const result = schemas.query.safeParse(req.query);
    if (!result.success) issues.query = result.error.issues;
  }

  if (schemas.params) {
    const result = schemas.params.safeParse(req.params);
    if (!result.success) issues.params = result.error.issues;
  }

  if (Object.keys(issues).length > 0) {
    return res.error("Validation failed", 400, { issues });
  }

  next();
};

export default validate;


/** Example
 * import validate from './middleware/validate.js';
import { z } from 'zod';

const bodySchema = z.object({
  name: z.string().min(1),
  age: z.number().min(0),
});

app.post('/user', validate({ body: bodySchema }), (req, res) => {
  res.success({ message: 'User created successfully' });
});

 */