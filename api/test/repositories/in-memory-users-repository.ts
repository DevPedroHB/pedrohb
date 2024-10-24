import { IPagination } from "@/core/types/pagination";
import { UsersRepository, type IUserFields } from "@/domain/account/application/repositories/users-repository";
import { User } from "@/domain/account/enterprise/entities/user";

export class InMemoryUsersRepository implements UsersRepository {
	public items: User[] = [];

	async fetchUsers({ page, perPage }: IPagination) {
		const items = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * perPage, page * perPage);

		return items;
	}

  async findByFields(fields: IUserFields) {
    return this.items.find((item) => {
      return Object.entries(fields).every(([key, value]) => {
        return item[key as keyof IUserFields] === value;
      });
    }) || null;
  }


	async create(user: User) {
		this.items.push(user);
	}

	async update(user: User) {
		const index = this.items.findIndex((item) => item.id.id === user.id.id);

		this.items[index] = user;
	}

	async delete(user: User) {
		const index = this.items.findIndex((item) => item.id.id === user.id.id);

		this.items.splice(index, 1);
	}
}
