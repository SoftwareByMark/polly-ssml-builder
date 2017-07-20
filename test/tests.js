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

const assert = require('assert');
const SsmlBuilder = require('../lib/polly-ssml-builder');

describe('SSML Builder', function() {

    describe('With no output', function () {
        it('should just contain the start and end tags', function () {
            const ssmlBuilder = new SsmlBuilder();
            const result = ssmlBuilder.build();
            const expectedResult= "<speak></speak>";
            assert.equal(result, expectedResult);
        });
    });

    describe('Say', function () {
        it('should output text', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speak("Hello there!");
            const result = ssmlBuilder.build();
            const expectedResult= "<speak>Hello there!</speak>";
            assert.equal(result, expectedResult);
        });
    });

    describe('Delay with strength', function () {
        it('should output strength tag', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speak("Legend")
            .addBreak(SsmlBuilder.BREAK_STRONG)
            .speak("dary");
            const result = ssmlBuilder.build();
            const expectedResult= '<speak>Legend<break strength="strong"/>dary</speak>';
            assert.equal(result, expectedResult);
        });
    });

    describe('Delay with time in milliseconds', function () {
        it('should output time tag', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speak("Legend")
            .addBreak('10ms')
            .speak("dary");
            const result = ssmlBuilder.build();
            const expectedResult= '<speak>Legend<break time="10ms"/>dary</speak>';
            assert.equal(result, expectedResult);
        });
    });

    describe('Delay with time in seconds', function () {
        it('should output time tag', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speak("Legend")
            .addBreak('10s')
            .speak("dary");
            const result = ssmlBuilder.build();
            const expectedResult= '<speak>Legend<break time="10s"/>dary</speak>';
            assert.equal(result, expectedResult);
        });
    });

    describe('Delay with invalid String duration', function () {
        it('should throw TypeError', function () {
            const ssmlBuilder = new SsmlBuilder();
            assert.throws(function() {
                ssmlBuilder.addBreak("kdkd")
            }, TypeError);
        });
    });

    describe('Delay with number duration', function () {
        it('should throw TypeError', function () {
            const ssmlBuilder = new SsmlBuilder();
            assert.throws(function() {
                ssmlBuilder.addBreak(10)
            }, TypeError);
        });
    });

    describe('Say with language', function () {
        it('should properly format the SSML', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speakWithLanguage("Bonjour!", "fr-FR");
            const result = ssmlBuilder.build();
            const expectedResult = '<speak><lang xml:lang="fr-FR">Bonjour!</lang></speak>';
            assert.equal(result, expectedResult);
        });
    });

    describe('Starting a language twice', function () {
        it('should throw an Error', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.startLanguage("fr-FR");
            assert.throws(function () {
                ssmlBuilder.startLanguage("fr-FR");
            }, Error)
        });
    });

    describe('Building without ending the language', function () {
        it('should throw an Error', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.startLanguage("fr-FR");
            assert.throws(function () {
                ssmlBuilder.build();
            }, Error)
        });
    });

    describe('Mark', function () {
        it('should properly format the SSML', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speak("Where will the")
            .mark("mark")
            .speak("be located?");
            const result = ssmlBuilder.build();
            const expectedResult = '<speak>Where will the<mark name="mark"/>be located?</speak>';
            assert.equal(result, expectedResult);
        });
    });

    describe('Say with paragraph', function () {
        it('should properly format the SSML', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speakWithParagraph("This speech will be wrapped in a paragraph");
            const result = ssmlBuilder.build();
            const expectedResult = '<speak><p>This speech will be wrapped in a paragraph</p></speak>';
            assert.equal(result, expectedResult);
        });
    });

    describe('Starting a paragraph twice', function () {
        it('should throw an Error', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.startParagraph();
            assert.throws(function () {
                ssmlBuilder.startParagraph();
            }, Error);
        });
    });

    describe('Building without ending paragraph', function () {
        it('should throw an Error', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.startParagraph();
            assert.throws(function () {
                ssmlBuilder.build();
            }, Error);
        });
    });

    describe('Say phonetically', function () {
        it('should properly format the SSML', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speak("You say, ")
            .speakPhonetically("pecan", SsmlBuilder.ALPHABET_IPA, "pɪˈkɑːn")
            .speak(". I say, ")
            .speakPhonetically("pecan", SsmlBuilder.ALPHABET_IPA, "ˈpi.kæn")
            .speak(".");
            const result = ssmlBuilder.build();
            const expectedResult = '<speak>You say, <phoneme alphabet="ipa" ph="pɪˈkɑːn">pecan</phoneme>. I say, <phoneme alphabet="ipa" ph="ˈpi.kæn">pecan</phoneme>.</speak>';
            assert.equal(result, expectedResult);
        });
    });

    describe('Say phonetically with invalid alphabet', function () {
        it('should throw a TypeError', function () {
            const ssmlBuilder = new SsmlBuilder();
            assert.throws(function (){
                ssmlBuilder.speakPhonetically("pecan", "foo", "pɪˈkɑːn");
            }, TypeError);
        });
    });

    describe('Say with volume constant', function () {
        it('should properly format the SSML', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speakWithVolume("Speak this quite a bit louder.", SsmlBuilder.VOLUME_XTRA_LOUD);
            const result = ssmlBuilder.build();
            const expectedResult = '<speak><prosody volume="x-loud">Speak this quite a bit louder.</prosody></speak>';
            assert.equal(result, expectedResult);
        });
    });

    describe('Say with invalid volume constant', function () {
        it('should throw a TypeError', function () {
            const ssmlBuilder = new SsmlBuilder();
            assert.throws(function() {
                ssmlBuilder.speakWithVolume("Speak this quite a bit louder.", "foo");
            }, TypeError);
        });
    });

    describe('Say with volume decibel', function () {
        it('should properly format the SSML', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speakWithVolume("Speak this quite a bit louder.", "+3dB");
            const result = ssmlBuilder.build();
            const expectedResult = '<speak><prosody volume="+3dB">Speak this quite a bit louder.</prosody></speak>';
            assert.equal(result, expectedResult);
        });
    });

    describe('Say with invalid volume decibel', function () {
        it('should throw a TypeError', function () {
            const ssmlBuilder = new SsmlBuilder();
            assert.throws(function() {
                ssmlBuilder.speakWithVolume("Speak this quite a bit louder.", "+3DB");
            }, TypeError);
        });
    });

    describe('Say with pitch constant', function () {
        it('should properly format the SSML', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speakWithPitch("Speak this quite a bit lower.", SsmlBuilder.PITCH_XTRA_LOW);
            const result = ssmlBuilder.build();
            const expectedResult = '<speak><prosody pitch="x-low">Speak this quite a bit lower.</prosody></speak>';
            assert.equal(result, expectedResult);
        });
    });

    describe('Say with invalid pitch constant', function () {
        it('should throw a TypeError', function () {
            const ssmlBuilder = new SsmlBuilder();
            assert.throws(function() {
                ssmlBuilder.speakWithPitch("Speak this quite a bit lower.", "foo");
            }, TypeError);
        });
    });

    describe('Say with pitch percent', function () {
        it('should properly format the SSML', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speakWithPitch("Speak this quite a bit lower.", "-7%");
            const result = ssmlBuilder.build();
            const expectedResult = '<speak><prosody pitch="-7%">Speak this quite a bit lower.</prosody></speak>';
            assert.equal(result, expectedResult);
        });
    });

    describe('Say with invalid pitch percent', function () {
        it('should throw a TypeError', function () {
            const ssmlBuilder = new SsmlBuilder();
            assert.throws(function() {
                ssmlBuilder.speakWithPitch("Speak this quite a bit lower.", "-7");
            }, TypeError);
        });
    });

    describe('Say with rate constant', function () {
        it('should properly format the SSML', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speakWithRate("Speak this quite a bit quicker.", SsmlBuilder.RATE_FAST);
            const result = ssmlBuilder.build();
            const expectedResult = '<speak><prosody rate="fast">Speak this quite a bit quicker.</prosody></speak>';
            assert.equal(result, expectedResult);
        });
    });

    describe('Say with rate string', function () {
        it('should properly format the SSML', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speakWithRate("Speak this quite a bit quicker.", "fast");
            const result = ssmlBuilder.build();
            const expectedResult = '<speak><prosody rate="fast">Speak this quite a bit quicker.</prosody></speak>';
            assert.equal(result, expectedResult);
        });
    });

    describe('Say with invalid rate constant', function () {
        it('should throw a TypeError', function () {
            const ssmlBuilder = new SsmlBuilder();
            assert.throws(function () {
                ssmlBuilder.speakWithRate("Speak this quite a bit quicker.", "foo");
            }, TypeError);
        });
    });

    describe('Say with Prosody', function () {
        it('should properly format the SSML', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speakWithProsody("Say this is a wierd voice.", SsmlBuilder.VOLUME_XTRA_SOFT, SsmlBuilder.PITCH_LOW, SsmlBuilder.RATE_XTRA_SLOW);
            const result = ssmlBuilder.build();
            const expectedResult = '<speak><prosody volume="x-soft" pitch="low" rate="x-slow">Say this is a wierd voice.</prosody></speak>';
            assert.equal(result, expectedResult);
        });
    });

    describe('Say with Prosody and no options', function () {
        it('should throw a TypeError', function () {
            const ssmlBuilder = new SsmlBuilder();
            assert.throws(function () {
                ssmlBuilder.speakWithProsody("Invalid.", null, null, null);
            }, TypeError);
        });
    });

    describe('Speak as sentence', function () {
        it('should properly format the SSML', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speakWithSentence("Mary had a little lamb")
                .speakWithSentence("Whose fleece was white as snow")
                .speak("And everywhere that Mary went, the lamb was sure to go.");
            const result = ssmlBuilder.build();
            const expectedResult = "<speak><s>Mary had a little lamb</s><s>Whose fleece was white as snow</s>And everywhere that Mary went, the lamb was sure to go.</speak>";
            assert.equal(result, expectedResult);
        });
    });

    describe('Start a sentence twice', function () {
        it('should throw an error', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.startSentence();
            assert.throws(function () {
                ssmlBuilder.startSentence();
            }, Error);
        });
    });

    describe('Building without ending sentence', function () {
        it('should throw an error', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.startSentence();
            assert.throws(function () {
                ssmlBuilder.build();
            }, Error);
        });
    });

    describe('Speak as with type constant', function () {
        it('should properly format the SSML', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speak("Richard's number is ")
            .speakAs("2122241555", SsmlBuilder.INTERPRET_AS_TELEPHONE);
            const result = ssmlBuilder.build();
            const expectedResult = "<speak>Richard's number is <say-as interpret-as=\"telephone\">2122241555</say-as></speak>";
            assert.equal(result, expectedResult);
        });
    });

    describe('Speak as with invliad type constant', function () {
        it('should throw a Type Error', function () {
            const ssmlBuilder = new SsmlBuilder();
            assert.throws(function () {
                ssmlBuilder.speakAs("2122241555", "foo");
            }, TypeError);
        });
    });

    describe('Speak as with type string', function () {
        it('should properly format the SSML', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speak("My postcode is ")
            .speakAs("1234", "digits");
            const result = ssmlBuilder.build();
            const expectedResult = "<speak>My postcode is <say-as interpret-as=\"digits\">1234</say-as></speak>";
            assert.equal(result, expectedResult);
        });
    });

    describe('Speak as Date without format', function () {
        it('should throw a TypeError', function () {
            const ssmlBuilder = new SsmlBuilder();
            assert.throws(function () {
                ssmlBuilder.speakAs("20170622", SsmlBuilder.INTERPRET_AS_DATE);
            }, TypeError);
        });
    });

    describe('Speak as Date', function () {
        it('should properly format the SSML', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speak("Today is ")
            .speakAs("20170622", SsmlBuilder.INTERPRET_AS_DATE, SsmlBuilder.DATE_YYYYMMDD);
            const result = ssmlBuilder.build();
            const expectedResult = "<speak>Today is <say-as interpret-as=\"date\" format=\"yyyymmdd\">20170622</say-as></speak>";
            assert.equal(result, expectedResult);
        });
    });

    describe('Speak with substitute', function () {
        it('should properly format the SSML', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speak("My favorite chemical element is ")
            .speakWithSubstitute("Hg", "mercury")
            .speak(", it looks cool.");
            const result = ssmlBuilder.build();
            const expectedResult = "<speak>My favorite chemical element is <sub alias=\"mercury\">Hg</sub>, it looks cool.</speak>";
            assert.equal(result, expectedResult);
        });
    });

    describe('Speak as role', function () {
        it('should properly format the SSML', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speak("The present simple form of the word is pronounced ")
            .speakWithRole("read", SsmlBuilder.ROLE_VERB)
            .speak(", where the past tense or past participle is pronounced ")
            .speakWithRole("read", SsmlBuilder.ROLE_PAST_TENSE);
            const result = ssmlBuilder.build();
            const expectedResult = "<speak>" +
                "The present simple form of the word is pronounced <w role=\"amazon:VB\">read</w>, " +
                "where the past tense or past participle is pronounced <w role=\"amazon:VBD\">read</w>" +
                "</speak>";
            assert.equal(result, expectedResult);
        });
    });

    describe('Speak as invalid role', function () {
        it('should throw a TypeError', function () {
            const ssmlBuilder = new SsmlBuilder();
            assert.throws(function () {
                ssmlBuilder.speakWithRole("read", "past");
            }, TypeError);
        });
    });

    describe('Speak as role', function () {
        it('should properly format the SSML', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.speak("The present simple form of the word is pronounced ")
            .speakWithRole("read", SsmlBuilder.ROLE_VERB)
            .speak(", where the past tense or past participle is pronounced ")
            .speakWithRole("read", SsmlBuilder.ROLE_PAST_TENSE);
            const result = ssmlBuilder.build();
            const expectedResult = "<speak>" +
                "The present simple form of the word is pronounced <w role=\"amazon:VB\">read</w>, " +
                "where the past tense or past participle is pronounced <w role=\"amazon:VBD\">read</w>" +
                "</speak>";
            assert.equal(result, expectedResult);
        });
    });


    describe('Whisper', function () {
        it('should properly format the SSML', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.whisper("If you make any noise, ")
            .speak("she said, ")
            .whisper("they will hear us.");
            const result = ssmlBuilder.build();
            const expectedResult = "<speak>" +
                "<amazon:effect name=\"whispered\">If you make any noise, </amazon:effect>" +
                "she said, <amazon:effect name=\"whispered\">they will hear us.</amazon:effect>" +
                "</speak>";
            assert.equal(result, expectedResult);
        });
    });


    describe('Speak with invalid effect', function () {
        it('should throw a TypeError', function () {
            const ssmlBuilder = new SsmlBuilder();
            assert.throws(function () {
                ssmlBuilder.speakWithEffect("Boo!", "foo");
            }, TypeError);
        });
    });


    describe('Complex example', function() {
        it('should properly format the SSML', function () {
            const ssmlBuilder = new SsmlBuilder();
            ssmlBuilder.startParagraph()
                .startSentence()
                .speakWithRate("Some say", SsmlBuilder.RATE_XTRA_FAST)
                .addBreak("200ms")
                .speak("the world will end in fire")
                .addBreak("500ms")
                .speak("Some say in ice.")
                .endSentence()
                .endParagraph()
                .startParagraph()
                .startSentence()
                .speakWithRate("From what", SsmlBuilder.RATE_XTRA_FAST)
                .addBreak("200ms")
                .speak("I've tasted of desire")
                .addBreak("1s")
                .speak("I hold with those who favour fire.")
                .endSentence()
                .endParagraph();
            const result = ssmlBuilder.build();
            const expectedResult = "<speak><p><s><prosody rate=\"x-fast\">Some say</prosody><break time=\"200ms\"/>the world will end in fire<break time=\"500ms\"/>Some say in ice.</s></p><p><s><prosody rate=\"x-fast\">From what</prosody><break time=\"200ms\"/>I've tasted of desire<break time=\"1s\"/>I hold with those who favour fire.</s></p></speak>"
            assert.equal(result, expectedResult);
        });
    });

});

