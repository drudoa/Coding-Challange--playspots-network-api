This is an entry for a code challage issued by [PlaySports Network](https://www.playsportsnetwork.com/)

# Getting started

## Installation

Clone this repo and enter its directory. \
You must provide the following environment variables file `.env` file or otherwise, before running this project.\
A Google APi key can be obtained by creating a new **credential** from your [Google Console](https://console.cloud.google.com/apis/credentials) \
You can optionaly restrict your new API key to only have access to `YouTube Data API v3`

**Important!** Your Goolge project you created an API key in **MUST** have a quota allocation for `YouTube Data API v3` in order to work. \
You can check your project quota's [here.](https://console.cloud.google.com/iam-admin/quotas?project)

Environment Variables:

```
YOUTUBE_API_KEY = <Google API key>
MYSQL_HOST = <ip address / dns address>
MYSQL_USER = <db username>
MYSQL_PASSWORD = <db password>
```

Now run:

```
npm install
npm start
```

## How to use

Now that the project is running you need to populate the database, this can be done by issuing a `GET` request to

```
<host-name>:3000/api/videos/populate
```

**Note** this may take a few minutes depening on how many videos are available. \
**Important!** this operation will clear the database every time it is run.

Get all stored videos (limited to 100 per page) with

```
<host-name>:3000/api/videos/<options-page-number>
```

You can also search for videos by title by issues a POST request to the same route above with a JSON body of:

```
{
  "searchTerm": "some search keywords"
}
```

Get or Delete a video by its id with GET and POST methods respectively

```
<host-name>:3000/api/video/<id>
```

# Original challenge

## Overview

Hey, Thank you very much for attempting our code test. We appreciate the time and effort
you are going to put into it. Hopefully you’ll find it interesting. Let’s go into it.
Below is a series of coding tasks which require you to write a RESTful API to perform
storage, deletion and search functionality.
Use any framework you feel comfortable with to provide a small project package for your
solution. Please include a readme file containing instructions for us to run your code!
It is encouraged to use version control and commit as you go.
There is no set time limit for this exercise, we understand not everyone is familiar with the
YouTube API and this is not a typing speed test. Having said that we recommend to try not
spend more than 2 hours on it.

Tasks:

1. 1. Expose an API endpoint, that when hit will store youtube video **titles** and **publishedAt**
      dates for the GlobalCyclingNetwork and globalmtb YouTube channels to a database[1]. We
      only want to store videos that match the filter criteria[2].
      The above must be done using the Youtube data API v3. An API key has been provided
      for you to use:


      1. **Storage** of information must use the provided SQL database structure (**youtube.sql**).
      2. We are only interested in storing videos with titles that match the filter criteria. The
         criteria **must** be read from the provided file (**search_filter**). Filtering should be case
         insensitive. How you implement this filter is up to you.

    1. Expose an API endpoint that will fetch the results from 1.i.

2. Expose an API endpoint which queries the searched data from 1 by ID.
3. Expose an API endpoint which removes an ID from the data store.
4. Expose an API endpoint that, when provided with a search term, returns a list of matching
   results for given search term from the information stored in task 1. The item(s) returned
   should contain the title and id only

## Rules

- You must use the database file provided to store data.
- You **may** modify the tables constraints but not the fields. All the appropriate fields are
  included, so you should not need to add or remove any.
- You must use validation where appropriate.

## Deliverables

- Project containing the source code for the above solution.
- We’re looking for a REST API that can be called from the browser or other tool (such
  as postman) and return the expected data in JSON form.
- Any instructions required to get the project running.
  Have fun and good luck!
