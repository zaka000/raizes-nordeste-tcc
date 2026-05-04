const userRepository = require('../../infrastructure/repositories/userRepository');
const bcrypt = require('bcrypt');

const userService = {
    register: async (nome, email, senha) => {
        const userExists = await userRepository.findByEmail(email);
        if (userExists) throw new Error('Este e-mail já está cadastrado!');

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(senha, salt);

        return await userRepository.create({ nome, email, senha_hash: hash, perfil: 'CLIENTE' });
    }
};

module.exports = userService;