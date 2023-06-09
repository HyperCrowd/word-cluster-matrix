const tf = require('@tensorflow/tfjs-node-gpu');
const fs = require('fs');
const PNG = require('pngjs').PNG;

const imageWidth = 101;  // Specify the desired width of the image
const imageHeight = 101; // Specify the desired height of the image

class CNN {

  /**
   * 
   */
  constructor ({ 
    filters = 16, // Number of feature detectors
    kernelSize = 3, // Field size of pattern detection
    height = imageHeight,
    width = imageWidth,
    channels = 4, // 1 = grayscale, 3 = RGB, 4 = RGBa
    poolSize = 2, // Field size of feature aggregation (max or average)
    strides = 2, // ?
    fullyConnectedLayers = 64,  // Number of fully connected layers
    categories = 0, // Number of categories you want to identify (this is the highest number allowed in the train() method's labels array)
    learningRate = 0.001, // Speed of model adaptivity
    batchSize = 32, // Number of samples used used for each teach training iteration
    epochs = 100 // Number of times to go through the entire training set
  }) {
    this.epochs = epochs
    this.batchSize = batchSize
    this.height = height
    this.width = width
    this.model = tf.sequential();

    // Define the model architecture
    this.model.add(tf.layers.conv2d({
      filters,
      kernelSize,
      activation: 'relu',
      inputShape: [height, width, channels],
    }));

    this.model.add(tf.layers.maxPooling2d({ poolSize, strides }));

    this.model.add(tf.layers.conv2d({
      filters: filters * 4,
      kernelSize,
      activation: 'relu',
      inputShape: [height, width, channels],
    }));

    this.model.add(tf.layers.maxPooling2d({ poolSize, strides }));

    this.model.add(tf.layers.conv2d({
      filters: filters * 3,
      kernelSize,
      activation: 'relu',
      inputShape: [height, width, channels],
    }));

    this.model.add(tf.layers.maxPooling2d({ poolSize, strides }));

    this.model.add(tf.layers.conv2d({
      filters: filters * 4,
      kernelSize,
      activation: 'relu',
      inputShape: [height, width, channels],
    }));

    this.model.add(tf.layers.maxPooling2d({ poolSize, strides }));

    this.model.add(tf.layers.flatten());
    this.model.add(tf.layers.dense({ units: fullyConnectedLayers, activation: 'relu' }));
    this.model.add(tf.layers.dense({ units: categories, activation: 'softmax' }));

    this.model.compile({
      optimizer: tf.train.adam(learningRate),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
  }

  /**
   * 
   */
  async imageToTensor (imagePath) {
    const buffer = fs.readFileSync(imagePath);
    return tf.node.decodeImage(buffer);
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
          result.push(tensor)
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
  async train (imagePathOrTensorList, labels, verbose = false) {
    if (!(imagePathOrTensorList instanceof Array) || !(labels instanceof Array)) {
      throw new RangeError('CNN.train only takes arrays of image paths or image tensor instances')
    }

    if (imagePathOrTensorList.length !== labels.length) {
     throw new RangeError('CNN.train lists must be the same size') 
    }

    const images = await this.getTensor(imagePathOrTensorList)
    const imageTensors = tf.data.array(images);
    const labelTensors = tf.data.array(labels.map(label => tf.tensor1d(label, 'int32')));
    const dataset = tf.data.zip({ xs: imageTensors, ys: labelTensors })

    // Train the model
    await this.model.fitDataset(dataset.batch(this.batchSize), {
      verbose: true,
      epochs: this.epochs,
      batchSize: this.batchSize,
      shuffle: true
    });

    return images
  }

  /**
   * 
   */
  async predict (imagePathOrTensor) {
    const imageTensor = await this.getTensor(imagePathOrTensor)
    const predictions = this.model.predict(imageTensor.expandDims());
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
