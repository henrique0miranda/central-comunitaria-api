const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class DatabaseConfig {
  constructor() {
    if (!DatabaseConfig.instance) {
      this.dbPath = path.resolve(__dirname, '../../database.sqlite');
      this.db = new sqlite3.Database(this.dbPath, (erro) => {
        if (erro) {
          console.error('Erro ao conectar com o banco de dados:', erro.message);
        } else {
          console.log('Conexão ao banco SQLite estabelecida.');
        }
      });
      DatabaseConfig.instance = this;
    }

    return DatabaseConfig.instance;
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (erro) {
        if (erro) {
          console.error("Error running sql " + sql);
          console.error(erro);
          reject(erro);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (erro, result) => {
        if (erro) {
          console.error("Error: " + sql);
          console.error(erro);
          reject(erro);
        } else {
          resolve(result);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (erro, rows) => {
        if (erro) {
          console.error("Error: " + sql);
          console.error(erro);
          reject(erro);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async initDb() {
    const schemaPath = path.resolve(__dirname, '../../schema.sql');
    const seedPath = path.resolve(__dirname, '../../seed.sql');

    const table = await this.get("SELECT name FROM sqlite_master WHERE type='table' AND name='usuarios'");

    if (!table) {
      console.log('Criando tabelas...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');

      await new Promise((resolve, reject) => {
        this.db.exec(schemaSql, (erro) => {
          if (erro) reject(erro);
          else resolve();
        });
      });

      console.log('Tabelas criadas com sucesso. Executando seed...');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await new Promise((resolve, reject) => {
        this.db.exec(seedSql, (erro) => {
          if (erro) reject(erro);
          else resolve();
        });
      });
      console.log('Seed inicial executada com sucesso.');
    }
  }
}

const instance = new DatabaseConfig();
Object.freeze(instance);

module.exports = instance;
