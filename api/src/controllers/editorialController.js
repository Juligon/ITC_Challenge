const { Editorial } = require("../db");
const { Op } = require("sequelize");

// Función para obtener todas las editoriales
const getAllEditorials = async (req, res, next) => {
	try {
		const editorials = await Editorial.findAll();

		if (editorials.length === 0) {
			const error = new Error("Editorials not found");
			error.status = 404;
			throw error;
		}

		res.json(editorials);
	} catch (error) {
		next(error);
	}
};

// Función para obtener una editorial por su ID
const getEditorialById = async (req, res, next) => {
	const { id } = req.params;

	try {
		const editorial = await Editorial.findByPk(id);

		if (!editorial) {
			const error = new Error("Editorial not found");
			error.status = 404;
			throw error;
		}
		res.json(editorial);
	} catch (error) {
		next(error);
	}
};

// Función para crear una nueva editorial
const createIndividualEditorial = async ({ name, logo }) => {
	const existingEditorial = await Editorial.findOne({
		where: { name: { [Op.iLike]: `%${name}%` } },
	});

	if (existingEditorial) {
		const error = new Error("The editorial already exists");
		error.status = 404;
		throw error;
	}

	const newEditorial = await Editorial.create({
		name: name,
		logo: logo,
	});

	return newEditorial;
};

// Función para crear editoriales a partir de un array
const bulkCreateEditorials = async (editorialsData) => {
	const editorials = await Editorial.bulkCreate(editorialsData);
	return editorials;
};

// Función para crear una nueva editorial o editoriales
const createEditorial = async (req, res, next) => {
	try {
		const requestData = req.body;

		if (Array.isArray(requestData)) {
			const editorials = await bulkCreateEditorials(requestData);
			res.json(editorials);
		} else if (typeof requestData === "object") {
			const newEditorial = await createIndividualEditorial(requestData); 
			res.status(201).json(newEditorial);
		} else {
			const error = new Error(
				"Invalid data format. Request data must be an object or an array."
			);
			error.status = 400;
			throw error;
		}
	} catch (error) {
		next(error);
	}
};

// Función para eliminar una editorial por su ID
const deleteEditorial = async (req, res, next) => {
	const { id } = req.params;
	try {
		const deletedEditorial = await Editorial.destroy({
			where: { id: id },
		});
		if (deletedEditorial === 0) {
			const error = new Error("Editorial not found");
			error.status = 404;
			throw error;
		}
		res.json({ message: "Editorial successfully deleted" });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getAllEditorials,
	getEditorialById,
	createEditorial,
	deleteEditorial
};
