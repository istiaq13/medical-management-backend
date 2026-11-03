import { Router } from 'express';
import { RoleController } from '../../controllers/role.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import {
  createRoleSchema,
  updateRoleSchema,
  roleQuerySchema,
} from '../../validators/role.validator';

const router = Router();

// Protect all role management endpoints: Admin access only
router.use(authenticate, authorize('ADMIN'));

router
  .route('/')
  .get(validateRequest({ query: roleQuerySchema }), RoleController.getAllRoles)
  .post(validateRequest({ body: createRoleSchema }), RoleController.createRole);

router
  .route('/:id')
  .get(RoleController.getRoleById)
  .put(validateRequest({ body: updateRoleSchema }), RoleController.updateRole)
  .delete(RoleController.deleteRole);

export default router;
