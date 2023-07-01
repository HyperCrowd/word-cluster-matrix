/**
 * 
 */
function getWeek(date) {
  // Copy the date object to avoid modifying the original
  const newDate = new Date(date.getTime());

  // Set the date to the first day of the year
  newDate.setMonth(0, 1);

  // Get the day of the week for the first day of the year
  const startDay = newDate.getDay();

  // Adjust the start day to handle week starting on Monday (ISO 8601)
  const adjustedStartDay = startDay > 0 ? startDay - 1 : 6;

  // Calculate the number of days between the date and the adjusted first day
  const diffDays = Math.floor((date - newDate) / (24 * 60 * 60 * 1000));

  // Calculate the week number based on the adjusted start day
  const weekNumber = Math.floor((diffDays + adjustedStartDay) / 7) + 1;

  return weekNumber;
}

class GrammarFieldManager {

  /**
   * 
   */
	constructor (name, sentences = [], times = [], scopes = [GrammarFieldManager.timeScopes.HOURLY]) {
    this.name = name
    this.scopes = scopes
    this.clusters = {}

    for (const scope of Object.keys(GrammarFieldManager.scopes)) {
      clusters[scope] = {}
    }

    for (const scope of Object.keys(this.scopes)) {
      const cluster = clusters[scope]

      for (let i = 0; i < times.length; i++) {
        const time = times[i]
        const newTime = new Date(0)
        newTime.setMilliseconds(time.getMilliseconds())
        newTime.setSeconds(time.getSeconds())
        newTime.setMinutes(time.getMinutes())

        let index

        switch (this.timeScope) {
          case GrammarField.scopes.HOURLY:
            index = time.getHour()
            break;
          case GrammarField.scopes.DAY_OF_WEEK:
            index = time.getDay()
            newTime.setHours(time.setHours())
            break;
          case GrammarField.scopes.DAY_OF_MONTH:
            index = time.getDate()
            newTime.setHours(time.setHours())
            break;
          case GrammarField.scopes.WEEKLY:
            index = getWeek(time)
            newTime.setHours(time.setHours())
            newTime.setDay(time.getDay())
            break;
          case GrammarField.scopes.MONTHLY:
            index = time.getMonth()
            newTime.setHours(time.setHours())
            newTime.getDate(time.setDate())
            break;
          case GrammarField.scopes.YEARLY:
            index = time.getFullYear()
            newTime.setTime(date.getTime())
            break;
        }

        if (cluster[index] === undefined) {
          cluster[index] = {
            sentences: [],
            times: []
          }

          cluster[index].sentences.push(sentences[i])
          cluster[index].times.push(newTime)
        }
      }
    }
	}

  /**
   * 
   */
  toPng (directory = 'images') {
    for (const scope of Object.keys(this.scopes)) {
      const cluster = this.clusters[scope]

      for (const label of Object.keys(cluster)) {
        const field = new GrammarField(cluster[label].sentences, cluster[label].times)
        await field.toPng(`${directory}/${this.name}-${scope}-${label}.png`);  
      }  
    }
  }
}

GrammarFieldManager.scopes = {
  HOURLY: 'hourly',
  DAY_OF_WEEK: 'day_of_week',
  DAY_OF_MONTH: 'day_of_month'
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
}


module.exports = GrammarFieldManager
