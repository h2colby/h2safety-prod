// utils/logger.ts

export function logInfo(message: string, ...args: any[]) {
    console.log(`[INFO] ${message}`, ...args)
  }
  
  export function logError(message: string, ...args: any[]) {
    console.error(`[ERROR] ${message}`, ...args)
  }
  