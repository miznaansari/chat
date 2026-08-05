import prisma from "@/lib/prisma";

/**
 * Shared Rate Limiter & Request Queue Manager for AI API Endpoints (/api/chat and /api/feature/turn)
 * Total limit per minute across both endpoints is controlled by AI_MAX_REQUESTS_PER_MIN (default 15).
 */

if (!globalThis._aiRateQueueState) {
  globalThis._aiRateQueueState = {
    timestamps: [],
    queue: [],
  };
}

const state = globalThis._aiRateQueueState;

/**
 * Record per-minute API request metrics in Prisma DB asynchronously
 */
async function recordMinuteMetric(wasQueued) {
  try {
    const now = new Date();
    const YYYY = now.getUTCFullYear();
    const MM = String(now.getUTCMonth() + 1).padStart(2, "0");
    const DD = String(now.getUTCDate()).padStart(2, "0");
    const HH = String(now.getUTCHours()).padStart(2, "0");
    const mm = String(now.getUTCMinutes()).padStart(2, "0");
    const minuteBucket = `${YYYY}-${MM}-${DD} ${HH}:${mm}`;

    await prisma.systemMetric.upsert({
      where: { minuteBucket },
      update: {
        requestCount: { increment: 1 },
        queuedCount: wasQueued ? { increment: 1 } : undefined,
      },
      create: {
        id: minuteBucket,
        minuteBucket,
        requestCount: 1,
        queuedCount: wasQueued ? 1 : 0,
        updatedAt: new Date(),
      },
    });
  } catch (err) {
    console.error("Error recording system minute metric:", err?.message || err);
  }
}

/**
 * Get current max requests per minute (reads env var dynamically or defaults to 15)
 */
export function getMaxRequestsPerMin() {
  const envVal = parseInt(process.env.AI_MAX_REQUESTS_PER_MIN || "15", 10);
  return isNaN(envVal) || envVal <= 0 ? 15 : envVal;
}

/**
 * Clean timestamps older than 60 seconds
 */
function cleanOldTimestamps() {
  const now = Date.now();
  const windowStart = now - 60000;
  while (state.timestamps.length > 0 && state.timestamps[0] < windowStart) {
    state.timestamps.shift();
  }
}

/**
 * Process next item in queue if capacity is available
 */
function checkAndProcessQueue() {
  cleanOldTimestamps();
  const maxLimit = getMaxRequestsPerMin();

  while (state.timestamps.length < maxLimit && state.queue.length > 0) {
    const nextResolver = state.queue.shift();
    if (nextResolver) {
      state.timestamps.push(Date.now());
      nextResolver();
    }
  }
}

/**
 * Executes an async task with rate limit checks & queuing.
 * @param {Function} taskFn - The async function to execute.
 * @returns {Promise<{ result: any, isHighDemand: boolean, wasQueued: boolean }>}
 */
export async function processWithRateQueue(taskFn) {
  cleanOldTimestamps();
  const maxLimit = getMaxRequestsPerMin();

  const currentWindowCount = state.timestamps.length;
  const isHighDemand = currentWindowCount >= maxLimit || state.queue.length > 0;
  let wasQueued = false;

  if (currentWindowCount >= maxLimit) {
    wasQueued = true;
    // Wait in FIFO queue for next available slot
    await new Promise((resolve) => {
      state.queue.push(resolve);
    });
  } else {
    // Immediate slot available
    state.timestamps.push(Date.now());
  }

  // Record minute metric in background (non-blocking)
  recordMinuteMetric(wasQueued).catch(() => {});

  // Schedule slot release check 60 seconds from now
  setTimeout(() => {
    checkAndProcessQueue();
  }, 60050);

  try {
    const result = await taskFn({ isHighDemand, wasQueued });
    return { result, isHighDemand, wasQueued };
  } finally {
    // Trigger queue check whenever a slot frees up or request finishes
    checkAndProcessQueue();
  }
}

/**
 * Gets current rate queue statistics for API responses or status checks
 */
export function getRateQueueStatus() {
  cleanOldTimestamps();
  const maxLimit = getMaxRequestsPerMin();
  return {
    maxLimit,
    activeInLastMin: state.timestamps.length,
    queuedCount: state.queue.length,
    isHighDemand: state.timestamps.length >= maxLimit || state.queue.length > 0,
  };
}
