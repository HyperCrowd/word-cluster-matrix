const CNN = require('../cnn');

async function main() {
	const trainingData = {
		'images/2010.elonmusk.png': [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		'images/2011.elonmusk.png': [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		'images/2012.elonmusk.png': [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		'images/2013.elonmusk.png': [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		'images/2014.elonmusk.png': [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		'images/2015.elonmusk.png': [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
		'images/2016.elonmusk.png': [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
		'images/2017.elonmusk.png': [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
		'images/2018.elonmusk.png': [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
		'images/2019.elonmusk.png': [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
		'images/2020.elonmusk.png': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
		'images/2021.elonmusk.png': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
		'images/2022.elonmusk.png': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
		'images/2023.elonmusk.png': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	}

	const filepaths = Object.keys(trainingData)
	const labels = Object.values(trainingData)

	const cnn = new CNN({
		categories: trainingData[filepaths[0]].length
	})

	const images = await cnn.train(filepaths, labels)
	const index = 5
	const predictions = await cnn.predict(images[index])
	const confidence = predictions.arraySync()[0]
	const maxConfidence  =Math.max(...confidence) 
	console.log(`We are ${(maxConfidence * 100).toFixed(2)}% confident that the image at image index ${index} is at confidence index ${confidence.indexOf(maxConfidence)}`)
}

main();
