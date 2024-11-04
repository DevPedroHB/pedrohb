import type { TEntityFields } from "@/core/types/entity-fields";
import type { TFetchEntity } from "@/core/types/fetch-entity";
import {
	type INotification,
	Notification,
} from "../../enterprise/entities/notification";

export type TNotificationFields = TEntityFields<
	INotification,
	"recipientId"
> & {
	recipientId?: string;
};

export abstract class NotificationsRepository {
	abstract fetchNotifications(
		options: TFetchEntity<TNotificationFields>,
	): Promise<Notification[]>;
	abstract findByFields(
		fields: TNotificationFields,
	): Promise<Notification | null>;
	abstract create(notification: Notification): Promise<void>;
	abstract update(notification: Notification): Promise<void>;
	abstract updateMany(notifications: Notification[]): Promise<void>;
}
