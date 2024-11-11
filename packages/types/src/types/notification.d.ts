export interface Notification {
	id: string;
	title: string;
	content: JSON;
	readAt?: Date | null;
	createdAt: Date;
	recipientId: string;
}
