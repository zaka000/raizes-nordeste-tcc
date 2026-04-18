const unitRepository = require('../../infrastructure/repositories/unitRepository');

const unitController = {
    addUnit: async (req, res) => {
        try {
            const { nome, cidade } = req.body;
            await unitRepository.create(nome, cidade);
            res.status(201).json({ message: "Unidade regional cadastrada!" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    listUnits: async (req, res) => {
        try {
            const units = await unitRepository.findAll();
            res.json(units);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = unitController;