export abstract class ValueObject<T> {
	protected readonly _props: T;

	protected constructor(props: T) {
		this._props = Object.freeze(props);
	}

	get props(): T {
		return this._props;
	}

	public equals(vo?: ValueObject<T>): boolean {
		if (!vo || !(vo instanceof ValueObject)) {
			return false;
		}

		return this.isEqual(vo.props, this.props);
	}

	private isEqual(obj1: T, obj2: T): boolean {
		if (obj1 === obj2) {
			return true;
		}

		if (
			typeof obj1 !== "object" ||
			typeof obj2 !== "object" ||
			obj1 === null ||
			obj2 === null
		) {
			return false;
		}

		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);

		if (keys1.length !== keys2.length) {
			return false;
		}

		for (const key of keys1) {
			if (
				!keys2.includes(key) ||
				!this.isEqual((obj1 as any)[key], (obj2 as any)[key])
			) {
				return false;
			}
		}

		return true;
	}
}
