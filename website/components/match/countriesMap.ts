// countriesMap.ts

type CountryInfo = {
    translation: string;
    gender: 'm' | 'f';
    plural?: string; // Pour les noms pluriels
    possessive?: string; // Pour les noms possessifs
};


const countries: Record<string, CountryInfo> = {
    "England": { translation: "Angleterre", gender: 'f', plural: "Anglaises", possessive: "de l'Angleterre" },
    "France": { translation: "France", gender: 'f', plural: "Françaises", possessive: "de la France" },
    "South Africa": { translation: "Afrique du Sud", gender: 'f', plural: "Sud-Africaines", possessive: "de l'Afrique du Sud" },
    "New Zealand": { translation: "Nouvelle-Zélande", gender: 'f', plural: "Néo-Zélandaises", possessive: "de la Nouvelle-Zélande" },
    "Australia": { translation: "Australie", gender: 'f' },
    "Ireland": { translation: "Irlande", gender: 'f' },
    "Wales": { translation: "Pays de Galles", gender: 'm' },
    "Scotland": { translation: "Écosse", gender: 'f' },
    "Japan": { translation: "Japon", gender: 'm' },
    "Argentina": { translation: "Argentine", gender: 'f' },
    "Namibia": { translation: "Namibie", gender: 'f' },
    "Italy": { translation: "Italie", gender: 'f', plural: "Italiennes", possessive: "de l'Italie" },
    "Tonga": { translation: "Tonga", gender: 'm', plural: "Tongiens", possessive: "des Tonga" },    
    "Romania": { translation: "Roumanie", gender: 'f' },
    "Georgia": { translation: "Géorgie", gender: 'f' },
    "Chile": { translation: "Chili", gender: 'm' },
    "Fiji": { translation: "Fiji", gender: 'm' },
    "Uruguay": { translation: "Uruguay", gender: 'm' },
    "Samoa": { translation: "Samoa", gender: 'm' },
    // Ajoutez d'autres pays si nécessaire
};

const countriesWithApostrophe = [
    "Afrique du Sud",
    "Angleterre",
    "Australie",
    "Irlande",
    "Écosse",
    "Argentine",
    "Italie",
    "Uruguay"
];

export const getArticleByGender = (country: string) => {
    const gender = countries[country]?.gender || 'm';
    return gender === 'f' ? 'la' : 'le';
};

export const getArticleWithApostrophe = (country: string) => {
    const translatedCountry = getTranslatedCountry(country);
    
    if (countriesWithApostrophe.includes(translatedCountry)) {
        return "l'";
    }
    return getArticleByGender(country) + ' ';
};

export const getTranslatedCountry = (country: string) => countries[country]?.translation || country;

export const getTranslatedCountryPossessive = (country: string) => {
    const translatedCountry = getTranslatedCountry(country);
    
    if (countriesWithApostrophe.includes(translatedCountry)) {
        return `l'${translatedCountry}`;
    }
    return `${getArticleByGender(country)} ${translatedCountry}`;
};

export default countries;