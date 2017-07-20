// Copyright 2017 Mark Borner
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//     You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
//     Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
//     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const StringBuilder = require('string-builder');
const isString = require("lodash.isstring");

exports = module.exports = SsmlBuilder;

const BREAK_NONE = "none";
const BREAK_XTRA_WEAK = "x-weak";
const BREAK_WEAK = "weak";
const BREAK_MEDIUM = "medium";
const BREAK_STRONG = "strong";
const BREAK_XTRA_STRONG = "x-strong";

exports.BREAK_NONE = BREAK_NONE;
exports.BREAK_XTRA_WEAK = BREAK_XTRA_WEAK;
exports.BREAK_WEAK = BREAK_WEAK;
exports.BREAK_MEDIUM = BREAK_MEDIUM;
exports.BREAK_STRONG = BREAK_STRONG;
exports.BREAK_XTRA_STRONG = BREAK_XTRA_STRONG;

const BREAK_STRENGTHS = [
    BREAK_NONE,
    BREAK_XTRA_WEAK,
    BREAK_WEAK,
    BREAK_MEDIUM,
    BREAK_STRONG,
    BREAK_XTRA_STRONG
];

const SUPPORTED_LANGUAGES = [
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
];

const ALPHABET_IPA = "ipa";
const ALPHABET_XSAMPA = "x-sampa";

exports.ALPHABET_IPA = ALPHABET_IPA;
exports.ALPHABET_XSAMPA = ALPHABET_XSAMPA;

const ALPHABETS = [
    ALPHABET_IPA,
    ALPHABET_XSAMPA
];

const VOLUME_DEFAULT = "default";
const VOLUME_SILENT = "silent";
const VOLUME_XTRA_SOFT = "x-soft";
const VOLUME_SOFT = "soft";
const VOLUME_MEDIUM = "medium";
const VOLUME_LOUD = "loud";
const VOLUME_XTRA_LOUD = "x-loud";

exports.VOLUME_DEFAULT = VOLUME_DEFAULT;
exports.VOLUME_SILENT = VOLUME_SILENT;
exports.VOLUME_XTRA_SOFT = VOLUME_XTRA_SOFT;
exports.VOLUME_SOFT = VOLUME_SOFT;
exports.VOLUME_MEDIUM = VOLUME_MEDIUM;
exports.VOLUME_LOUD = VOLUME_LOUD;
exports.VOLUME_XTRA_LOUD = VOLUME_XTRA_LOUD;

const VOLUMES = [
    VOLUME_DEFAULT,
    VOLUME_SILENT,
    VOLUME_XTRA_SOFT,
    VOLUME_SOFT,
    VOLUME_MEDIUM,
    VOLUME_LOUD,
    VOLUME_XTRA_LOUD
];

const RATE_XTRA_SLOW = "x-slow";
const RATE_SLOW = "slow";
const RATE_MEDIUM = "medium";
const RATE_FAST = "fast";
const RATE_XTRA_FAST = "x-fast";

exports.RATE_XTRA_SLOW = RATE_XTRA_SLOW;
exports.RATE_SLOW = RATE_SLOW;
exports.RATE_MEDIUM = RATE_MEDIUM;
exports.RATE_FAST = RATE_FAST;
exports.RATE_XTRA_FAST = RATE_XTRA_FAST;

const RATES = [
    RATE_XTRA_SLOW,
    RATE_SLOW,
    RATE_MEDIUM,
    RATE_FAST,
    RATE_XTRA_FAST
];

const PITCH_DEFAULT = "default";
const PITCH_XTRA_LOW = "x-low";
const PITCH_LOW = "low";
const PITCH_MEDIUM = "medium";
const PITCH_HIGH = "high";
const PITCH_XTRA_HIGH = "x-high";

exports.PITCH_DEFAULT = PITCH_DEFAULT;
exports.PITCH_XTRA_LOW = PITCH_XTRA_LOW;
exports.PITCH_LOW = PITCH_LOW;
exports.PITCH_MEDIUM = PITCH_MEDIUM;
exports.PITCH_HIGH = PITCH_HIGH;
exports.PITCH_XTRA_HIGH = PITCH_XTRA_HIGH;

const PITCHES = [
    PITCH_DEFAULT,
    PITCH_XTRA_LOW,
    PITCH_LOW,
    PITCH_MEDIUM,
    PITCH_HIGH,
    PITCH_XTRA_HIGH
];

const INTERPRET_AS_CHARACTER = "character";
const INTERPRET_AS_SPELL_OUT = "spell-out";
const INTERPRET_AS_CARDINAL = "cardinal";
const INTERPRET_AS_NUMBER = "number";
const INTERPRET_AS_ORDINAL = "ordinal";
const INTERPRET_AS_DIGITS = "digits";
const INTERPRET_AS_FRACTION = "fraction";
const INTERPRET_AS_UNIT = "unit";
const INTERPRET_AS_DATE = "date";
const INTERPRET_AS_TIME = "time";
const INTERPRET_AS_ADDRESS = "address";
const INTERPRET_AS_EXPLETIVE = "expletive";
const INTERPRET_AS_TELEPHONE = "telephone";

exports.INTERPRET_AS_CHARACTER = INTERPRET_AS_CHARACTER;
exports.INTERPRET_AS_SPELL_OUT = INTERPRET_AS_SPELL_OUT;
exports.INTERPRET_AS_CARDINAL = INTERPRET_AS_CARDINAL;
exports.INTERPRET_AS_NUMBER = INTERPRET_AS_NUMBER;
exports.INTERPRET_AS_ORDINAL = INTERPRET_AS_ORDINAL;
exports.INTERPRET_AS_DIGITS = INTERPRET_AS_DIGITS;
exports.INTERPRET_AS_FRACTION = INTERPRET_AS_FRACTION;
exports.INTERPRET_AS_UNIT = INTERPRET_AS_UNIT;
exports.INTERPRET_AS_DATE = INTERPRET_AS_DATE;
exports.INTERPRET_AS_TIME = INTERPRET_AS_TIME;
exports.INTERPRET_AS_ADDRESS = INTERPRET_AS_ADDRESS;
exports.INTERPRET_AS_EXPLETIVE = INTERPRET_AS_EXPLETIVE;
exports.INTERPRET_AS_TELEPHONE = INTERPRET_AS_TELEPHONE;

const INTERPRET_AS_VALUES = [
    INTERPRET_AS_CHARACTER,
    INTERPRET_AS_SPELL_OUT,
    INTERPRET_AS_CARDINAL,
    INTERPRET_AS_NUMBER,
    INTERPRET_AS_ORDINAL,
    INTERPRET_AS_DIGITS,
    INTERPRET_AS_FRACTION,
    INTERPRET_AS_UNIT,
    INTERPRET_AS_DATE,
    INTERPRET_AS_TIME,
    INTERPRET_AS_ADDRESS,
    INTERPRET_AS_EXPLETIVE,
    INTERPRET_AS_TELEPHONE
];

const DATE_MDY = "mdy";
const DATE_DMY = "dmy";
const DATE_YMD = "ymd";
const DATE_MD = "md";
const DATE_DM = "dm";
const DATE_YM = "ym";
const DATE_MY = "my";
const DATE_D = "d";
const DATE_M = "m";
const DATE_Y = "y";
const DATE_YYYYMMDD = "yyyymmdd";

exports.DATE_MDY = DATE_MDY;
exports.DATE_DMY = DATE_DMY;
exports.DATE_YMD = DATE_YMD;
exports.DATE_MD = DATE_MD;
exports.DATE_DM = DATE_DM;
exports.DATE_YM = DATE_YM;
exports.DATE_MY = DATE_MY;
exports.DATE_D = DATE_D;
exports.DATE_M = DATE_M;
exports.DATE_Y = DATE_Y;
exports.DATE_YYYYMMDD = DATE_YYYYMMDD;

const DATE_FORMATS = [
    DATE_MDY,
    DATE_DMY,
    DATE_YMD,
    DATE_MD,
    DATE_DM,
    DATE_YM,
    DATE_MY,
    DATE_D,
    DATE_M,
    DATE_Y,
    DATE_YYYYMMDD
];

const ROLE_VERB = "amazon:VB";
const ROLE_PAST_TENSE = "amazon:VBD";
const ROLE_NON_DEFAULT = "amazon:SENSE_1";

exports.ROLE_VERB = ROLE_VERB;
exports.ROLE_PAST_TENSE = ROLE_PAST_TENSE;
exports.ROLE_NON_DEFAULT = ROLE_NON_DEFAULT;

const ROLES = [
    ROLE_VERB,
    ROLE_PAST_TENSE,
    ROLE_NON_DEFAULT
];

const EFFECT_WHISPER = "whispered";

exports.EFFECT_WHISPER = EFFECT_WHISPER;

const EFFECTS = [
    EFFECT_WHISPER
];

/**
 * Creates a new SsmlBuilder
 *
 * @constructor
 */
function SsmlBuilder() {

    this.stringBuilder = undefined;
    this.languageStarted = false;
    this.paragraphStarted = false;
    this.sentenceStarted = false;

    this.reset();

}

/**
 * Speak the given text
 *
 * @param speech The text to speak
 * @returns {SsmlBuilder}
 */
SsmlBuilder.prototype.speak = function(speech) {
    this.stringBuilder.append(speech);
    return this;
};


/**
 * Add a break (pause) into the speach
 *
 * @param duration The duration of the break -  Either milliseconds (ie. 10ms) or seconds (ie. 10s) or one of BREAK_STRENGTHS constants
 * @returns {SsmlBuilder}
 */
SsmlBuilder.prototype.addBreak = function(duration)  {
    if (!isString(duration)) {
        throw new TypeError("Duration should be a string.");
    }
    this.stringBuilder.append('<break ');
    if (duration.endsWith('ms') || duration.endsWith('s')) {
        this.stringBuilder.append("time=\"");
        this.stringBuilder.append(duration);
    } else if (BREAK_STRENGTHS.indexOf(duration) === -1) {
        throw new TypeError("Duration should be in milliseconds (ie. 10ms) or seconds (ie. 10s) or one of: " + BREAK_STRENGTHS);
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
 * @returns {SsmlBuilder}
 */
SsmlBuilder.prototype.startLanguage = function(language) {
    if (this.languageStarted) {
        throw new Error("You must end a language before you can start another language");
    }
    if (SUPPORTED_LANGUAGES.indexOf(language) === -1) {
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
 * @returns {SsmlBuilder}
 */
SsmlBuilder.prototype.endLanguage = function() {
    this.stringBuilder.append("</lang>");
    this.languageStarted = false;
    return this;
};

/**
 * Speak the given text as the specified language
 *
 * @param speech The text to speak
 * @param language the language to use (see SUPPORTED_LANGUAGES)
 * @returns {SsmlBuilder}
 */
SsmlBuilder.prototype.speakWithLanguage = function(speech, language) {
    this.startLanguage(language);
    this.speak(speech);
    this.endLanguage();
    return this;
};

/**
 * Add a mark into the SSML
 *
 * @param tagName the name for the mark
 * @returns {SsmlBuilder}
 */
SsmlBuilder.prototype.mark = function(tagName) {
    this.stringBuilder.append("<mark name=\"");
    this.stringBuilder.append(tagName);
    this.stringBuilder.append("\"/>");
    return this;
};

/**
 * Start speaking a paragraph
 *
 * @returns {SsmlBuilder}
 */
SsmlBuilder.prototype.startParagraph = function() {
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
 * @returns {SsmlBuilder}
 */
SsmlBuilder.prototype.endParagraph = function() {
    this.stringBuilder.append("</p>");
    this.paragraphStarted = false;
    return this;
};

/**
 * Speak the given text as a paragraph
 *
 * @param speech The text to speak
 * @returns {SsmlBuilder}
 */
SsmlBuilder.prototype.speakWithParagraph = function(speech) {
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
 * @returns {SsmlBuilder}
 */
SsmlBuilder.prototype.speakPhonetically = function(word, alphabet, pronunciation) {
    if (ALPHABETS.indexOf(alphabet) === -1) {
        throw new TypeError("Alphabet is not one of: " + ALPHABETS);
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
 * @returns {SsmlBuilder}
 */
SsmlBuilder.prototype.speakWithVolume = function(speech, volume) {
    this.speakWithProsody(speech, volume, null, null);
    return this;
};

/**
 * Speak the given text with the specified pitch
 *
 * @param speech The text to speak
 * @param pitch The pitch of the speech
 * @returns {SsmlBuilder}
 */
SsmlBuilder.prototype.speakWithPitch = function(speech, pitch) {
    this.speakWithProsody(speech, null, pitch, null);
    return this;
};

/**
 * Speak the given text with the specified rate
 *
 * @param speech The text to speak
 * @param rate The rate of the speech
 * @returns {SsmlBuilder}
 */
SsmlBuilder.prototype.speakWithRate = function(speech, rate) {
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
 * @returns {SsmlBuilder}
 */

SsmlBuilder.prototype.speakWithProsody = function(speech, volume, pitch, rate) {
    if (!volume && !pitch && !rate) {
        throw new TypeError("One of volume, pitch or rate must be provided");
    }
    this.stringBuilder.append("<prosody ");
    if (volume) {
        if (VOLUMES.indexOf(volume) === -1 && !this.isValidDecibelString(volume)) {
            throw new TypeError("Volume should be an increase/decrease in decibels (ie. -10dB/+3dB) or one of: " + VOLUMES);
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
        if (PITCHES.indexOf(pitch) === -1 && !this.isValidPercentString(pitch)) {
            throw new TypeError("Pitch should be a percentile increase/decrease (ie. -3%/+3%) or one of: " + PITCHES);
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
        if (RATES.indexOf(rate) === -1) {
            throw new TypeError("RATE should be one of: " + RATES);
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
 * @returns {SsmlBuilder}
 */
SsmlBuilder.prototype.startSentence = function() {
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
 * @returns {SsmlBuilder}
 */
SsmlBuilder.prototype.endSentence = function() {
    this.stringBuilder.append("</s>");
    this.sentenceStarted = false;
    return this;
};

/**
 * Speak the given text as a sentence
 *
 * @param sentence The text to speak
 * @returns {SsmlBuilder}
 */
SsmlBuilder.prototype.speakWithSentence = function(sentence) {
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
 * @returns {SsmlBuilder}
 */
SsmlBuilder.prototype.speakAs = function(speach, interpretAs, dateFormat) {
    if (INTERPRET_AS_VALUES.indexOf(interpretAs) === -1) {
        throw new TypeError("Type should be one of: " + INTERPRET_AS_VALUES);
    }
    if (interpretAs === INTERPRET_AS_DATE && !dateFormat) {
        throw new TypeError("You must supply a date format");
    }
    this.stringBuilder.append("<say-as interpret-as=\"");
    this.stringBuilder.append(interpretAs);
    if (interpretAs === INTERPRET_AS_DATE) {
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
 * @returns {SsmlBuilder}
 */
SsmlBuilder.prototype.speakWithSubstitute = function (word, substitution) {
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
 * @returns {SsmlBuilder}
 */
SsmlBuilder.prototype.speakWithRole = function (word, role) {
    if (ROLES.indexOf(role) === -1) {
        throw new TypeError("Role must be one of: " + ROLES);
    }
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
 * @returns {SsmlBuilder}
 */
SsmlBuilder.prototype.whisper = function(speech) {
    this.speakWithEffect(speech, EFFECT_WHISPER);
    return this;
};

/**
 * Speak the given text with the given effect
 *
 * @param speech The text to speak
 * @param effect The effect to use (See EFFECTS)
 * @returns {SsmlBuilder}
 */
SsmlBuilder.prototype.speakWithEffect = function(speech, effect) {
    if (EFFECTS.indexOf(effect) === -1) {
        throw new TypeError("Effect must be one of: " + EFFECTS);
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
SsmlBuilder.prototype.build = function() {
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

SsmlBuilder.prototype.reset = function () {
    this.stringBuilder = new StringBuilder();
    this.stringBuilder.append("<speak>");
};

SsmlBuilder.prototype.isValidPercentString = function(pitch) {
    return isString(pitch) &&
        pitch.length > 2 &&
        pitch.endsWith("%") &&
        (pitch.startsWith("-") || pitch.startsWith("+"));
};

SsmlBuilder.prototype.isValidDecibelString = function (volume) {
    return isString(volume) &&
        volume.length > 3 &&
        volume.endsWith("dB") &&
        (volume.startsWith("-") || volume.startsWith("+"));
};

