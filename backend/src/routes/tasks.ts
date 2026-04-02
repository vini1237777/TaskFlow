import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} from '../controllers/taskController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';

const router = Router();
router.use(authenticate);

router.get('/', getTasks);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
    body('description').optional().isLength({ max: 1000 }),
    body('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  ],
  validateRequest,
  createTask
);

router.get('/:id', [param('id').isUUID()], validateRequest, getTask);

router.patch(
  '/:id',
  [
    param('id').isUUID(),
    body('title').optional().trim().notEmpty().isLength({ max: 200 }),
    body('description').optional().isLength({ max: 1000 }),
    body('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
    body('dueDate').optional().isISO8601(),
  ],
  validateRequest,
  updateTask
);

router.delete('/:id', [param('id').isUUID()], validateRequest, deleteTask);

router.post('/:id/toggle', [param('id').isUUID()], validateRequest, toggleTask);

export default router;
