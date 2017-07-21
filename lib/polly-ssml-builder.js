// Copyright 2017 Mark Borner
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const StringBuilder = require('string-builder');
const isString = require("lodash.isstring");

exports = module.exports = PollySsmlBuilder;

/**
 * Creates a new PollySsmlBuilder
 *
 * @constructor
 */
function PollySsmlBuilder() {

    this.stringBuilder = undefined;
    this.languageStarted = false;
    this.paragraphStarted = false;
    this.sentenceStarted = false;

    this.reset();

    Object.defineProperty(this, "BREAK_NONE", { value: "none", writable: false });
    Object.defineProperty(this, "BREAK_XTRA_WEAK", { value: "x-weak", writable: false });
    Object.defineProperty(this, "BREAK_WEAK", { value: "weak", writable: false });
    Object.defineProperty(this, "BREAK_MEDIUM", { value: "medium", writable: false });
    Object.defineProperty(this, "BREAK_STRONG", { value: "strong", writable: false });
    Object.defineProperty(this, "BREAK_XTRA_STRONG", { value: "x-strong", writable: false });
    Object.defineProperty(this, "BREAK_STRENGTHS", { value: [
        this.BREAK_NONE,
        this.BREAK_XTRA_WEAK,
        this.BREAK_WEAK,
        this.BREAK_MEDIUM,
        this.BREAK_STRONG,
        this.BREAK_XTRA_STRONG
    ], writable: false });

    Object.defineProperty(this, "SUPPORTED_LANGUAGES", { value: [
        'da-DK',
        'nl-NL',
        'en-AU',
        'en-GB',
        'en-IN',
        'en-US',
        'en-GB-WLS',
        'fr-FR',
        'fr-CA',
        'de-DE',
        'is-IS',
        'it-IT',
        'ja-JP',
        'nb-NO',
        'pl-PL',
        'pt-BR',
        'pt-PT',
        'ro-RO',
        'ru-RU',
        'es-ES',
        'es-US',
        'sv-SE',
        'tr-TR',
        'cy-GB'
    ], writable: false });

    Object.defineProperty(this, "ALPHABET_IPA", { value: "ipa", writable: false });
    Object.defineProperty(this, "ALPHABET_XSAMPA", { value: "x-sampa", writable: false });
    Object.defineProperty(this, "ALPHABETS", { value: [
        this.ALPHABET_IPA,
        this.ALPHABET_XSAMPA
    ], writable: false });

    Object.defineProperty(this, "VOLUME_DEFAULT", { value: "default", writable: false });
    Object.defineProperty(this, "VOLUME_SILENT", { value: "silent", writable: false });
    Object.defineProperty(this, "VOLUME_XTRA_SOFT", { value: "x-soft", writable: false });
    Object.defineProperty(this, "VOLUME_SOFT", { value: "soft", writable: false });
    Object.defineProperty(this, "VOLUME_MEDIUM", { value: "medium", writable: false });
    Object.defineProperty(this, "VOLUME_LOUD", { value: "loud", writable: false });
    Object.defineProperty(this, "VOLUME_XTRA_LOUD", { value: "x-loud", writable: false });
    Object.defineProperty(this, "VOLUMES", { value: [
        this.VOLUME_DEFAULT,
        this.VOLUME_SILENT,
        this.VOLUME_XTRA_SOFT,
        this.VOLUME_SOFT,
        this.VOLUME_MEDIUM,
        this.VOLUME_LOUD,
        this.VOLUME_XTRA_LOUD
    ], writable: false });

    Object.defineProperty(this, "RATE_XTRA_SLOW", { value: "x-slow", writable: false });
    Object.defineProperty(this, "RATE_SLOW", { value: "slow", writable: false });
    Object.defineProperty(this, "RATE_MEDIUM", { value: "medium", writable: false });
    Object.defineProperty(this, "RATE_FAST", { value: "fast", writable: false });
    Object.defineProperty(this, "RATE_XTRA_FAST", { value: "x-fast", writable: false });
    Object.defineProperty(this, "RATES", { value: [
        this.RATE_XTRA_SLOW,
        this.RATE_SLOW,
        this.RATE_MEDIUM,
        this.RATE_FAST,
        this.RATE_XTRA_FAST
    ], writable: false });

    Object.defineProperty(this, "PITCH_DEFAULT", { value: "default", writable: false });
    Object.defineProperty(this, "PITCH_XTRA_LOW", { value: "x-low", writable: false });
    Object.defineProperty(this, "PITCH_LOW", { value: "low", writable: false });
    Object.defineProperty(this, "PITCH_MEDIUM", { value: "medium", writable: false });
    Object.defineProperty(this, "PITCH_HIGH", { value: "high", writable: false });
    Object.defineProperty(this, "PITCH_XTRA_HIGH", { value: "x-high", writable: false });
    Object.defineProperty(this, "PITCHES", { value: [
        this.PITCH_DEFAULT,
        this.PITCH_XTRA_LOW,
        this.PITCH_LOW,
        this.PITCH_MEDIUM,
        this.PITCH_HIGH,
        this.PITCH_XTRA_HIGH
    ], writable: false });

    Object.defineProperty(this, "INTERPRET_AS_CHARACTER", { value: "character", writable: false });
    Object.defineProperty(this, "INTERPRET_AS_SPELL_OUT", { value: "spell-out", writable: false });
    Object.defineProperty(this, "INTERPRET_AS_CARDINAL", { value: "cardinal", writable: false });
    Object.defineProperty(this, "INTERPRET_AS_NUMBER", { value: "number", writable: false });
    Object.defineProperty(this, "INTERPRET_AS_ORDINAL", { value: "ordinal", writable: false });
    Object.defineProperty(this, "INTERPRET_AS_DIGITS", { value: "digits", writable: false });
    Object.defineProperty(this, "INTERPRET_AS_FRACTION", { value: "fraction", writable: false });
    Object.defineProperty(this, "INTERPRET_AS_UNIT", { value: "unit", writable: false });
    Object.defineProperty(this, "INTERPRET_AS_DATE", { value: "date", writable: false });
    Object.defineProperty(this, "INTERPRET_AS_TIME", { value: "time", writable: false });
    Object.defineProperty(this, "INTERPRET_AS_ADDRESS", { value: "address", writable: false });
    Object.defineProperty(this, "INTERPRET_AS_EXPLETIVE", { value: "expletive", writable: false });
    Object.defineProperty(this, "INTERPRET_AS_TELEPHONE", { value: "telephone", writable: false });
    Object.defineProperty(this, "INTERPRET_AS_VALUES", { value: [
        this.INTERPRET_AS_CHARACTER,
        this.INTERPRET_AS_SPELL_OUT,
        this.INTERPRET_AS_CARDINAL,
        this.INTERPRET_AS_NUMBER,
        this.INTERPRET_AS_ORDINAL,
        this.INTERPRET_AS_DIGITS,
        this.INTERPRET_AS_FRACTION,
        this.INTERPRET_AS_UNIT,
        this.INTERPRET_AS_DATE,
        this.INTERPRET_AS_TIME,
        this.INTERPRET_AS_ADDRESS,
        this.INTERPRET_AS_EXPLETIVE,
        this.INTERPRET_AS_TELEPHONE
    ], writable: false });

    Object.defineProperty(this, "DATE_MDY", { value: "mdy", writable: false });
    Object.defineProperty(this, "DATE_DMY", { value: "dmy", writable: false });
    Object.defineProperty(this, "DATE_YMD", { value: "ymd", writable: false });
    Object.defineProperty(this, "DATE_MD", { value: "md", writable: false });
    Object.defineProperty(this, "DATE_DM", { value: "dm", writable: false });
    Object.defineProperty(this, "DATE_YM", { value: "ym", writable: false });
    Object.defineProperty(this, "DATE_MY", { value: "my", writable: false });
    Object.defineProperty(this, "DATE_D", { value: "d", writable: false });
    Object.defineProperty(this, "DATE_M", { value: "m", writable: false });
    Object.defineProperty(this, "DATE_Y", { value: "y", writable: false });
    Object.defineProperty(this, "DATE_YYYYMMDD", { value: "yyyymmdd", writable: false });
    Object.defineProperty(this, "DATE_FORMATS", { value: [
        this.DATE_MDY,
        this.DATE_DMY,
        this.DATE_YMD,
        this.DATE_MD,
        this.DATE_DM,
        this.DATE_YM,
        this.DATE_MY,
        this.DATE_D,
        this.DATE_M,
        this.DATE_Y,
        this.DATE_YYYYMMDD
    ], writable: false });

    Object.defineProperty(this, "ROLE_VERB", { value: "amazon:VB", writable: false });
    Object.defineProperty(this, "ROLE_PAST_TENSE", { value: "amazon:VBD", writable: false });
    Object.defineProperty(this, "ROLE_NON_DEFAULT", { value: "amazon:SENSE_1", writable: false });
    Object.defineProperty(this, "ROLES", { value: [
        this.ROLE_VERB,
        this.ROLE_PAST_TENSE,
        this.ROLE_NON_DEFAULT
    ], writable: false });

    Object.defineProperty(this, "EFFECT_WHISPER", { value: "whispered", writable: false });
    Object.defineProperty(this, "EFFECTS", { value: [
        this.EFFECT_WHISPER
    ], writable: false });

}

/**
 * Speak the given text
 *
 * @param speech The text to speak
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.speak = function(speech) {
    this.stringBuilder.append(speech);
    return this;
};


/**
 * Add a break (pause) into the speach
 *
 * @param duration The duration of the break -  Either milliseconds (ie. 10ms) or seconds (ie. 10s) or one of BREAK_STRENGTHS constants
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.addBreak = function(duration)  {
    if (!isString(duration)) {
        throw new TypeError("Duration should be a string.");
    }
    this.stringBuilder.append('<break ');
    if (duration.endsWith('ms') || duration.endsWith('s')) {
        this.stringBuilder.append("time=\"");
        this.stringBuilder.append(duration);
    } else if (this.BREAK_STRENGTHS.indexOf(duration) === -1) {
        throw new TypeError("Duration should be in milliseconds (ie. 10ms) or seconds (ie. 10s) or one of: " + this.BREAK_STRENGTHS);
    } else {
        this.stringBuilder.append("strength=\"");
        this.stringBuilder.append(duration);
    }
    this.stringBuilder.append("\"/>");
    return this;
};

/**
 * Start speaking in a language
 *
 * @param language the language to start speaking (see SUPPORTED_LANGUAGES)
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.startLanguage = function(language) {
    if (this.languageStarted) {
        throw new Error("You must end a language before you can start another language");
    }
    if (this.SUPPORTED_LANGUAGES.indexOf(language) === -1) {
        console.log("WARNING: ", language, " does not appear to be a supported language by Polly");
    }
    this.stringBuilder.append("<lang xml:lang=\"");
    this.stringBuilder.append(language);
    this.stringBuilder.append("\">");
    this.languageStarted = true;
    return this;
};

/**
 * Stop speaking in a language
 *
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.endLanguage = function() {
    this.stringBuilder.append("</lang>");
    this.languageStarted = false;
    return this;
};

/**
 * Speak the given text as the specified language
 *
 * @param speech The text to speak
 * @param language the language to use (see SUPPORTED_LANGUAGES)
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.speakWithLanguage = function(speech, language) {
    this.startLanguage(language);
    this.speak(speech);
    this.endLanguage();
    return this;
};

/**
 * Add a mark into the SSML
 *
 * @param tagName the name for the mark
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.mark = function(tagName) {
    this.stringBuilder.append("<mark name=\"");
    this.stringBuilder.append(tagName);
    this.stringBuilder.append("\"/>");
    return this;
};

/**
 * Start speaking a paragraph
 *
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.startParagraph = function() {
    if (this.paragraphStarted === true) {
        throw new Error("You must end a paragraph before you can start a new paragraph");
    }
    this.stringBuilder.append("<p>");
    this.paragraphStarted = true;
    return this;
};

/**
 * End speaking a paragraph
 *
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.endParagraph = function() {
    this.stringBuilder.append("</p>");
    this.paragraphStarted = false;
    return this;
};

/**
 * Speak the given text as a paragraph
 *
 * @param speech The text to speak
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.speakWithParagraph = function(speech) {
    this.startParagraph();
    this.speak(speech);
    this.endParagraph();
    return this;
};

/**
 * Speak the given word phonetically
 *
 * @param word The word
 * @param alphabet The phonetic alphabet to use
 * @param pronunciation The pronunciation of the word in the specified alphabet
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.speakPhonetically = function(word, alphabet, pronunciation) {
    if (this.ALPHABETS.indexOf(alphabet) === -1) {
        throw new TypeError("Alphabet is not one of: " + this.ALPHABETS);
    }
    this.stringBuilder.append("<phoneme alphabet=\"");
    this.stringBuilder.append(alphabet);
    this.stringBuilder.append("\" ph=\"");
    this.stringBuilder.append(pronunciation);
    this.stringBuilder.append("\">");
    this.stringBuilder.append(word);
    this.stringBuilder.append("</phoneme>");
    return this;
};

/**
 * Speak the given text with the specified volume
 *
 * @param speech The text to speak
 * @param volume The volume of the speech
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.speakWithVolume = function(speech, volume) {
    this.speakWithProsody(speech, volume, null, null);
    return this;
};

/**
 * Speak the given text with the specified pitch
 *
 * @param speech The text to speak
 * @param pitch The pitch of the speech
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.speakWithPitch = function(speech, pitch) {
    this.speakWithProsody(speech, null, pitch, null);
    return this;
};

/**
 * Speak the given text with the specified rate
 *
 * @param speech The text to speak
 * @param rate The rate of the speech
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.speakWithRate = function(speech, rate) {
    this.speakWithProsody(speech, null, null, rate);
    return this;
};

/**
 * Speak the given text with the specified prosody
 *
 * @param speech The text to speak
 * @param volume The volume of the speech (see VOLUMES)
 * @param pitch The pitch of the speech (see PITCHES)
 * @param rate The rate of the speech (see RATES)
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.speakWithProsody = function(speech, volume, pitch, rate) {
    if (!volume && !pitch && !rate) {
        throw new TypeError("One of volume, pitch or rate must be provided");
    }
    this.stringBuilder.append("<prosody ");
    if (volume) {
        if (this.VOLUMES.indexOf(volume) === -1 && !this.isValidDecibelString(volume)) {
            throw new TypeError("Volume should be an increase/decrease in decibels (ie. -10dB/+3dB) or one of: " + this.VOLUMES);
        } else {
            this.stringBuilder.append("volume=\"");
            this.stringBuilder.append(volume);
            this.stringBuilder.append("\"");
            if (pitch || rate) {
                this.stringBuilder.append(" ");
            }
        }
    }
    if (pitch) {
        if (this.PITCHES.indexOf(pitch) === -1 && !this.isValidPercentString(pitch)) {
            throw new TypeError("Pitch should be a percentile increase/decrease (ie. -3%/+3%) or one of: " + this.PITCHES);
        } else {
            this.stringBuilder.append("pitch=\"");
            this.stringBuilder.append(pitch);
            this.stringBuilder.append("\"");
            if (rate) {
                this.stringBuilder.append(" ");
            }
        }
    }
    if (rate) {
        if (this.RATES.indexOf(rate) === -1 && !this.isValidRateString(rate)) {
            throw new TypeError(this.getRateErrorMessage());
        } else {
            this.stringBuilder.append("rate=\"");
            this.stringBuilder.append(rate);
            this.stringBuilder.append("\"");
        }
    }
    this.stringBuilder.append(">");
    this.stringBuilder.append(speech);
    this.stringBuilder.append("</prosody>");
    return this;
};

/**
 * Start speaking a sentence
 *
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.startSentence = function() {
    if (this.sentenceStarted === true) {
        throw new Error("You must end a sentence before you can start a new sentence");
    }
    this.stringBuilder.append("<s>");
    this.sentenceStarted = true;
    return this;
};

/**
 * Stop speaking a sentence
 *
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.endSentence = function() {
    this.stringBuilder.append("</s>");
    this.sentenceStarted = false;
    return this;
};

/**
 * Speak the given text as a sentence
 *
 * @param sentence The text to speak
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.speakWithSentence = function(sentence) {
    this.startSentence();
    this.speak(sentence);
    this.endSentence();
    return this;
};

/**
 * Speak the given text with the given interpretation
 *
 * @param speach The text to speak
 * @param interpretAs How to interpret the text
 * @param dateFormat Optional date format (required when interpretAs is "date")
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.speakAs = function(speach, interpretAs, dateFormat) {
    this.checkInterpretAsValue(interpretAs);
    if (interpretAs === this.INTERPRET_AS_DATE) {
        if (dateFormat) {
            if (this.DATE_FORMATS.indexOf(dateFormat) === -1) {
                throw new TypeError("Date Format should be one of: " + this.DATE_FORMATS);
            }
        } else {
            throw new TypeError("You must supply a date format");
        }
    }
    this.stringBuilder.append("<say-as interpret-as=\"");
    this.stringBuilder.append(interpretAs);
    if (interpretAs === this.INTERPRET_AS_DATE) {
        this.stringBuilder.append("\" format=\"");
        this.stringBuilder.append(dateFormat);
    }
    this.stringBuilder.append("\">");
    this.stringBuilder.append(speach);
    this.stringBuilder.append("</say-as>");
    return this;
};

/**
 * Speak a word using a substitute word
 *
 * @param word The original text
 * @param substitution The text to actually speak
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.speakWithSubstitute = function (word, substitution) {
    this.stringBuilder.append("<sub alias=\"");
    this.stringBuilder.append(substitution);
    this.stringBuilder.append("\">");
    this.stringBuilder.append(word);
    this.stringBuilder.append("</sub>");
    return this;
};

/**
 * Speak the given word using the given word role
 *
 * @param word The word to speak
 * @param role The word's role (see ROLES)
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.speakWithRole = function (word, role) {
    this.checkRoleValue(role);
    this.stringBuilder.append("<w role=\"");
    this.stringBuilder.append(role);
    this.stringBuilder.append("\">");
    this.stringBuilder.append(word);
    this.stringBuilder.append("</w>");
    return this;
};

/**
 * Whisper the given text
 *
 * @param speech The text to speak
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.whisper = function(speech) {
    this.speakWithEffect(speech, this.EFFECT_WHISPER);
    return this;
};

/**
 * Speak the given text with the given effect
 *
 * @param speech The text to speak
 * @param effect The effect to use (See EFFECTS)
 * @returns {PollySsmlBuilder}
 */
PollySsmlBuilder.prototype.speakWithEffect = function(speech, effect) {
    if (this.EFFECTS.indexOf(effect) === -1) {
        throw new TypeError("Effect must be one of: " + this.EFFECTS);
    }
    this.stringBuilder.append("<amazon:effect name=\"");
    this.stringBuilder.append(effect);
    this.stringBuilder.append("\">");
    this.stringBuilder.append(speech);
    this.stringBuilder.append("</amazon:effect>");
    return this;
};

/**
 * Builds the SSML String
 *
 * @returns {string}
 */
PollySsmlBuilder.prototype.build = function() {
    if (this.languageStarted === true) {
        throw new Error("Language has been started but not ended!");
    }
    if (this.paragraphStarted) {
        throw new Error("Paragraph has been started but not ended!");
    }
    if (this.sentenceStarted) {
        throw new Error("Sentence has been started but not ended!");
    }
    this.stringBuilder.append('</speak>');
    const result = this.stringBuilder.toString();
    this.reset();
    return result;
};

PollySsmlBuilder.prototype.reset = function () {
    this.stringBuilder = new StringBuilder();
    this.stringBuilder.append("<speak>");
};

PollySsmlBuilder.prototype.isValidPercentString = function(pitch) {
    return isString(pitch) &&
        pitch.length > 2 &&
        pitch.endsWith("%") &&
        (pitch.startsWith("-") || pitch.startsWith("+"));
};

PollySsmlBuilder.prototype.isValidDecibelString = function (volume) {
    return isString(volume) &&
        volume.length > 3 &&
        volume.endsWith("dB") &&
        (volume.startsWith("-") || volume.startsWith("+"));
};

PollySsmlBuilder.prototype.isValidRateString = function (rate) {
    return false;
};

PollySsmlBuilder.prototype.getRateErrorMessage = function() {
    return "Rate should be one of: " + this.RATES;
};

PollySsmlBuilder.prototype.checkInterpretAsValue = function(interpretAs) {
    if (this.INTERPRET_AS_VALUES.indexOf(interpretAs) === -1) {
        throw new TypeError("Type should be one of: " + this.INTERPRET_AS_VALUES);
    }
};

PollySsmlBuilder.prototype.checkRoleValue = function (role) {
    if (this.ROLES.indexOf(role) === -1) {
        throw new TypeError("Role must be one of: " + this.ROLES);
    }
};

