# Word Cluster Matrix

An important premise of psychosecurity is the idea that publicly-detectable word usage is an important means of measuring how and when people are influenced by state actors, egregores, trends, and advertising campaigns.  The Word Cluster Matrix uses math.js to generate matrixes of the following properties:

* X is time percentage.  
  * Messages need to be associated with a date of creation and should be absolute units of time (Such as UNIX milliseconds).
  * They sequence of time can be repeating and unordered as long as their index corresponds to the index of the message the time is representing.
  * Each X of the matrix, from left to right, is a percentage of time between the lowest and highest times.
  * There are 100 x pixels.
* Y is the cluster volume percentage.
  * The words within messages are extracted to their singular form and then their uniqueness is counted.
  * Words with near similar frequency distributions are considered a cluster
  * The index of the message should be identical to the timestamp of when that message appeared.
  * Each Y of the matrix, from top to bottom, is a percentage of cluster volume between the smallest and the largest cluster volumes.
* Each X and Y intersection represents a cluster point
  * The brightness of the cluster point corresponds to its proximity to the largest value in the matrix.
  * The darkness of a cluster point corresponds to its distance from the largestvalue in the matrix

The following image highlights these points:

![images/example.png]

[Please see the tests](tests/wordspace.js) for an example of how to use this package.