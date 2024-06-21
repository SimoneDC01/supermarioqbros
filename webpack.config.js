// webpack.config.js
const { watch } = require('fs');
const path = require('path');

module.exports = {
    mode: 'development', // Modalità di sviluppo
    entry: './src/index.js', // Punto di ingresso principale
    output: {
        filename: 'bundle.js', // Nome del file di output
        path: path.resolve(__dirname, 'dist') // Cartella di output
    },
    watch: true, // Abilita la modalità di ascolto
};
