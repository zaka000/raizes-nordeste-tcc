const userRepository = require('../../infrastructure/repositories/userRepository');
const bcrypt = require('bcrypt');

const userService = {
    register: async (nome, email, senha) => {
        // Verifica se o email já existe
        const userExists = await userRepository.findByEmail(email);
        if (userExists) throw new Error('Este e-mail já está cadastrado!');

        // Criptografa a senha (Segurança exigida no TCC)
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(senha, salt);

        // Salva no banco
        return await userRepository.create({ nome, email, senha_hash: hash, perfil: 'CLIENTE' });
    }
};

module.exports = userService;