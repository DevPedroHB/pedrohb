import type { TimestampedEntityProps } from "#/entities/timestamped-entity.js";

export function createTimestamps(now = new Date()): TimestampedEntityProps {
	return {
		createdAt: now,
		updatedAt: now,
	};
}
