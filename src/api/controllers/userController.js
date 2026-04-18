const userRepository = require('../../infrastructure/repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userController = {
    register: async (req, res) => {
        try {
            const { nome, email, senha } = req.body;
            await userRepository.create(nome, email, senha);
            res.status(201).json({ message: "Usuário criado com sucesso!" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, senha } = req.body;
            const user = await userRepository.findByEmail(email);

            if (!user) {
                return res.status(401).json({ message: "E-mail ou senha incorretos" });
            }

            const senhaValida = await bcrypt.compare(senha, user.senha);
            if (!senhaValida) {
                return res.status(401).json({ message: "E-mail ou senha incorretos" });
            }

            const token = jwt.sign(
                { id: user.id, nome: user.nome }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1d' }
            );

            res.json({ 
                message: "Login realizado!", 
                token: token,
                user: { id: user.id, nome: user.nome }
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = userController;