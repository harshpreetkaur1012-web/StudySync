import { Router } from 'express';
import {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  updateAssignmentStatus,
  deleteAssignment,
} from '../controllers/assignmentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Protect all assignment routes with JWT middleware
router.use(authenticate);

router.get('/', getAssignments);
router.post('/', createAssignment);
router.get('/:id', getAssignmentById);
router.put('/:id', updateAssignment);
router.patch('/:id/status', updateAssignmentStatus);
router.delete('/:id', deleteAssignment);

export default router;
