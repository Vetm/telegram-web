# Telegram web
This [WIP] project aims to rebuild Telegram web with a current version of Angular. The [official repo](https://github.com/zhukov/webogram) uses AngularJS 1 which will soon be [discontinued / enter LTS](https://docs.angularjs.org/misc/version-support-status).

## Current features
- Basic Login
- Sending and receiving text messages
- Displaying (most) images
- Emojis

## Missing features / issues
- Performance issues
- Better implementation of mtproto
- Limit api-requests
- i18n
- Basically everything else

## Development
### Prerequisites
- Angular CLI
- Yarn

### Setup
1. Create an app on [https://my.telegram.org](https://my.telegram.org)
2. Add the generated api_id and api_hash to the `src/telegram-api-conf.ts`-file (do not commit these values!)
3. Run `yarn`
4. Run `ng serve`
5. Visit [http://localhost:4200/](http://localhost:4200/) in your browser
