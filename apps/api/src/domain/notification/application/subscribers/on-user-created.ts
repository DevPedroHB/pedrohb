import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { UserCreatedEvent } from "@/domain/account/enterprise/events/user-created-event";
import { Injectable } from "@nestjs/common";
import { CreateNotificationUseCase } from "../use-cases/create-notification";

@Injectable()
export class OnUserCreated implements EventHandler {
	constructor(private createNotification: CreateNotificationUseCase) {
		this.setupSubscriptions();
	}

	setupSubscriptions() {
		DomainEvents.register(
			this.sendUserCreatedNotification.bind(this),
			UserCreatedEvent.name,
		);
	}

	private async sendUserCreatedNotification({ user }: UserCreatedEvent) {
		const content = [
			{
				type: "p",
				children: [
					{
						text: `Sua conta foi criada com sucesso, ${user.name}. Explore os recursos disponíveis e ajuste seu perfil.`,
					},
				],
			},
		];

		await this.createNotification.execute({
			title: `Bem-vindo(a) ${user.name}`,
			content: JSON.stringify(content),
			recipientId: user.id.id,
		});
	}
}
