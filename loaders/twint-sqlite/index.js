const { getDb, query } = require('../common/sqlite')

const uselessCharacters = /@[^\s]+\s|https?:\/\/[^\s]+|#\w+\s/g;
const oldRetweetsRegex = /^RT\s/

class TwintSqlite {
	
	/**
	 * 
	 */
	constructor (path, autoConnect = true, autoPopulate = true) {
    this.path = path;

		this.text = []
		this.times = []

    if (autoConnect) {
      this.connect(path);
    }

    if (autoPopulate) {
    	this.populate()
    }
  }

  /**
   * 
   */
  connect (path = this.path) {
  	this.connection = getDb(path);
  }
	
	/**
	 * 
	 */
	populate (verbose = false) {
    // https://github.com/twintproject/twint/blob/e7c8a0c764f6879188e5c21e25fb6f1f856a7221/twint/storage/db.py#L53
		const tweets = query(
      this.connection,
      'SELECT created_at, tweet FROM tweets ORDER BY created_at ASC;',
      {}
    );

		let i = 0
		const singlePercent = Math.floor(tweets.length * 0.01)

		tweets.forEach(row => {
			if (verbose === true && i % singlePercent === 0) {
				console.log((i / tweets.length * 100).toFixed(2) + '%')
			}

			const tweet = row.tweet
				.replace(uselessCharacters, '')
				.replace(oldRetweetsRegex, '')

			const time = new Date(row.created_at * 1000)

			this.text.push(tweet)
			this.times.push(time)
			i += 1
		})

    return this;
  }
}

module.exports = TwintSqlite
