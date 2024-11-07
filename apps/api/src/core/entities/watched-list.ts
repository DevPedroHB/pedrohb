export abstract class WatchedList<T> {
	private currentItems: Set<T>;
	private initial: Set<T>;
	private new: Set<T>;
	private removed: Set<T>;

	constructor(initialItems?: T[]) {
		this.currentItems = new Set(initialItems || []);
		this.initial = new Set(initialItems || []);
		this.new = new Set();
		this.removed = new Set();
	}

	abstract compareItems(a: T, b: T): boolean;

	public getItems(): T[] {
		return Array.from(this.currentItems);
	}

	public getNewItems(): T[] {
		return Array.from(this.new);
	}

	public getRemovedItems(): T[] {
		return Array.from(this.removed);
	}

	private findInSet(set: Set<T>, item: T): boolean {
		for (const v of set) {
			if (this.compareItems(item, v)) {
				return true;
			}
		}

		return false;
	}

	private removeFromSet(set: Set<T>, item: T): void {
		for (const v of set) {
			if (this.compareItems(item, v)) {
				set.delete(v);

				break;
			}
		}
	}

	public exists(item: T): boolean {
		return this.findInSet(this.currentItems, item);
	}

	public add(item: T): void {
		if (this.findInSet(this.removed, item)) {
			this.removeFromSet(this.removed, item);
		}

		if (
			!this.findInSet(this.new, item) &&
			!this.findInSet(this.initial, item)
		) {
			this.new.add(item);
		}

		if (!this.findInSet(this.currentItems, item)) {
			this.currentItems.add(item);
		}
	}

	public remove(item: T): void {
		this.removeFromSet(this.currentItems, item);

		if (this.findInSet(this.new, item)) {
			this.removeFromSet(this.new, item);

			return;
		}

		if (!this.findInSet(this.removed, item)) {
			this.removed.add(item);
		}
	}

	public update(items: T[]): void {
		const newItems = items.filter((a) => {
			return !Array.from(this.currentItems).some((b) =>
				this.compareItems(a, b),
			);
		});

		const removedItems = Array.from(this.currentItems).filter((a) => {
			return !items.some((b) => this.compareItems(a, b));
		});

		this.currentItems = new Set(items);
		this.new = new Set(newItems);
		this.removed = new Set(removedItems);
	}
}
