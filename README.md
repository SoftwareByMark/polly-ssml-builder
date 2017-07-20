# Polly SSML Builder

A utility for building valid SSML for use with Amazon Web Services [Lex](https://aws.amazon.com/lex/) and [Polly](https://aws.amazon.com/polly/) services.

Amazon Lex & Polly support a subset of the SSML markup tags as defined by [Speech Synthesis Markup Language (SSML) Version 1.1, W3C Recommendation](https://www.w3.org/TR/2010/REC-speech-synthesis11-20100907/).

Using a [Builder Pattern](https://en.wikipedia.org/wiki/Builder_pattern), the SsmlBuilder class allows you to programmatically build up a valid SSML string.


## Install

```
npm install polly-ssml-builder
```

### Usage

Start by requiring the library.

```javascript
const SsmlBuilder = require("polly-ssml-builder");
```

Then, for each SSML String you want to create, do the following:

* create a new SsmlBuilder
* call methods to speak text
* build the String result

```javascript
let replyBuilder = new SsmlBuilder();
let ssml = replyBuilder.speak("Don't tell anyone, but ")
    .whisper("I see dead people.")
    .build();
```

This produces the following String:

```text
<speak>Don't tell anyone, but <amazon:effect name="whispered">I see dead people.</amazon:effect></speak>
```

All options are available as constants on the SsmlBuilder class.  For example:

```javascript
let replyBuilder = new SsmlBuilder();
let ssml = replyBuilder.speakPhonetically("pecan", SsmlBuilder.ALPHABET_IPA, "pɪˈkɑːn")
    .build();
```

SsmlBuilder.ALPHABET_IPA specifies the "ipa" language.

### Break

To add a break (pause) into the speech, call addBreak().

```javascript
let replyBuilder = new SsmlBuilder();
let ssml = replyBuilder.speak("Legen - wait for it.")
    .addBreak(SsmlBuilder.BREAK_STRONG)
    .speak("dary")
    .build();
```

The duration parameter can be on of the following:

* The number of seconds specified as "10s" for 10 seconds 
* The number of milliseconds specified as "500ms" for 500 milliseconds
* One of the BREAK_* constants 

### Speak with Volume

To change the volume of speech, call speakWithVolume().

```javascript
let replyBuilder = new SsmlBuilder();
let ssml = replyBuilder.speakWithVolume("I'm shouting!", SsmlBuilder.VOLUME_XTRA_LOUD)
    .build();
```

The volume parameter can be on of the following:

* An increase in volume as "+5dB" will increase the volume by 5 decibels
* A decrease in volume as "-3dB" will decrease the volume by 3 decibels
* One of the VOLUME_* constants 

### Speak with Pitch

To change the pitch of speech, call speakWithPitch().

```javascript
let replyBuilder = new SsmlBuilder();
let ssml = replyBuilder.speakWithPitch("I'm speaking with a high voice!", SsmlBuilder.PITCH_HIGH)
    .build();
```

The pitch parameter can be on of the following:

* A percent increase in pitch as "+7%" will increase the pitch by 7 percent
* A percent decrease in pitch as "-5%" will decrease the pitch by 5 percent
* One of the PITCHE_* constants 

### Paragraphs

Paragraphs can be spoken with one method call:

```javascript
let replyBuilder = new SsmlBuilder();
let ssml = replyBuilder.speakWithParagraph("The quick brown fox jumped over the lazy dog.  It is a sentence that contains all the letters of the alphabet.")
    .build();
```

Or with multiple methods calls:

```javascript
let replyBuilder = new SsmlBuilder();
let ssml = replyBuilder.startParagraph()
    .speak("The quick brown fox jumped over the lazy dog.  ")
    .speak("It is a sentence that contains all the letters of the alphabet.")
    .endParagraph()
    .build();
```

Both of these options produce the same result.

If you forget to call endParagraph() before you build(), an Error will be thrown.

### Sentences

Sentences work similar to paragraphs - they can be spoken with one method call, or multiple method calls.

### Languages

Speaking in a language works similar to paragraphs - it can be spoken with one method call, or multiple method calls.

The language parameter is not defined by a constant.  This is to allow new languages to be added by Amazon Web Services
without the need to update this utility.  A warning will be logged if a language is not recognised.

See SUPPORTED_LANGUAGES array for a list of currently supported languages.

### Supported Tags

For a full list of supported SSML tags, see [SSML Tags in Amazon Polly](http://docs.aws.amazon.com/polly/latest/dg/supported-ssml.html)

All tags listed as of July 2017 are supported by this builder.

## Authors

* **Mark Borner** - *Initial work* - [Software By Mark](https://github.com/softwarebymark)

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE.txt](LICENSE.txt) file for details

