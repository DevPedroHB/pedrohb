import slugify from "slugify";
import { ValueObject } from "./value-object.js";

export type SlugProps = {
	slug: string;
};

export class Slug extends ValueObject<SlugProps> {
	private constructor(props: SlugProps) {
		super(props);
	}

	public get slug() {
		return this.props.slug;
	}

	public toJSON() {
		return {
			slug: this.slug,
		};
	}

	public static slugify(
		string: string,
		options:
			| {
					replacement?: string;
					remove?: RegExp;
					lower?: boolean;
					strict?: boolean;
					locale?: string;
					trim?: boolean;
			  }
			| string = {
			lower: true,
			strict: true,
			trim: true,
		},
	) {
		return slugify(string, options);
	}

	public static create(slug: string) {
		return new Slug({
			slug: Slug.slugify(slug),
		});
	}
}
