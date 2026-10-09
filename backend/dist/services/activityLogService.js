"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logTaskActivity = void 0;
const prisma_1 = require("../config/prisma");
const logTaskActivity = async (params) => {
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
        const logEntry = await prisma_1.prisma.taskActivityLog.create({
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
    }
    catch (error) {
        console.error('Failed to log task activity:', error);
        // Silent fail or non-blocking to prevent task mutation from crashing if log fails, but log error
        return null;
    }
};
exports.logTaskActivity = logTaskActivity;
