import { Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const VALID_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'] as const;
const VALID_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
type TaskStatus = typeof VALID_STATUSES[number];
type Priority = typeof VALID_PRIORITIES[number];

export const getTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const {
      page = '1',
      limit = '10',
      status,
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const where: {
      userId: string;
      status?: string;
      priority?: string;
      title?: { contains: string };
    } = { userId };

    if (status && VALID_STATUSES.includes(status as TaskStatus)) {
      where.status = status as string;
    }
    if (priority && VALID_PRIORITIES.includes(priority as Priority)) {
      where.priority = priority as string;
    }
    if (search) {
      where.title = { contains: search as string };
    }

    const validSortFields = ['createdAt', 'updatedAt', 'title', 'dueDate', 'priority'];
    const orderBy = validSortFields.includes(sortBy as string)
      ? { [sortBy as string]: sortOrder === 'asc' ? 'asc' : 'desc' }
      : { createdAt: 'desc' as const };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.task.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const task = await prisma.task.findFirst({ where: { id, userId } });
    if (!task) return next(createError('Task not found', 404));

    res.json({ success: true, data: { task } });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { title, description, status, priority, dueDate } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'PENDING',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) return next(createError('Task not found', 404));

    const { title, description, status, priority, dueDate } = req.body;
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const task = await prisma.task.update({ where: { id }, data: updateData });

    res.json({ success: true, message: 'Task updated', data: { task } });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) return next(createError('Task not found', 404));

    await prisma.task.delete({ where: { id } });

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const toggleTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) return next(createError('Task not found', 404));

    const nextStatus = existing.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

    const task = await prisma.task.update({
      where: { id },
      data: { status: nextStatus },
    });

    res.json({ success: true, message: `Task marked as ${nextStatus.toLowerCase()}`, data: { task } });
  } catch (error) {
    next(error);
  }
};
