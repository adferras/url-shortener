# URL Shortener

This has been created as an assignment from [freecodecamp](http://www.freecodecamp.com)

This app has been deployed to the following locations:
[Heroku](http://url-shortener-1690.herokuapp.com)

## This app fulfills the following user stories:
I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.
When I visit that shortened URL, it will redirect me to my original link.

## Example Usage:
```
https://url-shortener-1690.herokuapp.com/new/https://www.google.com
```

## Example Output:
{"original_url":"https://www.google.com","short_url":"http://url-shortener-1690.herokuapp.com/123456789"}
