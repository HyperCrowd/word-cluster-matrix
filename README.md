# Word Cluster Matrix

[An important premise of psychosecurity](https://github.com/PsySecGroup/foundation) is the idea that publicly-detectable word usage can be used as events to infer when people are influenced by state actors, egregores, trends, cults, AIs, and advertising campaigns.  The Word Cluster Matrix uses [math.js](https://mathjs.org/docs/datatypes/matrices.html) to generate matrixes of the following properties:

* X is time percentage.  
  * Messages need to be associated with a date of creation and should be absolute units of time (Such as UNIX milliseconds).
  * They sequence of time can be repeating and unordered as long as their index corresponds to the index of the message the time is representing.
  * Each X of the matrix, from left to right, is a percentage of time between the lowest and highest times.
  * There are 100 X pixels.
* Y is the cluster volume percentage.
  * The words within messages are extracted to their singular form and then their uniqueness is counted.
  * Words with near similar frequency distributions are considered a cluster
  * The index of the message should be identical to the timestamp of when that message appeared.
  * Each Y of the matrix, from top to bottom, is a percentage of cluster volume between the smallest and the largest cluster volumes.
  * There are 100 Y pixels
* Each X and Y intersection represents a cluster point
  * The brightness of the cluster point corresponds to its proximity to the largest value in the matrix.
  * The darkness of a cluster point corresponds to its distance from the largestvalue in the matrix

The following image highlights these points:

![images/example.png](images/example.png)

Upon examining this image, we see:

* Spattering of low frequency word clustering throughout the message timeline
* Complete emptiness of average frequency word clustering
* Extreme intensity and reuse of high frequency word clustering throughout the entire message timeline

A signature like this means someone is operating like a message bot using dynamic string replacement!

[Please see the tests](tests/wordspace.js) for an example of how to use this package.

I'll be trying to get this package into ML/AI pipelines via [GPU.js](https://gpu.rocks/#/) soon!