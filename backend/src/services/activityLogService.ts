import { LogAction } from '@prisma/client';
import { prisma } from '../config/prisma';

export interface LogTaskActivityParams {
  taskId: string;
  actorId: string;
  action: LogAction;
  previousState?: unknown;
  newState?: unknown;
  remarks?: string;
  ipAddress?: string;
}

export const logTaskActivity = async (params: LogTaskActivityParams) => {
  try {
    const previousStateStr = params.previousState
      ? typeof params.previousState === 'string'
        ? params.previousState
        : JSON.stringify(params.previousState)
      : null;

    const newStateStr = params.newState
      ? typeof params.newState === 'string'
        ? params.newState
        : JSON.stringify(params.newState)
      : null;

    const logEntry = await prisma.taskActivityLog.create({
      data: {
        taskId: params.taskId,
        actorId: params.actorId,
        action: params.action,
        previousState: previousStateStr,
        newState: newStateStr,
        remarks: params.remarks || null,
        ipAddress: params.ipAddress || null,
      },
      include: {
        actor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            roleEnum: true,
          },
        },
      },
    });

    return logEntry;
  } catch (error) {
    console.error('Failed to log task activity:', error);
    // Silent fail or non-blocking to prevent task mutation from crashing if log fails, but log error
    return null;
  }
};
