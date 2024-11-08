import type { TLogicalFilter } from "@/core/types/logical-filter";
import type { TQueryOptions } from "@/core/types/query-options";
import {
	type INotification,
	Notification,
} from "../../enterprise/entities/notification";

export type TNotificationFields = TLogicalFilter<
	INotification,
	"recipientId" | "content"
> & {
	recipientId?: string;
};

export abstract class NotificationsRepository {
	abstract fetchNotifications(
		options: TQueryOptions<TNotificationFields>,
	): Promise<Notification[]>;
	abstract findByFields(
		fields: TNotificationFields,
	): Promise<Notification | null>;
	abstract create(notification: Notification): Promise<void>;
	abstract update(notification: Notification): Promise<void>;
	abstract updateMany(notifications: Notification[]): Promise<void>;
}
