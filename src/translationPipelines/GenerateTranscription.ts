import {Translation, TranslationPipe} from "../definitions.js";
import {ua2sk} from '../transliterations/ua2sk.js';
import {sk2ua} from '../transliterations/sk2ua.js';
import {pl2ua} from '../transliterations/pl2ua.js';
import {ua2cz} from '../transliterations/ua2cz.js';
import {cz2ua} from '../transliterations/cz2ua.js';
import {ua2pl} from '../transliterations/ua2pl.js';
import {Language} from "../locales.js";

type TransriptionSubstitutionTable = [string, string][];

const removePunctuation = (str: string) => str
    .replace('.', '')
    .replace('?', '')
    .replace('!', '');


const FROM_UK_TABLES: Record<string, TransriptionSubstitutionTable> = {
    cs: ua2cz,
    pl: ua2pl,
    sk: ua2sk,
}

const TO_UK_TABLES: Record<string, TransriptionSubstitutionTable> = {
    cs: cz2ua,
    pl: pl2ua,
    sk: sk2ua,
}

function transcription(subs: TransriptionSubstitutionTable, text: string): string {
    let result = text;
    for (let i = 0; i < subs.length; i++) {
        // Vercel's Node 14 does not support String.replaceAll(), so we must use a RegEx workaround
        result = result.replace(new RegExp(subs[i][0], 'g'), subs[i][1]);
    }
    return removePunctuation(result);
}

export class GenerateTranscription implements TranslationPipe {
    execute(languagePack: Language, language: Language, translation: Translation): Translation {

        const table = language === Language.Uk ? FROM_UK_TABLES[languagePack] : TO_UK_TABLES[languagePack];

        if (typeof table === 'undefined') {
            return translation
        }

        translation.transcription = transcription(table, translation.translation)

        return translation
    }
}
