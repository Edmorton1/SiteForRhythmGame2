#!/usr/bin/env node
const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();

program.name('cli').description('CLI for generate').version('1.0.0');

program
	.command('generate')
	.description('Create microservice')
	.command('microservice <filename>')
	// .option('-d, --dir <directory>', 'Папка назначения', '.')
	.action(filename => {
		console.log(filename);
		// const targetDir = path.resolve(options.dir);
		const targetDir = path.resolve('.');
		const filePath = path.join(targetDir, filename);

		fs.mkdirSync('asd');
		// fs.writeFileSync(filePath, filename);
		console.log(`Создан файл: ${filePath}`);
	});

program.parse();
