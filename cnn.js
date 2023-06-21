const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const PNG = require('pngjs').PNG;

const imageWidth = 101;  // Specify the desired width of the image
const imageHeight = 101; // Specify the desired height of the image

class CNN {

  /**
   * 
   */
  constructor ({ 
    filters = 32, // Number of feature detectors
    kernelSize = 3, // Field size of pattern detection
    height = imageHeight,
    width = imageWidth,
    channels = 1, // 1 = grayscale, 3 = RGB, 4 = RGBa
    poolSize = 2, // Field size of feature aggregation (max or average)
    fullyConnectedLayers = 64,  // Number of fully connected layers
    categories = 0, // Number of categories you want to identify (this is the highest number allowed in the train() method's labels array)
    learningRate = 0.001, // Speed of model adaptivity
    batchSize = 32, // Number of samples used used for each teach training iteration
    epochs = 10 // Number of times to go through the entire training set
  }) {
    this.model = tf.sequential();
    this.epochs = epochs
    this.batchSize = batchSize

    // Define the model architecture
    this.model.add(tf.layers.conv2d({
      filters,
      kernelSize,
      activation: 'relu',
      inputShape: [height, width, channels]
    }));

    this.model.add(tf.layers.maxPooling2d({ poolSize }));
    this.model.add(tf.layers.flatten());
    this.model.add(tf.layers.dense({ units: fullyConnectedLayers, activation: 'relu' }));
    this.model.add(tf.layers.dense({ units: categories, activation: 'softmax' }));

    // Define the training parameters
    const optimizer = tf.train.adam(learningRate);

    this.model.compile({
      optimizer: optimizer,
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
  }

  /**
   * 
   */
  async imageToTensor (imagePath) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(imagePath)
          .pipe(new PNG())
          .on('parsed', function () {
            const imageData = new Uint8Array(this.width * this.height * 4);
            for (let y = 0; y < this.height; y++) {
              for (let x = 0; x < this.width; x++) {
                const idx = (this.width * y + x) << 2;
                imageData[idx] = this.data[idx];         // Red channel
                imageData[idx + 1] = this.data[idx + 1]; // Green channel
                imageData[idx + 2] = this.data[idx + 2]; // Blue channel
                imageData[idx + 3] = this.data[idx + 3]; // Alpha channel
              }
            }
            const tensor = tf.tensor3d(imageData, [this.height, this.width, 4], 'int32');
            // @CONFIRM: Preprocess the image if needed (e.g., normalize pixel values)
            resolve(tensor);
          })
          .on('error', function (err) {
            reject(err);
          }
        );
      }
    );
  }

  /**
   * 
   */
  async getTensor(imagePathOrTensor) {
    if (typeof imagePathOrTensor === 'string') {
      return this.imageToTensor(imagePathOrTensor)
    } else if (imagePathOrTensor instanceof Array) {
      const result = []

      for (const item of imagePathOrTensor) {
        const tensor = await this.getTensor(item)

        if (tensor instanceof Array) {
          tensor.map(item => result.push(item))
        } else {
          result.push(item)
        }
      }

      return result
    } else {
      return imagePathOrTensor
    }
  }

  /**
   * The highest number in the labels array should be the constructor's { categorizes } value - 1
   */
  async train (imagePathOrTensorList, labels) {
    if (!(imagePathOrTensorList instanceof Array) || !(labels instanceof Array)) {
      throw new RangeError('CNN.train only takes arrays of image paths or image tensor instances')
    }

    if (imagePathOrTensorList.length !== labels.length) {
     throw new RangeError('CNN.train lists must be the same size') 
    }

    const imageTensors = await this.getTensor(imagePathOrTensorList)

    // Create a training dataset
    const trainData = tf.data.array(imagePathOrTensorList).map((imageTensor, id) => {
      const labelTensor = tf.tensor1d([labels[id]]);
      return { xs: imageTensor, ys: labelTensor };
    });

    // Train the model
    await this.model.fitDataset(trainData, {
      epochs: this.epochs,
      batchSize: this.batchSize,
    });
  }

  /**
   * 
   */
  async predict (imagePathOrTensor) {
    const imageTensor = await this.getTensor(imagePathOrTensor)
    const predictions = this.model.predict(imageTensor);
    return predictions
  }

  /**
   * 
   */
  async visualize (imagePathOrTensor) {
    const imageTensor = await this.getTensor(imagePathOrTensor)
    const pixelArray = await imageTensor.array();
    return pixelArray
  }
}

module.exports = CNN
