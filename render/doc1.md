To listen to messages that [your app has access to receive](https://api.slack.com/messaging/retrieving#permissions), you can use the `message()` method which filters out events that aren’t of type `message`.

`message()` accepts an optional `pattern` parameter of type `string` or `RegExp` object which filters out any messages that don’t match the pattern.

```javascript
// This will match any message that contains 👋
app.message(':wave:', async ({ message, say }) => {
  await say(`Hello, <@${message.user}>`);
});
```
