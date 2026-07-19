export class EntityList {
	entitiesList = [];

	add = (EntityClass, ...args) => {
		this.entitiesList.push(new EntityClass(...args, this));
	};

	// Either use arrow function as i keeps the 'this' reference of parent always and doesnt have own 'this'
	// Or use normal function and use this.removeEntity.bind(this)

	// remove = (entity) => {
	// 	this.entitiesList = this.entitiesList.filter(
	// 		(thisEntity) => thisEntity !== entity
	// 	);
	// };
	remove = (entity) => {

		const index = this.entitiesList.indexOf(entity);
		if (index !== -1) {
			this.entitiesList.splice(index, 1);
		}

	};

	update = (time, camera) => {
		for (const entity of this.entitiesList) {
			entity.update(time, camera);
		}
	};

	draw = (context, camera) => {
		// this.entitiesList.map((entity) => entity.draw(context, camera));
		for (const entity of this.entitiesList) {
			entity.draw(context, camera);
		}
	};
}
