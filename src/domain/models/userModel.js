class User {
    constructor(nome, email, senha_hash, perfil = 'CLIENTE') {
        this.nome = nome;
        this.email = email;
        this.senha_hash = senha_hash;
        this.perfil = perfil;
    }
}

module.exports = User;