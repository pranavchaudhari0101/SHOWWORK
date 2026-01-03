/**
 * Production-safe logger for ShowWork
 * Provides structured logging for debugging visibility and data fetching issues
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
    action: string
    [key: string]: unknown
}

const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
}

// Only log info+ in production, debug+ in development
const MIN_LEVEL: LogLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug'

function shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL]
}

function formatLog(level: LogLevel, context: LogContext): string {
    const timestamp = new Date().toISOString()
    const { action, ...rest } = context

    // Sanitize sensitive data
    const sanitized = Object.fromEntries(
        Object.entries(rest).map(([key, value]) => {
            if (key.toLowerCase().includes('password') || key.toLowerCase().includes('secret')) {
                return [key, '[REDACTED]']
            }
            return [key, value]
        })
    )

    return JSON.stringify({
        timestamp,
        level,
        action,
        ...sanitized,
    })
}

export const logger = {
    debug: (context: LogContext) => {
        if (shouldLog('debug')) {
            console.log(formatLog('debug', context))
        }
    },

    info: (context: LogContext) => {
        if (shouldLog('info')) {
            console.log(formatLog('info', context))
        }
    },

    warn: (context: LogContext) => {
        if (shouldLog('warn')) {
            console.warn(formatLog('warn', context))
        }
    },

    error: (context: LogContext) => {
        if (shouldLog('error')) {
            console.error(formatLog('error', context))
        }
    },

    // Specific loggers for common operations
    fetchExplore: (projectCount: number, error?: string) => {
        logger.info({
            action: 'explore_fetch',
            projectCount,
            error: error || null,
        })
    },

    fetchProject: (projectId: string, found: boolean, visibility?: string, error?: string) => {
        logger.info({
            action: 'project_fetch',
            projectId,
            found,
            visibility: visibility || null,
            error: error || null,
        })
    },

    publishProject: (projectId: string, visibility: string, success: boolean, error?: string) => {
        logger.info({
            action: 'project_publish',
            projectId,
            visibility,
            success,
            error: error || null,
        })
    },

    accessDenied: (resource: string, reason: string, userId?: string) => {
        logger.warn({
            action: 'access_denied',
            resource,
            reason,
            userId: userId || 'anonymous',
        })
    },
}
