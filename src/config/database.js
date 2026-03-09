const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

/**
 * Padrão Singleton para a Conexão com o Banco de Dados
 * Garante que apenas uma instância do banco exista na aplicação inteira.
 */
class DatabaseConfig {
  constructor() {
    if (!DatabaseConfig.instance) {
      this.dbPath = path.resolve(__dirname, '../../database.sqlite');
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Erro ao conectar com o banco de dados:', err.message);
        } else {
          console.log('Conexão ao banco SQLite estabelecida.');
        }
      });
      DatabaseConfig.instance = this;
    }

    return DatabaseConfig.instance;
  }

  // Helper para executar queries (`run`)
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          console.error("Error running sql " + sql);
          console.error(err);
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  // Helper para executar queries que retornam um elemento (`get`)
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          console.error("Error running sql: " + sql);
          console.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  // Helper para executar queries que retornam múltiplos elementos (`all`)
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.error("Error running sql: " + sql);
          console.error(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Método para inicializar o banco de dados usando o arquivo schema.sql
   * Utilizado internamente ao subir o app se o banco estiver vazio.
   */
  async initDb() {
    const schemaPath = path.resolve(__dirname, '../../schema.sql');
    const seedPath = path.resolve(__dirname, '../../seed.sql');
    
    const checkTable = await this.get("SELECT name FROM sqlite_master WHERE type='table' AND name='usuarios'");
    
    if (!checkTable) {
      console.log('Criando tabelas...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      
      // sqlite3 driver in node doesn't support executing multiple statements via run(). 
      // We must execute them sequentially with db.exec for multiple statements or split them.
      await new Promise((resolve, reject) => {
        this.db.exec(schemaSql, (err) => {
           if(err) reject(err);
           else resolve();
        });
      });

      console.log('Tabelas criadas com sucesso. Executando seed...');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await new Promise((resolve, reject) => {
        this.db.exec(seedSql, (err) => {
           if(err) reject(err);
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
