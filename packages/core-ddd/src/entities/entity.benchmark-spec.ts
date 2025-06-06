import { UserEntity } from "@tests/entities/user-entity";
import { UserWithAccessorsDefineProperty } from "@tests/entities/user-with-accessors-define-property";
import { UserWithAccessorsProxy } from "@tests/entities/user-with-accessors-proxy";
import Benchmark from "benchmark";

const TEST_SIZE = 1_000_000;
const DATA = {
	name: "John Doe",
	age: 23,
};
const OTHER_DATA = {
	name: "Jane Doe",
	age: 24,
};

describe("Benchmark Entity Accessors", () => {
	const usersData = Array.from({ length: TEST_SIZE }, () => DATA);

	it("Compare Traditional x DefineProperty x Proxy", (done) => {
		const suite = new Benchmark.Suite();

		suite
			.add("Traditional", () => {
				for (const data of usersData) {
					const entity = UserEntity.create(data);

					entity.name = OTHER_DATA.name;
					entity.age = OTHER_DATA.age;
				}
			})
			.add("DefineProperty", () => {
				for (const data of usersData) {
					const entity = UserWithAccessorsDefineProperty.create(data);

					entity.name = OTHER_DATA.name;
					entity.age = OTHER_DATA.age;
				}
			})
			.add("Proxy", () => {
				for (const data of usersData) {
					const entity = UserWithAccessorsProxy.create(data);

					entity.name = OTHER_DATA.name;
					entity.age = OTHER_DATA.age;
				}
			})
			.on("cycle", (event: Benchmark.Event) => {
				console.log(String(event.target));
			})
			.on("complete", function (this: Benchmark.Suite) {
				console.log(`Fastest is ${this.filter("fastest").map("name")}`);

				done();
			})
			.run({ async: false });
	}, 30_000);
});
