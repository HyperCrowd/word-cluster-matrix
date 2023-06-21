const CNN = require('../cnn');

async function main() {
	const trainingData = {
		'images/2010.elonmusk.png': [0],
		'images/2011.elonmusk.png': [1],
		'images/2012.elonmusk.png': [2],
		'images/2013.elonmusk.png': [3],
		'images/2014.elonmusk.png': [4],
		'images/2015.elonmusk.png': [5],
		'images/2016.elonmusk.png': [6],
		'images/2017.elonmusk.png': [7],
		'images/2018.elonmusk.png': [8],
		'images/2019.elonmusk.png': [9],
		'images/2020.elonmusk.png': [10],
		'images/2021.elonmusk.png': [11],
		'images/2022.elonmusk.png': [12],
		'images/2023.elonmusk.png': [13],
	}

	const labels = Object.values(trainingData)

	const cnn = new CNN({
		categories: Math.max(...labels)
	})

	const images = await cnn.train(Object.keys(trainingData), labels)
	const predictions = await cnn.predict(images[1])
	const closest = predictions.argMax().dataSync()[0]
	console.log(closest)
}

main();
